import React, { useMemo, useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import { useRentStore } from "./store/rentStore";
import { mockTransactions } from "../../utils/mockData";
import { TransactionRow } from "../Transactions/components/TransactionRow";

const ROWS_PER_PAGE = 10;

const Rent: React.FC = () => {
  const navigate = useNavigate();
  const { rentFilters, setRentFilters, resetRentFilters } = useRentStore();
  const { search: searchQuery, status: statusFilter, date: dateFilter, schedule: scheduleFilter } = rentFilters;
  const [currentPage, setCurrentPage] = useState(1);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
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
        let transactionMonth: number;
        if (typeof transaction.dueDate === 'string' && transaction.dueDate.includes('-')) {
          const [year, month, day] = transaction.dueDate.split('-').map(Number);
          transactionMonth = new Date(year, month - 1, day).getMonth();
        } else {
          transactionMonth = new Date(transaction.dueDate).getMonth();
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
  }, [searchQuery, statusFilter, dateFilter, scheduleFilter]);

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

  // Calculate outstanding amount
  const outstandingAmount = useMemo(() => {
    return mockTransactions
      .filter((t) => t.status === "Open" || t.status === "Overdue")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, []);


  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-full mx-auto p-8 space-y-6">
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
              <span className="text-[#4B5563] text-sm ">Total {mockTransactions.length}</span>
            </div>
          </div>

          {/* Outstanding Section */}
          <div className="px-6 py-5">
            <p className="text-gray-600 text-lg text-sm mb-1">Outstanding</p>
            <p className="text-lg font-medium text-gray-900">{outstandingAmount.toFixed(2)} INR</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
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
        <div className="bg-white rounded-[1rem] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-gray-200 flex flex-col overflow-hidden">
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
      </div>
    </div>
  );
};

export default Rent;



