import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';

// Routes that own the ?token= param themselves.
//   /team/accept-invitation - its token is an invitation token, not a login one.
//   /auth/mobile-login      - MobileAutoLogin redeems the token itself so it can
//                             route by role afterwards. Mobile redirect tokens
//                             are single-use, so exactly one of the two
//                             components may redeem it; letting this provider
//                             go first would burn the token and leave that page
//                             with nothing to work with.
const EXCLUDED_PATHS = ['/team/accept-invitation', '/auth/mobile-login'];

interface AutoLoginProviderProps {
  children: React.ReactNode;
}

type RedeemResult = { ok: true } | { ok: false; message: string };

/**
 * Redeem a mobile redirect token and confirm the session cookie took effect.
 *
 * Kept outside the component and started exactly once per token: the token is
 * single-use, so this may never be retried. It resolves rather than rejects so
 * several effect invocations can await the same promise safely.
 */
const redeemMobileToken = async (token: string): Promise<RedeemResult> => {
  try {
    await authService.verifyMobileToken(token);
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : 'Auto-login failed',
    };
  }

  // Wait briefly for cookie to propagate
  await new Promise(resolve => setTimeout(resolve, 300));

  for (let i = 0; i < 3; i++) {
    try {
      const user = await authService.getCurrentUser();
      if (user?.userId) return { ok: true };
    } catch {
      await new Promise(resolve => setTimeout(resolve, 400));
    }
  }

  return {
    ok: false,
    message: 'Could not verify session. Please try logging in manually.',
  };
};

/**
 * Global wrapper that detects ?token= in ANY URL and auto-logs in the user
 * before rendering the page. This enables mobile-to-web deep linking:
 *
 *   https://frontend.com/dashboard/properties/123?token=xxx
 *
 * The provider will:
 * 1. Detect ?token= in the URL
 * 2. Call the backend to verify the token and set the auth cookie
 * 3. Strip ?token= from the URL (clean URL)
 * 4. Render the page normally (ProtectedRoute will find the cookie and allow access)
 *
 * If there's no ?token= param, children render immediately with zero delay.
 */
const AutoLoginProvider: React.FC<AutoLoginProviderProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobileTokenPath = !EXCLUDED_PATHS.includes(location.pathname);

  // Captured on the first render and kept across re-renders and the URL rewrite
  // below, so the token survives being stripped from the query string.
  const tokenRef = useRef<string | null>(
    isMobileTokenPath ? searchParams.get('token') : null,
  );
  // Holds the single in-flight redemption. Because the token can only be spent
  // once, StrictMode's second effect invocation must re-attach to this promise
  // instead of starting another request - and must not be left waiting on a
  // promise whose handlers the first invocation's cleanup already detached.
  const redeemPromiseRef = useRef<Promise<RedeemResult> | null>(null);

  const [state, setState] = useState<'idle' | 'verifying' | 'done' | 'error'>(
    () => (tokenRef.current ? 'verifying' : 'idle'),
  );
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = tokenRef.current;

    if (!token) {
      setState('idle');
      return;
    }

    let cancelled = false;

    if (!redeemPromiseRef.current) {
      // Strip ?token= before redeeming rather than after. The token is spent by
      // the request either way, so leaving it in the URL only means a reload or
      // a back-navigation retries a token that can no longer work - and it
      // keeps a credential in browser history and in any Referer header this
      // page sends.
      const strippedParams = new URLSearchParams(searchParams);
      strippedParams.delete('token');
      setSearchParams(strippedParams, { replace: true });

      redeemPromiseRef.current = redeemMobileToken(token);
    }

    void redeemPromiseRef.current.then(result => {
      if (cancelled) return;
      if (result.ok) {
        setState('done');
        return;
      }
      setErrorMessage(result.message);
      setState('error');
    });

    return () => { cancelled = true; };
    // Only run once on mount when token is present
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === 'verifying') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Signing you in...</p>
        </div>
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Failed</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg hover:bg-teal-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // state === 'idle' or 'done' - render children normally
  return <>{children}</>;
};

export default AutoLoginProvider;
