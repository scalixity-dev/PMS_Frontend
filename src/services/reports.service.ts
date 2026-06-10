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

export interface ProviderStatementItem {
  id: string;
  property: string;
  unit: string;
  category: string;
  subCategory: string;
  dateDue: string;
  datePaid: string;
  amountDue: number;
  amountPaid: number;
  details: string;
  servicePro: string;
  group?: string;
}

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

// ─── helpers ────────────────────────────────────────────────────────────────

function buildQuery(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`).join('&');
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { method: 'GET', credentials: 'include' });
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/** Backend consistently wraps list responses as { data: [...] }. Unwrap safely. */
function unwrapData<T>(raw: any): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && Array.isArray(raw.data)) return raw.data as T[];
  if (raw && Array.isArray(raw.rows)) return raw.rows as T[];
  return [];
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
  } catch {
    return iso;
  }
}

// ─── service ────────────────────────────────────────────────────────────────

export const reportsService = {
  async getRentRoll(): Promise<RentRollItem[]> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.RENT_ROLL);
    const items: any[] = unwrapData(raw);
    return items.map((item: any, idx: number) => {
      const start = item.leaseStart ? new Date(item.leaseStart).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      const end = item.leaseEnd ? new Date(item.leaseEnd).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '';
      return {
        id: item.id ?? item.leaseId ?? String(idx),
        tenant: item.tenant ?? item.tenantName ?? '',
        unit: item.unit ?? item.unitName ?? '—',
        leaseNumber: item.leaseNumber ?? item.leaseId?.slice(0, 8).toUpperCase() ?? `L-${idx + 1}`,
        leaseDuration: item.leaseDuration ?? (start && end ? `${start} – ${end}` : start || end || '—'),
        marketRent: Number(item.marketRent ?? item.rent ?? 0),
        depositsHeld: Number(item.depositsHeld ?? item.deposit ?? 0),
        rentalCharge: Number(item.rentalCharge ?? item.rent ?? 0),
        balance: Number(item.balance ?? 0),
        property: item.property ?? item.propertyName ?? '',
        propertyType: item.propertyType ?? '',
        propertyAddress: item.propertyAddress ?? '',
        occupancy: item.occupancy ?? 'Occupied',
        recurringTransaction: item.recurringTransaction ?? 'Active',
      };
    });
  },

  async getGeneralIncome(params: { startDate?: string; endDate?: string }): Promise<IncomeExpenseReport> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.GENERAL_INCOME(buildQuery(params)));
    // Backend may return { data/rows: [], grandTotal } or plain { rows: [], grandTotal }
    if (raw && (Array.isArray(raw.rows) || Array.isArray(raw.data))) {
      return { rows: raw.rows ?? raw.data ?? [], grandTotal: raw.grandTotal ?? 0 };
    }
    if (Array.isArray(raw)) {
      return { rows: raw, grandTotal: 0 };
    }
    return { rows: [], grandTotal: 0 };
  },

  async getGeneralExpenses(params: { startDate?: string; endDate?: string }): Promise<IncomeExpenseReport> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.GENERAL_EXPENSES(buildQuery(params)));
    if (raw && (Array.isArray(raw.rows) || Array.isArray(raw.data))) {
      return { rows: raw.rows ?? raw.data ?? [], grandTotal: raw.grandTotal ?? 0 };
    }
    if (Array.isArray(raw)) {
      return { rows: raw, grandTotal: 0 };
    }
    return { rows: [], grandTotal: 0 };
  },

  async getPropertyExpenses(params: { startDate?: string; endDate?: string; propertyId?: string }): Promise<PropertyExpenseItem[]> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.PROPERTY_EXPENSES(buildQuery(params)));
    return unwrapData<PropertyExpenseItem>(raw);
  },

  async getPropertyStatement(params: { propertyId?: string; startDate?: string; endDate?: string }): Promise<PropertyStatementItem[]> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.PROPERTY_STATEMENT(buildQuery(params)));
    return unwrapData<PropertyStatementItem>(raw);
  },

  async getTenantStatement(params: { tenantId?: string; startDate?: string; endDate?: string }): Promise<TenantStatementItem[]> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.TENANT_STATEMENT(buildQuery(params)));
    return unwrapData<TenantStatementItem>(raw);
  },

  async getVacantRentals(): Promise<VacantRentalItem[]> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.VACANT_RENTALS);
    const items: any[] = unwrapData(raw);
    return items.map((item: any, idx: number) => ({
      id: item.id ?? String(idx),
      property: item.property ?? item.propertyName ?? '',
      propertyType: item.propertyType ?? '',
      propertyAddress: item.propertyAddress ?? '',
      unit: item.unit ?? item.unitName ?? '—',
      daysVacant: Number(item.daysVacant ?? 0),
      beds: Number(item.beds ?? item.bedrooms ?? 0),
      baths: Number(item.baths ?? item.bathrooms ?? 0),
      size: item.size ?? item.squareFeet ? `${item.squareFeet} sq ft` : '—',
      marketRent: Number(item.marketRent ?? item.rent ?? 0),
      marketingStatus: item.marketingStatus ?? item.status ?? 'Unlisted',
    }));
  },

  async getRentersInsurance(): Promise<RentersInsuranceItem[]> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.RENTERS_INSURANCE);
    return unwrapData<RentersInsuranceItem>(raw);
  },

  async getMaintenanceRequests(params: { status?: string; startDate?: string; endDate?: string }): Promise<MaintenanceRequestItem[]> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.MAINTENANCE_REQUESTS(buildQuery(params)));
    const items: any[] = unwrapData(raw);
    return items.map((item: any, idx: number) => ({
      id: item.id ?? String(idx),
      requestNumber: item.requestNumber ?? item.id?.slice(0, 8).toUpperCase() ?? `REQ-${idx + 1}`,
      tenant: item.tenant ?? item.requestedBy ?? '',
      assignee: item.assignee ?? item.assignedTo?.name ?? item.assignedTo ?? '',
      status: item.status ?? '',
      priority: item.priority ?? '',
      title: item.title ?? '',
      dateDue: formatDate(item.dateDue ?? item.dueDate),
      endedWork: formatDate(item.endedWork ?? item.completedAt),
      property: item.property?.name ?? item.property ?? '',
      propertyType: item.property?.type ?? item.propertyType ?? '',
      propertyAddress: item.property?.address ?? item.propertyAddress ?? '',
    }));
  },

  async getContacts(): Promise<ContactItem[]> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.CONTACTS);
    const items: any[] = unwrapData(raw);
    return items.map((item: any, idx: number) => {
      const nameParts = (item.name ?? '').trim().split(/\s+/);
      return {
        id: item.id ?? String(idx),
        firstName: nameParts[0] ?? '',
        lastName: nameParts.slice(1).join(' '),
        company: item.company ?? '',
        address: item.address ?? '',
        email: item.email ?? '',
        phone: item.phone ?? '',
        category: item.type ?? item.category ?? undefined,
        contactType: item.type ?? item.contactType ?? undefined,
        property: item.property?.name ?? item.property ?? undefined,
        lease: item.lease ?? undefined,
      };
    });
  },

  getRentability(params: { startDate?: string; endDate?: string }): Promise<RentabilityReport> {
    return getJson<RentabilityReport>(API_ENDPOINTS.REPORTS.RENTABILITY(buildQuery(params)));
  },

  async getProviderStatement(params: { startDate?: string; endDate?: string; serviceProId?: string }): Promise<ProviderStatementItem[]> {
    const raw = await getJson<any>(API_ENDPOINTS.REPORTS.PROVIDER_STATEMENT(buildQuery(params)));
    return unwrapData<ProviderStatementItem>(raw);
  },
};
