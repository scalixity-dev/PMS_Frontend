import { API_ENDPOINTS } from '../config/api.config';

export interface DashboardStats {
  overview: {
    propertiesCount: number;
    unitsCount: number;
    unitsOccupied: number;
    unitsVacant: number;
    tenantsCount: number;
    openMaintenanceCount: number;
  };
  financial: {
    thisMonthIncome: number;
    thisMonthExpenses: number;
    thisMonthNOI: number;
    lastMonthIncome: number;
    lastMonthExpenses: number;
    incomeGrowthPct: number;
    expensesGrowthPct: number;
    depositsHeld: number;
    overdueInvoicesCount: number;
    overdueInvoicesAmount: number;
  };
  maintenance: {
    open: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  applications: {
    pending: number;
    approved: number;
    rejected: number;
  };
  leases: {
    expiringCount: number;
    expiringSoon: Array<{
      id: string;
      endDate: string;
      propertyName: string;
      tenantName: string;
      daysUntilExpiry: number;
    }>;
  };
  recentActivity: Array<{
    type: string;
    message: string;
    createdAt: string;
  }>;
}

export const dashboardService = {
  /**
   * Get aggregated dashboard statistics
   */
  async getStats(): Promise<DashboardStats> {
    const response = await fetch(API_ENDPOINTS.DASHBOARD.GET_STATS, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard statistics: ${response.statusText}`);
    }

    return response.json();
  },
};
