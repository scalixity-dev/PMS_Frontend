import { API_ENDPOINTS } from '../config/api.config';

// Backend Unit Response Types
export interface BackendUnit {
  id: string;
  propertyId: string;
  unitName: string;
  apartmentType?: string | null;
  sizeSqft?: string | number | null;
  beds?: number | null;
  baths?: string | number | null;
  rent?: string | number | null;
  coverPhotoUrl?: string | null;
  description?: string | null;
  photos?: Array<{
    id: string;
    photoUrl: string;
    isPrimary: boolean;
    createdAt: string;
  }>;
  amenities?: {
    parking: 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED';
    laundry: 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS';
    airConditioning: 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER';
    propertyFeatures?: string[];
    propertyAmenities?: string[];
  } | null;
  leasing?: {
    id: string;
    monthlyRent?: string | number | null;
    securityDeposit?: string | number | null;
  } | null;
  listings?: Array<{
    id: string;
    occupancyStatus?: 'VACANT' | 'OCCUPIED' | 'PARTIALLY_OCCUPIED' | null;
    listingStatus?: string;
  }>;
  property?: {
    id: string;
    propertyName: string;
    managerId: string;
    propertyType: 'SINGLE' | 'MULTI';
  };
}

class UnitService {
  /**
   * Get all units for a property
   */
  async getAllByProperty(propertyId: string): Promise<BackendUnit[]> {
    const response = await fetch(API_ENDPOINTS.UNIT.GET_ALL_BY_PROPERTY(propertyId), {
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
   * Get a single unit by ID
   */
  async getOne(unitId: string): Promise<BackendUnit> {
    const response = await fetch(API_ENDPOINTS.UNIT.GET_ONE(unitId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch unit';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Unit fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch unit: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Create a new unit
   */
  async create(propertyId: string, unitData: {
    unitName: string;
    apartmentType?: string;
    sizeSqft?: number;
    beds?: number;
    baths?: number;
    rent?: number;
    coverPhotoUrl?: string;
    description?: string;
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
  }): Promise<BackendUnit> {
    const response = await fetch(API_ENDPOINTS.UNIT.CREATE(propertyId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
      body: JSON.stringify(unitData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create unit';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Unit creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create unit: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update an existing unit
   */
  async update(unitId: string, updateData: {
    unitName?: string;
    apartmentType?: string;
    sizeSqft?: number;
    beds?: number;
    baths?: number;
    rent?: number;
    coverPhotoUrl?: string;
    description?: string;
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
  }): Promise<BackendUnit> {
    const response = await fetch(API_ENDPOINTS.UNIT.UPDATE(unitId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update unit';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Unit update error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to update unit: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete a unit
   */
  async delete(unitId: string): Promise<{ message: string; unit: { id: string; unitName: string; propertyName: string } }> {
    const response = await fetch(API_ENDPOINTS.UNIT.DELETE(unitId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for JWT
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete unit';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Unit deletion error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to delete unit: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const unitService = new UnitService();
