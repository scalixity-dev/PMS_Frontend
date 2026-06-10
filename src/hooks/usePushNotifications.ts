import { useCallback, useEffect, useState } from 'react';
import { getToken, deleteToken } from 'firebase/messaging';
import {
  getMessagingIfSupported,
  isPushConfigured,
  VAPID_KEY,
  swConfigQuery,
} from '../lib/firebase';
import { pushService } from '../services/push.service';
import { useToast } from '../components/common/Toast';

const TOKEN_KEY = 'fcm_token';

export type PushPermission = 'default' | 'granted' | 'denied' | 'unsupported';

interface UsePushNotifications {
  /** Browser supports the APIs AND the app is configured for push. */
  supported: boolean;
  permission: PushPermission;
  /** This device currently has a registered token. */
  enabled: boolean;
  busy: boolean;
  enable: () => Promise<boolean>;
  disable: () => Promise<void>;
  sendTest: () => Promise<void>;
}

function detectSupport(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    isPushConfigured()
  );
}

async function registerSW(): Promise<ServiceWorkerRegistration | undefined> {
  if (!('serviceWorker' in navigator)) return undefined;
  // Config is passed via query string so the SW (no env access) can init Firebase.
  return navigator.serviceWorker.register(`/firebase-messaging-sw.js?${swConfigQuery()}`);
}

/**
 * Drives FCM Web Push for the signed-in user on this device: permission prompt,
 * token acquisition + backend registration, foreground message toasts, and
 * teardown. All entry points no-op gracefully when push is unconfigured or the
 * browser lacks support, so it is safe to mount anywhere.
 */
export function usePushNotifications(): UsePushNotifications {
  const toast = useToast();
  const supported = detectSupport();

  const [permission, setPermission] = useState<PushPermission>(() => {
    if (!supported) return 'unsupported';
    return (Notification.permission as PushPermission) ?? 'default';
  });
  const [enabled, setEnabled] = useState<boolean>(() => Boolean(localStorage.getItem(TOKEN_KEY)));
  const [busy, setBusy] = useState(false);

  // If the user previously enabled push and still has permission, silently
  // refresh the token on load (tokens rotate) so the server stays current.
  useEffect(() => {
    if (!supported || permission !== 'granted' || !localStorage.getItem(TOKEN_KEY)) return;
    let cancelled = false;
    (async () => {
      try {
        const reg = await registerSW();
        const messaging = await getMessagingIfSupported();
        if (!messaging || cancelled) return;
        const token = await getToken(messaging, {
          vapidKey: VAPID_KEY,
          serviceWorkerRegistration: reg,
        });
        if (token && !cancelled) {
          localStorage.setItem(TOKEN_KEY, token);
          await pushService.subscribe(token);
          setEnabled(true);
        }
      } catch {
        /* non-fatal: token refresh will retry next load */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supported, permission]);

  const enable = useCallback(async (): Promise<boolean> => {
    if (!supported) {
      toast.info('Push notifications are not available in this browser.');
      return false;
    }
    setBusy(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm as PushPermission);
      if (perm !== 'granted') {
        toast.warning('Notifications blocked. Enable them in your browser settings to receive push.');
        return false;
      }
      const reg = await registerSW();
      const messaging = await getMessagingIfSupported();
      if (!messaging) {
        toast.error('Push messaging is not supported here.');
        return false;
      }
      const token = await getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: reg,
      });
      if (!token) {
        toast.error('Could not obtain a push token. Please try again.');
        return false;
      }
      await pushService.subscribe(token);
      localStorage.setItem(TOKEN_KEY, token);
      setEnabled(true);
      toast.success('Push notifications enabled on this device.');
      return true;
    } catch (err) {
      toast.error(`Failed to enable push: ${(err as Error).message}`);
      return false;
    } finally {
      setBusy(false);
    }
  }, [supported, toast]);

  const disable = useCallback(async (): Promise<void> => {
    setBusy(true);
    try {
      const stored = localStorage.getItem(TOKEN_KEY);
      const messaging = await getMessagingIfSupported();
      if (messaging) {
        try {
          await deleteToken(messaging);
        } catch {
          /* token may already be gone */
        }
      }
      if (stored) await pushService.unsubscribe(stored).catch(() => undefined);
      localStorage.removeItem(TOKEN_KEY);
      setEnabled(false);
      toast.info('Push notifications disabled on this device.');
    } finally {
      setBusy(false);
    }
  }, [toast]);

  const sendTest = useCallback(async (): Promise<void> => {
    try {
      const res = await pushService.sendTest();
      if (res.delivered > 0) toast.success('Test notification sent.');
      else toast.warning(`No device received it (${res.skipped ?? 'no active tokens'}).`);
    } catch (err) {
      toast.error(`Test failed: ${(err as Error).message}`);
    }
  }, [toast]);

  return { supported, permission, enabled, busy, enable, disable, sendTest };
}
