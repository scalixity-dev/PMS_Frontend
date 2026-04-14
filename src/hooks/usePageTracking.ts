import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../lib/analytics';

/**
 * Mount-once hook in the app root. Fires a `page_view` event each time the
 * route pathname changes. Skips initial duplicates if React strict-mode
 * double-mounts the root.
 */
export function usePageTracking() {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname + location.search;
    if (lastPath.current === path) return;
    lastPath.current = path;
    trackPageView(path);
  }, [location.pathname, location.search]);
}
