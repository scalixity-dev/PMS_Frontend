import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/application.service';

// Query keys for React Query
export const applicationQueryKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...applicationQueryKeys.lists(), filters] as const,
  details: () => [...applicationQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationQueryKeys.details(), id] as const,
  byLeasing: (leasingId: string) => [...applicationQueryKeys.all, 'leasing', leasingId] as const,
};

/**
 * Hook to get all applications for the authenticated user
 */
export const useGetAllApplications = (enabled: boolean = true) => {
  return useQuery({
    queryKey: applicationQueryKeys.lists(),
    queryFn: () => applicationService.getAll(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get a single application by ID
 */
export const useGetApplication = (applicationId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: applicationId ? applicationQueryKeys.detail(applicationId) : ['applications', 'detail', 'null'] as const,
    queryFn: () => applicationService.getOne(applicationId!),
    enabled: enabled && !!applicationId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get applications by leasing ID
 */
export const useGetApplicationsByLeasing = (leasingId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leasingId ? applicationQueryKeys.byLeasing(leasingId) : ['applications', 'leasing', 'null'] as const,
    queryFn: () => applicationService.getByLeasingId(leasingId!),
    enabled: enabled && !!leasingId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a new application
 */
export const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ formData, leasingId }: { formData: any; leasingId: string }) =>
      applicationService.create(formData, leasingId),
    onSuccess: () => {
      // Invalidate applications list to refetch
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
    },
  });
};

/**
 * Hook to update an application
 */
export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: Partial<any> }) =>
      applicationService.update(id, updateData),
    onSuccess: (data, variables) => {
      // Invalidate the specific application detail
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.detail(variables.id) });
      // Also invalidate the list to ensure consistency
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.lists() });
    },
  });
};

