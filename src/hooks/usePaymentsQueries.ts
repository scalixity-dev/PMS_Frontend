import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentsService, type SavedCard } from '../services/payments.service';

const cardsKey = ['payments', 'cards'] as const;

/**
 * List user's saved Stripe cards.
 */
export const useGetSavedCards = (enabled: boolean = true) => {
  return useQuery<SavedCard[]>({
    queryKey: cardsKey,
    queryFn: () => paymentsService.listCards(),
    enabled,
    staleTime: 60 * 1000,
  });
};

/**
 * Create SetupIntent — call before mounting Stripe Elements.
 */
export const useCreateSetupIntent = () => {
  return useMutation({
    mutationFn: () => paymentsService.createSetupIntent(),
  });
};

/**
 * Save a Stripe payment method to user (after client-side confirmSetup).
 */
export const useSaveCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentMethodId, setAsDefault }: { paymentMethodId: string; setAsDefault?: boolean }) =>
      paymentsService.saveCard(paymentMethodId, setAsDefault),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cardsKey });
    },
  });
};

/**
 * Mark a card as the default for charges.
 */
export const useSetDefaultCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => paymentsService.setDefaultCard(cardId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cardsKey });
    },
  });
};

/**
 * Delete a saved card.
 */
export const useDeleteCard = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (cardId: string) => paymentsService.deleteCard(cardId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: cardsKey });
    },
  });
};

/**
 * Create a PaymentIntent for charging the user.
 * If savedCardId provided → off-session charge.
 * Otherwise → returns clientSecret for Stripe Elements.
 */
export const useCreatePaymentIntent = () => {
  return useMutation({
    mutationFn: (params: {
      amount: number;
      currency?: string;
      savedCardId?: string;
      description?: string;
      metadata?: Record<string, string>;
    }) => paymentsService.createPaymentIntent(params),
  });
};

const connectStatusKey = ['payments', 'connect', 'status'] as const;

/**
 * Get Stripe Connect status for service provider.
 */
export const useConnectStatus = (enabled: boolean = true) => {
  return useQuery({
    queryKey: connectStatusKey,
    queryFn: () => paymentsService.getConnectStatus(),
    enabled,
    staleTime: 30 * 1000,
  });
};

/**
 * Create Stripe Connect Express onboarding link.
 */
export const useCreateConnectOnboarding = () => {
  return useMutation({
    mutationFn: ({ returnUrl, refreshUrl }: { returnUrl: string; refreshUrl: string }) =>
      paymentsService.createConnectOnboarding(returnUrl, refreshUrl),
  });
};

/**
 * Disconnect Stripe Connect account.
 */
export const useDisconnectConnect = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => paymentsService.disconnectConnect(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: connectStatusKey });
    },
  });
};
