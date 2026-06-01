import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService, type BackendProperty } from '../services/property.service';

// Query keys for React Query
export const propertyQueryKeys = {
  all: ['properties'] as const,
  lists: () => [...propertyQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...propertyQueryKeys.lists(), filters] as const,
  details: () => [...propertyQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...propertyQueryKeys.details(), id] as const,
  units: () => [...propertyQueryKeys.all, 'units'] as const,
};

// Cache preset for multi-step flows (e.g. List a Unit) that read the same
// property from several components/steps. Opting in dedupes those reads into a
// single network call and stops constant refetching from wiping pre-filled
// fields. Safe because the flow purges property queries on entry.
export const LISTING_FLOW_PROPERTY_CACHE = { staleTime: 5 * 60 * 1000, gcTime: 5 * 60 * 1000 };

/**
 * Hook to get a single property by ID
 * @param includeFullUnitDetails - For MULTI properties, return full unit details instead of simplified data
 * @param options - Optional staleTime/gcTime overrides (default: no caching). Pass LISTING_FLOW_PROPERTY_CACHE to fetch once and share.
 */
export const useGetProperty = (
  propertyId: string | null | undefined,
  enabled: boolean = true,
  includeFullUnitDetails: boolean = false,
  options?: { staleTime?: number; gcTime?: number },
) => {
  return useQuery({
    queryKey: propertyId ? [...propertyQueryKeys.detail(propertyId), includeFullUnitDetails] : ['properties', 'detail', 'null'] as const,
    queryFn: () => propertyService.getOne(propertyId!, includeFullUnitDetails),
    enabled: enabled && !!propertyId,
    // Cache by default (2 min) so the same property isn't refetched on every
    // mount/sibling. Writes invalidate the detail query, and login/logout clears
    // the cache, so there's no stale/cross-user risk. Override via `options`.
    staleTime: options?.staleTime ?? 2 * 60 * 1000,
    gcTime: options?.gcTime ?? 5 * 60 * 1000,
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
 * Public property detail (tenant-facing).
 * Auto-refetches when propertyId changes.
 */
export const useGetPublicPropertyDetail = (propertyId: string | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['public-property', propertyId] as const,
    queryFn: () => propertyService.getPublicPropertyDetail(propertyId!),
    enabled: enabled && !!propertyId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Public listings query (tenant property browsing).
 * Filters-aware — query refetches when filters change.
 */
export const useGetPublicListings = (
  filters?: {
    search?: string;
    country?: string;
    state?: string;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    propertyType?: string;
    petsAllowed?: boolean;
    page?: number;
    limit?: number;
  },
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['public-listings', filters] as const,
    queryFn: () => propertyService.getPublicListings(filters),
    enabled,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 1,
  });
};

/**
 * Lightweight - returns only { id, propertyName } for dropdowns.
 * Saves bandwidth vs full properties endpoint. Uses Redis cache on backend.
 */
export const useGetAllPropertiesIdName = (enabled: boolean = true) => {
  return useQuery({
    queryKey: [...propertyQueryKeys.lists(), 'idname'] as const,
    queryFn: () => propertyService.getAllIdName(),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
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
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes (invalidated on writes)
    gcTime: 5 * 60 * 1000,
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
      // Listings and units embed the property (and its amenities/photos/contact) — invalidate
      // every dependent cache so nested reads refresh immediately. `refetchType: 'active'`
      // forces active queries to re-fetch instead of just marking them stale.
      queryClient.invalidateQueries({ queryKey: ['listings'], refetchType: 'active' });
      queryClient.invalidateQueries({ queryKey: ['units'], refetchType: 'active' });
      queryClient.invalidateQueries({
        queryKey: propertyQueryKeys.detail(variables.propertyId),
        refetchType: 'active',
      });
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

