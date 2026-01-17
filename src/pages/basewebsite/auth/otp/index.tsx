import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LeftIcon, RightCircle } from './sections/otpBackgroundIcons';
import OtpForm from './sections/OtpForm';
import { authService } from '../../../../services/auth.service';
import { API_ENDPOINTS } from '../../../../config/api.config';

const OtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  // Decode email from URL to handle URL-encoded characters
  const rawEmail = searchParams.get('email') || '';
  const email = rawEmail ? decodeURIComponent(rawEmail) : '';
  const otpType = (searchParams.get('type') || 'email') as 'email' | 'device'; // 'email' or 'device'

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const handleOtpSubmit = async (otpCode: string) => {
    // Check for missing userId and handle gracefully
    if (!userId) {
      alert('User ID is missing. Please try logging in again.');
      navigate('/login', { replace: true });
      return;
    }

    try {
      if (otpType === 'device') {
        // Verify device OTP
        await authService.verifyDevice(userId, otpCode);
        // After successful device verification, redirect to dashboard
        navigate('/dashboard', { replace: true });
      } else {
        // Verify email OTP
        await authService.verifyEmail(userId, otpCode);
        // Wait a moment to ensure cookies are set
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check user role from URL params
        const userRole = (searchParams.get('role') || 'TENANT').toUpperCase();
        
        if (userRole === 'TENANT') {
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
              console.log('No preferences found after email verification, redirecting to tenant onboarding flow');
              navigate('/signup/tenant-onboarding-flow', { replace: true });
            } else {
              const preferences = await preferencesResponse.json();
              const hasPreferences = preferences && (
                (preferences.location && preferences.location.country && preferences.location.state && preferences.location.city) ||
                (preferences.rentalTypes && preferences.rentalTypes.length > 0)
              );

              if (!hasPreferences) {
                // Preferences are null or empty - redirect to tenant onboarding flow
                console.log('Preferences are null or empty after email verification, redirecting to tenant onboarding flow');
                navigate('/signup/tenant-onboarding-flow', { replace: true });
              } else {
                // Preferences exist - redirect to dashboard
                console.log('Preferences found after email verification, redirecting to tenant dashboard');
                navigate('/userdashboard', { replace: true });
              }
            }
          } catch (error) {
            // Error checking preferences - default to tenant onboarding flow for safety
            console.error('Error checking preferences after email verification:', error);
            navigate('/signup/tenant-onboarding-flow', { replace: true });
          }
        } else {
          // Property manager - redirect to property manager dashboard
          navigate('/dashboard', { replace: true });
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'OTP verification failed. Please try again.';
      alert(errorMessage);
      // Re-throw to let OtpForm handle UI state (clearing OTP, etc.)
      throw error;
    }
  };

  const handleResendOtp = async () => {
    // Check for missing userId and handle gracefully
    if (!userId) {
      alert('User ID is missing. Please try logging in again.');
      navigate('/login', { replace: true });
      return;
    }

    try {
      if (otpType === 'device') {
        // Resend device verification OTP
        await authService.resendDeviceOtp(userId);
      } else {
        // Resend email OTP
        await authService.resendEmailOtp(userId);
      }
    } catch (error) {
      console.error('OTP resend error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to resend OTP. Please try again.';
      alert(errorMessage);
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
