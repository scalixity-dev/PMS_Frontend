import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../config/api.config';
export interface RecurringMaintenance {
  id: string;
  managerId: string;
  propertyId: string;
  unitId?: string | null;
  title: string;
  description?: string | null;
  category?: string | null;
  priority: string;
  frequency: string;
  startDate: string;
  endDate?: string | null;
  nextOccurrence?: string | null;
  assignedTo?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  property?: { id: string; propertyName: string };
  unit?: { id: string; unitName: string } | null;
  assignee?: { id: string; fullName: string; email: string } | null;
}

export interface CreateRecurringMaintenanceInput {
  propertyId: string;
  unitId?: string;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  nextOccurrence?: string;
  assignedTo?: string;
  isActive?: boolean;
}

async function apiFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.message ?? `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export const recurringMaintenanceQueryKeys = {
  all: ['recurring-maintenance'] as const,
  list: () => [...recurringMaintenanceQueryKeys.all, 'list'] as const,
  detail: (id: string) => [...recurringMaintenanceQueryKeys.all, 'detail', id] as const,
};

export const useGetAllMaintenanceRecurring = (enabled = true) => {
  return useQuery<RecurringMaintenance[]>({
    queryKey: recurringMaintenanceQueryKeys.list(),
    queryFn: () => apiFetch<RecurringMaintenance[]>(API_ENDPOINTS.MAINTENANCE_RECURRING.GET_ALL),
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useGetMaintenanceRecurring = (id: string | undefined, enabled = true) => {
  return useQuery<RecurringMaintenance | null>({
    queryKey: recurringMaintenanceQueryKeys.detail(id ?? ''),
    queryFn: async () => {
      if (!id) return null;
      return apiFetch<RecurringMaintenance>(API_ENDPOINTS.MAINTENANCE_RECURRING.GET_ONE(id));
    },
    enabled: enabled && !!id,
    retry: 1,
  });
};

export const useCreateMaintenanceRecurring = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRecurringMaintenanceInput) =>
      apiFetch<RecurringMaintenance>(API_ENDPOINTS.MAINTENANCE_RECURRING.CREATE, {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recurringMaintenanceQueryKeys.list() });
    },
  });
};

export const useUpdateMaintenanceRecurring = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<CreateRecurringMaintenanceInput> }) =>
      apiFetch<RecurringMaintenance>(API_ENDPOINTS.MAINTENANCE_RECURRING.UPDATE(id), {
        method: 'PATCH',
        body: JSON.stringify(input),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: recurringMaintenanceQueryKeys.list() });
      queryClient.setQueryData(recurringMaintenanceQueryKeys.detail(data.id), data);
    },
  });
};

export const useDeleteMaintenanceRecurring = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiFetch<void>(API_ENDPOINTS.MAINTENANCE_RECURRING.DELETE(id), { method: 'DELETE' }),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: recurringMaintenanceQueryKeys.list() });
      queryClient.removeQueries({ queryKey: recurringMaintenanceQueryKeys.detail(id) });
    },
  });
};
