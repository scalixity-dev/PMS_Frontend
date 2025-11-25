import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../../../../services/auth.service';

const OAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const success = searchParams.get('success');
  const userId = searchParams.get('userId');
  const error = searchParams.get('error');

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const handleCallback = async () => {
      if (error || success !== 'true' || !userId) {
        // OAuth failed or missing params
        navigate('/login', { 
          state: { error: error || 'Authentication failed' },
          replace: true 
        });
        return;
      }

      try {
        // Get current user to check their status
        const user = await authService.getCurrentUser();
        
        // Check if user needs additional info (new OAuth signup)
        const needsAdditionalInfo = !user.country || !user.address || !user.phoneNumber;
        
        if (needsAdditionalInfo) {
          // New OAuth signup - redirect to simplified registration form
          navigate(`/signup/oauth-complete?userId=${userId}&email=${encodeURIComponent(user.email)}&fullName=${encodeURIComponent(user.fullName || '')}`, {
            replace: true
          });
        } else {
          
          navigate('/dashboard', { replace: true });
        }
      } catch (err) {
        console.error('Error handling OAuth callback:', err);
        // Check if error is due to no subscription (user exists but needs to select plan)
        const errorMessage = err instanceof Error ? err.message : '';
        if (errorMessage.includes('subscription') || errorMessage.includes('activate')) {
          // User exists but needs subscription - redirect to pricing
          navigate(`/pricing?userId=${userId}&oauth=true`, {
            replace: true
          });
        } else {
          // New user or other error - redirect to completion form
          navigate(`/signup/oauth-complete?userId=${userId}`, {
            replace: true
          });
        }
      }
    };

    handleCallback();
  }, [success, userId, error, navigate]);

  // Show loading state while processing
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;

