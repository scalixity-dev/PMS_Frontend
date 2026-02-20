import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceProviderService, type AvailableJob } from '../services/service-provider.service';

export const availableJobsQueryKeys = {
  all: ['available-jobs'] as const,
  lists: () => [...availableJobsQueryKeys.all, 'list'] as const,
  list: (filters?: { radius?: string; category?: string; priority?: string; search?: string }) =>
    [...availableJobsQueryKeys.lists(), filters] as const,
  details: () => [...availableJobsQueryKeys.all, 'detail'] as const,
  detail: (requestId: string) => [...availableJobsQueryKeys.details(), requestId] as const,
};

/**
 * Hook to get available jobs for the current service provider
 */
export const useGetAvailableJobs = (
  filters?: { radius?: string; category?: string; priority?: string; search?: string },
  enabled: boolean = true,
) => {
  return useQuery<AvailableJob[]>({
    queryKey: availableJobsQueryKeys.list(filters),
    queryFn: () => serviceProviderService.getAvailableJobs(filters),
    enabled,
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get a single available job by ID
 */
export const useGetAvailableJobById = (requestId: string | undefined, enabled: boolean = true) => {
  return useQuery<(AvailableJob & { hasApplied?: boolean }) | null>({
    queryKey: availableJobsQueryKeys.detail(requestId ?? ''),
    queryFn: async () => {
      if (!requestId) return null;
      return serviceProviderService.getAvailableJobById(requestId);
    },
    enabled: enabled && !!requestId,
    retry: 1,
  });
};

/**
 * Hook to apply to a job (submit interest/quote)
 */
export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      requestId,
      data,
    }: {
      requestId: string;
      data?: { quotedAmount?: number; message?: string };
    }) => serviceProviderService.applyToJob(requestId, data),
    onSuccess: (_data, variables) => {
      // Invalidate the list and detail queries
      queryClient.invalidateQueries({ queryKey: availableJobsQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: availableJobsQueryKeys.detail(variables.requestId) });
    },
  });
};
