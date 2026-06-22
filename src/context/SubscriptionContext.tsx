import React, { createContext, useContext, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscription.service';
import { useAuth } from './AuthContext';

interface SubscriptionContextValue {
  planId: string;
  planName: string;
  isLoading: boolean;
  refetch: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue>({
  planId: 'starter',
  planName: 'Starter',
  isLoading: false,
  refetch: () => {},
});

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const isPropertyManagerOrTeamMember =
    user?.role === 'PROPERTY_MANAGER' || user?.role === 'TEAM_MEMBER';

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['subscription', 'current'],
    queryFn: () => subscriptionService.getCurrent(),
    enabled: isPropertyManagerOrTeamMember,
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 1,
  });

  const value = useMemo<SubscriptionContextValue>(
    () => ({
      planId: data?.planId ?? 'starter',
      planName: data?.planName ?? 'Starter',
      isLoading,
      refetch,
    }),
    [data, isLoading, refetch],
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export function useSubscription(): SubscriptionContextValue {
  return useContext(SubscriptionContext);
}
