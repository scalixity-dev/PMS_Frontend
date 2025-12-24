import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reminderService } from '../services/reminder.service';
import type { CreateReminderDto, UpdateReminderDto } from '../services/reminder.service';
import { calendarQueryKeys } from './useCalendarQueries';

// Query keys for React Query
export const reminderQueryKeys = {
  all: ['reminders'] as const,
  lists: () => [...reminderQueryKeys.all, 'list'] as const,
  list: (filters?: { startDate?: string; endDate?: string }) => [...reminderQueryKeys.lists(), filters] as const,
  details: () => [...reminderQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...reminderQueryKeys.details(), id] as const,
};

/**
 * Hook to get all reminders
 */
export const useGetAllReminders = (startDate?: string, endDate?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: reminderQueryKeys.list({ startDate, endDate }),
    queryFn: () => reminderService.getAll(startDate, endDate),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get a single reminder by ID
 */
export const useGetReminder = (reminderId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: reminderId ? reminderQueryKeys.detail(reminderId) : ['reminders', 'detail', 'null'] as const,
    queryFn: () => reminderService.getOne(reminderId!),
    enabled: enabled && !!reminderId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a new reminder
 */
export const useCreateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createReminderDto: CreateReminderDto) => {
      return reminderService.create(createReminderDto);
    },
    onSuccess: () => {
      // Invalidate reminders list
      queryClient.invalidateQueries({ queryKey: reminderQueryKeys.lists() });
      // Invalidate calendar events to refresh calendar view
      queryClient.invalidateQueries({ queryKey: calendarQueryKeys.all });
    },
  });
};

/**
 * Hook to update an existing reminder
 */
export const useUpdateReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: UpdateReminderDto }) => {
      return reminderService.update(id, updateData);
    },
    onSuccess: (data, variables) => {
      // Invalidate reminders list
      queryClient.invalidateQueries({ queryKey: reminderQueryKeys.lists() });
      // Update the cached reminder
      queryClient.setQueryData(reminderQueryKeys.detail(variables.id), data);
      // Invalidate calendar events
      queryClient.invalidateQueries({ queryKey: calendarQueryKeys.all });
    },
  });
};

/**
 * Hook to delete a reminder
 */
export const useDeleteReminder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return reminderService.delete(id);
    },
    onSuccess: () => {
      // Invalidate reminders list
      queryClient.invalidateQueries({ queryKey: reminderQueryKeys.lists() });
      // Invalidate calendar events
      queryClient.invalidateQueries({ queryKey: calendarQueryKeys.all });
    },
  });
};

