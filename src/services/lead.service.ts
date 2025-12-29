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
  activityType: string; // Required, must be a valid string (e.g., 'NOTE', 'TASK', 'CALL', 'MEETING', 'EMAIL', 'MESSAGE', 'STATUS_CHANGE', 'OTHER')
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
      let errorMessage = 'Failed to fetch notes';
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
        errorMessage = `Failed to fetch notes: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch note';
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
        errorMessage = `Failed to fetch note: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to create note';
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
        errorMessage = `Failed to create note: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to update note';
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
        errorMessage = `Failed to update note: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to delete note';
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
        errorMessage = `Failed to delete note: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch tasks';
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
        errorMessage = `Failed to fetch tasks: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch task';
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
        errorMessage = `Failed to fetch task: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to create task';
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
        errorMessage = `Failed to create task: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to update task';
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
        errorMessage = `Failed to update task: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to delete task';
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
        errorMessage = `Failed to delete task: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch activities';
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
        errorMessage = `Failed to fetch activities: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch activity';
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
        errorMessage = `Failed to fetch activity: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async createActivity(leadId: string, activityData: CreateActivityDto): Promise<BackendActivity> {
    const response = await fetch(API_ENDPOINTS.LEAD.ACTIVITIES.CREATE(leadId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(activityData),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create activity';
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
        errorMessage = `Failed to create activity: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to delete activity';
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
        errorMessage = `Failed to delete activity: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch calls';
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
        errorMessage = `Failed to fetch calls: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch call';
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
        errorMessage = `Failed to fetch call: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to create call';
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
        errorMessage = `Failed to create call: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to update call';
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
        errorMessage = `Failed to update call: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to delete call';
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
        errorMessage = `Failed to delete call: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch meetings';
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
        errorMessage = `Failed to fetch meetings: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to fetch meeting';
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
        errorMessage = `Failed to fetch meeting: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to create meeting';
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
        errorMessage = `Failed to create meeting: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to update meeting';
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
        errorMessage = `Failed to update meeting: ${response.statusText}`;
      }
      throw new Error(errorMessage);
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
      let errorMessage = 'Failed to delete meeting';
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
        errorMessage = `Failed to delete meeting: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
  }
}

export const leadService = new LeadService();

