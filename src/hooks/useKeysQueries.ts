import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keysService, type BackendKey, type CreateKeyDto, type UpdateKeyDto } from '../services/keys.service';

// Query keys for React Query
export const keysQueryKeys = {
  all: ['keys'] as const,
  lists: () => [...keysQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...keysQueryKeys.lists(), filters] as const,
  details: () => [...keysQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...keysQueryKeys.details(), id] as const,
  byProperty: (propertyId: string) => [...keysQueryKeys.all, 'property', propertyId] as const,
  byUnit: (unitId: string) => [...keysQueryKeys.all, 'unit', unitId] as const,
};

/**
 * Hook to get all keys for the authenticated user
 */
export const useGetAllKeys = (enabled: boolean = true) => {
  return useQuery({
    queryKey: keysQueryKeys.lists(),
    queryFn: () => keysService.getAll(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get all keys for a specific property
 */
export const useGetKeysByProperty = (propertyId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyId ? keysQueryKeys.byProperty(propertyId) : ['keys', 'property', 'null'],
    queryFn: () => keysService.getByProperty(propertyId!),
    enabled: enabled && !!propertyId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get a single key by ID
 */
export const useGetKey = (id: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: id ? keysQueryKeys.detail(id) : ['keys', 'detail', 'null'],
    queryFn: () => keysService.getOne(id!),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a new key
 */
export const useCreateKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (keyData: CreateKeyDto): Promise<BackendKey> => {
      return keysService.create(keyData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch keys list
      queryClient.invalidateQueries({ queryKey: keysQueryKeys.lists() });
      // Invalidate property-specific keys if propertyId exists
      if (data.propertyId) {
        queryClient.invalidateQueries({ queryKey: keysQueryKeys.byProperty(data.propertyId) });
      }
      // Cache the newly created key
      queryClient.setQueryData(keysQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to update an existing key
 */
export const useUpdateKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      keyId, 
      updateData 
    }: { 
      keyId: string; 
      updateData: UpdateKeyDto 
    }): Promise<BackendKey> => {
      return keysService.update(keyId, updateData);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch keys list
      queryClient.invalidateQueries({ queryKey: keysQueryKeys.lists() });
      // Update the cached key
      queryClient.setQueryData(keysQueryKeys.detail(variables.keyId), data);
      // Invalidate property-specific keys if propertyId exists
      if (data.propertyId) {
        queryClient.invalidateQueries({ queryKey: keysQueryKeys.byProperty(data.propertyId) });
      }
    },
  });
};

/**
 * Hook to delete a key
 */
export const useDeleteKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<{ message: string; key: BackendKey }> => {
      return keysService.delete(id);
    },
    onSuccess: (data, keyId) => {
      // Invalidate and refetch keys list
      queryClient.invalidateQueries({ queryKey: keysQueryKeys.lists() });
      // Remove the deleted key from cache
      queryClient.removeQueries({ queryKey: keysQueryKeys.detail(keyId) });
      // Invalidate property-specific keys if propertyId exists
      if (data.key.propertyId) {
        queryClient.invalidateQueries({ queryKey: keysQueryKeys.byProperty(data.key.propertyId) });
      }
    },
  });
};

