import { API_BASE_URL } from '../config/api.config';

/**
 * Lightweight analytics client. Posts events to /api/v1/analytics/track.
 * Buffers in-memory and flushes every 3s OR on visibility change OR on threshold.
 *
 * Usage:
 *   track('cta_click', 'engagement', { label: 'add_property' });
 *   trackPageView('/dashboard/properties');
 */

interface EventPayload {
  eventName: string;
  eventCategory?: string;
  properties?: Record<string, unknown>;
  sessionId: string;
}

const SESSION_KEY = 'pms_session_id';
const FLUSH_INTERVAL_MS = 3000;
const MAX_BUFFER = 20;

function getSessionId(): string {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored) return stored;
    const fresh: string = (crypto as any).randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_KEY, fresh);
    return fresh;
  } catch {
    return `${Date.now()}-fallback`;
  }
}

const buffer: EventPayload[] = [];
let flushTimer: number | null = null;
let inFlight: Promise<void> | null = null;

async function flush(): Promise<void> {
  if (buffer.length === 0) return inFlight ?? Promise.resolve();
  if (inFlight) return inFlight;

  const events = buffer.splice(0, buffer.length);
  const url = `${API_BASE_URL}/api/v1/analytics/track`;
  const body = JSON.stringify({ events });

  inFlight = (async () => {
    try {
      // sendBeacon is fire-and-forget — survives page unload. Falls back to fetch.
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        const blob = new Blob([body], { type: 'application/json' });
        const ok = navigator.sendBeacon(url, blob);
        if (ok) return;
      }
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body,
        keepalive: true,
      });
    } catch {
      // Drop on failure — analytics must never break the app.
    } finally {
      inFlight = null;
    }
  })();

  return inFlight;
}

function scheduleFlush() {
  if (flushTimer != null) return;
  flushTimer = window.setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_INTERVAL_MS);
}

if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') void flush();
  });
  window.addEventListener('pagehide', () => { void flush(); });
}

export function track(
  eventName: string,
  eventCategory?: string,
  properties?: Record<string, unknown>,
): void {
  if (!eventName) return;
  buffer.push({
    eventName,
    eventCategory,
    properties,
    sessionId: getSessionId(),
  });
  if (buffer.length >= MAX_BUFFER) {
    void flush();
  } else {
    scheduleFlush();
  }
}

export function trackPageView(path: string, extra?: Record<string, unknown>): void {
  track('page_view', 'navigation', {
    path,
    referrer: typeof document !== 'undefined' ? document.referrer : undefined,
    ...extra,
  });
}

export const analytics = { track, trackPageView, flush };
