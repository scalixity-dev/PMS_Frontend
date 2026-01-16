import { API_ENDPOINTS } from '../config/api.config';

export interface GoogleCalendarIntegrationStatus {
  connected: boolean;
  email: string | null;
  lastSyncedAt: string | null;
  expiresAt?: string;
}

export interface GoogleCalendarConnectResponse {
  authUrl: string;
  message: string;
}

export interface GoogleCalendarCallbackResponse {
  success: boolean;
  message: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  location?: string;
  htmlLink?: string;
  created?: string;
  updated?: string;
}

export interface SyncCalendarEventsResponse {
  events: GoogleCalendarEvent[];
  count: number;
  syncedAt: string;
}

export interface CreateCalendarEventRequest {
  summary: string;
  description?: string;
  start: { dateTime: string; timeZone?: string } | { date: string };
  end: { dateTime: string; timeZone?: string } | { date: string };
  location?: string;
}

class GoogleCalendarIntegrationService {
  private getAuthHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Get Google OAuth authorization URL
   */
  async getConnectUrl(redirectUrl?: string): Promise<GoogleCalendarConnectResponse> {
    const url = new URL(API_ENDPOINTS.GOOGLE_CALENDAR.CONNECT);
    if (redirectUrl) {
      url.searchParams.set('redirectUrl', redirectUrl);
    }

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || `Failed to get authorization URL: ${response.status} ${response.statusText}`);
      }

      return response.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to the server. Please ensure the backend server is running and accessible.');
      }
      throw error;
    }
  }

  /**
   * Get integration status
   */
  async getStatus(): Promise<GoogleCalendarIntegrationStatus> {
    const response = await fetch(API_ENDPOINTS.GOOGLE_CALENDAR.STATUS, {
      method: 'GET',
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to get integration status');
    }

    return response.json();
  }

  /**
   * Disconnect Google Calendar
   */
  async disconnect(): Promise<{ success: boolean; message: string }> {
    const response = await fetch(API_ENDPOINTS.GOOGLE_CALENDAR.DISCONNECT, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to disconnect Google Calendar');
    }

    return response.json();
  }

  /**
   * Sync calendar events from Google Calendar
   */
  async syncEvents(startDate?: string, endDate?: string): Promise<SyncCalendarEventsResponse> {
    const url = new URL(API_ENDPOINTS.GOOGLE_CALENDAR.SYNC_EVENTS);
    if (startDate) {
      url.searchParams.set('startDate', startDate);
    }
    if (endDate) {
      url.searchParams.set('endDate', endDate);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to sync calendar events');
    }

    return response.json();
  }

  /**
   * Create event in Google Calendar
   */
  async createEvent(event: CreateCalendarEventRequest): Promise<GoogleCalendarEvent> {
    const response = await fetch(API_ENDPOINTS.GOOGLE_CALENDAR.CREATE_EVENT, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(event),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to create calendar event');
    }

    return response.json();
  }
}

export const googleCalendarIntegrationService = new GoogleCalendarIntegrationService();
