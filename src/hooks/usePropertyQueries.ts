import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService, type BackendProperty } from '../services/property.service';

// Query keys for React Query
export const propertyQueryKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...propertyQueryKeys.lists(), filters] as const,
  details: () => [...propertyQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyQueryKeys.details(), id] as const,
};

/**
 * Hook to get a single property by ID
 */
export const useGetProperty = (propertyId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyId ? propertyQueryKeys.detail(propertyId) : ['properties', 'detail', 'null'] as const,
    queryFn: () => propertyService.getOne(propertyId!),
    enabled: enabled && !!propertyId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get all properties
 */
export const useGetAllProperties = (enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyQueryKeys.lists(),
    queryFn: () => propertyService.getAll(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to create a new property
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyData: Parameters<typeof propertyService.create>[0]): Promise<BackendProperty> => {
      return propertyService.create(propertyData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: propertyQueryKeys.lists() });
      // Cache the newly created property
      queryClient.setQueryData(propertyQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to update an existing property
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      propertyId, 
      updateData 
    }: { 
      propertyId: string; 
      updateData: Parameters<typeof propertyService.update>[1] 
    }): Promise<BackendProperty> => {
      return propertyService.update(propertyId, updateData);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: propertyQueryKeys.lists() });
      // Update the cached property
      queryClient.setQueryData(propertyQueryKeys.detail(variables.propertyId), data);
    },
  });
};

