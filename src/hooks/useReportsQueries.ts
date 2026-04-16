import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../services/reports.service';

export const reportQueryKeys = {
  all: ['reports'] as const,
  rentRoll: () => [...reportQueryKeys.all, 'rent-roll'] as const,
  generalIncome: (params: { startDate?: string; endDate?: string }) =>
    [...reportQueryKeys.all, 'general-income', params] as const,
  generalExpenses: (params: { startDate?: string; endDate?: string }) =>
    [...reportQueryKeys.all, 'general-expenses', params] as const,
  propertyExpenses: (params: { startDate?: string; endDate?: string; propertyId?: string }) =>
    [...reportQueryKeys.all, 'property-expenses', params] as const,
  propertyStatement: (params: { propertyId?: string; startDate?: string; endDate?: string }) =>
    [...reportQueryKeys.all, 'property-statement', params] as const,
  tenantStatement: (params: { tenantId?: string; startDate?: string; endDate?: string }) =>
    [...reportQueryKeys.all, 'tenant-statement', params] as const,
  vacantRentals: () => [...reportQueryKeys.all, 'vacant-rentals'] as const,
  rentersInsurance: () => [...reportQueryKeys.all, 'renters-insurance'] as const,
  maintenanceRequests: (params: { status?: string; startDate?: string; endDate?: string }) =>
    [...reportQueryKeys.all, 'maintenance-requests', params] as const,
  contacts: () => [...reportQueryKeys.all, 'contacts'] as const,
  rentability: (params: { startDate?: string; endDate?: string }) =>
    [...reportQueryKeys.all, 'rentability', params] as const,
};

export function useRentRollReport() {
  return useQuery({
    queryKey: reportQueryKeys.rentRoll(),
    queryFn: () => reportsService.getRentRoll(),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useGeneralIncomeReport(params: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: reportQueryKeys.generalIncome(params),
    queryFn: () => reportsService.getGeneralIncome(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useGeneralExpensesReport(params: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: reportQueryKeys.generalExpenses(params),
    queryFn: () => reportsService.getGeneralExpenses(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function usePropertyExpensesReport(params: { startDate?: string; endDate?: string; propertyId?: string }) {
  return useQuery({
    queryKey: reportQueryKeys.propertyExpenses(params),
    queryFn: () => reportsService.getPropertyExpenses(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function usePropertyStatementReport(params: { propertyId?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: reportQueryKeys.propertyStatement(params),
    queryFn: () => reportsService.getPropertyStatement(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useTenantStatementReport(params: { tenantId?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: reportQueryKeys.tenantStatement(params),
    queryFn: () => reportsService.getTenantStatement(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useVacantRentalsReport() {
  return useQuery({
    queryKey: reportQueryKeys.vacantRentals(),
    queryFn: () => reportsService.getVacantRentals(),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useRentersInsuranceReport() {
  return useQuery({
    queryKey: reportQueryKeys.rentersInsurance(),
    queryFn: () => reportsService.getRentersInsurance(),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useMaintenanceRequestsReport(params: { status?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: reportQueryKeys.maintenanceRequests(params),
    queryFn: () => reportsService.getMaintenanceRequests(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useContactsReport() {
  return useQuery({
    queryKey: reportQueryKeys.contacts(),
    queryFn: () => reportsService.getContacts(),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}

export function useRentabilityReport(params: { startDate?: string; endDate?: string } = {}) {
  return useQuery({
    queryKey: reportQueryKeys.rentability(params),
    queryFn: () => reportsService.getRentability(params),
    staleTime: 2 * 60 * 1000,
    retry: 1,
  });
}
