import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusPill } from "./StatusPill";
import { formatMoney } from "../../../../../utils/currency.utils";

/**
 * Transaction Interface for type safety
 * Status values are aligned with StatusPill component expectations
 */
interface LeaseTransaction {
    id: string;
    status: "Active" | "Overdue" | "Paid" | "Partial";
    firstInvoice: string;
    category: string;
    nextInvoice: string;
    amount: number;
    currency: string;
    paidAmount?: number;
}

const ROWS_PER_PAGE = 5;

const getOutstandingAmount = (transaction: LeaseTransaction) => {
    const totalAmount = Math.abs(transaction.amount);
    let paidAmount = 0;
    if (transaction.status === 'Paid') {
        paidAmount = totalAmount;
    } else if (transaction.status === 'Partial') {
        paidAmount = transaction.paidAmount ?? 0;
    }
    return Math.max(0, totalAmount - paidAmount);
};

/**
 * Format date to "DD MMM" format
 */
const formatDateShort = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    } catch {
        return dateString;
    }
};

/**
 * Calculate next invoice date (for recurring transactions)
 */
const getNextInvoiceDate = (dueDate: string, schedule: string): string => {
    try {
        const date = new Date(dueDate);
        if (schedule === 'Monthly') {
            date.setMonth(date.getMonth() + 1);
        }
        return formatDateShort(date.toISOString());
    } catch {
        return formatDateShort(dueDate);
    }
};

export interface LeaseTransactionsTableProps {
    transactions?: any[]; // Backend transaction format
}

/**
 * LeaseTransactionsTable
 * A table component styled to match the main UserDashboard's TransactionTable style.
 */
export const LeaseTransactionsTable: React.FC<LeaseTransactionsTableProps> = ({ transactions: backendTransactions = [] }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Transform backend transactions to LeaseTransaction format
    const transactions = useMemo<LeaseTransaction[]>(() => {
        if (!backendTransactions || backendTransactions.length === 0) return [];

        return backendTransactions.map((tx: any) => {
            // Map status from backend to frontend format
            const statusMap: Record<string, 'Active' | 'Overdue' | 'Paid' | 'Partial'> = {
                'Pending': 'Active',
                'Paid': 'Paid',
                'Void': 'Active',
                'PARTIALLY_PAID': 'Partial',
                'PENDING': 'Active',
                'PAID': 'Paid',
                'VOID': 'Active',
                'REFUNDED': 'Paid'
            };

            let status: 'Active' | 'Overdue' | 'Paid' | 'Partial' = statusMap[tx.status] || 'Active';
            
            // Check if overdue
            if (status === 'Active' && tx.dueDateRaw) {
                const dueDate = new Date(tx.dueDateRaw);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                dueDate.setHours(0, 0, 0, 0);
                const amount = tx.total || parseFloat(tx.amount || '0');
                const balance = tx.balance || 0;
                if (dueDate < today && balance > 0) {
                    status = 'Overdue';
                }
            }

            const amount = tx.total || parseFloat(tx.amount || '0');
            const balance = tx.balance || 0;
            const paidAmount = amount - balance;
            const dueDate = tx.dueDateRaw || tx.dueDate || new Date().toISOString();
            const schedule = tx.schedule || (tx.isRecurring ? 'Monthly' : 'One-time');

            return {
                id: tx.id,
                status,
                firstInvoice: formatDateShort(dueDate),
                category: tx.category || 'General',
                nextInvoice: schedule === 'Monthly' ? getNextInvoiceDate(dueDate, schedule) : formatDateShort(dueDate),
                amount: -Math.abs(amount), // Negative for expenses
                currency: tx.currency || 'USD',
                paidAmount: status === 'Partial' ? paidAmount : undefined
            };
        });
    }, [backendTransactions]);

    // Reset to first page when transactions change
    useEffect(() => {
        setCurrentPage(1);
    }, [backendTransactions]);

    // Calculate pagination
    const totalPages = Math.ceil(transactions.length / ROWS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = startIndex + ROWS_PER_PAGE;
        return transactions.slice(startIndex, endIndex);
    }, [transactions, currentPage]);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="flex flex-col mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500 md:bg-white md:rounded-[1rem] md:shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] md:border md:border-gray-200">
            {/* Desktop Table View */}
            <div className="hidden md:flex flex-col">
                {/* Table Header */}
                <div className="bg-[var(--dashboard-accent)] flex justify-between px-10 py-3 rounded-t-[1rem]">
                    <span className="text-white font-normal text-lg flex-1">Status</span>
                    <span className="text-white font-normal text-lg flex-1 text-center">First Invoice</span>
                    <span className="text-white font-normal text-lg flex-1 text-center">Category</span>
                    <span className="text-white font-normal text-lg flex-1 text-center">Next Invoice</span>
                    <span className="text-white font-normal text-lg flex-[1.5] text-right">Total</span>
                </div>

                {/* Table Body */}
                <div className="flex flex-col">
                    {paginatedTransactions.length > 0 ? (
                        paginatedTransactions.map((item, index) => (
                            <div
                                key={item.id}
                                className={`flex items-center px-8 py-3 ${index !== paginatedTransactions.length - 1 ? 'border-b border-gray-100' : ''}`}
                            >
                                <div className="flex-1">
                                    <StatusPill status={item.status} />
                                </div>
                                <div className="flex-1 text-center text-[var(--dashboard-text-main)] font-semibold text-sm">
                                    {item.firstInvoice}
                                </div>
                                <div className="flex-1 text-center text-[var(--dashboard-text-main)] font-semibold text-sm">
                                    {item.category}
                                </div>
                                <div className="flex-1 text-center text-[var(--dashboard-text-main)] font-semibold text-sm">
                                    {item.nextInvoice}
                                </div>
                                <div className="flex-[1.5] flex justify-end items-center gap-4">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[var(--dashboard-text-main)] font-medium text-base">
                                            {item.amount < 0 ? '-' : ''} {formatMoney(Math.abs(item.amount), item.currency)}
                                        </span>
                                        {getOutstandingAmount(item) > 0 && (
                                            <span className="text-[#FF2D55] font-semibold text-xs">
                                                Outstanding: {formatMoney(getOutstandingAmount(item), item.currency)}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-gray-400 font-bold text-xs tracking-widest min-w-[30px]">{item.currency}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-8 py-12 text-center text-gray-400 font-medium">
                            No transactions found.
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="flex md:hidden flex-col gap-4">
                {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-white p-5 rounded-2xl border border-gray-200 shadow-[0_2px_12px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] hover:border-[var(--dashboard-accent)] transition-all duration-300 space-y-5"
                        >
                            {/* Header: Status and Amount */}
                            <div className="flex justify-between items-start">
                                <StatusPill status={item.status} />
                                <div className="text-right">
                                    <div className="text-[var(--dashboard-text-main)] font-semibold text-lg tracking-tight">
                                        {item.amount < 0 ? '-' : ''} {formatMoney(Math.abs(item.amount), item.currency)}
                                    </div>
                                    {getOutstandingAmount(item) > 0 && (
                                        <div className="text-[#FF2D55] font-medium text-xs mt-1">
                                            Outstanding: {formatMoney(getOutstandingAmount(item), item.currency)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content Grid */}
                            <div className="grid grid-cols-2 gap-y-4 gap-x-2 pt-2">
                                {/* First Invoice */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">First Invoice</span>
                                    <span className="text-[var(--dashboard-text-main)] font-semibold text-sm">
                                        {item.firstInvoice}
                                    </span>
                                </div>

                                {/* Next Invoice */}
                                <div className="flex flex-col gap-1">
                                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Next Invoice</span>
                                    <span className="text-[var(--dashboard-text-main)] font-semibold text-sm">
                                        {item.nextInvoice}
                                    </span>
                                </div>

                                {/* Category */}
                                <div className="col-span-2 flex flex-col gap-1 pt-2 border-t border-dashed border-gray-100 mt-1">
                                    <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Category</span>
                                    <span className="text-[var(--dashboard-text-main)] font-semibold text-sm truncate">
                                        {item.category}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-8 text-center text-gray-400 font-medium">
                        No transactions found.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {transactions.length > ROWS_PER_PAGE && (
                <div className="px-8 py-4 md:border-t border-gray-200 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full transition-colors ${currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all ${currentPage === page
                                ? 'bg-[#3A7D76] text-white shadow-lg'
                                : 'bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-full transition-colors ${currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}
        </div>
    );
};
