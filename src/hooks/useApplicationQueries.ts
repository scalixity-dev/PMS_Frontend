import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/application.service';
import { API_ENDPOINTS } from '../config/api.config';

// Query keys for React Query
export const applicationQueryKeys = {
  all: ['applications'] as const,
  lists: () => [...applicationQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...applicationQueryKeys.lists(), filters] as const,
  details: () => [...applicationQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...applicationQueryKeys.details(), id] as const,
  byLeasing: (leasingId: string) => [...applicationQueryKeys.all, 'leasing', leasingId] as const,
  attachments: (id: string) => [...applicationQueryKeys.detail(id), 'attachments'] as const,
};

/**
 * Hook to get all applications for the authenticated user with optional filters
 */
export const useGetAllApplications = (
  filters?: {
    search?: string;
    status?: string;
    page?: number;
    limit?: number;
  },
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: applicationQueryKeys.list(filters),
    queryFn: () => applicationService.getAll(filters),
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
    onSuccess: async (data, variables) => {
      // Write the freshly returned application into the detail cache immediately.
      if (data) {
        queryClient.setQueryData(applicationQueryKeys.detail(variables.id), data);
      }

      // Optimistically patch the new status into every cached list snapshot
      // (active or inactive) so the card flips instantly when the user navigates
      // back to the list — no waiting for a background refetch.
      if (variables.updateData.status) {
        queryClient.setQueriesData(
          { queryKey: applicationQueryKeys.lists() },
          (oldData: any) => {
            if (!oldData) return oldData;
            const patchItem = (app: any) =>
              app.id === variables.id ? { ...app, status: variables.updateData.status } : app;
            if (oldData.data && Array.isArray(oldData.data)) {
              return { ...oldData, data: oldData.data.map(patchItem) };
            }
            if (Array.isArray(oldData)) {
              return oldData.map(patchItem);
            }
            return oldData;
          }
        );
      }

      // Invalidate to ensure server truth is eventually reflected.
      // refetchType:'all' covers inactive (unmounted) list queries too,
      // so the cache is fresh by the time the user navigates back.
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.detail(variables.id),
          refetchType: 'active',
        }),
        queryClient.invalidateQueries({
          queryKey: applicationQueryKeys.lists(),
          refetchType: 'all',
        }),
        queryClient.invalidateQueries({
          queryKey: [...applicationQueryKeys.all, 'leasing'],
          refetchType: 'all',
        }),
      ]);
    },
  });
};

/**
 * Hook to request an application fee from the applicant
 */
export const useRequestApplicationFee = () => {
  return useMutation({
    mutationFn: async ({ id, amount, currency }: { id: string; amount: string; currency: string }) => {
      const res = await fetch(API_ENDPOINTS.APPLICATION.REQUEST_FEE(id), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ amount, currency }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to send fee request');
      }
      return res.json();
    },
  });
};

/**
 * Hook to delete an application
 */
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => applicationService.delete(id),
    onSuccess: async (_data, id) => {
      await queryClient.cancelQueries({ queryKey: applicationQueryKeys.detail(id) });
      await queryClient.invalidateQueries({
        queryKey: applicationQueryKeys.lists(),
        refetchType: 'all',
      });
    },
  });
};

/**
 * Hook to get attachments for an application
 */
export const useGetApplicationAttachments = (applicationId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: applicationId ? applicationQueryKeys.attachments(applicationId) : ['applications', 'attachments', 'null'] as const,
    queryFn: () => applicationService.getAttachments(applicationId!),
    enabled: enabled && !!applicationId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to delete an application attachment
 */
export const useDeleteApplicationAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, attachmentId }: { applicationId: string; attachmentId: string }) =>
      applicationService.deleteAttachment(applicationId, attachmentId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: applicationQueryKeys.attachments(variables.applicationId) });
    },
  });
};
