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
