import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyService } from '../services/property.service';

// Query keys for React Query
export const propertyDetailQueryKeys = {
  all: ['propertyDetails'] as const,
  specs: (propertyId: string) => [...propertyDetailQueryKeys.all, 'specs', propertyId] as const,
  financials: (propertyId: string) => [...propertyDetailQueryKeys.all, 'financials', propertyId] as const,
  serviceProviders: (propertyId: string) => [...propertyDetailQueryKeys.all, 'serviceProviders', propertyId] as const,
  responsibilities: (propertyId: string) => [...propertyDetailQueryKeys.all, 'responsibilities', propertyId] as const,
};

/**
 * Hook to get property specs
 */
export const useGetPropertySpecs = (propertyId: string, unitId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyDetailQueryKeys.specs(propertyId),
    queryFn: () => propertyService.getSpecs(propertyId, unitId),
    enabled: enabled && !!propertyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create a property spec
 */
export const useCreatePropertySpec = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, specData }: { propertyId: string; specData: any }) =>
      propertyService.createSpec(propertyId, specData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.specs(variables.propertyId) });
    },
  });
};

/**
 * Hook to update a property spec
 */
export const useUpdatePropertySpec = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, specId, specData }: { propertyId: string; specId: string; specData: any }) =>
      propertyService.updateSpec(propertyId, specId, specData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.specs(variables.propertyId) });
    },
  });
};

/**
 * Hook to delete a property spec
 */
export const useDeletePropertySpec = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, specId }: { propertyId: string; specId: string }) =>
      propertyService.deleteSpec(propertyId, specId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.specs(variables.propertyId) });
    },
  });
};

/**
 * Hook to get property financials
 */
export const useGetPropertyFinancials = (propertyId: string, unitId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyDetailQueryKeys.financials(propertyId),
    queryFn: () => propertyService.getFinancials(propertyId, unitId),
    enabled: enabled && !!propertyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create property insurance
 */
export const useCreatePropertyInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, insuranceData }: { propertyId: string; insuranceData: any }) =>
      propertyService.createInsurance(propertyId, insuranceData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.financials(variables.propertyId) });
    },
  });
};

/**
 * Hook to update property insurance
 */
export const useUpdatePropertyInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, insuranceId, insuranceData }: { propertyId: string; insuranceId: string; insuranceData: any }) =>
      propertyService.updateInsurance(propertyId, insuranceId, insuranceData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.financials(variables.propertyId) });
    },
  });
};

/**
 * Hook to delete property insurance
 */
export const useDeletePropertyInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, insuranceId }: { propertyId: string; insuranceId: string }) =>
      propertyService.deleteInsurance(propertyId, insuranceId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.financials(variables.propertyId) });
    },
  });
};

/**
 * Hook to create property loan
 */
export const useCreatePropertyLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, loanData }: { propertyId: string; loanData: any }) =>
      propertyService.createLoan(propertyId, loanData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.financials(variables.propertyId) });
    },
  });
};

/**
 * Hook to update property loan
 */
export const useUpdatePropertyLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, loanId, loanData }: { propertyId: string; loanId: string; loanData: any }) =>
      propertyService.updateLoan(propertyId, loanId, loanData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.financials(variables.propertyId) });
    },
  });
};

/**
 * Hook to delete property loan
 */
export const useDeletePropertyLoan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, loanId }: { propertyId: string; loanId: string }) =>
      propertyService.deleteLoan(propertyId, loanId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.financials(variables.propertyId) });
    },
  });
};

/**
 * Hook to get property service providers
 */
export const useGetPropertyServiceProviders = (propertyId: string, unitId?: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyDetailQueryKeys.serviceProviders(propertyId),
    queryFn: () => propertyService.getServiceProviders(propertyId, unitId),
    enabled: enabled && !!propertyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to create utility provider
 */
export const useCreateUtilityProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, providerData }: { propertyId: string; providerData: any }) =>
      propertyService.createUtilityProvider(propertyId, providerData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.serviceProviders(variables.propertyId) });
    },
  });
};

/**
 * Hook to update utility provider
 */
export const useUpdateUtilityProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, providerId, providerData }: { propertyId: string; providerId: string; providerData: any }) =>
      propertyService.updateUtilityProvider(propertyId, providerId, providerData),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.serviceProviders(variables.propertyId) });
    },
  });
};

/**
 * Hook to delete utility provider
 */
export const useDeleteUtilityProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, providerId }: { propertyId: string; providerId: string }) =>
      propertyService.deleteUtilityProvider(propertyId, providerId),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.serviceProviders(variables.propertyId) });
    },
  });
};

/**
 * Hook to get property responsibilities (Bug 4 fix)
 */
export const useGetPropertyResponsibilities = (propertyId: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: propertyDetailQueryKeys.responsibilities(propertyId),
    queryFn: () => propertyService.getResponsibilities(propertyId),
    enabled: enabled && !!propertyId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

/**
 * Hook to upsert property responsibilities (Bug 4 fix)
 */
export const useUpsertPropertyResponsibilities = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propertyId, items }: { propertyId: string; items: { utility: string; payer: string }[] }) =>
      propertyService.upsertResponsibilities(propertyId, items),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: propertyDetailQueryKeys.responsibilities(variables.propertyId) });
    },
  });
};
