import React, { useMemo } from "react";
import { MessageSquare, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import FilterDropdown from "../../../../components/ui/FilterDropdown";



import { useUserDashboardStore } from "../../store/userDashboardStore";

const Requests: React.FC = () => {
  const navigate = useNavigate();
  const { requestFilters, setRequestFilters, resetRequestFilters, requests } = useUserDashboardStore();
  const { search: searchQuery, status: statusFilter, priority: priorityFilter, category: categoryFilter } = requestFilters;

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !request.requestId.toLowerCase().includes(query) &&
          !request.category.toLowerCase().includes(query) &&
          !request.property.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter && request.status !== statusFilter) {
        return false;
      }

      // Priority filter
      if (priorityFilter && request.priority !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter && request.category !== categoryFilter) {
        return false;
      }

      return true;
    });
  }, [searchQuery, statusFilter, priorityFilter, categoryFilter, requests]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-600";
      case "Normal":
        return "bg-green-100 text-green-600";
      case "Low":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
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
            <li className="text-[#1A1A1A]  font-medium" aria-current="page">Request</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center pt-3 justify-between">
          <div className="flex items-center gap-5">
            <h1 className="text-2xl font-semibold text-gray-900">Requests</h1>
            <span className="text-[#4B5563] text-sm">Total {requests.length}</span>
          </div>
          <PrimaryActionButton
            text="Add Request"
            onClick={() => navigate("/userdashboard/new-request")}
            className="bg-[#7ED957] hover:bg-[#6BC847] !px-6 !py-2.5"
          />
        </div>

        {/* Divider */}
        <div className="border-t border-[#E5E7EB]"></div>

        {/* Filters Section */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <input
              type="text"
              placeholder="Search Anything..."
              value={searchQuery}
              onChange={(e) => setRequestFilters({ search: e.target.value })}
              className="w-full pl-4 pr-10 py-2.5 border border-gray-600 bg-white rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#7ED957] focus:border-transparent shadow-[0px_2px_4px_rgba(0,0,0,0.05)]"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-900 text-white rounded-lg p-1.5 hover:bg-gray-800 transition-colors">
              <Search size={14} />
            </button>
          </div>

          <FilterDropdown
            placeholder="Status"
            value={statusFilter}
            onSelect={(val) => setRequestFilters({ status: val })}
            options={[
              { label: "New", value: "New" },
              { label: "In Progress", value: "In Progress" },
              { label: "Completed", value: "Completed" },
            ]}
          />

          <FilterDropdown
            placeholder="Priority"
            value={priorityFilter}
            onSelect={(val) => setRequestFilters({ priority: val })}
            options={[
              { label: "Critical", value: "Critical" },
              { label: "Normal", value: "Normal" },
              { label: "Low", value: "Low" },
            ]}
          />

          <FilterDropdown
            placeholder="Category"
            value={categoryFilter}
            onSelect={(val) => setRequestFilters({ category: val })}
            options={[
              { label: "Appliances", value: "Appliances" },
              { label: "Plumbing", value: "Plumbing" },
              { label: "Electrical", value: "Electrical" },
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
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Property
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold text-sm">
                    Assignee
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${request.status === 'New' ? 'bg-red-500' : request.status === 'In Progress' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                          <span className={`text-sm font-medium ${request.status === 'New' ? 'text-red-500' : request.status === 'In Progress' ? 'text-yellow-500' : 'text-green-500'}`}>{request.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{request.requestId}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{request.category}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{request.property}</td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit ${getPriorityColor(request.priority)}`}>
                          <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                          {request.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="text-[var(--dashboard-accent)] hover:opacity-80 transition-opacity">
                          <MessageSquare size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <p className="text-sm">No requests found</p>
                        <button
                          onClick={resetRequestFilters}
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

export default Requests;


