/**
 * Firebase Web SDK bootstrap for Cloud Messaging (FCM) push notifications.
 *
 * Everything here is config-gated: if the VITE_FIREBASE_* env vars (or the VAPID
 * key) are missing, the helpers return null and the app behaves exactly as
 * before — push simply stays dormant. Fill the vars to switch the feature on.
 */
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** VAPID public key from Firebase Console > Cloud Messaging > Web Push certificates. */
export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY as string | undefined;

/** True when all credentials needed to obtain an FCM token are present. */
export function isPushConfigured(): boolean {
  return Boolean(
    firebaseConfig.apiKey &&
      firebaseConfig.projectId &&
      firebaseConfig.messagingSenderId &&
      firebaseConfig.appId &&
      VAPID_KEY,
  );
}

let app: FirebaseApp | null = null;
export function getFirebaseApp(): FirebaseApp | null {
  if (!isPushConfigured()) return null;
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig as Record<string, string>);
  }
  return app;
}

/** Returns a Messaging instance, or null if push is unconfigured/unsupported. */
export async function getMessagingIfSupported(): Promise<Messaging | null> {
  const a = getFirebaseApp();
  if (!a) return null;
  try {
    if (!(await isSupported())) return null;
  } catch {
    return null;
  }
  return getMessaging(a);
}

/**
 * Build the query string that hands the (public) Firebase config to the
 * messaging service worker, which cannot read Vite env vars itself.
 */
export function swConfigQuery(): string {
  const p = new URLSearchParams();
  if (firebaseConfig.apiKey) p.set('apiKey', firebaseConfig.apiKey);
  if (firebaseConfig.authDomain) p.set('authDomain', firebaseConfig.authDomain);
  if (firebaseConfig.projectId) p.set('projectId', firebaseConfig.projectId);
  if (firebaseConfig.messagingSenderId) p.set('messagingSenderId', firebaseConfig.messagingSenderId);
  if (firebaseConfig.appId) p.set('appId', firebaseConfig.appId);
  return p.toString();
}
