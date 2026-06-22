import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../services/auth.service';

const EXCLUDED_PATHS = ['/team/accept-invitation'];

interface AutoLoginProviderProps {
  children: React.ReactNode;
}

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
  const [state, setState] = useState<'idle' | 'verifying' | 'done' | 'error'>(() => {
    return isMobileTokenPath && searchParams.has('token') ? 'verifying' : 'idle';
  });
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token || !isMobileTokenPath) {
      setState('idle');
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        await authService.verifyMobileToken(token);

        if (cancelled) return;

        // Wait briefly for cookie to propagate
        await new Promise(resolve => setTimeout(resolve, 300));

        // Verify cookie is set
        let verified = false;
        for (let i = 0; i < 3; i++) {
          try {
            const user = await authService.getCurrentUser();
            if (user?.userId) {
              verified = true;
              break;
            }
          } catch {
            await new Promise(resolve => setTimeout(resolve, 400));
          }
        }

        if (cancelled) return;

        if (!verified) {
          setErrorMessage('Could not verify session. Please try logging in manually.');
          setState('error');
          return;
        }

        // Strip ?token= from URL while keeping the current path and other params
        const newParams = new URLSearchParams(searchParams);
        newParams.delete('token');
        setSearchParams(newParams, { replace: true });

        setState('done');
      } catch (err) {
        if (cancelled) return;
        const msg = err instanceof Error ? err.message : 'Auto-login failed';
        setErrorMessage(msg);
        setState('error');
      }
    };

    verify();

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

  // state === 'idle' or 'done' — render children normally
  return <>{children}</>;
};

export default AutoLoginProvider;
