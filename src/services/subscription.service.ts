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
  trialEndsAt: string | null;
  daysLeftInTrial: number;
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
  invoicePdfUrl: string | null;
  hostedInvoiceUrl: string | null;
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

export interface CreateSubscriptionDto {
  planId: string;
  isYearly: boolean;
  paymentMethodId?: string;
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
   * Get current subscription, or null when the account has none.
   *
   * The backend answers 404 for an account that never chose a plan. That is an
   * ordinary answer, not a failure, so it resolves to null instead of throwing -
   * otherwise every plan-less account renders an error where "no plan" belongs.
   */
  async getCurrent(): Promise<Subscription | null> {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTION.GET_CURRENT, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (response.status === 404) {
      return null;
    }

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
   * Create a new Stripe subscription (first-time subscriber)
   */
  async create(data: CreateSubscriptionDto): Promise<Subscription> {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTION.CREATE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to create subscription');
    }
    return response.json();
  }

  /**
   * Cancel active subscription (access continues until period end)
   */
  async cancel(): Promise<Subscription> {
    const response = await fetch(API_ENDPOINTS.SUBSCRIPTION.CANCEL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Failed to cancel subscription');
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

