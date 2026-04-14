import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceProviderService } from '../services/service-provider.service';

export const serviceProviderAssignmentsQueryKeys = {
  all: ['service-provider-assignments'] as const,
  list: (status?: string) => [...serviceProviderAssignmentsQueryKeys.all, 'list', status] as const,
};

export function useServiceProviderAssignments(status?: string) {
  return useQuery({
    queryKey: serviceProviderAssignmentsQueryKeys.list(status),
    queryFn: () => serviceProviderService.getMyAssignments(status),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to get service provider dashboard stats
 */
export function useServiceProviderDashboardStats(enabled: boolean = true) {
  return useQuery({
    queryKey: ['service-provider-dashboard-stats'] as const,
    queryFn: () => serviceProviderService.getMyDashboardStats(),
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/**
 * Hook to get service provider accounting data (transactions + summary).
 */
export function useServiceProviderAccounting(enabled: boolean = true) {
  return useQuery({
    queryKey: ['service-provider-accounting'] as const,
    queryFn: () => serviceProviderService.getMyAccounting(),
    enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useUpdateAssignmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      serviceProviderId,
      assignmentId,
      status,
    }: {
      serviceProviderId: string;
      assignmentId: string;
      status: string;
    }) =>
      serviceProviderService.updateAssignmentStatus(serviceProviderId, assignmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceProviderAssignmentsQueryKeys.all });
    },
  });
}
