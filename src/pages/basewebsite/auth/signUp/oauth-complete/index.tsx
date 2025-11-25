import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RegistrationForm } from '../sections/RegistrationForm';
import type { RegisterFormData } from '../sections/signUpProps';
import { Navigate } from 'react-router-dom';

const OAuthCompletePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const email = searchParams.get('email') || '';
  const fullName = searchParams.get('fullName') || '';

  const [formData, setFormData] = useState<RegisterFormData>({
    email: decodeURIComponent(email),
    fullName: decodeURIComponent(fullName),
    accountType: 'manage', // Default for OAuth signups
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  if (!userId) {
    // Redirect if no userId
    navigate('/signup', { replace: true });
    return <Navigate to="/signup" replace />;
  }

  return (
    <RegistrationForm
      formData={formData}
      setFormData={setFormData}
      isOAuthSignup={true}
      userId={userId || undefined}
    />
  );
};

export default OAuthCompletePage;

