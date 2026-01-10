import { API_ENDPOINTS } from '../config/api.config';

export type EquipmentStatus = 'ACTIVE' | 'UNDER_MAINTENANCE' | 'REPLACED' | 'DISPOSED';

export interface BackendEquipment {
  id: string;
  propertyId: string;
  unitId?: string | null;
  singleUnitDetailId?: string | null;
  // Can be a simple string or an expanded object from Prisma include
  categoryId?: string;
  category: string | {
    id: string;
    name: string;
    description?: string | null;
  };
  // Optional subcategory object when included from backend
  subcategoryId?: string | null;
  subcategory?: {
    id: string;
    name: string;
    description?: string | null;
  } | null;
  brand: string;
  model: string;
  serialNumber: string;
  price: string | number;
  dateOfInstallation: string;
  equipmentDetails?: string | null;
  photoUrl?: string | null;
  status: EquipmentStatus;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    propertyName: string;
    // Main cover photo for property, if any
    coverPhotoUrl?: string | null;
    // Additional property photos with primary flag
    photos?: Array<{
      photoUrl: string;
      isPrimary?: boolean | null;
    }>;
    address?: {
      streetAddress: string;
      city: string;
      stateRegion: string;
      zipCode: string;
      country: string;
    } | null;
  };
  unit?: {
    id: string;
    unitName: string;
  } | null;
  singleUnitDetail?: {
    id: string;
  } | null;
}

export interface CreateEquipmentDto {
  propertyId: string;
  unitId?: string;
  singleUnitDetailId?: string;
  categoryId: string;
  subcategoryId?: string;
  brand: string;
  model: string;
  serialNumber: string;
  price: number;
  dateOfInstallation: string;
  equipmentDetails?: string;
  photoUrl?: string;
  status?: EquipmentStatus;
}

export interface UpdateEquipmentDto {
  propertyId?: string;
  unitId?: string | null;
  singleUnitDetailId?: string | null;
  categoryId?: string;
  subcategoryId?: string | null;
  brand?: string;
  model?: string;
  serialNumber?: string;
  price?: number;
  dateOfInstallation?: string;
  equipmentDetails?: string;
  photoUrl?: string;
  status?: EquipmentStatus;
}

class EquipmentService {
  /**
   * Get all equipment for the authenticated user
   */
  async getAll(): Promise<BackendEquipment[]> {
    const response = await fetch(API_ENDPOINTS.EQUIPMENT.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch equipment';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Equipment fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch equipment: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get all equipment for a specific property
   */
  async getByProperty(propertyId: string): Promise<BackendEquipment[]> {
    const response = await fetch(API_ENDPOINTS.EQUIPMENT.GET_BY_PROPERTY(propertyId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch equipment for property';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch equipment: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get a single equipment by ID
   */
  async getOne(id: string): Promise<BackendEquipment> {
    const response = await fetch(API_ENDPOINTS.EQUIPMENT.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch equipment';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch equipment: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Create a new equipment
   */
  async create(equipmentData: CreateEquipmentDto): Promise<BackendEquipment> {
    const response = await fetch(API_ENDPOINTS.EQUIPMENT.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(equipmentData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create equipment';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Equipment creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create equipment: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update an existing equipment
   */
  async update(id: string, updateData: UpdateEquipmentDto): Promise<BackendEquipment> {
    const response = await fetch(API_ENDPOINTS.EQUIPMENT.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update equipment';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to update equipment: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete an equipment
   */
  async delete(id: string): Promise<{ message: string; equipment: BackendEquipment }> {
    const response = await fetch(API_ENDPOINTS.EQUIPMENT.DELETE(id), {
      method: 'DELETE',
      headers: {},
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete equipment';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to delete equipment: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const equipmentService = new EquipmentService();

