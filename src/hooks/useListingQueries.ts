import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listingService, type BackendListing, type CreateListingDto, type ListingDashboardQuery, type ListingDashboardResponse, type ListingStatistics } from '../services/listing.service';

// Query keys for React Query
export const listingQueryKeys = {
  all: ['listings'] as const,
  lists: () => [...listingQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...listingQueryKeys.lists(), filters] as const,
  dashboardView: (query?: ListingDashboardQuery) => [...listingQueryKeys.all, 'dashboard-view', query] as const,
  details: () => [...listingQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...listingQueryKeys.details(), id] as const,
  byProperty: (propertyId: string) => [...listingQueryKeys.all, 'property', propertyId] as const,
  statistics: (id: string) => [...listingQueryKeys.detail(id), 'statistics'] as const,
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
 * Hook to get the listing dashboard view (paginated cards for the Listings page)
 */
export const useGetListingDashboard = (query: ListingDashboardQuery = {}, enabled: boolean = true) => {
  return useQuery<ListingDashboardResponse>({
    queryKey: listingQueryKeys.dashboardView(query),
    queryFn: () => listingService.getDashboardView(query),
    enabled,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
    placeholderData: (prev) => prev,
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
      // Invalidate dashboard view
      queryClient.invalidateQueries({ queryKey: [...listingQueryKeys.all, 'dashboard-view'] });
      // Invalidate property-specific listings
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.byProperty(data.propertyId) });
      // Cache the newly created listing
      queryClient.setQueryData(listingQueryKeys.detail(data.id), data);
      // Also invalidate properties to reflect status changes
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

/**
 * Hook to update an existing listing
 */
export const useUpdateListing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateListingDto> }): Promise<BackendListing> => {
      return listingService.update(id, data);
    },
    onSuccess: (data) => {
      // Invalidate and refetch listings list
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.lists() });
      // Invalidate dashboard view
      queryClient.invalidateQueries({ queryKey: [...listingQueryKeys.all, 'dashboard-view'] });
      // Invalidate property-specific listings
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.byProperty(data.propertyId) });
      // Cache the updated listing
      queryClient.setQueryData(listingQueryKeys.detail(data.id), data);
      // Invalidate specific detail query
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.detail(data.id) });
      // Also invalidate properties to reflect status changes
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
  });
};

/**
 * Hook to get listing statistics
 */
export const useGetListingStatistics = (listingId: string | null | undefined, enabled: boolean = true) => {
  return useQuery<ListingStatistics>({
    queryKey: listingId ? listingQueryKeys.statistics(listingId) : ['listings', 'statistics', 'null'] as const,
    queryFn: () => listingService.getStatistics(listingId!),
    enabled: enabled && !!listingId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Hook to toggle favorite on a listing
 */
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (listingId: string) => listingService.toggleFavorite(listingId),
    onSuccess: (_, listingId) => {
      queryClient.invalidateQueries({ queryKey: ['listings', 'favorite', listingId] });
      queryClient.invalidateQueries({ queryKey: ['listings', 'favorites', 'mine'] });
      queryClient.invalidateQueries({ queryKey: listingQueryKeys.statistics(listingId) });
    },
  });
};

/**
 * Hook to check if listing is favorited by current user
 */
export const useIsFavorited = (listingId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['listings', 'favorite', listingId] as const,
    queryFn: () => listingService.isFavorited(listingId!),
    enabled: enabled && !!listingId,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Hook to get all favorites of current user
 */
export const useGetMyFavorites = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['listings', 'favorites', 'mine'] as const,
    queryFn: () => listingService.getMyFavorites(),
    enabled,
    staleTime: 2 * 60 * 1000,
  });
};
