import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { API_ENDPOINTS } from '../config/api.config';

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, { credentials: 'include', ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || res.statusText);
  }
  return res.json();
}

export const twoFactorQueryKeys = {
  status: () => ['2fa', 'status'] as const,
};

export const useGet2FAStatus = () =>
  useQuery({
    queryKey: twoFactorQueryKeys.status(),
    queryFn: () => apiFetch(API_ENDPOINTS.TWO_FACTOR.STATUS),
    staleTime: 60 * 1000,
  });

export const useSend2FACode = () =>
  useMutation({
    mutationFn: () =>
      apiFetch(API_ENDPOINTS.TWO_FACTOR.SEND_CODE, { method: 'POST' }),
  });

export const useVerify2FACode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ code, intent }: { code: string; intent: 'enable' | 'disable' }) =>
      apiFetch(API_ENDPOINTS.TWO_FACTOR.VERIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, intent }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: twoFactorQueryKeys.status() });
    },
  });
};
