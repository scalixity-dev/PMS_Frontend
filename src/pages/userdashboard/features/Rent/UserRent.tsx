import React, { useMemo, useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import { useRentStore } from "./store/rentStore";
import { calculateOutstandingAmount } from "../../utils/financeUtils";
import { useDashboardStore } from "../../store/dashboardStore";
import { TransactionRow } from "../Transactions/components/TransactionRow";
import { TransactionCard } from "../Transactions/components/TransactionCard";
import { useGetTransactions } from "../../../../hooks/useTransactionQueries";
import type { Transaction } from "../../utils/types";

const ROWS_PER_PAGE = 10;

const Rent: React.FC = () => {
  const navigate = useNavigate();
  const { rentFilters, setRentFilters, resetRentFilters } = useRentStore();
  const { finances } = useDashboardStore();
  const { search: searchQuery, status: statusFilter, date: dateFilter, schedule: scheduleFilter } = rentFilters;
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch transactions from API
  const { data: backendTransactions, isLoading, error } = useGetTransactions();

  // Transform backend transactions to frontend format
  const transactions = useMemo<Transaction[]>(() => {
    if (!backendTransactions || !Array.isArray(backendTransactions)) return [];
    
    return backendTransactions.map((tx: any) => {
      // Map backend status to frontend status
      const statusMap: Record<string, 'Open' | 'Overdue' | 'Paid' | 'Partial'> = {
        'Pending': 'Open',
        'Paid': 'Paid',
        'Void': 'Open',
        'PARTIALLY_PAID': 'Partial',
        'PENDING': 'Open',
        'PAID': 'Paid',
        'VOID': 'Open',
        'REFUNDED': 'Paid'
      };

      let status: 'Open' | 'Overdue' | 'Paid' | 'Partial' = statusMap[tx.status] || 'Open';
      
      // Check if overdue
      if (status === 'Open' && tx.dueDateRaw) {
        const dueDate = new Date(tx.dueDateRaw);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        if (dueDate < today && tx.balance > 0) {
          status = 'Overdue';
        }
      } else if (tx.isOverdue && status === 'Open') {
        status = 'Overdue';
      }

      // Determine schedule (Monthly if recurring, otherwise One-time)
      const schedule: 'Monthly' | 'One-time' = tx.isRecurring || tx.type === 'RECURRING' ? 'Monthly' : 'One-time';

      // Get contact name
      const contactName = tx.contact || 'N/A';
      const initials = contactName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
      
      // Generate avatar color based on contact name
      const colors = ['#52D3A2', '#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#A8E6CF'];
      const colorIndex = contactName.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
      const avatarColor = colors[colorIndex % colors.length];

      // Calculate amount (negative for expenses/rent)
      const total = tx.total || parseFloat(tx.amount || '0');
      const balance = tx.balance || 0;
      const amount = -Math.abs(total); // Negative for rent/expenses
      const paidAmount = total - balance;

      // Format due date
      const dueDate = tx.dueDate || 'N/A';

      return {
        id: tx.id,
        status,
        dueDate,
        category: tx.category || 'General',
        contact: {
          name: contactName,
          initials,
          avatarColor
        },
        amount,
        paidAmount: paidAmount > 0 ? paidAmount : undefined,
        currency: tx.currency || 'INR',
        schedule
      };
    });
  }, [backendTransactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !transaction.contact.name.toLowerCase().includes(query) &&
          !transaction.category.toLowerCase().includes(query) &&
          !transaction.status.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter && transaction.status !== statusFilter) {
        return false;
      }

      // Date filter (simple month-based filtering)
      if (dateFilter) {
        let transactionMonth: number | null = null;
        if (transaction.dueDate && transaction.dueDate !== 'N/A') {
          // Try to parse the formatted date (e.g., "02 Jan, 2026")
          const dateStr = transaction.dueDate;
          try {
            if (dateStr.includes(',')) {
              // Format: "02 Jan, 2026"
              const parts = dateStr.split(',');
              const dayMonth = parts[0].trim().split(' ');
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              const monthIndex = monthNames.findIndex(m => m === dayMonth[1]);
              if (monthIndex !== -1) {
                transactionMonth = monthIndex;
              }
            }
            // Fallback to Date parsing if month name parsing fails
            if (transactionMonth === null) {
              const parsedDate = new Date(dateStr);
              if (!isNaN(parsedDate.getTime())) {
                transactionMonth = parsedDate.getMonth();
              }
            }
          } catch (e) {
            // If parsing fails, skip this transaction
            return false;
          }
        }
        
        if (transactionMonth === null) {
          return false; // Skip if no valid due date
        }
        
        const filterMonth = parseInt(dateFilter);
        if (transactionMonth !== filterMonth) {
          return false;
        }
      }

      // Schedule filter
      if (scheduleFilter && transaction.schedule !== scheduleFilter) {
        return false;
      }

      return true;
    });
  }, [transactions, searchQuery, statusFilter, dateFilter, scheduleFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredTransactions.length / ROWS_PER_PAGE);
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ROWS_PER_PAGE;
    const endIndex = startIndex + ROWS_PER_PAGE;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, dateFilter, scheduleFilter]);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Calculate outstanding amount from real transactions
  const outstandingAmountValue = useMemo(() => {
    if (finances.outstanding && finances.outstanding !== "0.00") {
      return parseFloat(finances.outstanding);
    }
    return calculateOutstandingAmount(transactions);
  }, [finances.outstanding, transactions]);


  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-full mx-auto p-4 md:p-8 space-y-4 md:space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--dashboard-accent)]" />
              <p className="text-gray-600">Loading transactions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-full mx-auto p-4 md:p-8 space-y-4 md:space-y-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-red-600 mb-2">Failed to load transactions</p>
              <p className="text-gray-600 text-sm">{error instanceof Error ? error.message : 'An error occurred'}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-full mx-auto p-4 md:p-8 space-y-4 md:space-y-6">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-base font-medium">
            <li>
              <Link to="/userdashboard" className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity">Dashboard</Link>
            </li>
            <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">/</li>
            <li className="text-[#1A1A1A]  font-medium" aria-current="page">Accounting</li>
          </ol>
        </nav>

        {/* Header Card */}
        <div className="bg-[#F4F4F4] border border-[#E5E7EB] rounded-lg shadow-[0px_3.68px_3.68px_0px_rgba(0,0,0,0.2)] overflow-hidden">
          <div className="px-6 py-3 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-5">
              <h1 className="text-2xl font-semibold text-gray-900">Accounting</h1>
              <span className="text-[#4B5563] text-sm ">Total {transactions.length}</span>
            </div>
          </div>

          {/* Outstanding Section */}
          <div className="px-6 py-5">
            <p className="text-gray-600 text-sm mb-1">Outstanding</p>
            <p className="text-lg font-medium text-gray-900">{outstandingAmountValue.toFixed(2)} INR</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Bar */}
          <div className="relative w-full md:w-auto md:flex-1 max-w-none md:max-w-xs">
            <input
              type="text"
              placeholder="Search Anything..."
              value={searchQuery}
              onChange={(e) => setRentFilters({ search: e.target.value })}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-600 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-transparent shadow-[0px_2px_4px_rgba(0,0,0,0.05)]"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white rounded-lg p-1.5 hover:bg-gray-800 transition-colors">
              <Search size={14} />
            </button>
          </div>

          <FilterDropdown
            placeholder="Date"
            value={dateFilter}
            onSelect={(val) => setRentFilters({ date: val })}
            options={[
              { label: "January", value: "0" },
              { label: "February", value: "1" },
              { label: "March", value: "2" },
              { label: "April", value: "3" },
              { label: "May", value: "4" },
              { label: "June", value: "5" },
              { label: "July", value: "6" },
              { label: "August", value: "7" },
              { label: "September", value: "8" },
              { label: "October", value: "9" },
              { label: "November", value: "10" },
              { label: "December", value: "11" },
            ]}
          />

          <FilterDropdown
            placeholder="Transaction Status"
            value={statusFilter}
            onSelect={(val) => setRentFilters({ status: val })}
            options={[
              { label: "Paid", value: "Paid" },
              { label: "Partial", value: "Partial" },
              { label: "Open", value: "Open" },
              { label: "Overdue", value: "Overdue" },
            ]}
          />

          <FilterDropdown
            placeholder="Transaction Schedule"
            value={scheduleFilter}
            onSelect={(val) => setRentFilters({ schedule: val })}
            options={[
              { label: "Monthly", value: "Monthly" },
              { label: "One-time", value: "One-time" },
            ]}
          />
        </div>

        {/* Table Container */}
        <div className="hidden lg:flex bg-white rounded-[1rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 flex-col overflow-hidden">
          {/* Table Header */}
          <div className="bg-[var(--dashboard-accent)] flex justify-between px-10 py-3">
            <span className="text-white font-normal text-lg flex-[1.2]">Status</span>
            <span className="text-white font-normal text-lg flex-1 text-center">Due Date</span>
            <span className="text-white font-normal text-lg flex-1 text-center">Category</span>
            <span className="text-white font-normal text-lg flex-[2] text-center">Contact</span>
            <span className="text-white font-normal text-lg flex-[1.5] text-right">Total</span>
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
                <p>No transactions found</p>
                <button
                  onClick={resetRentFilters}
                  className="mt-2 text-[#7ED957] hover:underline text-sm font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredTransactions.length > ROWS_PER_PAGE && (
            <div className="px-8 py-4 border-t border-gray-200 flex justify-center items-center gap-2">
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

        {/* Mobile/Tablet Card View */}
        <div className="lg:hidden flex flex-col gap-4">
          {paginatedTransactions.length > 0 ? (
            paginatedTransactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                transaction={transaction}
                onClick={() => navigate(`/userdashboard/transactions/${transaction.id}`)}
              />
            ))
          ) : (
            <div className="bg-white rounded-xl p-8 text-center text-gray-400 font-medium border border-gray-200 shadow-sm">
              <p>No transactions found</p>
              <button
                onClick={resetRentFilters}
                className="mt-2 text-[#7ED957] hover:underline text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination for Mobile */}
          {filteredTransactions.length > ROWS_PER_PAGE && (
            <div className="flex justify-center items-center gap-2 py-4">
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
                    : 'bg-transparent text-gray-600 border border-gray-300 hover:bg-gray-100' // Keeping it transparent/white for mobile background
                    } ${currentPage !== page ? 'bg-white' : ''}`} // Add bg-white for unselected in mobile if needed, or rely on transparent
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
      </div>
    </div>
  );
};

export default Rent;



