import { API_ENDPOINTS } from '../config/api.config';

// Backend Leasing Response Types
export interface BackendLeasing {
  id: string;
  propertyId: string;
  unitId?: string | null;
  singleUnitDetailId?: string | null;
  monthlyRent: string | number;
  securityDeposit?: string | number | null;
  amountRefundable?: string | number | null;
  dateAvailable: string;
  minLeaseDuration: string;
  maxLeaseDuration: string;
  description?: string | null;
  petsAllowed: boolean;
  petCategory?: string[] | null;
  petDeposit?: string | number | null;
  petFee?: string | number | null;
  petDescription?: string | null;
  onlineRentalApplication: boolean;
  requireApplicationFee?: boolean | null;
  applicationFee?: string | number | null;
  createdAt: string;
  updatedAt: string;
  property?: any;
  unit?: any;
  singleUnitDetail?: any;
}

export type LeaseDuration =
  | 'ONE_MONTH'
  | 'TWO_MONTHS'
  | 'THREE_MONTHS'
  | 'FOUR_MONTHS'
  | 'FIVE_MONTHS'
  | 'SIX_MONTHS'
  | 'SEVEN_MONTHS'
  | 'EIGHT_MONTHS'
  | 'NINE_MONTHS'
  | 'TEN_MONTHS'
  | 'ELEVEN_MONTHS'
  | 'TWELVE_MONTHS'
  | 'THIRTEEN_MONTHS'
  | 'FOURTEEN_MONTHS'
  | 'FIFTEEN_MONTHS'
  | 'SIXTEEN_MONTHS'
  | 'SEVENTEEN_MONTHS'
  | 'EIGHTEEN_MONTHS'
  | 'NINETEEN_MONTHS'
  | 'TWENTY_MONTHS'
  | 'TWENTY_ONE_MONTHS'
  | 'TWENTY_TWO_MONTHS'
  | 'TWENTY_THREE_MONTHS'
  | 'TWENTY_FOUR_MONTHS'
  | 'THIRTY_SIX_PLUS_MONTHS'
  | 'CONTACT_FOR_DETAILS';

class LeasingService {
  /**
   * Get all leasings
   */
  async getAll(): Promise<BackendLeasing[]> {
    const response = await fetch(API_ENDPOINTS.LEASING.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch leasings';
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
        errorMessage = `Failed to fetch leasings: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get a single leasing by ID
   */
  async getOne(id: string): Promise<BackendLeasing> {
    const response = await fetch(API_ENDPOINTS.LEASING.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch leasing';
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
        errorMessage = `Failed to fetch leasing: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get leasing by property ID
   * Returns null if leasing doesn't exist (404), throws error for other failures
   */
  async getByPropertyId(propertyId: string): Promise<BackendLeasing | null> {
    const response = await fetch(API_ENDPOINTS.LEASING.GET_BY_PROPERTY(propertyId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // 404 means leasing doesn't exist - this is not an error, just return null
      if (response.status === 404) {
        return null;
      }
      
      // For other errors, throw an exception
      let errorMessage = 'Failed to fetch leasing for property';
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
        errorMessage = `Failed to fetch leasing: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Create a new leasing
   */
  async create(leasingData: {
    propertyId: string;
    unitId?: string;
    singleUnitDetailId?: string;
    monthlyRent: number;
    securityDeposit?: number;
    amountRefundable?: number;
    dateAvailable: string;
    minLeaseDuration: LeaseDuration;
    maxLeaseDuration: LeaseDuration;
    description?: string;
    petsAllowed: boolean;
    petCategory?: string[];
    petDeposit?: number;
    petFee?: number;
    petDescription?: string;
    onlineRentalApplication: boolean;
    requireApplicationFee?: boolean;
    applicationFee?: number;
  }): Promise<BackendLeasing> {
    const response = await fetch(API_ENDPOINTS.LEASING.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(leasingData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create leasing';
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
        errorMessage = `Failed to create leasing: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update an existing leasing
   */
  async update(id: string, updateData: {
    propertyId?: string;
    unitId?: string;
    singleUnitDetailId?: string;
    monthlyRent?: number;
    securityDeposit?: number;
    amountRefundable?: number;
    dateAvailable?: string;
    minLeaseDuration?: LeaseDuration;
    maxLeaseDuration?: LeaseDuration;
    description?: string;
    petsAllowed?: boolean;
    petCategory?: string[];
    petDeposit?: number;
    petFee?: number;
    petDescription?: string;
    onlineRentalApplication?: boolean;
    requireApplicationFee?: boolean;
    applicationFee?: number;
  }): Promise<BackendLeasing> {
    const response = await fetch(API_ENDPOINTS.LEASING.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update leasing';
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
        errorMessage = `Failed to update leasing: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete a leasing
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.LEASING.DELETE(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete leasing';
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
        errorMessage = `Failed to delete leasing: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  }
    /**
   * Validate Excel file for import
   */
  async validateExcel(file: File): Promise<{
    total: number;
    successful: number;
    failed: number;
    errors: Array<{ row: number; error: string }>;
    message: string;
    headers: string[];
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(API_ENDPOINTS.LEASING.VALIDATE_EXCEL, {
      method: 'POST',
      headers: {
        // Content-Type is set automatically for FormData
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      // Mock response for development if endpoint doesn't exist
      if (response.status === 404) {
        console.warn('Validate endpoint not found, returning mock data');
        return {
          total: 5,
          successful: 5,
          failed: 0,
          errors: [],
          message: 'File validated successfully (Mock)',
          headers: ['Property', 'Tenant', 'StartDate', 'EndDate', 'Rent'],
        };
      }
      throw new Error(`Failed to validate file: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Import leasings from Excel
   */
  async importFromExcel(
    file: File,
    mappings: Record<string, string>,
    importFirstRow: boolean
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
    formData.append('mappings', JSON.stringify(mappings));
    formData.append('importFirstRow', String(importFirstRow));

    const response = await fetch(API_ENDPOINTS.LEASING.IMPORT_EXCEL, {
      method: 'POST',
      headers: {
        // Content-Type is set automatically for FormData
      },
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
        // Mock response for development
        if (response.status === 404) {
            console.warn('Import endpoint not found, returning mock data');
            return {
                total: 5,
                successful: 5,
                failed: 0,
                errors: [],
                jobId: 'mock-job-id-123',
                message: 'Import started successfully (Mock)',
            };
        }
      throw new Error(`Failed to import leasings: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get import fields definition
   */
  async getImportFields(): Promise<{
    fields: Array<{ key: string; label: string; required: boolean }>;
  }> {
    const response = await fetch(API_ENDPOINTS.LEASING.GET_IMPORT_FIELDS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
        // Mock response
        if (response.status === 404) {
             return {
                fields: [
                    { key: 'property', label: 'Property', required: true },
                    { key: 'tenant', label: 'Tenant', required: true },
                    { key: 'startDate', label: 'Start Date', required: true },
                    { key: 'endDate', label: 'End Date', required: true },
                    { key: 'rent', label: 'Monthly Rent', required: true },
                ]
             };
        }
      throw new Error(`Failed to fetch import fields: ${response.statusText}`);
    }

    return response.json();
  }

}

export const leasingService = new LeasingService();

