import { create } from 'zustand';

/**
 * Represents transaction data that can be cloned or used to pre-fill forms.
 * All fields are optional since different components may provide partial data.
 */
export interface TransactionData {
    // Basic transaction info
    id?: string;
    transactionId?: string;
    amount?: string;
    date?: string;
    status?: string;
    
    // Parties involved
    user?: string;
    payer?: string;
    payee?: string;
    
    // Classification
    category?: string;
    type?: string;
    
    // Related entities
    property?: string;
    lease?: string;
    tags?: string;
    
    // Additional information
    details?: string;
}

/**
 * Represents payment data used in payment modals.
 * All fields are optional since different contexts may provide partial data.
 */
export interface PaymentData {
    id?: number | string;
    paymentId?: string;
    status?: string;
    datePaid?: string;
    date?: string;
    category?: string;
    property?: string;
    contact?: string;
    amount?: number | string;
    type?: string;
    method?: string;
    details?: string;
}

interface TransactionStoreState {
    // Modal Visibility States
    isEditPaymentModalOpen: boolean;
    isRefundModalOpen: boolean;
    isDeleteModalOpen: boolean;
    isMarkAsPaidOpen: boolean;
    isApplyDepositsOpen: boolean;
    isApplyCreditsOpen: boolean;
    isAddDiscountOpen: boolean;
    isDeleteTransactionOpen: boolean;
    isEditInvoiceOpen: boolean;
    isVoidModalOpen: boolean;
    isCloneTransactionOpen: boolean; // Just in case, though it's a page

    // Selected Data States
    selectedPayment: PaymentData | null;
    clonedTransactionData: TransactionData | null;
    editingTransactionData: TransactionData | null;
    markAsPaidData: { amount?: string; date?: Date } | null;
    selectedTransactionId: number | string | null;

    // Actions
    setEditPaymentModalOpen: (isOpen: boolean) => void;
    setRefundModalOpen: (isOpen: boolean) => void;
    setDeleteModalOpen: (isOpen: boolean) => void;
    setMarkAsPaidOpen: (isOpen: boolean) => void;
    setApplyDepositsOpen: (isOpen: boolean) => void;
    setApplyCreditsOpen: (isOpen: boolean) => void;
    setAddDiscountOpen: (isOpen: boolean) => void;
    setDeleteTransactionOpen: (isOpen: boolean) => void;
    setEditInvoiceOpen: (isOpen: boolean) => void;
    setVoidModalOpen: (isOpen: boolean) => void;

    setSelectedPayment: (payment: PaymentData | null) => void;
    setClonedTransactionData: (data: TransactionData | null) => void;
    setEditingTransactionData: (data: TransactionData | null) => void;
    setMarkAsPaidData: (data: { amount?: string; date?: Date } | null) => void;
    setSelectedTransactionId: (id: number | string | null) => void;

    // Helper to close all (optional)
    closeAllModals: () => void;
}

export const useTransactionStore = create<TransactionStoreState>((set) => ({
    // Initial States
    isEditPaymentModalOpen: false,
    isRefundModalOpen: false,
    isDeleteModalOpen: false,
    isMarkAsPaidOpen: false,
    isApplyDepositsOpen: false,
    isApplyCreditsOpen: false,
    isAddDiscountOpen: false,
    isDeleteTransactionOpen: false,
    isEditInvoiceOpen: false,
    isVoidModalOpen: false,
    isCloneTransactionOpen: false,

    selectedPayment: null,
    clonedTransactionData: null,
    editingTransactionData: null,
    markAsPaidData: null,
    selectedTransactionId: null,

    // Setters
    setEditPaymentModalOpen: (isOpen) => set({ isEditPaymentModalOpen: isOpen }),
    setRefundModalOpen: (isOpen) => set({ isRefundModalOpen: isOpen }),
    setDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),
    setMarkAsPaidOpen: (isOpen) => set({ isMarkAsPaidOpen: isOpen }),
    setApplyDepositsOpen: (isOpen) => set({ isApplyDepositsOpen: isOpen }),
    setApplyCreditsOpen: (isOpen) => set({ isApplyCreditsOpen: isOpen }),
    setAddDiscountOpen: (isOpen) => set({ isAddDiscountOpen: isOpen }),
    setDeleteTransactionOpen: (isOpen) => set({ isDeleteTransactionOpen: isOpen }),
    setEditInvoiceOpen: (isOpen) => set({ isEditInvoiceOpen: isOpen }),
    setVoidModalOpen: (isOpen) => set({ isVoidModalOpen: isOpen }),

    setSelectedPayment: (payment) => set({ selectedPayment: payment }),
    setClonedTransactionData: (data) => set({ clonedTransactionData: data }),
    setEditingTransactionData: (data) => set({ editingTransactionData: data }),
    setMarkAsPaidData: (data) => set({ markAsPaidData: data }),
    setSelectedTransactionId: (id) => set({ selectedTransactionId: id }),

    closeAllModals: () => set({
        isEditPaymentModalOpen: false,
        isRefundModalOpen: false,
        isDeleteModalOpen: false,
        isMarkAsPaidOpen: false,
        isApplyDepositsOpen: false,
        isApplyCreditsOpen: false,
        isAddDiscountOpen: false,
        isDeleteTransactionOpen: false,
        isEditInvoiceOpen: false,
        isVoidModalOpen: false,
    }),
}));
