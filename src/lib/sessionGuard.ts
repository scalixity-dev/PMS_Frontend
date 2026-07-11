import { API_BASE_URL } from '../config/api.config';
import { authService } from '../services/auth.service';

/**
 * Paths under API_BASE_URL where a 401 is an expected/normal outcome
 * (login attempt, guest auth check, public browsing) rather than a sign
 * that a previously-valid session has expired. These must never trigger
 * a forced logout/redirect.
 */
const EXCLUDED_PATH_PATTERNS = [/\/auth\//, /\/public\//, /\/public-listing\//];

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

  if (window.location.pathname.startsWith('/login')) {
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
