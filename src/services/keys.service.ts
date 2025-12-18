import { API_ENDPOINTS } from '../config/api.config';

export type KeyType = 'DOOR' | 'MAILBOX' | 'GARAGE' | 'GATE' | 'STORAGE' | 'OTHER';
export type KeyStatus = 'AVAILABLE' | 'ISSUED' | 'LOST' | 'DAMAGED' | 'INACTIVE';

export interface BackendKey {
  id: string;
  propertyId: string;
  unitId?: string | null;
  singleUnitDetailId?: string | null;
  keyName: string;
  keyType: KeyType;
  description?: string | null;
  keyPhotoUrl?: string | null;
  status: KeyStatus;
  issuedTo?: string | null;
  issuedDate?: string | null;
  returnedDate?: string | null;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    propertyName: string;
    coverPhotoUrl?: string | null;
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

export interface CreateKeyDto {
  propertyId: string;
  unitId?: string;
  singleUnitDetailId?: string;
  keyName: string;
  keyType: KeyType;
  description?: string;
  keyPhotoUrl?: string;
  status?: KeyStatus;
  issuedTo?: string;
  issuedDate?: string;
  returnedDate?: string;
}

export interface UpdateKeyDto {
  propertyId?: string;
  unitId?: string | null;
  singleUnitDetailId?: string | null;
  keyName?: string;
  keyType?: KeyType;
  description?: string;
  keyPhotoUrl?: string;
  status?: KeyStatus;
  issuedTo?: string | null;
  issuedDate?: string | null;
  returnedDate?: string | null;
}

class KeysService {
  /**
   * Get all keys for the authenticated user
   */
  async getAll(): Promise<BackendKey[]> {
    const response = await fetch(API_ENDPOINTS.KEYS.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch keys';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Keys fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch keys: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get all keys for a specific property
   */
  async getByProperty(propertyId: string): Promise<BackendKey[]> {
    const response = await fetch(API_ENDPOINTS.KEYS.GET_BY_PROPERTY(propertyId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch keys for property';
      
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
        errorMessage = `Failed to fetch keys: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get a single key by ID
   */
  async getOne(id: string): Promise<BackendKey> {
    const response = await fetch(API_ENDPOINTS.KEYS.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch key';
      
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
        errorMessage = `Failed to fetch key: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Create a new key
   */
  async create(keyData: CreateKeyDto): Promise<BackendKey> {
    const response = await fetch(API_ENDPOINTS.KEYS.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(keyData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create key';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Key creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create key: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update an existing key
   */
  async update(id: string, updateData: UpdateKeyDto): Promise<BackendKey> {
    const response = await fetch(API_ENDPOINTS.KEYS.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update key';
      
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
        errorMessage = `Failed to update key: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete a key
   */
  async delete(id: string): Promise<{ message: string; key: BackendKey }> {
    const response = await fetch(API_ENDPOINTS.KEYS.DELETE(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete key';
      
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
        errorMessage = `Failed to delete key: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const keysService = new KeysService();

