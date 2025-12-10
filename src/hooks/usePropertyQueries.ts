import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService, type BackendProperty, type Property } from '../services/property.service';

// Query keys for React Query
export const propertyQueryKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...propertyQueryKeys.lists(), filters] as const,
  details: () => [...propertyQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyQueryKeys.details(), id] as const,
  units: () => [...propertyQueryKeys.all, 'units'] as const,
};

/**
 * Hook to get a single property by ID
 * @param includeFullUnitDetails - For MULTI properties, return full unit details instead of simplified data
 */
export const useGetProperty = (propertyId: string | null | undefined, enabled: boolean = true, includeFullUnitDetails: boolean = false) => {
  return useQuery({
    queryKey: propertyId ? [...propertyQueryKeys.detail(propertyId), includeFullUnitDetails] : ['properties', 'detail', 'null'] as const,
    queryFn: () => propertyService.getOne(propertyId!, includeFullUnitDetails),
    enabled: enabled && !!propertyId,
    staleTime: 0, // Always consider data stale to ensure fresh fetch
    gcTime: 0, // Don't keep in cache to prevent cross-user data leakage
    retry: 1,
  });
};

/**
 * Hook to get all properties
 * @param includeListings - Whether to include listings in the response (default: false for performance)
 */
export const useGetAllProperties = (enabled: boolean = true, includeListings: boolean = false) => {
  return useQuery({
    queryKey: [...propertyQueryKeys.lists(), includeListings ? 'withListings' : 'withoutListings'] as const,
    queryFn: () => propertyService.getAll(includeListings),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get all properties (transformed for frontend)
 */
export const useGetAllPropertiesTransformed = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [...propertyQueryKeys.lists(), 'transformed'] as const,
    queryFn: () => propertyService.getAllTransformed(),
    enabled,
    staleTime: 0, // Always consider data stale to ensure fresh fetch on mount
    gcTime: 0, // Don't keep in cache to prevent cross-user data leakage
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

/**
 * Hook to get all units from all properties
 */
export const useGetAllUnits = (enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyQueryKeys.units(),
    queryFn: () => propertyService.getAllUnits(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

