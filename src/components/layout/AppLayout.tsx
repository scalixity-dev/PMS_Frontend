import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { authService } from '../../services/auth.service';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
};

// Legal/reference pages stay reachable while signed in (opened from links
// inside the dashboards, e.g. "Terms of Service" at the bottom of an
// application form). They carry the public marketing Navbar and Footer —
// Login/Sign up buttons, a newsletter signup, marketing nav links — which
// reads as "you got logged out" to an already signed-in tenant. Hide both
// for them on just these routes rather than touching every other AppLayout
// page, which is guarded by GuestRoute and never rendered to a signed-in
// user in the first place.
const PUBLIC_PAGES_REACHABLE_WHILE_SIGNED_IN = [
  '/terms-of-service',
  '/privacy-policy',
  '/cookie-policy',
  '/faq',
];

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authService
      .getCurrentUser()
      .then((user) => {
        if (!cancelled) setIsAuthenticated(!!user);
      })
      .catch(() => {
        if (!cancelled) setIsAuthenticated(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const hideMarketingChrome =
    isAuthenticated && PUBLIC_PAGES_REACHABLE_WHILE_SIGNED_IN.includes(pathname);

  return (
  <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      <ScrollToTop />
      {!hideMarketingChrome && <Navbar />}
      <main className="flex-1">
        {/* Page content (excluding header/footer) wrapped with uniform padding */}
        <div className="p-2">
          <Outlet />
        </div>
      </main>
      {!hideMarketingChrome && <Footer />}
    </div>
  );
};

export default AppLayout;
