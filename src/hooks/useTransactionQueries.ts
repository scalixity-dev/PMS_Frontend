import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  transactionService,
  type BackendTransaction,
  type CreateIncomeInvoiceDto,
  type CreateExpenseInvoiceDto,
  type CreateRecurringIncomeDto,
  type CreateDepositDto,
  type CreateCreditDto,
  type ReturnableDeposit,
  type ReturnDepositDto,
  type ApplicableInvoice,
  type AvailableDepositCredit,
  type ApplyDepositCreditDto,
} from '../services/transaction.service';

// Query keys for React Query
export const transactionQueryKeys = {
  all: ['transactions'] as const,
  lists: () => [...transactionQueryKeys.all, 'list'] as const,
  list: (filters?: any) => [...transactionQueryKeys.lists(), filters] as const,
  details: () => [...transactionQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...transactionQueryKeys.details(), id] as const,
  byProperty: (propertyId: string) => [...transactionQueryKeys.all, 'property', propertyId] as const,
  byType: (type: string) => [...transactionQueryKeys.all, 'type', type] as const,
};

/**
 * Hook to create a new income invoice
 */
export const useCreateIncomeInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceData,
      file,
    }: {
      invoiceData: CreateIncomeInvoiceDto;
      file?: File;
    }): Promise<BackendTransaction> => {
      return transactionService.createIncomeInvoice(invoiceData, file);
    },
    onSuccess: (data) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate property-specific transactions
      if (data.propertyId) {
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.byProperty(data.propertyId),
        });
      }
      // Invalidate type-specific transactions
      queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.byType(data.type),
      });
      // Cache the newly created transaction
      queryClient.setQueryData(transactionQueryKeys.detail(data.id), data);
      // Invalidate tags to refresh suggestions
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'tags'] });
    },
  });
};

/**
 * Hook to create a new expense invoice
 */
export const useCreateExpenseInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      invoiceData,
      file,
    }: {
      invoiceData: CreateExpenseInvoiceDto;
      file?: File;
    }): Promise<BackendTransaction> => {
      return transactionService.createExpenseInvoice(invoiceData, file);
    },
    onSuccess: (data) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate property-specific transactions
      if (data.propertyId) {
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.byProperty(data.propertyId),
        });
      }
      // Invalidate type-specific transactions
      queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.byType(data.type),
      });
      // Cache the newly created transaction
      queryClient.setQueryData(transactionQueryKeys.detail(data.id), data);
      // Invalidate tags to refresh suggestions
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'tags'] });
    },
  });
};

/**
 * Hook to get all transaction tags
 */
export const useGetTransactionTags = () => {
  return useQuery({
    queryKey: [...transactionQueryKeys.all, 'tags'],
    queryFn: () => transactionService.getTags(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 1,
  });
};

/**
 * Hook to get all payments
 */
export const useGetPayments = () => {
  return useQuery({
    queryKey: [...transactionQueryKeys.all, 'payments'],
    queryFn: () => transactionService.getPayments(),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get all transactions
 */
export const useGetTransactions = () => {
  return useQuery({
    queryKey: transactionQueryKeys.lists(),
    queryFn: () => transactionService.getTransactions(),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to get all recurring transactions
 */
export const useGetRecurringTransactions = () => {
  return useQuery({
    queryKey: [...transactionQueryKeys.all, 'recurring'],
    queryFn: () => transactionService.getRecurringTransactions(),
    staleTime: 2 * 60 * 1000, // Cache for 2 minutes
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    retry: 1,
  });
};

/**
 * Hook to mark a transaction as paid
 */
export const useMarkAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      data,
      file,
    }: {
      transactionId: string;
      data: {
        datePaid: string;
        amountPaid: number;
        method: string;
        paymentDetails?: string;
        referenceNumber?: string;
        notes?: string;
      };
      file?: File;
    }): Promise<BackendTransaction> => {
      return transactionService.markAsPaid(transactionId, data, file);
    },
    onSuccess: (data) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate payments list
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'payments'] });
      // Invalidate property-specific transactions
      if (data.propertyId) {
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.byProperty(data.propertyId),
        });
      }
      // Invalidate type-specific transactions
      queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.byType(data.type),
      });
      // Update the specific transaction in cache
      queryClient.setQueryData(transactionQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to create a recurring income transaction
 */
export const useCreateRecurringIncome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recurringData: CreateRecurringIncomeDto): Promise<any> => {
      return transactionService.createRecurringIncome(recurringData);
    },
    onSuccess: () => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate tags to refresh suggestions
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'tags'] });
    },
  });
};

/**
 * Hook to create a deposit transaction
 */
export const useCreateDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      depositData,
      file,
    }: {
      depositData: CreateDepositDto;
      file?: File;
    }): Promise<BackendTransaction> => {
      return transactionService.createDeposit(depositData, file);
    },
    onSuccess: (data) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate property-specific transactions
      if (data.propertyId) {
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.byProperty(data.propertyId),
        });
      }
      // Invalidate type-specific transactions
      queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.byType(data.type),
      });
      // Cache the newly created transaction
      queryClient.setQueryData(transactionQueryKeys.detail(data.id), data);
      // Invalidate tags to refresh suggestions
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'tags'] });
    },
  });
};

/**
 * Hook to create a credit transaction
 */
export const useCreateCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      creditData,
      file,
    }: {
      creditData: CreateCreditDto;
      file?: File;
    }): Promise<BackendTransaction> => {
      return transactionService.createCredit(creditData, file);
    },
    onSuccess: (data) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate property-specific transactions
      if (data.propertyId) {
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.byProperty(data.propertyId),
        });
      }
      // Invalidate type-specific transactions
      queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.byType(data.type),
      });
      // Cache the newly created transaction
      queryClient.setQueryData(transactionQueryKeys.detail(data.id), data);
      // Invalidate tags to refresh suggestions
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'tags'] });
    },
  });
};

/**
 * Hook to delete a transaction
 */
export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId: string): Promise<void> => {
      return transactionService.deleteTransaction(transactionId);
    },
    onSuccess: (_, transactionId) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate payments list
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'payments'] });
      // Remove the deleted transaction from cache
      queryClient.removeQueries({ queryKey: transactionQueryKeys.detail(transactionId) });
      // Invalidate all type-specific and property-specific queries
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
    },
  });
};

/**
 * Hook to get returnable deposits
 */
export const useGetReturnableDeposits = (params?: {
  payerId?: string;
  contactId?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: [...transactionQueryKeys.all, 'returnable-deposits', params],
    queryFn: () => transactionService.getReturnableDeposits(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    enabled: true, // Always enabled, params can be undefined
  });
};

/**
 * Hook to return a deposit
 */
export const useReturnDeposit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      returnData,
      file,
    }: {
      returnData: ReturnDepositDto;
      file?: File;
    }): Promise<{ deposit: BackendTransaction; refundTransaction: BackendTransaction }> => {
      return transactionService.returnDeposit(returnData, file);
    },
    onSuccess: () => {
      // Invalidate all transaction-related queries
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'returnable-deposits'] });
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'payments'] });
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.all });
    },
  });
};

/**
 * Hook to get applicable invoices (invoices that can have deposits/credits applied)
 */
export const useGetApplicableInvoices = (
  payerId?: string | null,
  contactId?: string | null,
  leaseId?: string | null,
) => {
  return useQuery({
    queryKey: [...transactionQueryKeys.all, 'applicable-invoices', payerId, contactId, leaseId],
    queryFn: () =>
      transactionService.getApplicableInvoices(
        payerId || undefined,
        contactId || undefined,
        leaseId || undefined,
      ),
    enabled: !!(payerId || contactId),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to get available deposits and credits
 */
export const useGetAvailableDepositsAndCredits = (
  payerId?: string | null,
  contactId?: string | null,
  leaseId?: string | null,
) => {
  return useQuery({
    queryKey: [...transactionQueryKeys.all, 'available-deposits-credits', payerId, contactId, leaseId],
    queryFn: () =>
      transactionService.getAvailableDepositsAndCredits(
        payerId || undefined,
        contactId || undefined,
        leaseId || undefined,
      ),
    enabled: !!(payerId || contactId),
    staleTime: 30 * 1000,
    gcTime: 2 * 60 * 1000,
  });
};

/**
 * Hook to apply deposits/credits to invoices
 */
export const useApplyDepositCredit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applyData,
      file,
    }: {
      applyData: ApplyDepositCreditDto;
      file?: File;
    }): Promise<{ message: string; applications: any[] }> => {
      return transactionService.applyDepositCredit(applyData, file);
    },
    onSuccess: () => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate applicable invoices and available deposits/credits
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'applicable-invoices'] });
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'available-deposits-credits'] });
    },
  });
};

/**
 * Hook to get a single transaction by ID
 */
export const useGetTransaction = (transactionId: string | undefined) => {
  return useQuery({
    queryKey: transactionQueryKeys.detail(transactionId || ''),
    queryFn: () => {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }
      return transactionService.getTransactionById(transactionId);
    },
    enabled: !!transactionId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};

/**
 * Hook to update a transaction
 */
export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      updateData,
      file,
    }: {
      transactionId: string;
      updateData: {
        category?: string;
        subcategory?: string;
        amount?: number;
        dueDate?: string;
        details?: string;
        notes?: string;
        tags?: string[];
      };
      file?: File;
    }): Promise<BackendTransaction> => {
      return transactionService.updateTransaction(transactionId, updateData, file);
    },
    onSuccess: (data) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Update the specific transaction in cache
      queryClient.setQueryData(transactionQueryKeys.detail(data.id), data);
      // Invalidate property-specific and type-specific queries
      if (data.propertyId) {
        queryClient.invalidateQueries({
          queryKey: transactionQueryKeys.byProperty(data.propertyId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: transactionQueryKeys.byType(data.type),
      });
    },
  });
};

/**
 * Hook to update transaction discount
 */
export const useUpdateDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      discount,
      file,
    }: {
      transactionId: string;
      discount: number;
      file?: File;
    }): Promise<BackendTransaction> => {
      return transactionService.updateDiscount(transactionId, discount, file);
    },
    onSuccess: (data) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Update the specific transaction in cache
      queryClient.setQueryData(transactionQueryKeys.detail(data.id), data);
    },
  });
};

/**
 * Hook to void a transaction
 */
export const useVoidTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      reason,
      file,
    }: {
      transactionId: string;
      reason: string;
      file?: File;
    }): Promise<BackendTransaction> => {
      return transactionService.voidTransaction(transactionId, reason, file);
    },
    onSuccess: (data) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Update the specific transaction in cache
      queryClient.setQueryData(transactionQueryKeys.detail(data.id), data);
      // Invalidate payments list
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'payments'] });
    },
  });
};

/**
 * Hook to update a payment
 */
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      paymentId,
      updateData,
      file,
    }: {
      transactionId: string;
      paymentId: string;
      updateData: {
        amount?: number;
        paymentDate?: string;
        method?: string;
        paymentDetails?: string;
        referenceNumber?: string;
        notes?: string;
      };
      file?: File;
    }): Promise<any> => {
      return transactionService.updatePayment(transactionId, paymentId, updateData, file);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate payments list
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'payments'] });
      // Invalidate the specific transaction
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.detail(variables.transactionId) });
    },
  });
};

/**
 * Hook to delete a payment
 */
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      transactionId,
      paymentId,
    }: {
      transactionId: string;
      paymentId: string;
    }): Promise<void> => {
      return transactionService.deletePayment(transactionId, paymentId);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch transactions list
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.lists() });
      // Invalidate payments list
      queryClient.invalidateQueries({ queryKey: [...transactionQueryKeys.all, 'payments'] });
      // Invalidate the specific transaction
      queryClient.invalidateQueries({ queryKey: transactionQueryKeys.detail(variables.transactionId) });
    },
  });
};
