import { API_ENDPOINTS } from '../config/api.config';

export interface TwoFactorStatus {
    enabled: boolean;
    maskedEmail: string;
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

export const twoFactorService = {
    status: () => request<TwoFactorStatus>(API_ENDPOINTS.TWO_FACTOR.STATUS),
    sendCode: () => request<{ sent: boolean; maskedEmail: string }>(API_ENDPOINTS.TWO_FACTOR.SEND_CODE, { method: 'POST' }),
    verify: (code: string, intent: 'enable' | 'disable') =>
        request<{ enabled: boolean }>(API_ENDPOINTS.TWO_FACTOR.VERIFY, {
            method: 'POST',
            body: JSON.stringify({ code, intent }),
        }),
};
