import { API_ENDPOINTS } from '../config/api.config';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string;
  time?: string;
  type: 'reminder' | 'viewing' | 'meeting' | 'other';
  property?: string;
  assignee?: string;
  recurring: boolean;
  frequency?: string;
  endDate?: string;
  color?: string;
}

export interface CreateReminderDto {
  title: string;
  description?: string;
  date: string;
  time: string;
  type: 'reminder' | 'viewing' | 'meeting' | 'other';
  propertyId?: string;
  assignee?: string;
  recurring?: boolean;
  frequency?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'ONCE';
  endDate?: string;
  color?: string;
}

export interface UpdateReminderDto extends Partial<CreateReminderDto> {}

class ReminderService {
  async getAll(startDate?: string, endDate?: string): Promise<Reminder[]> {
    const queryParams = new URLSearchParams();
    
    if (startDate) {
      queryParams.append('startDate', startDate);
    }
    if (endDate) {
      queryParams.append('endDate', endDate);
    }

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.REMINDER.GET_ALL}?${queryParams.toString()}`
      : API_ENDPOINTS.REMINDER.GET_ALL;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch reminders';
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
        errorMessage = `Failed to fetch reminders: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async getOne(id: string): Promise<Reminder> {
    const response = await fetch(API_ENDPOINTS.REMINDER.GET_ONE(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch reminder';
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
        errorMessage = `Failed to fetch reminder: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async create(createReminderDto: CreateReminderDto): Promise<Reminder> {
    const response = await fetch(API_ENDPOINTS.REMINDER.CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(createReminderDto),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to create reminder';
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
        errorMessage = `Failed to create reminder: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async update(id: string, updateReminderDto: UpdateReminderDto): Promise<Reminder> {
    const response = await fetch(API_ENDPOINTS.REMINDER.UPDATE(id), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(updateReminderDto),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update reminder';
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
        errorMessage = `Failed to update reminder: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await fetch(API_ENDPOINTS.REMINDER.DELETE(id), {
      method: 'DELETE',
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to delete reminder';
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
        errorMessage = `Failed to delete reminder: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const reminderService = new ReminderService();

