import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService, type BackendLead, type CreateLeadDto, type UpdateLeadDto } from '../services/lead.service';

// Query keys for React Query
export const leadQueryKeys = {
  all: ['leads'] as const,
  lists: () => [...leadQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...leadQueryKeys.lists(), filters] as const,
  details: () => [...leadQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...leadQueryKeys.details(), id] as const,
};

/**
 * Hook to get all leads for the authenticated manager
 */
export const useGetAllLeads = (enabled: boolean = true) => {
  return useQuery({
    queryKey: leadQueryKeys.lists(),
    queryFn: () => leadService.getAll(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get a single lead by ID
 */
export const useGetLead = (leadId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: leadId ? leadQueryKeys.detail(leadId) : ['leads', 'detail', 'null'] as const,
    queryFn: () => leadService.getOne(leadId!),
    enabled: enabled && !!leadId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to create a new lead
 */
export const useCreateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (leadData: CreateLeadDto): Promise<BackendLead> => {
      return leadService.create(leadData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch leads list
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.lists() });
      // Cache the newly created lead
      queryClient.setQueryData(leadQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to update a lead
 */
export const useUpdateLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateLeadDto }): Promise<BackendLead> => {
      return leadService.update(id, data);
    },
    onSuccess: (data) => {
      // Invalidate and refetch leads list
      queryClient.invalidateQueries({ queryKey: leadQueryKeys.lists() });
      // Update the cached lead
      queryClient.setQueryData(leadQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to delete a lead
 */
export const useDeleteLead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string): Promise<void> => {
      console.log('Deleting lead with ID:', id);
      return leadService.delete(id);
    },
    onSuccess: (_, deletedId) => {
      console.log('Lead deleted successfully, invalidating cache for ID:', deletedId);
      // Invalidate and refetch leads list - use refetchType to ensure immediate refetch
      queryClient.invalidateQueries({ 
        queryKey: leadQueryKeys.lists(),
        refetchType: 'active'
      });
      // Remove the deleted lead from cache
      queryClient.removeQueries({ queryKey: leadQueryKeys.detail(deletedId) });
    },
    onError: (error, deletedId) => {
      console.error('Error deleting lead:', deletedId, error);
    },
  });
};

