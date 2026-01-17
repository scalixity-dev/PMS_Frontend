import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  googleCalendarIntegrationService,
  type GoogleCalendarIntegrationStatus,
  type GoogleCalendarConnectResponse,
  type SyncCalendarEventsResponse,
  type CreateCalendarEventRequest,
  type GoogleCalendarEvent,
} from '../services/google-calendar-integration.service';

// Query keys for React Query
export const googleCalendarQueryKeys = {
  all: ['google-calendar'] as const,
  status: () => [...googleCalendarQueryKeys.all, 'status'] as const,
  events: () => [...googleCalendarQueryKeys.all, 'events'] as const,
  eventsSync: (startDate?: string, endDate?: string) =>
    [...googleCalendarQueryKeys.events(), 'sync', startDate, endDate] as const,
};

/**
 * Hook to get Google Calendar integration status
 */
export const useGetGoogleCalendarStatus = () => {
  return useQuery({
    queryKey: googleCalendarQueryKeys.status(),
    queryFn: (): Promise<GoogleCalendarIntegrationStatus> => {
      return googleCalendarIntegrationService.getStatus();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get Google Calendar connect URL
 */
export const useGetGoogleCalendarConnectUrl = () => {
  return useMutation({
    mutationFn: (redirectUrl?: string): Promise<GoogleCalendarConnectResponse> => {
      return googleCalendarIntegrationService.getConnectUrl(redirectUrl);
    },
  });
};

/**
 * Hook to disconnect Google Calendar
 */
export const useDisconnectGoogleCalendar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (): Promise<{ success: boolean; message: string }> => {
      return googleCalendarIntegrationService.disconnect();
    },
    onSuccess: () => {
      // Invalidate status query
      queryClient.invalidateQueries({ queryKey: googleCalendarQueryKeys.status() });
      queryClient.invalidateQueries({ queryKey: googleCalendarQueryKeys.events() });
    },
  });
};

/**
 * Hook to sync calendar events
 */
export const useSyncGoogleCalendarEvents = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      startDate,
      endDate,
    }: {
      startDate?: string;
      endDate?: string;
    }): Promise<SyncCalendarEventsResponse> => {
      return googleCalendarIntegrationService.syncEvents(startDate, endDate);
    },
    onSuccess: (data, variables) => {
      // Invalidate events queries
      queryClient.invalidateQueries({ queryKey: googleCalendarQueryKeys.events() });
      queryClient.setQueryData(
        googleCalendarQueryKeys.eventsSync(variables.startDate, variables.endDate),
        data
      );
    },
  });
};

/**
 * Hook to create a calendar event
 */
export const useCreateGoogleCalendarEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (event: CreateCalendarEventRequest): Promise<GoogleCalendarEvent> => {
      return googleCalendarIntegrationService.createEvent(event);
    },
    onSuccess: () => {
      // Invalidate events queries
      queryClient.invalidateQueries({ queryKey: googleCalendarQueryKeys.events() });
    },
  });
};
