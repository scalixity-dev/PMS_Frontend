import React, { useMemo } from "react";
import { Search } from "lucide-react";
import { Link } from "react-router-dom";
import FilterDropdown from "../../../../components/ui/FilterDropdown";
import { useUserDashboardStore } from "../../store/userDashboardStore";

interface Transaction {
  id: number;
  status: "Paid" | "Pending" | "Overdue";
  dueDate: string;
  category: string;
  contact: string;
  total: number;
}


const Rent: React.FC = () => {
  const { rentFilters, setRentFilters, resetRentFilters } = useUserDashboardStore();
  const { search: searchQuery, status: statusFilter, date: dateFilter, schedule: scheduleFilter } = rentFilters;

  // Mock transaction data
  const mockTransactions: Transaction[] = [
    {
      id: 1,
      status: "Paid",
      dueDate: "2024-01-15",
      category: "Monthly Rent",
      contact: "John Doe",
      total: 15000,
    },
    {
      id: 2,
      status: "Pending",
      dueDate: "2024-02-01",
      category: "Monthly Rent",
      contact: "Jane Smith",
      total: 18000,
    },
    {
      id: 3,
      status: "Overdue",
      dueDate: "2023-12-20",
      category: "Maintenance Fee",
      contact: "Robert Johnson",
      total: 5000,
    },
    {
      id: 4,
      status: "Paid",
      dueDate: "2024-01-10",
      category: "Security Deposit",
      contact: "Emily Davis",
      total: 25000,
    },
    {
      id: 5,
      status: "Pending",
      dueDate: "2024-02-15",
      category: "Monthly Rent",
      contact: "Michael Brown",
      total: 20000,
    },
    {
      id: 6,
      status: "Paid",
      dueDate: "2024-01-05",
      category: "Utility Bill",
      contact: "Sarah Wilson",
      total: 3500,
    },
  ];

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !transaction.contact.toLowerCase().includes(query) &&
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
        const transactionMonth = new Date(transaction.dueDate).getMonth();
        const filterMonth = parseInt(dateFilter);
        if (transactionMonth !== filterMonth) {
          return false;
        }
      }

      // Schedule filter
      if (scheduleFilter) {
        if (scheduleFilter === "Monthly" && !transaction.category.includes("Monthly")) {
          return false;
        }
        if (scheduleFilter === "One-time" && transaction.category.includes("Monthly")) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, statusFilter, dateFilter, scheduleFilter]);

  // Calculate outstanding amount
  const outstandingAmount = useMemo(() => {
    return mockTransactions
      .filter((t) => t.status === "Pending" || t.status === "Overdue")
      .reduce((sum, t) => sum + t.total, 0);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Overdue":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

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
              { label: "Pending", value: "Pending" },
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

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#7ED957] to-[#6BC847]">
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(transaction.dueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{transaction.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{transaction.contact}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        ₹{transaction.total.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm">No transactions found</p>
                        <button
                          onClick={resetRentFilters}
                          className="mt-2 text-[#7ED957] hover:underline text-sm font-medium"
                        >
                          Clear all filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rent;



