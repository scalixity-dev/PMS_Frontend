import { API_ENDPOINTS } from '../config/api.config';

export interface SavedCard {
    id: string;
    brand: string | null;
    last4: string | null;
    expMonth: number | null;
    expYear: number | null;
    cardholderName: string | null;
    isDefault: boolean;
    createdAt: string;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        ...init,
    });
    if (!res.ok) {
        let msg = 'Request failed';
        try {
            const err = await res.json();
            if (Array.isArray(err.message)) msg = err.message.join('. ');
            else if (err.message) msg = err.message;
            else if (err.error) msg = err.error;
        } catch {
            msg = `${res.status} ${res.statusText}`;
        }
        throw new Error(msg);
    }
    return res.json();
}

export const paymentsService = {
    createSetupIntent(): Promise<{ clientSecret: string; customerId: string }> {
        return request(API_ENDPOINTS.PAYMENTS.CREATE_SETUP_INTENT, { method: 'POST' });
    },
    saveCard(paymentMethodId: string, setAsDefault = false): Promise<SavedCard> {
        return request(API_ENDPOINTS.PAYMENTS.SAVE_CARD, {
            method: 'POST',
            body: JSON.stringify({ paymentMethodId, setAsDefault }),
        });
    },
    listCards(): Promise<SavedCard[]> {
        return request(API_ENDPOINTS.PAYMENTS.LIST_CARDS, { method: 'GET' });
    },
    setDefaultCard(id: string): Promise<{ id: string; isDefault: boolean }> {
        return request(API_ENDPOINTS.PAYMENTS.SET_DEFAULT(id), { method: 'PATCH' });
    },
    deleteCard(id: string): Promise<{ deleted: boolean; newDefaultCardId: string | null }> {
        return request(API_ENDPOINTS.PAYMENTS.DELETE_CARD(id), { method: 'DELETE' });
    },
    /**
     * Create PaymentIntent. If savedCardId provided, charges off-session immediately.
     * Otherwise returns clientSecret for client-side Stripe Elements confirmation.
     */
    createPaymentIntent(params: {
        amount: number;
        currency?: string;
        savedCardId?: string;
        description?: string;
        metadata?: Record<string, string>;
    }): Promise<{
        paymentIntentId: string;
        clientSecret: string;
        status: string;
        amount: number;
        currency: string;
    }> {
        return request(API_ENDPOINTS.PAYMENTS.CREATE_PAYMENT_INTENT, {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },

    // ============ Stripe Connect (Service Provider payouts) ============
    /**
     * Create a Stripe Connect Express onboarding link for the service pro.
     * After completing KYC, user redirects to returnUrl.
     */
    createConnectOnboarding(returnUrl: string, refreshUrl: string): Promise<{
        accountId: string;
        onboardingUrl: string;
        expiresAt: number;
    }> {
        return request(API_ENDPOINTS.PAYMENTS.CONNECT_ONBOARDING_LINK, {
            method: 'POST',
            body: JSON.stringify({ returnUrl, refreshUrl }),
        });
    },

    /**
     * Get current Stripe Connect status.
     */
    getConnectStatus(): Promise<{
        connected: boolean;
        accountId: string | null;
        chargesEnabled: boolean;
        payoutsEnabled: boolean;
        detailsSubmitted: boolean;
    }> {
        return request(API_ENDPOINTS.PAYMENTS.CONNECT_STATUS, { method: 'GET' });
    },

    /**
     * Disconnect Stripe Connect account.
     */
    disconnectConnect(): Promise<{ disconnected: boolean }> {
        return request(API_ENDPOINTS.PAYMENTS.CONNECT_DISCONNECT, { method: 'POST' });
    },
};
