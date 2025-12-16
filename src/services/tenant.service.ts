import { API_ENDPOINTS } from '../config/api.config';

// Backend Tenant Profile Types
export interface BackendTenantProfile {
  id: string;
  userId?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneCountryCode?: string | null;
  phoneNumber?: string | null;
  forwardingAddress?: string | null;
  profilePhotoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
  } | null;
  contactBookEntry?: {
    id: string;
    email: string;
    status: string;
  } | null;
  pets: BackendTenantPet[];
  vehicles: BackendTenantVehicle[];
  emergencyContacts: BackendTenantEmergencyContact[];
  documents: BackendTenantDocument[];
}

export interface BackendTenantPet {
  id: string;
  tenantId: string;
  type: string;
  name: string;
  breed?: string | null;
  weight?: string | number | null;
  age?: number | null;
  vaccination: boolean;
  notes?: string | null;
}

export interface BackendTenantVehicle {
  id: string;
  tenantId: string;
  type: string;
  make: string;
  model: string;
  year?: number | null;
  color?: string | null;
  licensePlate: string;
  registeredIn?: string | null;
}

export interface BackendTenantEmergencyContact {
  id: string;
  tenantId: string;
  name: string;
  relationship: string;
  phoneNumber: string;
  email?: string | null;
  address?: string | null;
}

export interface BackendTenantDocument {
  id: string;
  tenantId: string;
  documentType: string;
  fileUrl: string;
  description?: string | null;
  uploadedAt: string;
}

// Frontend Tenant Types
export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  image?: string;
}

// DTOs for creating/updating
export interface CreateTenantProfileDto {
  email: string; // Required - used to find or invite user
  userId?: string; // Optional - will be resolved from email if not provided
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  forwardingAddress?: string;
  profilePhotoUrl?: string;
  emergencyContacts?: {
    name: string;
    phoneNumber: string;
    relationship: string;
    email?: string;
    address?: string;
  }[];
  pets?: {
    type: string;
    name: string;
    breed?: string;
    weight?: number;
    age?: number;
    notes?: string;
    photoUrl?: string;
    vaccination?: boolean;
  }[];
  vehicles?: {
    type: string;
    make: string;
    model: string;
    year?: number;
    color?: string;
    licensePlate: string;
    registeredIn?: string;
  }[];
}

export interface UpdateTenantProfileDto extends Partial<CreateTenantProfileDto> {}

class TenantService {
  /**
   * Get all tenant profiles
   */
  async getAll(): Promise<BackendTenantProfile[]> {
    const response = await fetch(API_ENDPOINTS.TENANT.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch tenants';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Tenant fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch tenants: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get tenant profile by ID
   */
  async getOne(id: string): Promise<BackendTenantProfile> {
    const response = await fetch(API_ENDPOINTS.TENANT.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch tenant';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = `Failed to fetch tenant: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get tenant profile by user ID
   */
  async getByUserId(userId: string): Promise<BackendTenantProfile> {
    const response = await fetch(API_ENDPOINTS.TENANT.GET_BY_USER(userId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch tenant';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = `Failed to fetch tenant: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Create a new tenant profile
   */
  async create(data: CreateTenantProfileDto): Promise<BackendTenantProfile> {
    const response = await fetch(API_ENDPOINTS.TENANT.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create tenant profile';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Tenant creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create tenant profile: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update tenant profile
   */
  async update(id: string, data: UpdateTenantProfileDto): Promise<BackendTenantProfile> {
    const response = await fetch(API_ENDPOINTS.TENANT.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update tenant profile';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Tenant update error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to update tenant profile: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete tenant profile
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.TENANT.DELETE(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete tenant profile';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = `Failed to delete tenant profile: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Upload profile photo
   */
  async uploadProfilePhoto(id: string, file: File): Promise<{ profilePhotoUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.TENANT.UPLOAD_PROFILE_PHOTO(id), {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to upload profile photo';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = `Failed to upload profile photo: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return { profilePhotoUrl: data.profilePhotoUrl };
  }

  /**
   * Upload document
   */
  async uploadDocument(
    id: string,
    file: File,
    documentType: string,
    description?: string,
  ): Promise<BackendTenantDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    if (description) {
      formData.append('description', description);
    }

    const response = await fetch(API_ENDPOINTS.TENANT.UPLOAD_DOCUMENT(id), {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to upload document';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = `Failed to upload document: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get all documents for a tenant
   */
  async getDocuments(id: string): Promise<BackendTenantDocument[]> {
    const response = await fetch(API_ENDPOINTS.TENANT.GET_DOCUMENTS(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch documents';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = `Failed to fetch documents: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete document
   */
  async deleteDocument(documentId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.TENANT.DELETE_DOCUMENT(documentId), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete document';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        errorMessage = `Failed to delete document: ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
  }

  /**
   * Transform backend tenant profile to frontend tenant format
   */
  transformTenant(backendTenant: BackendTenantProfile): Tenant {
    // Get email from user if available, otherwise from contactBookEntry
    const email = backendTenant.user?.email || backendTenant.contactBookEntry?.email || 'N/A';
    
    // Get phone number with country code if available
    const phone = backendTenant.phoneNumber 
      ? `${backendTenant.phoneCountryCode || ''}${backendTenant.phoneNumber}`.trim() 
      : 'N/A';

    return {
      id: backendTenant.id,
      name: `${backendTenant.firstName} ${backendTenant.middleName || ''} ${backendTenant.lastName}`.trim(),
      phone: phone,
      email: email,
      image: backendTenant.profilePhotoUrl || undefined,
    };
  }
}

export const tenantService = new TenantService();

