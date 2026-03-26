import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../../../services/auth.service';
import { API_ENDPOINTS } from '../../../../config/api.config';

const MobileAutoLogin: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    const performAutoLogin = async () => {
      try {
        const result = await authService.verifyMobileToken(token);

        // Wait briefly for the cookie to propagate
        await new Promise(resolve => setTimeout(resolve, 500));

        // Verify the cookie was set by calling getCurrentUser
        let isAuthenticated = false;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount <= maxRetries && !isAuthenticated) {
          try {
            const currentUser = await authService.getCurrentUser();
            if (currentUser && currentUser.userId) {
              isAuthenticated = true;
            }
          } catch {
            if (retryCount < maxRetries) {
              await new Promise(resolve => setTimeout(resolve, 500));
              retryCount++;
            } else {
              break;
            }
          }
        }

        if (!isAuthenticated) {
          setError('Authentication verification failed. Please try logging in manually.');
          setIsProcessing(false);
          return;
        }

        // Route based on user role
        const userRole = result.user.role?.toUpperCase();

        if (userRole === 'SERVICE_PRO') {
          navigate('/service-dashboard', { replace: true });
          return;
        }

        if (userRole === 'TENANT') {
          // Check if tenant has completed onboarding
          try {
            const preferencesResponse = await fetch(API_ENDPOINTS.TENANT.GET_PREFERENCES, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            });

            if (preferencesResponse.ok) {
              const preferencesData = await preferencesResponse.json();
              if (!preferencesData || !preferencesData.preferences) {
                navigate('/signup/tenant-onboarding-flow', { replace: true });
                return;
              }
            }
          } catch {
            // If preferences check fails, go to dashboard anyway
          }

          navigate('/userdashboard', { replace: true });
          return;
        }

        // Default: PROPERTY_MANAGER
        navigate('/dashboard', { replace: true });

      } catch (err) {
        const message = err instanceof Error ? err.message : 'Auto-login failed';
        setError(message);
        setIsProcessing(false);
      }
    };

    performAutoLogin();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Login Failed</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600 text-lg">Signing you in...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default MobileAutoLogin;
