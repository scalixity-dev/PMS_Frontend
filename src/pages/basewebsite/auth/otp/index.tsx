import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LeftIcon, RightCircle } from './sections/otpBackgroundIcons';
import OtpForm from './sections/OtpForm';
import { authService } from '../../../../services/auth.service';

const OtpPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const email = searchParams.get('email') || '';
  const otpType = (searchParams.get('type') || 'email') as 'email' | 'device'; // 'email' or 'device'

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  const handleOtpSubmit = async (otpCode: string) => {
    if (!userId) {
      throw new Error('User ID is missing. Please try again.');
    }

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
  };

  const handleResendOtp = async () => {
    if (!userId) {
      throw new Error('User ID is missing. Please try again.');
    }

    if (otpType === 'device') {
      // For device verification, we need to trigger login again to resend OTP
      // This is a limitation - we'd need a separate endpoint for resending device OTP
      throw new Error('Please try logging in again to receive a new device verification code.');
    } else {
      // Resend email OTP
      await authService.resendEmailOtp(userId);
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
