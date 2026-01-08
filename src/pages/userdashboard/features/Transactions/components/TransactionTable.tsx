import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Transaction } from "../../../utils/types";
import { TransactionRow } from "./TransactionRow";
import FilterDropdown from "@/components/ui/FilterDropdown";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionTableProps {
    transactions: Transaction[];
}

const TIME_FILTER_OPTIONS = [
    { label: "All Time", value: "all_time" },
    { label: "Today", value: "today" },
    { label: "This Week", value: "this_week" },
    { label: "This Month", value: "this_month" },
    { label: "Last Month", value: "last_month" },
];

// Helper function to parse date string "DD MMM, YYYY" format
const parseDate = (dateStr: string): Date | null => {
    try {
        const cleanDateStr = dateStr.trim();
        const parts = cleanDateStr.split(/[\s,]+/);

        if (parts.length >= 3) {
            const day = parseInt(parts[0]);
            const month = parts[1];
            const year = parseInt(parts[2]);

            const monthMap: Record<string, number> = {
                'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
                'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
            };

            const monthIndex = monthMap[month];
            if (monthIndex !== undefined) {
                return new Date(year, monthIndex, day);
            }
        }
        return null;
    } catch {
        return null;
    }
};

// Helper function to check if date matches filter
const matchesTimeFilter = (dateStr: string, filter: string): boolean => {
    const transactionDate = parseDate(dateStr);
    if (!transactionDate) return true; // If can't parse, show it

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    switch (filter) {
        case "today": {
            const transDate = new Date(transactionDate.getFullYear(), transactionDate.getMonth(), transactionDate.getDate());
            return transDate.getTime() === today.getTime();
        }
        case "this_week": {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
            return transactionDate >= weekStart && transactionDate <= weekEnd;
        }
        case "this_month": {
            return transactionDate.getMonth() === now.getMonth() &&
                transactionDate.getFullYear() === now.getFullYear();
        }
        case "last_month": {
            const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            return transactionDate.getMonth() === lastMonth.getMonth() &&
                transactionDate.getFullYear() === lastMonth.getFullYear();
        }
        case "all_time":
        default:
            return true;
    }
};

const ROWS_PER_PAGE = 5;

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
    const navigate = useNavigate();
    const [selectedTimeFilter, setSelectedTimeFilter] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleTimeFilterChange = (value: string | null) => {
        setSelectedTimeFilter(value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Filter transactions based on selected time period
    const filteredTransactions = useMemo(() => {
        if (!selectedTimeFilter || selectedTimeFilter === "all_time") {
            return transactions;
        }

        return transactions.filter(transaction =>
            matchesTimeFilter(transaction.dueDate, selectedTimeFilter)
        );
    }, [transactions, selectedTimeFilter]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredTransactions.length / ROWS_PER_PAGE);
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
        const endIndex = startIndex + ROWS_PER_PAGE;
        return filteredTransactions.slice(startIndex, endIndex);
    }, [filteredTransactions, currentPage]);

    // Reset to page 1 if current page is out of bounds
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [totalPages, currentPage]);

    // Get the display label for the current selection
    const selectedLabel = selectedTimeFilter 
        ? TIME_FILTER_OPTIONS.find(opt => opt.value === selectedTimeFilter)?.label || "All Time"
        : "All Time";

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="bg-white rounded-[1rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 flex flex-col">
            {/* Table Header */}
            <div className="bg-[var(--dashboard-accent)] flex justify-between px-10 py-3 rounded-t-[1rem]">
                <span className="text-white font-normal text-lg flex-[1.2]">Status</span>
                <span className="text-white font-normal text-lg flex-1 text-center">Due Date</span>
                <span className="text-white font-normal text-lg flex-1 text-center">Category</span>
                <span className="text-white font-normal text-lg flex-[2] text-center">Contact</span>
                <span className="text-white font-normal text-lg flex-[1.5] text-right">Total</span>
            </div>

            {/* Filter Section */}
            <div className="px-8 py-3 border-b border-gray-200 relative overflow-visible">
                <FilterDropdown
                    value={selectedTimeFilter}
                    options={TIME_FILTER_OPTIONS}
                    onSelect={handleTimeFilterChange}
                    placeholder={selectedLabel}
                    className="inline-block"
                />
            </div>

            {/* Table Body */}
            <div className="flex flex-col">
                {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction, index) => (
                        <TransactionRow
                            key={transaction.id}
                            transaction={transaction}
                            isLast={index === paginatedTransactions.length - 1}
                            onClick={() => navigate(`/userdashboard/transactions/${transaction.id}`)}
                        />
                    ))
                ) : (
                    <div className="px-8 py-12 text-center text-gray-400 font-medium">
                        No transactions found for the selected time period.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredTransactions.length > ROWS_PER_PAGE && (
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
