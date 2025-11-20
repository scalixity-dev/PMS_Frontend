import { useEffect } from 'react';
import { LeftIcon, RightCircle } from './sections/otpBackgroundIcons';
import OtpForm from './sections/OtpForm';

const OtpPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-12 px-4 sm:px-6 lg:px-8">
      {/* background icons */}
      <div>
        <LeftIcon />
        <RightCircle />
      </div>

      <div className="flex flex-col lg:flex-row max-w-4xl mx-auto bg-white rounded-lg overflow-hidden">
        <OtpForm />
      </div>
    </div>
  );
};

export default OtpPage;
