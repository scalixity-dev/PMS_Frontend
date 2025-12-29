import { API_ENDPOINTS } from '../config/api.config';

export type LeadSource = 
    | 'CREATED_MANUALLY'
    | 'RENTAL_APPLICATION'
    | 'SENT_A_QUESTION'
    | 'REQUESTED_A_TOUR'
    | 'ZILLOW'
    | 'ZUMPER'
    | 'RENTLER'
    | 'TENANT_PROFILE'
    | 'REALTOR'
    | 'APARTMENTS'
    | 'RENT_GROUP'
    | 'OTHER';

export type LeadStatus = 'NEW' | 'WORKING' | 'CLOSED';
export type LeadType = 'HOT' | 'COLD';

export interface BackendLead {
  id: string;
  managerId: string;
  listingId?: string | null;
  status: LeadStatus;
  name: string;
  phoneNumber?: string | null;
  phoneCountryCode?: string | null;
  email?: string | null;
  source: LeadSource;
  type?: LeadType | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  name: string;
  phoneNumber?: string;
  phoneCountryCode?: string;
  email?: string;
  type?: LeadType;
  source?: LeadSource;
  listingId?: string;
  notes?: string;
}

export interface UpdateLeadDto extends Partial<CreateLeadDto> {
  status?: LeadStatus;
}

class LeadService {
  /**
   * Get all leads for the authenticated manager
   */
  async getAll(): Promise<BackendLead[]> {
    const response = await fetch(API_ENDPOINTS.LEAD.GET_ALL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch leads';
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
        errorMessage = `Failed to fetch leads: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get a single lead by ID
   */
  async getOne(id: string): Promise<BackendLead> {
    const response = await fetch(API_ENDPOINTS.LEAD.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch lead';
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
        errorMessage = `Failed to fetch lead: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Create a new lead
   */
  async create(leadData: CreateLeadDto): Promise<BackendLead> {
    const response = await fetch(API_ENDPOINTS.LEAD.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create lead';
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
        errorMessage = `Failed to create lead: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update a lead
   */
  async update(id: string, leadData: UpdateLeadDto): Promise<BackendLead> {
    const response = await fetch(API_ENDPOINTS.LEAD.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update lead';
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
        errorMessage = `Failed to update lead: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Delete a lead
   */
  async delete(id: string): Promise<void> {
    const url = API_ENDPOINTS.LEAD.DELETE(id);
    
    const response = await fetch(url, {
      method: 'DELETE',
      // Don't set Content-Type header for DELETE requests as they typically don't have a body
      credentials: 'include',
    });


    // Handle 404 (Not Found) as success - lead is already deleted, which is the desired state
    if (response.status === 404) {
      return;
    }

    if (!response.ok) {
      let errorMessage = 'Failed to delete lead';
      try {
        const errorData = await response.json();
        console.error('Delete error response:', errorData);
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        errorMessage = `Failed to delete lead: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  
  }
}

export const leadService = new LeadService();

