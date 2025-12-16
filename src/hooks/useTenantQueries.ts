import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  tenantService,
  type BackendTenantProfile,
  type CreateTenantProfileDto,
  type UpdateTenantProfileDto,
} from '../services/tenant.service';

// Query keys for React Query
export const tenantQueryKeys = {
  all: ['tenants'] as const,
  lists: () => [...tenantQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...tenantQueryKeys.lists(), filters] as const,
  details: () => [...tenantQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...tenantQueryKeys.details(), id] as const,
  byUser: (userId: string) => [...tenantQueryKeys.all, 'user', userId] as const,
};

/**
 * Hook to get all tenant profiles
 */
export const useGetAllTenants = (enabled: boolean = true) => {
  return useQuery({
    queryKey: tenantQueryKeys.lists(),
    queryFn: () => tenantService.getAll(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get a single tenant profile by ID
 */
export const useGetTenant = (tenantId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: tenantId ? tenantQueryKeys.detail(tenantId) : ['tenants', 'detail', 'null'] as const,
    queryFn: () => tenantService.getOne(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get tenant profile by user ID
 */
export const useGetTenantByUserId = (userId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: userId ? tenantQueryKeys.byUser(userId) : ['tenants', 'user', 'null'] as const,
    queryFn: () => tenantService.getByUserId(userId!),
    enabled: enabled && !!userId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to create a new tenant profile
 */
export const useCreateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantData: CreateTenantProfileDto): Promise<BackendTenantProfile> => {
      return tenantService.create(tenantData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch tenants list
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
      // Cache the newly created tenant
      queryClient.setQueryData(tenantQueryKeys.detail(data.id), data);
      // Also invalidate by user ID
      if (data.userId) {
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.byUser(data.userId) });
      }
    },
  });
};

/**
 * Hook to update an existing tenant profile
 */
export const useUpdateTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      updateData,
    }: {
      tenantId: string;
      updateData: UpdateTenantProfileDto;
    }): Promise<BackendTenantProfile> => {
      return tenantService.update(tenantId, updateData);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch tenants list
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
      // Update the cached tenant
      queryClient.setQueryData(tenantQueryKeys.detail(variables.tenantId), data);
      // Also invalidate by user ID
      if (data.userId) {
        queryClient.invalidateQueries({ queryKey: tenantQueryKeys.byUser(data.userId) });
      }
    },
  });
};

/**
 * Hook to delete a tenant profile
 */
export const useDeleteTenant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tenantId: string): Promise<void> => {
      return tenantService.delete(tenantId);
    },
    onSuccess: (_, tenantId) => {
      // Invalidate and refetch tenants list
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.lists() });
      // Remove from cache
      queryClient.removeQueries({ queryKey: tenantQueryKeys.detail(tenantId) });
    },
  });
};

/**
 * Hook to upload profile photo
 */
export const useUploadTenantProfilePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ tenantId, file }: { tenantId: string; file: File }): Promise<{ profilePhotoUrl: string }> => {
      return tenantService.uploadProfilePhoto(tenantId, file);
    },
    onSuccess: (_, variables) => {
      // Invalidate tenant to refetch with new photo
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.detail(variables.tenantId) });
    },
  });
};

/**
 * Hook to upload document
 */
export const useUploadTenantDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tenantId,
      file,
      documentType,
      description,
    }: {
      tenantId: string;
      file: File;
      documentType: string;
      description?: string;
    }): Promise<any> => {
      return tenantService.uploadDocument(tenantId, file, documentType, description);
    },
    onSuccess: (_, variables) => {
      // Invalidate tenant to refetch with new document
      queryClient.invalidateQueries({ queryKey: tenantQueryKeys.detail(variables.tenantId) });
    },
  });
};

/**
 * Hook to get tenant documents
 */
export const useGetTenantDocuments = (tenantId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: tenantId ? [...tenantQueryKeys.detail(tenantId), 'documents'] : ['tenants', 'documents', 'null'] as const,
    queryFn: () => tenantService.getDocuments(tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to delete tenant document
 */
export const useDeleteTenantDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (documentId: string): Promise<void> => {
      return tenantService.deleteDocument(documentId);
    },
    onSuccess: () => {
      // Invalidate all tenant documents queries
      queryClient.invalidateQueries({ queryKey: ['tenants', 'documents'] });
    },
  });
};

