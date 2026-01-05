import { API_ENDPOINTS } from '../config/api.config';

export interface Subscription {
  id: string;
  planId: string;
  planName: string;
  status: string;
  startDate: string;
  endDate: string | null;
  nextBillingDate: string | null;
  cancelledAt: string | null;
  isYearly: boolean;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BillingHistoryItem {
  id: string;
  status: string;
  date: string;
  amount: number;
  plan: string;
  billingPeriod: string;
  createdAt: string;
}

export interface BillingHistory {
  items: BillingHistoryItem[];
  total: number;
}

export interface UpdateSubscriptionDto {
  status?: string;
  isYearly?: boolean;
}

export interface ChangePlanDto {
  planId: string;
  isYearly?: boolean;
}

export interface RenewSubscriptionDto {
  isYearly?: boolean;
}

class SubscriptionService {
  /**
   * Get current subscription
   */
  async getCurrent(): Promise<Subscription> {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTION.GET_CURRENT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch subscription';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch subscription: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Update subscription
   */
  async update(data: UpdateSubscriptionDto): Promise<Subscription> {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTION.UPDATE, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to update subscription';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to update subscription: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Change subscription plan
   */
  async changePlan(data: ChangePlanDto): Promise<Subscription> {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTION.CHANGE_PLAN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to change plan';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to change plan: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Renew an expired subscription
   */
  async renew(data?: RenewSubscriptionDto): Promise<Subscription> {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTION.RENEW, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data || {}),
    });

    if (!response.ok) {
      let errorMessage = 'Failed to renew subscription';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to renew subscription: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  /**
   * Get billing history
   */
  async getBillingHistory(startDate?: string, endDate?: string): Promise<BillingHistory> {
    const queryParams = new URLSearchParams();
    
    if (startDate) {
      queryParams.append('startDate', startDate);
    }
    if (endDate) {
      queryParams.append('endDate', endDate);
    }

    const url = queryParams.toString() 
      ? `${API_ENDPOINTS.SUBSCRIPTION.BILLING_HISTORY}?${queryParams.toString()}`
      : API_ENDPOINTS.SUBSCRIPTION.BILLING_HISTORY;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      let errorMessage = 'Failed to fetch billing history';
      try {
        const errorData = await response.json();
        if (Array.isArray(errorData.message)) {
          errorMessage = errorData.message.join('. ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch (parseError) {
        errorMessage = `Failed to fetch billing history: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }
}

export const subscriptionService = new SubscriptionService();

