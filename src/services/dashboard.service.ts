import { API_ENDPOINTS } from '../config/api.config';

interface DashboardStats {
  overview: {
    propertiesCount: number;
    unitsCount: number;
    tenantsCount: number;
    openMaintenanceCount: number;
  };
  financial: {
    thisMonthIncome: number;
    thisMonthExpenses: number;
    thisMonthNOI: number;
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
