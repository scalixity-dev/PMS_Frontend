import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LeftIcon, RightCircle } from './sections/otpBackgroundIcons';
import OtpForm from './sections/OtpForm';
import { authService } from '../../../../services/auth.service';
import { API_ENDPOINTS } from '../../../../config/api.config';
import { useOtpSessionStore } from '../store/otpSessionStore';
import { queryClient } from '../../../../lib/queryClient';
import { useToast } from '../../../../components/common/Toast';

const OtpPage: React.FC = () => {
  const toast = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setOtpSession, clearOtpSession, userId: storeUserId, email: storeEmail } = useOtpSessionStore();
  const userId = searchParams.get('userId') || storeUserId;
  const rawEmail = searchParams.get('email') || '';
  const emailFromUrl = rawEmail ? decodeURIComponent(rawEmail) : '';
  const email = emailFromUrl || storeEmail || '';
  const otpType = (searchParams.get('type') || 'email') as 'email' | 'device';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    if (userId && email) {
      setOtpSession({ userId, email, otpType });
    }
  }, [userId, email, otpType, setOtpSession]);

  const handleSuccessfulVerification = async () => {
    // Wait a moment to ensure cookies are set
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify authentication by getting current user (ensures cookie is propagated)
    let isAuthenticated = false;
    let retryCount = 0;
    const maxAuthRetries = 3;

    while (retryCount <= maxAuthRetries && !isAuthenticated) {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser && currentUser.userId) {
          isAuthenticated = true;
          console.log('Authentication verified after OTP');
        }
      } catch (error) {
        if (retryCount < maxAuthRetries) {
          console.log(`OTP Auth check failed, retrying... (attempt ${retryCount + 1}/${maxAuthRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, 500));
          retryCount++;
        } else {
          console.error('Failed to verify auth after OTP retries:', error);
          // Fallback: assume the verification went through even if me-endpoint transiently fails
          isAuthenticated = true; 
        }
      }
    }

    const userRole = (searchParams.get('role') || 'TENANT').toUpperCase();
    console.log('Redirecting user after OTP with role:', userRole);

    if (userRole === 'TENANT') {
      try {
        const redirectPropertyId = sessionStorage.getItem('redirect_property_id');
        if (redirectPropertyId) {
          sessionStorage.removeItem('redirect_property_id');
          console.log('Redirecting tenant after OTP to new application form:', redirectPropertyId);
          navigate(`/userdashboard/new-application?propertyId=${redirectPropertyId}`, { replace: true });
          return;
        }
      } catch (e) {
        console.error('Error reading redirect_property_id from sessionStorage:', e);
      }

      // Check if tenant has preferences (onboarding completed)
      try {
        const preferencesResponse = await fetch(API_ENDPOINTS.TENANT.GET_PREFERENCES, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (preferencesResponse.status === 404 || !preferencesResponse.ok) {
          // No preferences found - redirect to tenant onboarding flow
          console.log('No preferences found after verification, redirecting to tenant onboarding flow');
          navigate('/signup/tenant-onboarding-flow', { replace: true });
        } else {
          const preferences = await preferencesResponse.json();
          const hasPreferences = preferences && (
            (preferences.location && preferences.location.country && preferences.location.state && preferences.location.city) ||
            (preferences.rentalTypes && preferences.rentalTypes.length > 0)
          );

          if (!hasPreferences) {
            // Preferences are null or empty - redirect to tenant onboarding flow
            console.log('Preferences are null or empty after verification, redirecting to tenant onboarding flow');
            navigate('/signup/tenant-onboarding-flow', { replace: true });
          } else {
            // Preferences exist - redirect to dashboard
            console.log('Preferences found after verification, redirecting to tenant dashboard');
            navigate('/userdashboard', { replace: true });
          }
        }
      } catch (error) {
        // Error checking preferences - default to tenant onboarding flow for safety
        console.error('Error checking preferences after verification:', error);
        navigate('/signup/tenant-onboarding-flow', { replace: true });
      }
    } else if (userRole === 'SERVICE_PRO') {
      // Service provider - redirect to service provider dashboard
      console.log('Redirecting to service provider dashboard');
      navigate('/service-dashboard', { replace: true });
    } else {
      // Property manager / team member - redirect to property manager dashboard.
      // Reset team queries so TeamPermissionContext refetches with the authenticated session
      // rather than serving the stale unauthenticated (empty) cache.
      queryClient.resetQueries({ queryKey: ['team'] });
      console.log('Redirecting to property manager dashboard');
      navigate('/dashboard', { replace: true });
    }
  };

  const handleOtpSubmit = async (otpCode: string) => {
    // Check for missing userId and handle gracefully
    if (!userId) {
      toast.error('User ID is missing. Please try logging in again.');
      navigate('/login', { replace: true });
      return;
    }

    try {
      if (otpType === 'device') {
        await authService.verifyDevice(userId, otpCode);
        clearOtpSession();
        await handleSuccessfulVerification();
      } else {
        await authService.verifyEmail(userId, otpCode);
        clearOtpSession();
        await handleSuccessfulVerification();
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'OTP verification failed. Please try again.';
      toast.error(errorMessage);
      // Re-throw to let OtpForm handle UI state (clearing OTP, etc.)
      throw error;
    }
  };

  const handleResendOtp = async () => {
    if (!userId) {
      toast.error('User ID is missing. Please try logging in again.');
      navigate('/login', { replace: true });
      return;
    }

    try {
      if (otpType === 'device') {
        await authService.resendDeviceOtp(userId, email);
      } else {
        await authService.resendEmailOtp(userId, email);
      }
    } catch (error) {
      console.error('OTP resend error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to resend OTP. Please try again.';
      toast.error(errorMessage);
      // Re-throw to let OtpForm handle UI state
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
      {/* background icons */}
      <div>
        <LeftIcon />
        <RightCircle />
      </div>

      <div className="flex flex-col lg:flex-row max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
        <OtpForm 
          email={email}
          onSubmit={handleOtpSubmit}
          onResend={handleResendOtp}
          otpType={otpType}
        />
      </div>
    </div>
  );
};

export default OtpPage;
