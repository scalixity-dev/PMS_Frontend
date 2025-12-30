import { API_ENDPOINTS } from '../config/api.config';

/**
 * Helper function to handle API error responses
 * @param response - The fetch Response object
 * @param defaultMessage - Default error message if parsing fails
 * @returns Promise that rejects with an Error containing the formatted message
 */
async function handleApiError(response: Response, defaultMessage: string): Promise<never> {
  let errorMessage = defaultMessage;
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
    errorMessage = `${defaultMessage}: ${response.statusText}`;
  }
  throw new Error(errorMessage);
}

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

// Note interfaces
export interface BackendNote {
  id: string;
  leadId: string;
  content: string;
  attachmentUrl?: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteDto {
  content: string;
  attachmentUrl?: string;
}

export interface UpdateNoteDto {
  content?: string;
  attachmentUrl?: string;
}

// Task interfaces
export interface BackendTask {
  id: string;
  leadId: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  assignee?: string | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDto {
  description: string; // Required
  dueDate: string; // Required, must be a valid date
}

export interface UpdateTaskDto {
  description?: string;
  dueDate?: string;
}

// Activity interfaces
export interface BackendActivity {
  id: string;
  leadId: string;
  type: 'NOTE' | 'TASK' | 'CALL' | 'MEETING' | 'EMAIL' | 'MESSAGE' | 'STATUS_CHANGE' | 'OTHER';
  description: string;
  metadata?: Record<string, unknown> | null;
  createdBy: string;
  createdAt: string;
}

export interface CreateActivityDto {
  type: 'NOTE' | 'TASK' | 'CALL' | 'MEETING' | 'EMAIL' | 'MESSAGE' | 'STATUS_CHANGE' | 'OTHER'; // Required, must be a valid activity type
  description: string; // Required
  metadata?: Record<string, unknown>;
}

// Call interfaces
export interface BackendCall {
  id: string;
  leadId: string;
  details: string;
  dateTime: string;
  callResult: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCallDto {
  details: string; // Required, max 5000 characters, must be string
  dateTime: string; // Required, must be valid ISO 8601 date string
  callResult: string; // Required, must be valid value (enum)
}

export interface UpdateCallDto {
  details?: string; // Max 5000 characters, must be string
  dateTime?: string; // Must be valid ISO 8601 date string
  callResult?: string; // Must be valid value (enum)
}

// Meeting interfaces
export interface BackendMeeting {
  id: string;
  leadId: string;
  details: string;
  dateTime: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetingDto {
  details: string; // Required, max 5000 characters, must be string
  dateTime: string; // Required, must be valid ISO 8601 date string
}

export interface UpdateMeetingDto {
  details?: string; // Max 5000 characters, must be string
  dateTime?: string; // Must be valid ISO 8601 date string
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
      await handleApiError(response, 'Failed to fetch leads');
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
      await handleApiError(response, 'Failed to fetch lead');
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
      await handleApiError(response, 'Failed to create lead');
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
      await handleApiError(response, 'Failed to update lead');
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
      await handleApiError(response, 'Failed to delete lead');
    }
  }

  // ========== Notes Methods ==========
  
  async getAllNotes(leadId: string): Promise<BackendNote[]> {
    const response = await fetch(API_ENDPOINTS.LEAD.NOTES.GET_ALL(leadId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch notes');
    }

    return response.json();
  }

  async getNote(leadId: string, noteId: string): Promise<BackendNote> {
    const response = await fetch(API_ENDPOINTS.LEAD.NOTES.GET_ONE(leadId, noteId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch note');
    }

    return response.json();
  }

  async createNote(leadId: string, noteData: CreateNoteDto): Promise<BackendNote> {
    const response = await fetch(API_ENDPOINTS.LEAD.NOTES.CREATE(leadId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to create note');
    }

    return response.json();
  }

  async updateNote(leadId: string, noteId: string, noteData: UpdateNoteDto): Promise<BackendNote> {
    const response = await fetch(API_ENDPOINTS.LEAD.NOTES.UPDATE(leadId, noteId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(noteData),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to update note');
    }

    return response.json();
  }

  async deleteNote(leadId: string, noteId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.LEAD.NOTES.DELETE(leadId, noteId), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.status === 404) {
      return; // Idempotent - already deleted
    }

    if (!response.ok) {
      // For DELETE, 404 is acceptable (resource already deleted)
      if (response.status === 404) {
        return;
      }
      await handleApiError(response, 'Failed to delete note');
    }
  }

  // ========== Tasks Methods ==========

  async getAllTasks(leadId: string): Promise<BackendTask[]> {
    const response = await fetch(API_ENDPOINTS.LEAD.TASKS.GET_ALL(leadId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch tasks');
    }

    return response.json();
  }

  async getTask(leadId: string, taskId: string): Promise<BackendTask> {
    const response = await fetch(API_ENDPOINTS.LEAD.TASKS.GET_ONE(leadId, taskId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch task');
    }

    return response.json();
  }

  async createTask(leadId: string, taskData: CreateTaskDto): Promise<BackendTask> {
    const response = await fetch(API_ENDPOINTS.LEAD.TASKS.CREATE(leadId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to create task');
    }

    return response.json();
  }

  async updateTask(leadId: string, taskId: string, taskData: UpdateTaskDto): Promise<BackendTask> {
    const response = await fetch(API_ENDPOINTS.LEAD.TASKS.UPDATE(leadId, taskId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to update task');
    }

    return response.json();
  }

  async deleteTask(leadId: string, taskId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.LEAD.TASKS.DELETE(leadId, taskId), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.status === 404) {
      return; // Idempotent - already deleted
    }

    if (!response.ok) {
      await handleApiError(response, 'Failed to delete task');
    }
  }

  // ========== Activities Methods ==========

  async getAllActivities(leadId: string): Promise<BackendActivity[]> {
    const response = await fetch(API_ENDPOINTS.LEAD.ACTIVITIES.GET_ALL(leadId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch activities');
    }

    return response.json();
  }

  async getActivity(leadId: string, activityId: string): Promise<BackendActivity> {
    const response = await fetch(API_ENDPOINTS.LEAD.ACTIVITIES.GET_ONE(leadId, activityId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch activity');
    }

    return response.json();
  }

  async createActivity(leadId: string, activityData: CreateActivityDto): Promise<BackendActivity> {
    // Map 'type' to 'activityType' for backend compatibility
    const payload = {
      activityType: activityData.type,
      description: activityData.description,
      metadata: activityData.metadata,
    };
    
    const response = await fetch(API_ENDPOINTS.LEAD.ACTIVITIES.CREATE(leadId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to create activity');
    }

    return response.json();
  }

  async deleteActivity(leadId: string, activityId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.LEAD.ACTIVITIES.DELETE(leadId, activityId), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.status === 404) {
      return; // Idempotent - already deleted
    }

    if (!response.ok) {
      // For DELETE, 404 is acceptable (resource already deleted)
      if (response.status === 404) {
        return;
      }
      await handleApiError(response, 'Failed to delete activity');
    }
  }

  // ========== Calls Methods ==========

  async getAllCalls(leadId: string): Promise<BackendCall[]> {
    const response = await fetch(API_ENDPOINTS.LEAD.CALLS.GET_ALL(leadId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch calls');
    }

    return response.json();
  }

  async getCall(leadId: string, callId: string): Promise<BackendCall> {
    const response = await fetch(API_ENDPOINTS.LEAD.CALLS.GET_ONE(leadId, callId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch call');
    }

    return response.json();
  }

  async createCall(leadId: string, callData: CreateCallDto): Promise<BackendCall> {
    const response = await fetch(API_ENDPOINTS.LEAD.CALLS.CREATE(leadId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(callData),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to create call');
    }

    return response.json();
  }

  async updateCall(leadId: string, callId: string, callData: UpdateCallDto): Promise<BackendCall> {
    const response = await fetch(API_ENDPOINTS.LEAD.CALLS.UPDATE(leadId, callId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(callData),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to update call');
    }

    return response.json();
  }

  async deleteCall(leadId: string, callId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.LEAD.CALLS.DELETE(leadId, callId), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.status === 404) {
      return; // Idempotent - already deleted
    }

    if (!response.ok) {
      await handleApiError(response, 'Failed to delete call');
    }
  }

  // ========== Meetings Methods ==========

  async getAllMeetings(leadId: string): Promise<BackendMeeting[]> {
    const response = await fetch(API_ENDPOINTS.LEAD.MEETINGS.GET_ALL(leadId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch meetings');
    }

    return response.json();
  }

  async getMeeting(leadId: string, meetingId: string): Promise<BackendMeeting> {
    const response = await fetch(API_ENDPOINTS.LEAD.MEETINGS.GET_ONE(leadId, meetingId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to fetch meeting');
    }

    return response.json();
  }

  async createMeeting(leadId: string, meetingData: CreateMeetingDto): Promise<BackendMeeting> {
    const response = await fetch(API_ENDPOINTS.LEAD.MEETINGS.CREATE(leadId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to create meeting');
    }

    return response.json();
  }

  async updateMeeting(leadId: string, meetingId: string, meetingData: UpdateMeetingDto): Promise<BackendMeeting> {
    const response = await fetch(API_ENDPOINTS.LEAD.MEETINGS.UPDATE(leadId, meetingId), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(meetingData),
    });

    if (!response.ok) {
      await handleApiError(response, 'Failed to update meeting');
    }

    return response.json();
  }

  async deleteMeeting(leadId: string, meetingId: string): Promise<void> {
    const response = await fetch(API_ENDPOINTS.LEAD.MEETINGS.DELETE(leadId, meetingId), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (response.status === 404) {
      return; // Idempotent - already deleted
    }

    if (!response.ok) {
      // For DELETE, 404 is acceptable (resource already deleted)
      if (response.status === 404) {
        return;
      }
      await handleApiError(response, 'Failed to delete meeting');
    }
  }
}

export const leadService = new LeadService();

