import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingService, type BackendListing, type CreateListingDto } from '../services/listing.service';

// Query keys for React Query
export const listingQueryKeys = {
  all: ['listings'] as const,
  lists: () => [...listingQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...listingQueryKeys.lists(), filters] as const,
  details: () => [...listingQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...listingQueryKeys.details(), id] as const,
  byProperty: (propertyId: string) => [...listingQueryKeys.all, 'property', propertyId] as const,
};

/**
 * Hook to get all listings
 */
export const useGetAllListings = (enabled: boolean = true) => {
  return useQuery({
    queryKey: listingQueryKeys.lists(),
    queryFn: () => listingService.getAll(),
    enabled,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get a single listing by ID
 */
export const useGetListing = (listingId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: listingId ? listingQueryKeys.detail(listingId) : ['listings', 'detail', 'null'] as const,
    queryFn: () => listingService.getOne(listingId!),
    enabled: enabled && !!listingId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get listings by property ID
 */
export const useGetListingsByProperty = (propertyId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyId ? listingQueryKeys.byProperty(propertyId) : ['listings', 'property', 'null'] as const,
    queryFn: () => listingService.getByPropertyId(propertyId!),
    enabled: enabled && !!propertyId,
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to create a new listing
 */
export const useCreateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listingData: CreateListingDto): Promise<BackendListing> => {
      return listingService.create(listingData);
    },
    onSuccess: (data) => {
      // Invalidate and refetch listings list
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.lists() });
      // Invalidate property-specific listings
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.byProperty(data.propertyId) });
      // Cache the newly created listing
      queryClient.setQueryData(listingQueryKeys.detail(data.id), data);
      // Also invalidate properties to reflect status changes
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};


