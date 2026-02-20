import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  maintenanceRequestService,
  type CreateMaintenanceRequestInput,
  type MaintenanceRequestResponse,
  type MaintenanceRequestDetail,
  type MaintenanceRequestTransaction,
  type MaintenanceRequestApplicant,
} from '../services/maintenance-request.service';

export const maintenanceRequestQueryKeys = {
  all: ['maintenance-requests'] as const,
  list: () => [...maintenanceRequestQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...maintenanceRequestQueryKeys.all, 'detail', id] as const,
  transactions: (id: string) => [...maintenanceRequestQueryKeys.all, 'transactions', id] as const,
  applicants: (id: string) => [...maintenanceRequestQueryKeys.all, 'applicants', id] as const,
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

export const useGetMaintenanceTransactions = (id: string | undefined, enabled: boolean = true) => {
  return useQuery<MaintenanceRequestTransaction[]>({
    queryKey: maintenanceRequestQueryKeys.transactions(id ?? ''),
    queryFn: async () => {
      if (!id) return [];
      return maintenanceRequestService.listTransactions(id);
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

export const useUpdateMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      id: string;
      input: Partial<CreateMaintenanceRequestInput>;
    }): Promise<MaintenanceRequestDetail> =>
      maintenanceRequestService.update(params.id, params.input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: maintenanceRequestQueryKeys.list() });
      if (data.id) {
        queryClient.setQueryData(
          maintenanceRequestQueryKeys.detail(data.id),
          data,
        );
      }
    },
  });
};

export const useDeleteMaintenanceRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<void> =>
      maintenanceRequestService.delete(id),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: maintenanceRequestQueryKeys.list() });
      queryClient.removeQueries({
        queryKey: maintenanceRequestQueryKeys.detail(id),
      });
    },
  });
};

export const useGetMaintenanceRequestApplicants = (id: string | undefined, enabled: boolean = true) => {
  return useQuery<MaintenanceRequestApplicant[]>({
    queryKey: maintenanceRequestQueryKeys.applicants(id ?? ''),
    queryFn: async () => {
      if (!id) return [];
      return maintenanceRequestService.getApplicants(id);
    },
    enabled: enabled && !!id,
    retry: 1,
  });
};

