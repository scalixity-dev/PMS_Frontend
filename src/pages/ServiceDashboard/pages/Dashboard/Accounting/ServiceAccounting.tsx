import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Download, Loader2 } from 'lucide-react';
import { PiHandCoinsLight } from 'react-icons/pi';
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';
import ServiceFilters from '../../../components/ServiceFilters';
import { useServiceProviderAccounting } from '../../../../../hooks/useServiceProviderAssignments';

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ServiceAccounting = () => {
    const { data: accountingData, isLoading, error } = useServiceProviderAccounting();
    const transactions = accountingData?.transactions ?? [];
    const summary = accountingData?.summary ?? { total: 0, paid: 0, outstanding: 0, overdue: 0 };
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [statusFilter, setStatusFilter] = useState<string | string[]>('All');
    const [scheduleFilter, setScheduleFilter] = useState<string | string[]>('All');

    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = searchTerm === '' ||
            (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (t.contact && t.contact.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesStatus = statusFilter === 'All' ||
            (Array.isArray(statusFilter) ? (statusFilter.includes('All') || statusFilter.includes(t.status)) : t.status === statusFilter);

        // Handling Schedule Filter (checking t.type for "One-time" or "Recurring")
        // Also checking t.category as legacy fallback if needed, but primary is t.type
        const scheduleSource = t.type || t.category || '';
        const matchesSchedule = scheduleFilter === 'All' ||
            (Array.isArray(scheduleFilter) ?
                (scheduleFilter.includes('All') || (scheduleSource && scheduleFilter.some(s => scheduleSource.includes(s))))
                : (scheduleSource && scheduleSource.includes(scheduleFilter)));

        // Basic Date Filter
        const matchesDate = (() => {
            // Check if at least one date is present
            if (!dateRange?.from && !dateRange?.to) return true;

            if (!t.dueDate) return false;

            // Parse transaction date "YYYY-MM-DD"
            const [y, m, d] = (t.dueDate as string).split('-').map(Number);
            const date = new Date(y, m - 1, d); // Local midnight

            // Determine effective range
            // If only 'from' is selected, use it as both start and end (single day)
            // If only 'to' is selected (unlikely in UI but possible in state), treat as single day
            const fromDateRaw = dateRange.from || dateRange.to;
            const toDateRaw = dateRange.to || dateRange.from;

            if (!fromDateRaw || !toDateRaw) return true; // Should be covered above but safe guard

            const from = new Date(fromDateRaw.getFullYear(), fromDateRaw.getMonth(), fromDateRaw.getDate());
            const to = new Date(toDateRaw.getFullYear(), toDateRaw.getMonth(), toDateRaw.getDate());

            // Adjust to ensure inclusive comparison for the end date
            to.setHours(23, 59, 59, 999);

            return date >= from && date <= to;
        })();

        return matchesSearch && matchesStatus && matchesSchedule && matchesDate;
    });


    const outstanding = summary.outstanding.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <div className={`mx-auto min-h-screen pb-20 transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Accounting', active: true }
                ]}
            />

            {/* Stats Card */}
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Accounting</h1>
                    <span className="text-gray-500 text-sm">Total {transactions.length}</span>
                </div>

                <hr className="border-gray-200 mb-4" />

                <div>
                    <h2 className="text-gray-500 text-sm font-medium mb-1">Outstanding</h2>
                    <div className="text-xl font-bold text-gray-800">{outstanding} INR</div>
                </div>
            </div>

            {/* Filters */}
            <ServiceFilters
                onSearch={setSearchTerm}

                // + Date
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                propertyLabel="Date Range"

                // + Transaction Status
                currentStatus={statusFilter}
                onStatusChange={setStatusFilter}
                statusLabel="Trans. Status"
                statusOptions={['All', 'Paid', 'Unpaid', 'Pending', 'Overdue']}

                // + Transaction schedule
                currentCategory={scheduleFilter}
                onCategoryChange={setScheduleFilter}
                categoryLabel="Trans. schedule"
                categoryOptions={['All', 'One-time', 'Recurring']}
            />

            {isLoading ? (
                <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mt-8">
                    <Loader2 className="w-8 h-8 animate-spin text-[#7BE156]" />
                    <span className="ml-3 text-gray-600">Loading accounting...</span>
                </div>
            ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-8">
                    <p className="text-red-800">Failed to load accounting data. Please try again.</p>
                </div>
            ) : filteredTransactions.length > 0 ? (
                <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredTransactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => navigate(`/service-dashboard/accounting/transaction/${transaction.id}`)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-gray-500 font-medium text-sm">#{transaction.id}</span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${transaction.status === 'Paid' ? 'bg-green-50 text-green-700' :
                                        transaction.status === 'Overdue' ? 'bg-red-50 text-red-600' :
                                            transaction.status === 'Pending' ? 'bg-blue-50 text-blue-600' :
                                                'bg-yellow-50 text-yellow-700'
                                        }`}>
                                        {transaction.status}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{transaction.description}</h3>
                                    <p className="text-gray-500 text-sm">{transaction.property}</p>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-sm font-semibold text-gray-900">
                                        {transaction.total}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-xs font-bold text-gray-700">
                                            {(transaction.contact || transaction.property || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{transaction.contact}</span>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label="Download CSV"
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                    >
                                        <Download size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-[#7BE156] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left font-semibold">Due Date</th>
                                    <th className="px-6 py-4 text-left font-semibold">Category</th>
                                    <th className="px-6 py-4 text-left font-semibold">Contact</th>
                                    <th className="px-6 py-4 text-left font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredTransactions.map((transaction) => (
                                    <tr
                                        key={transaction.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/service-dashboard/accounting/transaction/${transaction.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 font-medium text-sm ${transaction.status === 'Paid' ? 'text-green-600' :
                                                transaction.status === 'Overdue' ? 'text-red-500' :
                                                    transaction.status === 'Pending' ? 'text-blue-500' :
                                                        'text-yellow-600' // Unpaid
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${transaction.status === 'Paid' ? 'bg-green-600' :
                                                    transaction.status === 'Overdue' ? 'bg-red-500' :
                                                        transaction.status === 'Pending' ? 'bg-blue-500' :
                                                            'bg-yellow-600'
                                                    }`}></span>
                                                {transaction.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{transaction.dueDate}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{transaction.category}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-[10px] font-bold text-gray-700">
                                                    {(transaction.contact || transaction.property || '?').split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <span className="text-sm font-medium text-gray-900">{transaction.contact || transaction.property}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-between items-center pr-4">
                                                <span className="text-sm text-gray-900 font-medium">{transaction.total}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mt-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <PiHandCoinsLight size={40} className="text-gray-400" />
                    </div>
                    {transactions.length === 0 ? (
                        <>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No transactions yet</h3>
                            <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed">
                                You don't have any financial records yet. Your payments and expenses will be tracked here once you start processing jobs.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No transactions found</h3>
                            <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed">
                                We couldn't find any transactions matching your current filters. Try adjusting your search or filters to see your financial records.
                            </p>
                        </>
                    )}
                </div>
            )}

        </div>
    );
};

export default ServiceAccounting;
