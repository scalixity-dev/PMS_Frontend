import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { API_ENDPOINTS } from '../config/api.config';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const FullScreenLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
    <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600" />
  </div>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('ProtectedRoute: Checking authentication...');
        const user = await authService.getCurrentUser();
        console.log('ProtectedRoute: User retrieved:', {
          userId: user.userId,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified
        });

        const role = user.role?.toUpperCase();
        const isPropertyManager = role === 'PROPERTY_MANAGER';
        const isTeamMember = role === 'TEAM_MEMBER';

        console.log('ProtectedRoute: Validation results:', {
          role,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified
        });

        // Property managers need active + email verified
        // Team members only need active (email verified via invite flow)
        if ((isPropertyManager && user.isActive && user.isEmailVerified) ||
            (isTeamMember && user.isActive)) {
          console.log('ProtectedRoute: Authentication successful');
          setIsAuthenticated(true);
        } else if (isPropertyManager && user.isActive) {
          // May be a team member (email verified via invite flow, no subscription)
          try {
            const teamsRes = await fetch(API_ENDPOINTS.TEAM.MY_TEAMS, { credentials: 'include' });
            if (teamsRes.ok) {
              const teams = await teamsRes.json();
              if (Array.isArray(teams) && teams.length > 0) {
                setIsAuthenticated(true);
                return;
              }
            }
          } catch { /* fall through */ }
          setIsAuthenticated(false);
        } else {
          console.warn('ProtectedRoute: Authentication failed - user does not meet requirements');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('ProtectedRoute: Authentication check failed:', error);
        if (error instanceof Error) {
          console.error('Error message:', error.message);
          if (error.message.includes('401') || error.message.includes('Unauthorized')) {
            console.error('401 Unauthorized - No valid authentication token found');
          }
        }
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const TenantProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        const isTenant = user.role?.toUpperCase() === 'TENANT';
        setIsAuthenticated(isTenant && user.isActive);
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const ServiceProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Once authenticated in session storage, skip re-check for subsequent route
    // mounts. This prevents transient network errors on in-app navigation
    // (e.g. clicking Integrations/Chat) from kicking the user back to /login.
    const cached = sessionStorage.getItem('service_pro_authenticated');
    if (cached === 'true') {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    const checkAuth = async () => {
      try {
        console.log('ServiceProtectedRoute: Checking authentication...');
        const user = await authService.getCurrentUser();
        const isServicePro = user.role && user.role.toUpperCase() === 'SERVICE_PRO';

        if (isServicePro && user.isActive && user.isEmailVerified) {
          console.log('ServiceProtectedRoute: Authentication successful');
          sessionStorage.setItem('service_pro_authenticated', 'true');
          setIsAuthenticated(true);
        } else {
          console.warn('ServiceProtectedRoute: Authentication failed - user does not meet requirements');
          sessionStorage.removeItem('service_pro_authenticated');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('ServiceProtectedRoute: Authentication check failed:', error);
        // Only flip to unauthenticated on a genuine auth failure (401), not
        // on network hiccups. Treat thrown non-auth errors as "still logged in".
        const msg = (error as Error)?.message || '';
        if (/401|unauthor/i.test(msg)) {
          sessionStorage.removeItem('service_pro_authenticated');
          setIsAuthenticated(false);
        } else {
          // Transient error — keep session if we have one cached
          const cachedRetry = sessionStorage.getItem('service_pro_authenticated');
          setIsAuthenticated(cachedRetry === 'true');
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return <FullScreenLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const GuestRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [status, setStatus] = useState<'checking' | 'guest' | 'authenticated'>('checking');
  const [redirectTo, setRedirectTo] = useState('/dashboard');

  useEffect(() => {
    authService.getCurrentUser().then((user) => {
      const role = user?.role?.toUpperCase();
      if (role === 'TENANT') {
        setRedirectTo('/userdashboard');
        setStatus('authenticated');
      } else if (role === 'SERVICE_PRO') {
        setRedirectTo('/service-dashboard');
        setStatus('authenticated');
      } else if (role === 'PROPERTY_MANAGER' || role === 'TEAM_MEMBER') {
        setRedirectTo('/dashboard');
        setStatus('authenticated');
      } else {
        setStatus('guest');
      }
    }).catch(() => setStatus('guest'));
  }, []);

  if (status === 'checking') return <FullScreenLoader />;
  if (status === 'authenticated') return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
};
