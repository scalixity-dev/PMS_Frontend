import { API_ENDPOINTS } from '../config/api.config';

export interface PushTestResult {
  success: boolean;
  delivered: number;
  skipped?: string;
}

/** Backend API for FCM device-token lifecycle. Auth via session cookie. */
export const pushService = {
  /** Register/refresh this device's FCM token (also flips push opt-in on). */
  async subscribe(token: string, platform: 'web' | 'android' | 'ios' = 'web'): Promise<void> {
    const res = await fetch(API_ENDPOINTS.NOTIFICATION.PUSH_SUBSCRIBE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token, platform }),
    });
    if (!res.ok) throw new Error(`Failed to subscribe push: ${res.statusText}`);
  },

  /** Remove this device's FCM token. */
  async unsubscribe(token: string): Promise<void> {
    const res = await fetch(API_ENDPOINTS.NOTIFICATION.PUSH_UNSUBSCRIBE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ token }),
    });
    if (!res.ok) throw new Error(`Failed to unsubscribe push: ${res.statusText}`);
  },

  /** Trigger a test push to the current user's devices. */
  async sendTest(): Promise<PushTestResult> {
    const res = await fetch(API_ENDPOINTS.NOTIFICATION.PUSH_TEST, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) throw new Error(`Failed to send test push: ${res.statusText}`);
    return res.json();
  },
};
