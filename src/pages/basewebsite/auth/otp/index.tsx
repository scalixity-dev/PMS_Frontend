import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LeftIcon, RightCircle } from './sections/otpBackgroundIcons';
import OtpForm from './sections/OtpForm';
import { authService } from '../../../../services/auth.service';

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
        // After successful email verification, redirect to dashboard
        navigate('/dashboard', { replace: true });
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
        // For device verification, we need to trigger login again to resend OTP
        // This is a limitation - we'd need a separate endpoint for resending device OTP
        alert('Please try logging in again to receive a new device verification code.');
        navigate('/login', { replace: true });
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
