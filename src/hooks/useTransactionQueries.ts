import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  transactionService,
  type BackendTransaction,
  type CreateIncomeInvoiceDto,
  type CreateExpenseInvoiceDto,
  type CreateRecurringIncomeDto,
  type CreateDepositDto,
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
