import { API_ENDPOINTS } from '../config/api.config';

export interface RentRollItem {
  id: string;
  tenant: string;
  unit: number | string;
  leaseNumber: number | string;
  leaseDuration: string;
  marketRent: number;
  depositsHeld: number;
  rentalCharge: number;
  balance: number;
  property: string;
  propertyType: string;
  propertyAddress: string;
  occupancy: string;
  recurringTransaction: string;
}

export interface IncomeExpenseRow {
  category: string;
  count: number;
  total: number;
}

export interface IncomeExpenseReport {
  rows: IncomeExpenseRow[];
  grandTotal: number;
}

export interface PropertyExpenseItem {
  id: string;
  datePaid: string;
  dateDue: string;
  unit: string;
  category: string;
  subCategory: string;
  payerPayee: string;
  amountDue: number;
  amountPaid: number;
  details: string;
  property?: string;
  propertyType?: string;
  propertyAddress?: string;
}

export interface PropertyStatementItem {
  id: string;
  property: string;
  propertyType: string;
  propertyAddress: string;
  datePaid: string;
  category: string;
  subCategory: string;
  payerPayee: string;
  moneyIn: number;
  moneyOut: number;
}

export interface TenantStatementItem {
  id: string;
  tenant: string;
  dateDue: string;
  datePaid: string;
  category: string;
  subCategory: string;
  invoicingType: string;
  amountDue: number;
  amountPaid: number;
  incomeType: string;
}

export interface VacantRentalItem {
  id: string;
  property: string;
  propertyType: string;
  propertyAddress: string;
  unit: string;
  daysVacant: number;
  beds: number;
  baths: number;
  size: string;
  marketRent: number;
  marketingStatus: string;
}

export interface RentersInsuranceItem {
  id: string;
  tenant: string;
  property: string;
  propertyType: string;
  propertyAddress: string;
  unit: string;
  insuranceStatus: string;
  effectiveDate: string;
  expirationDate: string;
  policy: string;
}

export interface MaintenanceRequestItem {
  id: string;
  requestNumber: string;
  tenant: string;
  assignee: string;
  status: string;
  priority: string;
  title: string;
  dateDue: string;
  endedWork: string;
  property: string;
  propertyType: string;
  propertyAddress: string;
}

export interface ContactItem {
  id: string;
  firstName: string;
  lastName: string;
  company: string;
  address: string;
  email: string;
  phone: string;
  category?: string;
  property?: string;
  lease?: string;
  contactType?: string;
}

function buildQuery(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`).join('&');
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.statusText}`);
  }
  return response.json();
}

export const reportsService = {
  getRentRoll(): Promise<RentRollItem[]> {
    return getJson<RentRollItem[]>(API_ENDPOINTS.REPORTS.RENT_ROLL);
  },

  getGeneralIncome(params: { startDate?: string; endDate?: string }): Promise<IncomeExpenseReport> {
    return getJson<IncomeExpenseReport>(API_ENDPOINTS.REPORTS.GENERAL_INCOME(buildQuery(params)));
  },

  getGeneralExpenses(params: { startDate?: string; endDate?: string }): Promise<IncomeExpenseReport> {
    return getJson<IncomeExpenseReport>(API_ENDPOINTS.REPORTS.GENERAL_EXPENSES(buildQuery(params)));
  },

  getPropertyExpenses(params: { startDate?: string; endDate?: string; propertyId?: string }): Promise<PropertyExpenseItem[]> {
    return getJson<PropertyExpenseItem[]>(API_ENDPOINTS.REPORTS.PROPERTY_EXPENSES(buildQuery(params)));
  },

  getPropertyStatement(params: { propertyId?: string; startDate?: string; endDate?: string }): Promise<PropertyStatementItem[]> {
    return getJson<PropertyStatementItem[]>(API_ENDPOINTS.REPORTS.PROPERTY_STATEMENT(buildQuery(params)));
  },

  getTenantStatement(params: { tenantId?: string; startDate?: string; endDate?: string }): Promise<TenantStatementItem[]> {
    return getJson<TenantStatementItem[]>(API_ENDPOINTS.REPORTS.TENANT_STATEMENT(buildQuery(params)));
  },

  getVacantRentals(): Promise<VacantRentalItem[]> {
    return getJson<VacantRentalItem[]>(API_ENDPOINTS.REPORTS.VACANT_RENTALS);
  },

  getRentersInsurance(): Promise<RentersInsuranceItem[]> {
    return getJson<RentersInsuranceItem[]>(API_ENDPOINTS.REPORTS.RENTERS_INSURANCE);
  },

  getMaintenanceRequests(params: { status?: string; startDate?: string; endDate?: string }): Promise<MaintenanceRequestItem[]> {
    return getJson<MaintenanceRequestItem[]>(API_ENDPOINTS.REPORTS.MAINTENANCE_REQUESTS(buildQuery(params)));
  },

  getContacts(): Promise<ContactItem[]> {
    return getJson<ContactItem[]>(API_ENDPOINTS.REPORTS.CONTACTS);
  },

  getRentability(params: { startDate?: string; endDate?: string }): Promise<RentabilityReport> {
    return getJson<RentabilityReport>(API_ENDPOINTS.REPORTS.RENTABILITY(buildQuery(params)));
  },
};

export interface RentabilityRow {
  propertyId: string;
  propertyName: string;
  propertyType: string;
  monthlyRent: number;
  expectedRent: number;
  income: number;
  expenses: number;
  noi: number;
  paidRent: number;
  collectionRate: number;
  occupancyStatus: string;
  status: string;
}

export interface RentabilityReport {
  data: RentabilityRow[];
  summary: {
    propertyCount: number;
    totalIncome: number;
    totalExpenses: number;
    totalNOI: number;
    portfolioCollectionRate: number;
    rangeStart: string;
    rangeEnd: string;
    months: number;
  };
}
