import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  maintenanceRequestService,
  type CreateMaintenanceRequestInput,
  type MaintenanceRequestResponse,
  type MaintenanceRequestDetail,
} from '../services/maintenance-request.service';

export const maintenanceRequestQueryKeys = {
  all: ['maintenance-requests'] as const,
  list: () => [...maintenanceRequestQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...maintenanceRequestQueryKeys.all, 'detail', id] as const,
};

export const useGetAllMaintenanceRequests = (enabled: boolean = true) => {
  return useQuery({
    queryKey: maintenanceRequestQueryKeys.list(),
    queryFn: () => maintenanceRequestService.getAll(),
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useGetMaintenanceRequest = (id: string | undefined, enabled: boolean = true) => {
  return useQuery<MaintenanceRequestDetail | null>({
    queryKey: maintenanceRequestQueryKeys.detail(id ?? ''),
    queryFn: async () => {
      if (!id) return null;
      const data = await maintenanceRequestService.getOne(id);
      return data as MaintenanceRequestDetail;
    },
    enabled: enabled && !!id,
    retry: 1,
  });
};

export const useCreateMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMaintenanceRequestInput): Promise<MaintenanceRequestResponse> =>
      maintenanceRequestService.create(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: maintenanceRequestQueryKeys.list() });
      if (data.id) {
        queryClient.setQueryData(maintenanceRequestQueryKeys.detail(data.id), data);
      }
    },
  });
};

