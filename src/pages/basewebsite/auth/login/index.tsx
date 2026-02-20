import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LeftIcon, RightCircle } from './sections/loginBackgroundIcons';
import LoginFormImage from './sections/LoginFormImage';
import LoginForm from './sections/loginForm';
import ForgotPasswordForm from './sections/forgotPasswordForm';

const LoginPage: React.FC = () => {
  const location = useLocation();
  const isForgotPassword = location.pathname === '/forgot-password';

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

      <div className="flex flex-col lg:flex-row max-w-5xl w-full bg-white rounded-lg overflow-hidden">
        {isForgotPassword ? <ForgotPasswordForm /> : <LoginForm />}
        <LoginFormImage />
      </div>
    </div>
  );
};

export default LoginPage;