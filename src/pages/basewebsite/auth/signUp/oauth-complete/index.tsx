import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RegistrationForm } from '../sections/RegistrationForm';
import { Navigate } from 'react-router-dom';
import { useSignUpStore } from '../store/signUpStore';

const OAuthCompletePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const email = searchParams.get('email') || '';
  const fullName = searchParams.get('fullName') || '';

  const { setFormData, setIsOAuthSignup, setUserId, resetForm } = useSignUpStore();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    
    // Initialize OAuth signup data
    if (userId) {
      resetForm(); // Reset form first
      setFormData({
        email: decodeURIComponent(email),
        fullName: decodeURIComponent(fullName),
        accountType: 'manage', // Default for OAuth signups
      });
      setIsOAuthSignup(true);
      setUserId(userId);
    }
  }, [userId, email, fullName, setFormData, setIsOAuthSignup, setUserId, resetForm]);

  if (!userId) {
    // Redirect if no userId
    navigate('/signup', { replace: true });
    return <Navigate to="/signup" replace />;
  }

  return (
    <RegistrationForm
      isOAuthSignup={true}
      userId={userId || undefined}
    />
  );
};

export default OAuthCompletePage;

