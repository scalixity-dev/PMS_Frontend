import { API_ENDPOINTS } from '../config/api.config';

// Backend Property Response Types
export interface BackendProperty {
  id: string;
  propertyName: string;
  propertyType: 'SINGLE' | 'MULTI';
  marketRent?: string | number | null;
  sizeSqft?: string | number | null;
  yearBuilt?: number | null;
  description?: string | null;
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
  units?: Array<{
    id: string;
    unitName: string;
  }>;
  photos?: Array<{
    id: string;
    photoUrl: string;
    isPrimary: boolean;
  }>;
  amenities?: {
    parking: 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED';
    laundry: 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS';
    airConditioning: 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER';
    propertyFeatures?: string[];
    propertyAmenities?: string[];
  } | null;
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
   */
  async getAll(): Promise<BackendProperty[]> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.GET_ALL, {
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

    // Get primary photo or first photo
    const primaryPhoto = backendProperty.photos?.find((p) => p.isPrimary);
    const firstPhoto = backendProperty.photos?.[0];
    const image = primaryPhoto?.photoUrl || firstPhoto?.photoUrl || '';

    // Determine unit name
    const unit =
      backendProperty.propertyType === 'MULTI' && backendProperty.units?.[0]
        ? backendProperty.units[0].unitName
        : backendProperty.propertyType === 'SINGLE'
        ? 'Single Unit'
        : 'Property';

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
   */
  async getOne(propertyId: string): Promise<BackendProperty> {
    const response = await fetch(API_ENDPOINTS.PROPERTY.GET_ONE(propertyId), {
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
}

export const propertyService = new PropertyService();

