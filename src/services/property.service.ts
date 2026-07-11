import { API_ENDPOINTS } from '../config/api.config';

// Public Listings API Response Types (used by GET_PUBLIC_LISTINGS endpoint)
export interface PublicListingPhoto {
  photoUrl: string;
}

export interface PublicListingAddress {
  streetAddress?: string;
  city?: string;
  stateRegion?: string;
  zipCode?: string;
  country?: string;
}

export interface PublicListingDetails {
  id?: string;
  title?: string;
  monthlyRent?: string;
  listingPrice?: string;
  petsAllowed?: boolean;
}

export interface PublicSingleUnitDetail {
  beds?: number | null;
}

export interface PublicListingProperty {
  id: string;
  propertyName?: string;
  propertyType?: string;
  address?: PublicListingAddress;
  listing?: PublicListingDetails;
  singleUnitDetail?: PublicSingleUnitDetail;
  marketRent?: string;
  coverPhotoUrl?: string;
  photos?: PublicListingPhoto[];
}

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
/** A soft-deleted property, as returned by GET /property/deleted. */
export interface DeletedBackendProperty extends BackendProperty {
  deletedAt: string;
  permanentDeleteAt: string;
  daysRemaining: number;
}

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

    const data = await response.json();

    // Handle both array response and pagination response
    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data.data;
    }

    // Fallback: return empty array if response is unexpected
    console.warn('Unexpected property response format:', data);
    return [];
  }

  /**
   * Lightweight - returns only { propertyId, propertyName } for each property.
   * Use this for dropdowns/selectors to save bandwidth.
   */
  async getAllIdName(): Promise<Array<{ propertyId: string; propertyName: string }>> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.GET_ALL_ID_NAME, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch property list: ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) return data;
    if (data && typeof data === 'object' && Array.isArray(data.data)) return data.data;
    return [];
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
    listingContactName?: string;
    listingPhoneCountryCode?: string;
    listingPhoneNumber?: string;
    listingEmail?: string;
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
  async importFromExcel(
    file: File,
    fieldMappings?: Record<string, string>,
    importFirstRow: boolean = true
  ): Promise<{
    total: number;
    successful: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
    jobId: string | null;
    message: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add field mappings if provided
    if (fieldMappings && Object.keys(fieldMappings).length > 0) {
      formData.append('fieldMappings', JSON.stringify(fieldMappings));
    }
    
    // Add importFirstRow option
    formData.append('importFirstRow', String(importFirstRow));

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
   * List the current manager's soft-deleted properties (the "Deleted" tab).
   * Each entry carries `daysRemaining` until the purge cron hard-deletes it.
   */
  async getDeleted(): Promise<DeletedBackendProperty[]> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.GET_DELETED, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch deleted properties';
      try {
        const errorData = await response.json();
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join('. ')
          : errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /** Restore a soft-deleted property so it's active again. */
  async recover(propertyId: string): Promise<{ message: string }> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.RECOVER(propertyId), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to recover property';
      try {
        const errorData = await response.json();
        errorMessage = Array.isArray(errorData.message)
          ? errorData.message.join('. ')
          : errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
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

  /**
   * Get property specs (paint, doors, flooring, etc)
   */
  async getSpecs(propertyId: string, unitId?: string): Promise<any> {
    const url = unitId
      ? API_ENDPOINTS.UNIT.GET_SPECS(unitId)
      : API_ENDPOINTS.PROPERTY.GET_SPECS(propertyId);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch specs: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create a property spec
   */
  async createSpec(propertyId: string, specData: any): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.CREATE_SPEC(propertyId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(specData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create spec: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update a property spec
   */
  async updateSpec(propertyId: string, specId: string, specData: any): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.UPDATE_SPEC(propertyId, specId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(specData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update spec: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete a property spec
   */
  async deleteSpec(propertyId: string, specId: string): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.DELETE_SPEC(propertyId, specId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete spec: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get property responsibilities (Bug 4 fix)
   */
  async getResponsibilities(propertyId: string): Promise<any[]> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.GET_RESPONSIBILITIES(propertyId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch responsibilities: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Upsert (bulk replace) property responsibilities (Bug 4 fix)
   */
  async upsertResponsibilities(propertyId: string, items: { utility: string; payer: string }[]): Promise<any[]> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.UPSERT_RESPONSIBILITIES(propertyId), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ items }),
    });
    if (!response.ok) {
      throw new Error(`Failed to upsert responsibilities: ${response.statusText}`);
    }
    return response.json();
  }

  /**
   * Get property financials (summary, transactions, insurance, loans)
   */
  async getFinancials(propertyId: string, unitId?: string): Promise<any> {
    const url = unitId
      ? API_ENDPOINTS.UNIT.GET_FINANCIALS(unitId)
      : API_ENDPOINTS.PROPERTY.GET_FINANCIALS(propertyId);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch financials: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create property insurance
   */
  async createInsurance(propertyId: string, insuranceData: any): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.CREATE_INSURANCE(propertyId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(insuranceData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create insurance: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update property insurance
   */
  async updateInsurance(propertyId: string, insuranceId: string, insuranceData: any): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.UPDATE_INSURANCE(propertyId, insuranceId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(insuranceData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update insurance: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete property insurance
   */
  async deleteInsurance(propertyId: string, insuranceId: string): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.DELETE_INSURANCE(propertyId, insuranceId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete insurance: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create property loan
   */
  async createLoan(propertyId: string, loanData: any): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.CREATE_LOAN(propertyId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loanData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create loan: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update property loan
   */
  async updateLoan(propertyId: string, loanId: string, loanData: any): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.UPDATE_LOAN(propertyId, loanId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(loanData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update loan: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete property loan
   */
  async deleteLoan(propertyId: string, loanId: string): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.DELETE_LOAN(propertyId, loanId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete loan: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get property service providers
   */
  async getServiceProviders(propertyId: string, unitId?: string): Promise<any> {
    const url = unitId
      ? API_ENDPOINTS.UNIT.GET_SERVICE_PROVIDERS(unitId)
      : API_ENDPOINTS.PROPERTY.GET_SERVICE_PROVIDERS(propertyId);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch service providers: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Create utility provider
   */
  async createUtilityProvider(propertyId: string, providerData: any): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.CREATE_UTILITY_PROVIDER(propertyId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(providerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create utility provider: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Update utility provider
   */
  async updateUtilityProvider(propertyId: string, providerId: string, providerData: any): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.UPDATE_UTILITY_PROVIDER(propertyId, providerId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(providerData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update utility provider: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Delete utility provider
   */
  async deleteUtilityProvider(propertyId: string, providerId: string): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.DELETE_UTILITY_PROVIDER(propertyId, providerId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete utility provider: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch public property detail (tenant-facing, unauthenticated access OK)
   */
  async getPublicPropertyDetail(propertyId: string): Promise<any> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.GET_PUBLIC_DETAIL(propertyId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) throw new Error('Property not found');
      throw new Error(`Failed to fetch property detail: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Fetch public listings with pagination and filtering (tenant-facing)
   */
  async getPublicListings(filters?: {
    search?: string;
    country?: string;
    state?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    propertyType?: string;
    petsAllowed?: boolean;
    page?: number;
    limit?: number;
  }): Promise<any> {
    const params = new URLSearchParams();

    if (filters?.search) params.append('search', filters.search);
    if (filters?.country) params.append('country', filters.country);
    if (filters?.state) params.append('state', filters.state);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.minPrice) params.append('minPrice', String(filters.minPrice));
    if (filters?.maxPrice) params.append('maxPrice', String(filters.maxPrice));
    if (filters?.beds) params.append('beds', String(filters.beds));
    if (filters?.baths) params.append('baths', String(filters.baths));
    if (filters?.propertyType) params.append('propertyType', filters.propertyType);
    if (filters?.petsAllowed !== undefined) params.append('petsAllowed', String(filters.petsAllowed));
    if (filters?.page) params.append('_page', String(filters.page));
    if (filters?.limit) params.append('_limit', String(filters.limit));

    let url = API_ENDPOINTS.PROPERTY.GET_PUBLIC_LISTINGS;
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch public listings';
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (e) {
        // fallback to default error message
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // Handle both array and pagination response
    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === 'object' && Array.isArray(data.data)) {
      return data;
    }

    // Fallback: wrap array in pagination object if needed
    console.warn('Unexpected public listings response format:', data);
    return { data: Array.isArray(data) ? data : [], pagination: { page: 1, limit: 12, total: 0, totalPages: 0 } };
  }
}

export const propertyService = new PropertyService();

