import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { equipmentService, type BackendEquipment, type CreateEquipmentDto, type UpdateEquipmentDto } from '../services/equipment.service';

// Query keys for React Query
export const equipmentQueryKeys = {
  all: ['equipment'] as const,
  lists: () => [...equipmentQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...equipmentQueryKeys.lists(), filters] as const,
  details: () => [...equipmentQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...equipmentQueryKeys.details(), id] as const,
  byProperty: (propertyId: string) => [...equipmentQueryKeys.all, 'property', propertyId] as const,
  byUnit: (unitId: string) => [...equipmentQueryKeys.all, 'unit', unitId] as const,
};

/**
 * Hook to get all equipment for the authenticated user
 */
export const useGetAllEquipment = (enabled: boolean = true) => {
  return useQuery({
    queryKey: equipmentQueryKeys.lists(),
    queryFn: () => equipmentService.getAll(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get all equipment for a specific property
 */
export const useGetEquipmentByProperty = (propertyId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyId ? equipmentQueryKeys.byProperty(propertyId) : ['equipment', 'property', 'null'],
    queryFn: () => equipmentService.getByProperty(propertyId!),
    enabled: enabled && !!propertyId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to get a single equipment by ID
 */
export const useGetEquipment = (id: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: id ? equipmentQueryKeys.detail(id) : ['equipment', 'detail', 'null'],
    queryFn: () => equipmentService.getOne(id!),
    enabled: enabled && !!id,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to create a new equipment
 */
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (equipmentData: CreateEquipmentDto): Promise<BackendEquipment> => {
      return equipmentService.create(equipmentData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch equipment list
      queryClient.invalidateQueries({ queryKey: equipmentQueryKeys.lists() });
      // Invalidate property-specific equipment if propertyId exists
      if (data.propertyId) {
        queryClient.invalidateQueries({ queryKey: equipmentQueryKeys.byProperty(data.propertyId) });
      }
      // Cache the newly created equipment
      queryClient.setQueryData(equipmentQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to update an existing equipment
 */
export const useUpdateEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ 
      equipmentId, 
      updateData 
    }: { 
      equipmentId: string; 
      updateData: UpdateEquipmentDto 
    }): Promise<BackendEquipment> => {
      return equipmentService.update(equipmentId, updateData);
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch equipment list
      queryClient.invalidateQueries({ queryKey: equipmentQueryKeys.lists() });
      // Update the cached equipment
      queryClient.setQueryData(equipmentQueryKeys.detail(variables.equipmentId), data);
      // Invalidate property-specific equipment if propertyId exists
      if (data.propertyId) {
        queryClient.invalidateQueries({ queryKey: equipmentQueryKeys.byProperty(data.propertyId) });
      }
    },
  });
};

/**
 * Hook to delete an equipment
 */
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<{ message: string; equipment: BackendEquipment }> => {
      return equipmentService.delete(id);
    },
    onSuccess: (data, equipmentId) => {
      // Invalidate and refetch equipment list
      queryClient.invalidateQueries({ queryKey: equipmentQueryKeys.lists() });
      // Remove the deleted equipment from cache
      queryClient.removeQueries({ queryKey: equipmentQueryKeys.detail(equipmentId) });
      // Invalidate property-specific equipment if propertyId exists
      if (data.equipment.propertyId) {
        queryClient.invalidateQueries({ queryKey: equipmentQueryKeys.byProperty(data.equipment.propertyId) });
      }
    },
  });
};

