import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/task.service';
import type { TaskFilters, CreateTaskDto, UpdateTaskDto } from '../services/task.service';
import { calendarQueryKeys } from './useCalendarQueries';

// Query keys for React Query
export const taskQueryKeys = {
  all: ['tasks'] as const,
  lists: () => [...taskQueryKeys.all, 'list'] as const,
  list: (filters?: TaskFilters) => [...taskQueryKeys.lists(), filters] as const,
  details: () => [...taskQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...taskQueryKeys.details(), id] as const,
};

/**
 * Hook to get all tasks for the authenticated user
 */
export const useGetAllTasks = (filters?: TaskFilters, enabled: boolean = true) => {
  return useQuery({
    queryKey: taskQueryKeys.list(filters),
    queryFn: () => taskService.getAll(filters),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get a single task by ID
 */
export const useGetTask = (taskId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: taskId ? taskQueryKeys.detail(taskId) : ['tasks', 'detail', 'null'] as const,
    queryFn: () => taskService.getOne(taskId!),
    enabled: enabled && !!taskId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a new task
 */
export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (createTaskDto: CreateTaskDto) => taskService.create(createTaskDto),
    onSuccess: () => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      // Invalidate calendar events to refresh calendar view
      queryClient.invalidateQueries({ queryKey: calendarQueryKeys.all });
    },
  });
};

/**
 * Hook to update a task
 */
export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: UpdateTaskDto }) =>
      taskService.update(id, updateData),
    onSuccess: (_data, variables) => {
      // Invalidate the specific task detail
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.detail(variables.id) });
      // Also invalidate the list to ensure consistency
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      // Invalidate calendar events to refresh calendar view
      queryClient.invalidateQueries({ queryKey: calendarQueryKeys.all });
    },
  });
};

/**
 * Hook to delete a task
 */
export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => taskService.delete(id),
    onSuccess: () => {
      // Invalidate tasks list to refetch
      queryClient.invalidateQueries({ queryKey: taskQueryKeys.lists() });
      // Invalidate calendar events to refresh calendar view
      queryClient.invalidateQueries({ queryKey: calendarQueryKeys.all });
    },
  });
};

