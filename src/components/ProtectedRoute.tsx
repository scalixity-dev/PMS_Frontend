import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

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

        // Verify user is property manager (or has property manager role) and account is active
        // Role might be 'PROPERTY_MANAGER', 'property_manager', or similar variations
        const isPropertyManager = user.role && (
          user.role.toUpperCase() === 'PROPERTY_MANAGER' ||
          user.role.toLowerCase() === 'property_manager' ||
          user.role === 'property_manager'
        );

        console.log('ProtectedRoute: Validation results:', {
          isPropertyManager,
          isActive: user.isActive,
          isEmailVerified: user.isEmailVerified
        });

        // User must be:
        // 1. Property manager
        // 2. Account must be active (isActive = true)
        // 3. Email must be verified (isEmailVerified = true)
        // Note: Backend JwtAuthGuard already checks for active subscription,
        // so if getCurrentUser succeeds, user has an active subscription
        if (isPropertyManager && user.isActive && user.isEmailVerified) {
          console.log('ProtectedRoute: Authentication successful');
          setIsAuthenticated(true);
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const ServiceProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('ServiceProtectedRoute: Checking authentication...');
        const user = await authService.getCurrentUser();
        const isServicePro = user.role && user.role.toUpperCase() === 'SERVICE_PRO';

        if (isServicePro && user.isActive && user.isEmailVerified) {
          console.log('ServiceProtectedRoute: Authentication successful');
          setIsAuthenticated(true);
        } else {
          console.warn('ServiceProtectedRoute: Authentication failed - user does not meet requirements');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('ServiceProtectedRoute: Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

