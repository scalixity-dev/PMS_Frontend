import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leaseService, type BackendLease, type CreateLeaseDto, type UpdateLeaseDto } from '../services/lease.service';

// Query keys for React Query
export const leaseQueryKeys = {
  all: ['leases'] as const,
  lists: () => [...leaseQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...leaseQueryKeys.lists(), filters] as const,
  details: () => [...leaseQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...leaseQueryKeys.details(), id] as const,
  byProperty: (propertyId: string) => [...leaseQueryKeys.all, 'property', propertyId] as const,
  byTenant: (tenantId: string) => [...leaseQueryKeys.all, 'tenant', tenantId] as const,
};

/**
 * Hook to get all leases
 */
export const useGetAllLeases = (propertyId?: string, tenantId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyId 
      ? leaseQueryKeys.byProperty(propertyId)
      : tenantId
      ? leaseQueryKeys.byTenant(tenantId)
      : leaseQueryKeys.lists(),
    queryFn: () => leaseService.getAll(propertyId, tenantId),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get a single lease by ID
 */
export const useGetLease = (leaseId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leaseId ? leaseQueryKeys.detail(leaseId) : ['leases', 'detail', 'null'] as const,
    queryFn: () => leaseService.getOne(leaseId!),
    enabled: enabled && !!leaseId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get leases by property ID
 */
export const useGetLeasesByProperty = (propertyId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyId ? leaseQueryKeys.byProperty(propertyId) : ['leases', 'property', 'null'] as const,
    queryFn: () => leaseService.getAll(propertyId!, undefined),
    enabled: enabled && !!propertyId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get leases by tenant ID
 */
export const useGetLeasesByTenant = (tenantId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: tenantId ? leaseQueryKeys.byTenant(tenantId) : ['leases', 'tenant', 'null'] as const,
    queryFn: () => leaseService.getAll(undefined, tenantId!),
    enabled: enabled && !!tenantId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a new lease
 */
export const useCreateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leaseData: CreateLeaseDto): Promise<BackendLease> => {
      return leaseService.create(leaseData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch leases list
      queryClient.invalidateQueries({ queryKey: leaseQueryKeys.lists() });
      // Invalidate property-specific leases
      if (data.propertyId) {
        queryClient.invalidateQueries({ queryKey: leaseQueryKeys.byProperty(data.propertyId) });
      }
      // Invalidate tenant-specific leases
      if (data.tenantId) {
        queryClient.invalidateQueries({ queryKey: leaseQueryKeys.byTenant(data.tenantId) });
      }
      // Cache the newly created lease
      queryClient.setQueryData(leaseQueryKeys.detail(data.id), data);
      // Also invalidate properties to reflect status changes
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

/**
 * Hook to update an existing lease
 */
export const useUpdateLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeaseDto }): Promise<BackendLease> => {
      return leaseService.update(id, data);
    },
    onSuccess: (data) => {
      // Invalidate and refetch leases list
      queryClient.invalidateQueries({ queryKey: leaseQueryKeys.lists() });
      // Invalidate property-specific leases
      if (data.propertyId) {
        queryClient.invalidateQueries({ queryKey: leaseQueryKeys.byProperty(data.propertyId) });
      }
      // Invalidate tenant-specific leases
      if (data.tenantId) {
        queryClient.invalidateQueries({ queryKey: leaseQueryKeys.byTenant(data.tenantId) });
      }
      // Update the cached lease
      queryClient.setQueryData(leaseQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to delete a lease
 */
export const useDeleteLease = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      return leaseService.delete(id);
    },
    onSuccess: (_, id) => {
      // Invalidate and refetch leases list
      queryClient.invalidateQueries({ queryKey: leaseQueryKeys.lists() });
      // Remove the deleted lease from cache
      queryClient.removeQueries({ queryKey: leaseQueryKeys.detail(id) });
    },
  });
};
