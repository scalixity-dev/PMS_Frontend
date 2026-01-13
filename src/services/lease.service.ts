import { API_ENDPOINTS } from '../config/api.config';

export interface BackendLease {
  id: string;
  tenantId: string;
  propertyId: string;
  unitId?: string | null;
  applicationId?: string | null;
  status: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'TERMINATED' | 'CANCELLED';
  startDate: string;
  endDate?: string | null;
  moveInDate?: string | null;
  moveOutDate?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    email: string;
    fullName: string;
    phoneNumber?: string | null;
    tenantProfile?: {
      id: string;
      profilePhotoUrl?: string | null;
    } | null;
  };
  property?: {
    id: string;
    propertyName: string;
    coverPhotoUrl?: string | null;
    address?: {
      streetAddress: string;
      city: string;
      stateRegion: string;
      zipCode: string;
      country: string;
    } | null;
    photos?: Array<{
      id: string;
      photoUrl: string;
      isPrimary: boolean;
    }>;
  };
  unit?: {
    id: string;
    unitName: string;
  } | null;
  application?: any;
  sharedTenants?: Array<{
    id: string;
    tenantId: string;
    tenant: {
      id: string;
      email: string;
      fullName: string;
      tenantProfile?: {
        id: string;
        profilePhotoUrl?: string | null;
      } | null;
    };
  }>;
  deposits?: Array<{
    id: string;
    category: string;
    amount: string;
    invoiceDate?: string | null;
    status: string;
  }>;
  recurringRent?: {
    id: string;
    enabled: boolean;
    amount: string;
    invoiceSchedule: string;
    startOn: string;
    endOn?: string | null;
    isMonthToMonth: boolean;
    markPastPaid: boolean;
  } | null;
  lateFees?: {
    id: string;
    enabled: boolean;
    scheduleType?: string | null;
    oneTimeFeeType?: string | null;
    oneTimeFeeAmount?: string | null;
    oneTimeGracePeriodDays?: number | null;
    oneTimeFeeTime?: string | null;
    dailyFeeType?: string | null;
    dailyFeeAmount?: string | null;
    dailyMaxMonthlyBalance?: string | null;
    dailyGracePeriod?: string | null;
    dailyFeeTime?: string | null;
  } | null;
}

export interface CreateLeaseDto {
  tenantId: string;
  propertyId: string;
  unitId?: string;
  applicationId?: string;
  startDate?: string;
  endDate?: string;
  moveInDate?: string;
  sharedTenantIds?: string[];
  deposit?: {
    category: string;
    amount: number;
    invoiceDate?: string;
  };
  recurringRent?: {
    enabled: boolean;
    amount: number;
    invoiceSchedule: string;
    startOn: string;
    endOn?: string;
    isMonthToMonth: boolean;
    markPastPaid: boolean;
  };
  lateFees?: {
    enabled: boolean;
    scheduleType?: string;
    oneTimeFee?: {
      type: string;
      amount: number;
      gracePeriodDays: string;
      time: string;
    };
    dailyFee?: {
      type: string;
      amount: number;
      maxMonthlyBalance: number;
      gracePeriod: string;
      time: string;
    };
  };
  notes?: string;
}

export interface UpdateLeaseDto extends Partial<CreateLeaseDto> {
  status?: 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'TERMINATED' | 'CANCELLED';
}

class LeaseService {
  /**
   * Create a new lease
   */
  async create(leaseData: CreateLeaseDto): Promise<BackendLease> {
    const response = await fetch(API_ENDPOINTS.LEASE.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(leaseData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create lease';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
        console.error('Lease creation error:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
      } catch (parseError) {
        errorMessage = `Failed to create lease: ${response.statusText}`;
        console.error('Failed to parse error response:', parseError);
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get all leases
   */
  async getAll(propertyId?: string, tenantId?: string): Promise<BackendLease[]> {
    let url = API_ENDPOINTS.LEASE.GET_ALL;
    const params = new URLSearchParams();
    if (propertyId) params.append('propertyId', propertyId);
    if (tenantId) params.append('tenantId', tenantId);
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
      let errorMessage = 'Failed to fetch leases';
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
        errorMessage = `Failed to fetch leases: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get a single lease by ID
   */
  async getOne(id: string): Promise<BackendLease> {
    const response = await fetch(API_ENDPOINTS.LEASE.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch lease';
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
        errorMessage = `Failed to fetch lease: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update a lease
   */
  async update(id: string, updateData: UpdateLeaseDto): Promise<BackendLease> {
    const response = await fetch(API_ENDPOINTS.LEASE.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update lease';
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
        errorMessage = `Failed to update lease: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete a lease
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.LEASE.DELETE(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete lease';
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
        errorMessage = `Failed to delete lease: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  }
}

export const leaseService = new LeaseService();
