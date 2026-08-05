import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscription.service';

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
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: () => subscriptionService.getCurrent(),
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: false,
  });

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
