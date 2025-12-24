import { useQuery } from '@tanstack/react-query';
import { calendarService, type CalendarFilters } from '../services/calendar.service';

export const calendarQueryKeys = {
  all: ['calendar'] as const,
  events: (startDate: Date, endDate: Date, filters?: CalendarFilters) =>
    [...calendarQueryKeys.all, 'events', startDate, endDate, filters] as const,
};

export const useGetCalendarEvents = (
  startDate: Date,
  endDate: Date,
  filters?: CalendarFilters,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: calendarQueryKeys.events(startDate, endDate, filters),
    queryFn: () => calendarService.getEvents(startDate, endDate, filters),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};