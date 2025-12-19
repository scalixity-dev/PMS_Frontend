import { create } from 'zustand';

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
    selectedPayment: { date: string; amount: string } | null;
    clonedTransactionData: any; // Using any for now to match component usage

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

    setSelectedPayment: (payment: { date: string; amount: string } | null) => void;
    setClonedTransactionData: (data: any) => void;

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
