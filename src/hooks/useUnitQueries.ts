import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { unitService, type BackendUnit } from '../services/unit.service';

// Query keys for React Query
export const unitQueryKeys = {
  all: ['units'] as const,
  lists: () => [...unitQueryKeys.all, 'list'] as const,
  list: (propertyId: string) => [...unitQueryKeys.lists(), propertyId] as const,
  details: () => [...unitQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...unitQueryKeys.details(), id] as const,
};

/**
 * Hook to get all units for a property
 */
export const useGetUnitsByProperty = (propertyId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyId ? unitQueryKeys.list(propertyId) : ['units', 'list', 'null'] as const,
    queryFn: () => unitService.getAllByProperty(propertyId!),
    enabled: enabled && !!propertyId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get a single unit by ID
 */
export const useGetUnit = (unitId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: unitId ? unitQueryKeys.detail(unitId) : ['units', 'detail', 'null'] as const,
    queryFn: () => unitService.getOne(unitId!),
    enabled: enabled && !!unitId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to create a new unit
 */
export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      propertyId, 
      unitData 
    }: { 
      propertyId: string; 
      unitData: Parameters<typeof unitService.create>[1] 
    }): Promise<BackendUnit> => {
      return unitService.create(propertyId, unitData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch units list for the property
      queryClient.invalidateQueries({ queryKey: unitQueryKeys.list(data.propertyId) });
      // Cache the newly created unit
      queryClient.setQueryData(unitQueryKeys.detail(data.id), data);
      // Also invalidate properties list to refresh unit counts
      queryClient.invalidateQueries({ queryKey: ['properties', 'list'] });
    },
  });
};

/**
 * Hook to update an existing unit
 */
export const useUpdateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      unitId, 
      updateData 
    }: { 
      unitId: string; 
      updateData: Parameters<typeof unitService.update>[1] 
    }): Promise<BackendUnit> => {
      return unitService.update(unitId, updateData);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch units list for the property
      queryClient.invalidateQueries({ queryKey: unitQueryKeys.list(data.propertyId) });
      // Update the cached unit
      queryClient.setQueryData(unitQueryKeys.detail(variables.unitId), data);
    },
  });
};

/**
 * Hook to delete a unit
 */
export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (unitId: string): Promise<{ message: string; unit: { id: string; unitName: string; propertyName: string } }> => {
      return unitService.delete(unitId);
    },
    onSuccess: (_data, unitId) => {
      // Remove the unit from cache
      queryClient.removeQueries({ queryKey: unitQueryKeys.detail(unitId) });
      // Invalidate units lists (will need propertyId, but we can invalidate all)
      queryClient.invalidateQueries({ queryKey: unitQueryKeys.lists() });
      // Also invalidate properties list to refresh unit counts
      queryClient.invalidateQueries({ queryKey: ['properties', 'list'] });
    },
  });
};
