import { useCallback, useRef } from 'react';

/**
 * Returns a debounced version of the callback with leading-edge behavior:
 * fires immediately on first call, then blocks subsequent calls until
 * the delay has passed. Ideal for form submit buttons.
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay = 1000
): T {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  return useCallback((...args: Parameters<T>) => {
    if (timer.current) return;
    callbackRef.current(...args);
    timer.current = setTimeout(() => {
      timer.current = null;
    }, delay);
  }, [delay]) as T;
}
