import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

export const dashboardQueryKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardQueryKeys.all, 'stats'] as const,
};

/**
 * Hook to get dashboard statistics
 * Aggregates property, unit, tenant, maintenance, application, and financial data
 */
export const useGetDashboardStats = (enabled: boolean = true) => {
  return useQuery({
    queryKey: dashboardQueryKeys.stats(),
    queryFn: () => dashboardService.getStats(),
    enabled: enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
};
