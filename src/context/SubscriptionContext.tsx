import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscription.service';
import { authService } from '../services/auth.service';

interface SubscriptionContextValue {
  planId: string;
  planName: string;
  status: string;
  isTrialing: boolean;
  isExpired: boolean;
  daysLeftInTrial: number;
  trialEndsAt: string | null;
  isLoading: boolean;
  /**
   * False when this account has no subscription at all.
   *
   * `planId` falls back to 'starter' when the fetch returns nothing, and the
   * backend answers 404 for an account that never chose a plan - so planId
   * alone cannot tell "on Starter" apart from "has no plan", and reading it
   * would silently grant Starter features to someone who never picked one.
   * Gate on this before trusting planId.
   */
  hasPlan: boolean;
  refetch: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  planId: 'starter',
  planName: 'Starter',
  status: '',
  isTrialing: false,
  isExpired: false,
  daysLeftInTrial: 0,
  trialEndsAt: null,
  isLoading: false,
  hasPlan: false,
  refetch: () => {},
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  /**
   * Is anybody signed in?
   *
   * This provider wraps the whole route tree, marketing and auth pages
   * included, so without a gate the subscription request below fired for
   * anonymous visitors on every public page. It answered 401, the global
   * unauthorized interceptor read that as a dead session, and the visitor was
   * thrown to /login?sessionExpired=1 - which is what happened to anyone
   * choosing their role after signing up with Google.
   *
   * /auth/me is the app's own session probe and is excluded from that
   * interceptor, so it is safe to ask here. It resolves to null rather than
   * throwing, because "not logged in" is an ordinary answer on these pages.
   */
  const { data: sessionUser, isLoading: sessionLoading } = useQuery({
    queryKey: ['auth', 'session-probe'],
    queryFn: () => authService.getCurrentUser().catch(() => null),
    staleTime: 30 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  // Subscriptions only exist for property-manager accounts - tenants and
  // service pros never have a row, so asking for one just 404s. Gating on
  // role (not only "is anybody logged in") stops that pointless request on
  // every tenant/service-pro page.
  const isPropertyManager = sessionUser?.role === 'PROPERTY_MANAGER';

  const { data, isLoading: subscriptionLoading, refetch } = useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: () => subscriptionService.getCurrent(),
    enabled: isPropertyManager,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
  });

  // Still "loading" while the session probe is in flight, so a consumer never
  // briefly sees the no-plan state of a user who does in fact have one.
  const isLoading = sessionLoading || (isPropertyManager && subscriptionLoading);

  const value = useMemo<SubscriptionContextValue>(() => {
    const status = data?.status ?? '';
    const isTrialing = status === 'TRIALING';
    const isExpired = status === 'EXPIRED' || status === 'PAST_DUE' ||
      (isTrialing && !!data?.trialEndsAt && new Date(data.trialEndsAt) < new Date());

    return {
      planId: data?.planId ?? 'starter',
      planName: data?.planName ?? 'Starter',
      status,
      isTrialing: isTrialing && !isExpired,
      isExpired,
      daysLeftInTrial: data?.daysLeftInTrial ?? 0,
      trialEndsAt: data?.trialEndsAt ?? null,
      isLoading,
      // The query has retry:false and the backend 404s when there is no
      // subscription, so a missing planId here means "no plan", not "Starter".
      hasPlan: !!data?.planId,
      refetch,
    };
  }, [data, isLoading, refetch]);

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export function useSubscription(): SubscriptionContextValue {
  return useContext(SubscriptionContext);
}
