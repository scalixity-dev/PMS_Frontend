import { API_ENDPOINTS } from '../config/api.config';

export interface CalendarEvent {
  id: string;
  type: 'task' | 'reminder';
  title: string;
  description?: string;
  date: string; // "DD MMM, YYYY" format
  time?: string;
  color?: string;
  propertyId?: string;
  propertyName?: string;
  assignee?: string;
  status?: string;
  metadata?: Record<string, any>;
}

export interface CalendarFilters {
  types?: ('task' | 'reminder')[];
  propertyId?: string[];
}

class CalendarService {
  async getEvents(
    startDate: Date,
    endDate: Date,
    filters?: CalendarFilters
  ): Promise<CalendarEvent[]> {
    const queryParams = new URLSearchParams();
    queryParams.append('startDate', startDate.toISOString());
    queryParams.append('endDate', endDate.toISOString());

    if (filters?.types && filters.types.length > 0) {
      queryParams.append('types', filters.types.join(','));
    }
    if (filters?.propertyId && filters.propertyId.length > 0) {
      queryParams.append('propertyId', filters.propertyId.join(','));
    }

    const url = `${API_ENDPOINTS.CALENDAR.GET_EVENTS}?${queryParams.toString()}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch calendar events';
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
        errorMessage = `Failed to fetch calendar events: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const calendarService = new CalendarService();