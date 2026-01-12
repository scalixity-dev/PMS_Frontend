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

