import { useState, useMemo } from "react";
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
}

const ROWS_PER_PAGE = 5;

/**
 * LeaseTransactionsTable
 * A table component styled to match the main UserDashboard's TransactionTable style.
 */
export const LeaseTransactionsTable = () => {
    const [currentPage, setCurrentPage] = useState(1);

    // Mock data based on the provided image
    const transactions = useMemo<LeaseTransaction[]>(() => [
        {
            id: "1",
            status: "Active",
            firstInvoice: "17 Dec",
            category: "Rent",
            nextInvoice: "17 Dec",
            amount: -2611.00,
            currency: "INR"
        },
        {
            id: "2",
            status: "Overdue",
            firstInvoice: "15 Jan",
            category: "Utility Bill",
            nextInvoice: "15 Feb",
            amount: -850.50,
            currency: "INR"
        },
        {
            id: "3",
            status: "Paid",
            firstInvoice: "10 Dec",
            category: "Maintenance",
            nextInvoice: "10 Jan",
            amount: -1200.00,
            currency: "INR"
        }
    ], []);

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
        <div className="bg-white rounded-[1rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 flex flex-col mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                    <span className="text-[#FF2D55] font-semibold text-xs">
                                        {formatMoney(Math.abs(item.amount), item.currency)}
                                    </span>
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

            {/* Pagination */}
            {transactions.length > ROWS_PER_PAGE && (
                <div className="px-8 py-4 border-t border-gray-200 flex justify-center items-center gap-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-full transition-colors ${
                            currentPage === 1
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
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-medium transition-all ${
                                currentPage === page
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
                        className={`p-2 rounded-full transition-colors ${
                            currentPage === totalPages
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
