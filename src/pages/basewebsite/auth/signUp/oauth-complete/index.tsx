import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { RegistrationForm } from '../sections/RegistrationForm';
import { Navigate } from 'react-router-dom';
import { useSignUpStore } from '../store/signUpStore';
import { authService } from '../../../../../services/auth.service';

const OAuthCompletePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userId = searchParams.get('userId');
  const email = searchParams.get('email') || '';
  const fullName = searchParams.get('fullName') || '';

  const { setFormData, setIsOAuthSignup, setUserId, resetForm } = useSignUpStore();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    if (!userId) return;

    // Initialize OAuth signup data
    resetForm(); // Reset form first
    setFormData({
      email: decodeURIComponent(email),
      fullName: decodeURIComponent(fullName),
      accountType: 'manage',
    });
    setIsOAuthSignup(true);
    setUserId(userId);

    // The role was chosen before the visitor left for Google and the account
    // was created with it, so read it back rather than assuming 'manage'.
    // Hardcoding it meant a tenant or service pro who signed up with Google was
    // shown the property-manager flow and sent to the plan screen.
    let cancelled = false;
    authService
      .getCurrentUser()
      .then((user) => {
        if (cancelled) return;
        const byRole: Record<string, 'manage' | 'renting' | 'fix'> = {
          PROPERTY_MANAGER: 'manage',
          TENANT: 'renting',
          SERVICE_PRO: 'fix',
        };
        const accountType = byRole[user.role?.toUpperCase() ?? ''];
        if (accountType) setFormData({ accountType });
      })
      .catch(() => {
        // Leave the default in place; the form still works and the backend
        // remains the authority on what this account actually is.
      });

    return () => {
      cancelled = true;
    };
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

