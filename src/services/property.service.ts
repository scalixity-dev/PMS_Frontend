import { API_ENDPOINTS } from '../config/api.config';

// Type definitions for units
export type DetailedUnitsArray = Array<{
  id: string;
  unitName: string;
  apartmentType?: string | null;
  sizeSqft?: string | number | null;
  beds?: number | null;
  baths?: string | number | null;
  rent?: string | number | null;
  listings?: Array<{
    id: string;
    occupancyStatus?: 'VACANT' | 'OCCUPIED' | 'PARTIALLY_OCCUPIED' | null;
    listingStatus?: string;
  }>;
  leasing?: {
    id: string;
  } | null;
}>;

export type SummaryUnits = {
  count: number;
  units: Array<{
    id: string;
    unitName: string;
    status: 'VACANT' | 'OCCUPIED';
  }>;
};

// Type guard to check if units is in summary format
export function isSummaryUnits(units: DetailedUnitsArray | SummaryUnits | undefined): units is SummaryUnits {
  return units !== undefined && !Array.isArray(units) && 'count' in units;
}

// Backend Property Response Types
export interface BackendProperty {
  id: string;
  propertyName: string;
  propertyType: 'SINGLE' | 'MULTI';
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | null;
  marketRent?: string | number | null;
  depositAmount?: string | number | null;
  sizeSqft?: string | number | null;
  yearBuilt?: number | null;
  mlsNumber?: string | null;
  description?: string | null;
  coverPhotoUrl?: string | null;
  youtubeUrl?: string | null;
  ribbonType?: 'NONE' | 'CHAT' | 'CUSTOM' | null;
  ribbonTitle?: string | null;
  listingContactName?: string | null;
  listingPhoneCountryCode?: string | null;
  listingPhoneNumber?: string | null;
  listingEmail?: string | null;
  displayPhonePublicly?: boolean | null;
  address?: {
    streetAddress: string;
    city: string;
    stateRegion: string;
    zipCode: string;
    country: string;
  } | null;
  singleUnitDetails?: {
    beds: number;
    baths?: string | number | null;
  } | null;
  units?: DetailedUnitsArray | SummaryUnits;
  photos?: Array<{
    id: string;
    photoUrl: string;
    isPrimary: boolean;
  }>;
  attachments?: Array<{
    id: string;
    fileUrl: string;
    fileType: string;
    description?: string | null;
  }>;
  amenities?: {
    parking: 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED';
    laundry: 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS';
    airConditioning: 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER';
    propertyFeatures?: string[];
    propertyAmenities?: string[];
  } | null;
  leasing?: {
    occupancyStatus?: 'VACANT' | 'OCCUPIED' | 'PARTIALLY_OCCUPIED' | null;
    monthlyRent?: string | number | null;
    securityDeposit?: string | number | null;
    amountRefundable?: string | number | null;
    dateAvailable?: string | null;
    minLeaseDuration?: string | null;
    maxLeaseDuration?: string | null;
    description?: string | null;
    petsAllowed?: boolean | null;
    petCategory?: string[] | null;
    petDeposit?: string | number | null;
    petFee?: string | number | null;
    petDescription?: string | null;
    onlineRentalApplication?: boolean | null;
    requireApplicationFee?: boolean | null;
    applicationFee?: string | number | null;
  } | null;
  listings?: Array<{
    id: string;
    listingStatus: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'ARCHIVED' | 'REMOVED';
    isActive: boolean;
  }> | null;
}

// Frontend Property Interface
export interface Property {
  id: string;
  name: string;
  unit: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  image: string;
}

class PropertyService {
  /**
   * Get all properties
   * @param includeListings - Whether to include listings in the response (default: false for performance)
   */
  async getAll(includeListings: boolean = false): Promise<BackendProperty[]> {
    const url = includeListings 
      ? `${API_ENDPOINTS.PROPERTY.GET_ALL}?includeListings=true`
      : API_ENDPOINTS.PROPERTY.GET_ALL;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch properties';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Property fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch properties: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Transform backend property to frontend property format
   */
  transformProperty(backendProperty: BackendProperty): Property {
    // Format address - handle null, undefined, or empty address object
    let address = 'Address not available';
    if (backendProperty.address) {
      const addressParts = [
        backendProperty.address.streetAddress,
        backendProperty.address.city,
        backendProperty.address.stateRegion,
        backendProperty.address.zipCode,
        backendProperty.address.country,
      ].filter(part => part && part.trim() !== '');
      
      if (addressParts.length > 0) {
        address = addressParts.join(', ');
      }
    }

    // Get price from marketRent
    const price = backendProperty.marketRent
      ? typeof backendProperty.marketRent === 'string'
        ? parseFloat(backendProperty.marketRent) || 0
        : Number(backendProperty.marketRent) || 0
      : 0;

    // Get bedrooms and bathrooms from singleUnitDetails
    const bedrooms = backendProperty.singleUnitDetails?.beds || 0;
    const bathrooms = backendProperty.singleUnitDetails?.baths
      ? typeof backendProperty.singleUnitDetails.baths === 'string'
        ? parseFloat(backendProperty.singleUnitDetails.baths) || 0
        : Number(backendProperty.singleUnitDetails.baths) || 0
      : 0;

    // Prioritize coverPhotoUrl, then primary photo, then first photo
    const image = backendProperty.coverPhotoUrl 
      || backendProperty.photos?.find((p) => p.isPrimary)?.photoUrl 
      || backendProperty.photos?.[0]?.photoUrl 
      || '';

    // Determine unit name
    let unit = 'Property';
    if (backendProperty.propertyType === 'MULTI' && backendProperty.units) {
      if (isSummaryUnits(backendProperty.units)) {
        // Summary format: use first unit from summary.units if available
        unit = backendProperty.units.units[0]?.unitName || 'Property';
      } else {
        // Detailed array format: use first unit
        unit = backendProperty.units[0]?.unitName || 'Property';
      }
    } else if (backendProperty.propertyType === 'SINGLE') {
      unit = 'Single Unit';
    }

    return {
      id: backendProperty.id,
      name: backendProperty.propertyName,
      unit,
      address,
      price,
      bedrooms,
      bathrooms,
      image,
    };
  }

  /**
   * Get a single property by ID
   * @param includeFullUnitDetails - For MULTI properties, return full unit details instead of simplified data
   */
  async getOne(propertyId: string, includeFullUnitDetails: boolean = false): Promise<BackendProperty> {
    const url = includeFullUnitDetails 
      ? `${API_ENDPOINTS.PROPERTY.GET_ONE(propertyId)}?includeFullUnitDetails=true`
      : API_ENDPOINTS.PROPERTY.GET_ONE(propertyId);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch property';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Property fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch property: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get a single property and transform it
   */
  async getOneTransformed(propertyId: string): Promise<Property> {
    const backendProperty = await this.getOne(propertyId);
    return this.transformProperty(backendProperty);
  }

  /**
   * Get all properties and transform them
   */
  async getAllTransformed(): Promise<Property[]> {
    const backendProperties = await this.getAll();
    return backendProperties.map((prop) => this.transformProperty(prop));
  }

  /**
   * Get all units from all properties
   */
  async getAllUnits(): Promise<BackendProperty[]> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.GET_ALL_UNITS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch units';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Units fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch units: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Create a new property
   */
  async create(propertyData: {
    managerId: string;
    propertyName: string;
    propertyType: 'SINGLE' | 'MULTI';
    yearBuilt?: number;
    sizeSqft?: number;
    marketRent?: number;
    depositAmount?: number;
    address?: {
      streetAddress: string;
      city: string;
      stateRegion: string;
      zipCode: string;
      country: string;
    };
    description?: string;
    singleUnitDetails?: {
      beds: number;
      baths?: number;
      marketRent?: number;
      deposit?: number;
    };
    amenities?: {
      parking: 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED';
      laundry: 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS';
      airConditioning: 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER';
      propertyFeatures?: string[];
      propertyAmenities?: string[];
    };
    photos?: Array<{
      photoUrl: string;
      isPrimary?: boolean;
    }>;
  }): Promise<BackendProperty> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
      body: JSON.stringify(propertyData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create property';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Property creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create property: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update an existing property
   */
  async update(propertyId: string, updateData: {
    managerId?: string;
    propertyName?: string;
    propertyType?: 'SINGLE' | 'MULTI';
    yearBuilt?: number;
    sizeSqft?: number;
    marketRent?: number;
    depositAmount?: number;
    address?: {
      streetAddress: string;
      city: string;
      stateRegion: string;
      zipCode: string;
      country: string;
    };
    description?: string;
    coverPhotoUrl?: string;
    youtubeUrl?: string;
    singleUnitDetails?: {
      beds: number;
      baths?: number;
      marketRent?: number;
      deposit?: number;
    };
    amenities?: {
      parking: 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED';
      laundry: 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS';
      airConditioning: 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER';
      propertyFeatures?: string[];
      propertyAmenities?: string[];
    };
    photos?: Array<{
      photoUrl: string;
      isPrimary?: boolean;
    }>;
  }): Promise<BackendProperty> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.UPDATE(propertyId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update property';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Property update error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to update property: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Validate Excel file without importing
   */
  async validateExcel(file: File): Promise<{
    headers: string[];
    total: number;
    successful: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
    message: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.PROPERTY.VALIDATE_EXCEL, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to validate file';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('File validation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to validate file: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get system field definitions for mapping
   */
  async getImportFields(): Promise<{
    fields: Array<{
      key: string;
      label: string;
      required: boolean;
      category: string;
    }>;
  }> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.GET_IMPORT_FIELDS, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch import fields');
    }

    return response.json();
  }

  /**
   * Import properties from Excel file
   */
  async importFromExcel(file: File): Promise<{
    total: number;
    successful: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
    jobId: string | null;
    message: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.PROPERTY.IMPORT_EXCEL, {
      method: 'POST',
      credentials: 'include', // Include cookies for JWT
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to import properties';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Property import error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to import properties: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete a property
   */
  async delete(propertyId: string): Promise<{ message: string; property: BackendProperty }> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.DELETE(propertyId), {
      method: 'DELETE',
      credentials: 'include', // Include cookies for JWT
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete property';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Property deletion error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to delete property: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Bulk delete multiple properties
   */
  async bulkDelete(propertyIds: string[]): Promise<{
    deleted: number;
    failed: number;
    errors: Array<{ id: string; error: string }>;
  }> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.BULK_DELETE, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
      body: JSON.stringify({ propertyIds }),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete properties';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Bulk property deletion error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to delete properties: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const propertyService = new PropertyService();

