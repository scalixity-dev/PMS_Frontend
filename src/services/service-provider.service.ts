import { API_ENDPOINTS } from '../config/api.config';

// Backend DTOs
export interface CreateServiceProviderDto {
  photoUrl?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneCountryCode?: string;
  phoneNumber: string;
  companyName: string;
  companyWebsite?: string;
  faxNumber?: string;
  email: string;
  category: string;
  subcategory?: string;
  address: string;
  city?: string;
  state: string;
  zipCode: string;
  country: string;
  isActive?: boolean;
}

export interface UpdateServiceProviderDto extends Partial<CreateServiceProviderDto> {}

export interface BackendServiceProviderDocument {
  id: string;
  serviceProviderId: string;
  documentType: string;
  fileUrl: string;
  description?: string | null;
  uploadedAt: string;
}

export interface BackendServiceProvider {
  id: string;
  userId?: string | null;
  photoUrl?: string | null;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phoneCountryCode?: string | null;
  phoneNumber: string;
  companyName: string;
  companyWebsite?: string | null;
  faxNumber?: string | null;
  email: string;
  category: string;
  subcategory?: string | null;
  address: string;
  city?: string | null;
  state: string;
  zipCode: string;
  country: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  documents?: BackendServiceProviderDocument[];
}

export interface AvailableJob {
  id: string;
  title: string;
  category: string;
  subcategory?: string | null;
  priority: string;
  status: string;
  requestedAt: string;
  property?: {
    propertyName: string;
    address?: {
      streetAddress?: string | null;
      city?: string | null;
      stateRegion?: string | null;
      zipCode?: string | null;
      country?: string | null;
    };
  };
  unit?: {
    id: string;
    unitName: string;
  };
  photos?: Array<{ id: string; photoUrl: string; isPrimary?: boolean }>;
  materials?: Array<{ id: string; materialName: string; quantity: number }>;
  location: string;
  address: string;
}

class ServiceProviderService {
  /**
   * Create a new service provider
   */
  async create(data: CreateServiceProviderDto): Promise<BackendServiceProvider> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create service provider';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Service provider creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create service provider: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get all service providers
   */
  async getAll(isActive?: boolean): Promise<BackendServiceProvider[]> {
    const url = isActive !== undefined 
      ? `${API_ENDPOINTS.SERVICE_PROVIDER.GET_ALL}?isActive=${isActive}`
      : API_ENDPOINTS.SERVICE_PROVIDER.GET_ALL;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch service providers';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Service provider fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch service providers: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Self-register as a service provider (public, no auth)
   */
  async selfRegister(data: CreateServiceProviderDto): Promise<unknown> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.SELF_REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to submit registration';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Get pending self-registered service providers (PM only)
   */
  async getPending(): Promise<BackendServiceProvider[]> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.GET_PENDING, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to fetch pending providers';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Approve a self-registered service provider (PM only)
   */
  async approveSelfRegistered(id: string): Promise<unknown> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.APPROVE(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to approve provider';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Reject a self-registered service provider (PM only)
   */
  async rejectSelfRegistered(id: string): Promise<unknown> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.REJECT(id), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to reject provider';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Get assignments for the current service provider (me)
   */
  async getMyAssignments(status?: string): Promise<unknown[]> {
    const url = status
      ? `${API_ENDPOINTS.SERVICE_PROVIDER.GET_ME_ASSIGNMENTS}?status=${status}`
      : API_ENDPOINTS.SERVICE_PROVIDER.GET_ME_ASSIGNMENTS;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to fetch assignments';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Get available jobs for the current service provider
   */
  async getAvailableJobs(filters?: {
    radius?: string;
    category?: string;
    priority?: string;
    search?: string;
  }): Promise<AvailableJob[]> {
    const params = new URLSearchParams();
    if (filters?.radius) params.append('radius', filters.radius);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.search) params.append('search', filters.search);

    const url = `${API_ENDPOINTS.SERVICE_PROVIDER.GET_AVAILABLE_JOBS}${params.toString() ? `?${params.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to fetch available jobs';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Get a single available job by ID
   */
  async getAvailableJobById(requestId: string): Promise<AvailableJob & { hasApplied?: boolean } | null> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.GET_AVAILABLE_JOB_BY_ID(requestId), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to fetch job';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Apply to a job (submit interest/quote)
   */
  async applyToJob(requestId: string, data?: { quotedAmount?: number; message?: string }): Promise<{ id: string; requestId: string; quotedAmount: number; message: string }> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.APPLY_TO_JOB(requestId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data ?? {}),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to apply to job';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Get current service provider's profile
   */
  async getMyProfile(): Promise<BackendServiceProvider | null> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.GET_MY_PROFILE, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to fetch profile';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Create or update current service provider's profile
   */
  async createOrUpdateMyProfile(data: CreateServiceProviderDto): Promise<BackendServiceProvider> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.CREATE_OR_UPDATE_MY_PROFILE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to save profile';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Update assignment status
   */
  async updateAssignmentStatus(
    serviceProviderId: string,
    assignmentId: string,
    status: string,
  ): Promise<unknown> {
    const response = await fetch(
      API_ENDPOINTS.SERVICE_PROVIDER.UPDATE_ASSIGNMENT_STATUS(serviceProviderId, assignmentId),
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status }),
      },
    );

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to update assignment status';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Assign service provider to a maintenance request
   */
  async assignToMaintenanceRequest(
    serviceProviderId: string,
    requestId: string,
    options?: { scheduledDate?: string; notes?: string; quotedAmount?: number; quotedAmountCurrency?: string },
  ): Promise<unknown> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.ASSIGN_TO_REQUEST(serviceProviderId, requestId), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(options ?? {}),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message?: unknown }).message)
          : 'Failed to assign service provider to request';
      throw new Error(message);
    }

    return response.json();
  }

  /**
   * Get service provider by ID
   */
  async getOne(id: string): Promise<BackendServiceProvider> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch service provider';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Service provider fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch service provider: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get service providers by category
   */
  async getByCategory(category: string, isActive?: boolean): Promise<BackendServiceProvider[]> {
    const url = isActive !== undefined 
      ? `${API_ENDPOINTS.SERVICE_PROVIDER.GET_BY_CATEGORY(category)}?isActive=${isActive}`
      : API_ENDPOINTS.SERVICE_PROVIDER.GET_BY_CATEGORY(category);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch service providers by category';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Service provider fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch service providers: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update a service provider
   */
  async update(id: string, data: UpdateServiceProviderDto): Promise<BackendServiceProvider> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update service provider';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Service provider update error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to update service provider: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete a service provider
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.DELETE(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete service provider';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Service provider deletion error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to delete service provider: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get all documents for a service provider
   */
  async getDocuments(id: string): Promise<BackendServiceProviderDocument[]> {
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.GET_DOCUMENTS(id), {
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
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Service provider documents fetch error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to fetch documents: ${response.statusText}`;
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

    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.VALIDATE_EXCEL, {
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
    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.GET_IMPORT_FIELDS, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch import fields');
    }

    return response.json();
  }

  /**
   * Import service providers from Excel file
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

    const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.IMPORT_EXCEL, {
      method: 'POST',
      credentials: 'include', // Include cookies for JWT
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = 'Failed to import service providers';
      
      try {
        const errorData = await response.json();
        
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        
        console.error('Service provider import error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to import service providers: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const serviceProviderService = new ServiceProviderService();

