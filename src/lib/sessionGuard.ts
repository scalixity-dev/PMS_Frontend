import { API_BASE_URL } from '../config/api.config';
import { authService } from '../services/auth.service';

/**
 * Paths under API_BASE_URL where a 401 is an expected/normal outcome
 * (login attempt, guest auth check, public browsing) rather than a sign
 * that a previously-valid session has expired. These must never trigger
 * a forced logout/redirect.
 *
 * `/subscription/current` is included because SubscriptionProvider is
 * mounted at the app root and queries it on every page, including guest
 * pages (home, login, signup) — a guest 401 there is normal, not a dead
 * session.
 */
const EXCLUDED_PATH_PATTERNS = [/\/auth\//, /\/public\//, /\/public-listing\//, /\/subscription\/current/];

/**
 * Route prefixes that only make sense with a live session.
 *
 * A 401 is only evidence of an *expired* session if the user was somewhere
 * that required one. On a public page - the marketing site, /signup, /otp - a
 * 401 usually just means "not logged in", which is the normal state there.
 * Bouncing those visitors to /login?sessionExpired=1 is how a Google sign-up
 * got ejected from the role picker before it could be used.
 *
 * This is an allow-list rather than a list of public paths on purpose: a new
 * public page then behaves correctly without anyone remembering to add it.
 */
const SESSION_REQUIRED_PREFIXES = [
  '/dashboard',
  '/service-dashboard',
  '/userdashboard',
];

function requiresSession(pathname: string): boolean {
  return SESSION_REQUIRED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

let handlingUnauthorized = false;
let installed = false;

function isTrackedRequest(url: string): boolean {
  return url.startsWith(API_BASE_URL);
}

function isExcluded(url: string): boolean {
  return EXCLUDED_PATH_PATTERNS.some((pattern) => pattern.test(url));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A single 401 on a protected endpoint can be a transient cookie-propagation
 * race right after login/OTP verification (the app already has retry loops
 * elsewhere to work around exactly this), not proof the session is dead.
 * Confirm with a side-effect-free /auth/me recheck before forcing logout —
 * that endpoint is excluded from triggering this interceptor, so this can't
 * recurse, and being a GET it's safe to retry unlike the original request
 * (which may have been a mutation).
 */
async function isSessionActuallyInvalid(): Promise<boolean> {
  const attempts = 3;
  for (let i = 0; i < attempts; i++) {
    await sleep(400);
    try {
      authService.invalidateCurrentUserCache();
      await authService.getCurrentUser();
      return false;
    } catch {
      // keep trying
    }
  }
  return true;
}

async function handleUnauthorized(): Promise<void> {
  if (handlingUnauthorized) return;
  handlingUnauthorized = true;

  // Nothing to eject them from: they are not on a page that needed a session.
  if (!requiresSession(window.location.pathname)) {
    handlingUnauthorized = false;
    return;
  }

  if (!(await isSessionActuallyInvalid())) {
    handlingUnauthorized = false;
    return;
  }

  try {
    await authService.logout();
  } catch {
    // Logout call failing shouldn't block redirecting the user out.
  }

  const redirect = `${window.location.pathname}${window.location.search}`;
  window.location.href = `/login?redirect=${encodeURIComponent(redirect)}&sessionExpired=1`;
}

/**
 * Installs a global fetch interceptor that force-logs-out the user whenever
 * any authenticated API call comes back 401. Without this, a token/cookie
 * that expires mid-session just surfaces as a generic error toast on
 * whichever request happened to fail, instead of returning the user to /login.
 */
export function installUnauthorizedInterceptor(): void {
  if (installed) return;
  installed = true;

  const originalFetch = window.fetch.bind(window);

  window.fetch = async (...args: Parameters<typeof fetch>) => {
    const response = await originalFetch(...args);

    if (response.status === 401) {
      const input = args[0];
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

      if (isTrackedRequest(url) && !isExcluded(url)) {
        void handleUnauthorized();
      }
    }

    return response;
  };
}
