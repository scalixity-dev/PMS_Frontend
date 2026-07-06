import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { getRoleFavicon, tenantFavicon } from '../../utils/roleIcon';

/**
 * Swaps the browser tab favicon to match the logged-in user's role; falls back to the
 * tenant icon when logged out. Re-checks on every route change since login/logout in
 * this app navigate client-side rather than doing a full page reload.
 */
export const FaviconManager: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) return;

    authService
      .getCurrentUser()
      .then((user) => {
        link.href = getRoleFavicon(user?.role);
      })
      .catch(() => {
        link.href = tenantFavicon;
      });
  }, [location.pathname]);

  return null;
};

export default FaviconManager;
