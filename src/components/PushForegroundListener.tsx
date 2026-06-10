import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from './common/Toast';
import { notificationQueryKeys } from '../hooks/useNotificationQueries';

/**
 * Mount ONCE near the app root. While a tab is focused FCM does not raise a
 * system notification, so we surface a toast and refresh the unread badge for
 * incoming pushes. Keeping this in a single component avoids duplicate toasts
 * that would occur if multiple `usePushNotifications` consumers each bound
 * their own onMessage handler.
 *
 * The Firebase SDK is imported dynamically and only when the user has already
 * granted notification permission, so it never weighs down the main bundle for
 * users who haven't opted into push. A permissions listener re-binds when the
 * user grants permission mid-session (no reload needed).
 */
export function PushForegroundListener() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [granted, setGranted] = useState<boolean>(
    () => typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted',
  );

  // Track permission changes so the message handler binds the moment the user
  // enables push, without requiring a page reload.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.permissions?.query) return;
    let status: PermissionStatus | undefined;
    const onChange = () => setGranted(status?.state === 'granted');
    navigator.permissions
      .query({ name: 'notifications' as PermissionName })
      .then((s) => {
        status = s;
        setGranted(s.state === 'granted');
        s.addEventListener('change', onChange);
      })
      .catch(() => undefined);
    return () => status?.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (!granted) return;

    let unsub: (() => void) | undefined;
    let cancelled = false;
    (async () => {
      const [{ onMessage }, { getMessagingIfSupported }] = await Promise.all([
        import('firebase/messaging'),
        import('../lib/firebase'),
      ]);
      const messaging = await getMessagingIfSupported();
      if (!messaging || cancelled) return;
      unsub = onMessage(messaging, (payload) => {
        const data = payload.data || {};
        const title = data.title || payload.notification?.title || 'New notification';
        const body = data.body || payload.notification?.body || '';
        toast.info(body ? `${title} — ${body}` : title);
        queryClient.invalidateQueries({ queryKey: notificationQueryKeys.unreadCount() });
        queryClient.invalidateQueries({ queryKey: notificationQueryKeys.list() });
      });
    })();

    return () => {
      cancelled = true;
      unsub?.();
    };
  }, [granted, toast, queryClient]);

  return null;
}
