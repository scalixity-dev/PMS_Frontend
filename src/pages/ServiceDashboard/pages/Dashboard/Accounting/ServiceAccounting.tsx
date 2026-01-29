import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Download } from 'lucide-react';
import { PiHandCoinsLight } from 'react-icons/pi';
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';
import ServiceFilters from '../../../components/ServiceFilters';

import { mockTransactions } from './mockData';

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ServiceAccounting = () => {
    // Mock Data
    const [transactions] = useState(mockTransactions);
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState<string | string[]>('All');
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
        // Basic Date Filter
        const matchesDate = (() => {
            if (!t.dueDate) return false;

            const filters = Array.isArray(dateFilter) ? dateFilter : [dateFilter];
            if (filters.includes('All')) return true;

            // Parse date "YYYY-MM-DD"
            const [y, m, d] = (t.dueDate as string).split('-').map(Number);
            const date = new Date(y, m - 1, d);
            const now = new Date();

            // Normalize current date to midnight for fair comparison
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            return filters.some(filter => {
                if (filter === 'Last 7 Days') {
                    const diffTime = today.getTime() - date.getTime();
                    const diffDays = diffTime / (1000 * 3600 * 24);
                    return diffDays >= 0 && diffDays <= 7;
                }
                if (filter === 'Last 30 Days') {
                    const diffTime = today.getTime() - date.getTime();
                    const diffDays = diffTime / (1000 * 3600 * 24);
                    return diffDays >= 0 && diffDays <= 30;
                }
                if (filter === 'This Month') {
                    return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
                }
                if (filter === 'Last Month') {
                    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                    return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
                }
                return true;
            });
        })();

        return matchesSearch && matchesStatus && matchesSchedule && matchesDate;
    });


    const outstanding = transactions
        .filter(t => t.status === 'Unpaid' || t.status === 'Overdue')
        .reduce((acc, t) => acc + (t.amount || 0), 0)
        .toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
                currentProperty={dateFilter}
                onPropertyChange={setDateFilter}
                propertyLabel="Date"
                propertyOptions={['All', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month']}

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

            {filteredTransactions.length > 0 ? (
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
                                        {transaction.payer?.avatar ? (
                                            <img src={transaction.payer.avatar} alt={transaction.contact} className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-xs font-bold text-gray-700">
                                                {transaction.contact.split(' ').map((n: string) => n[0]).join('')}
                                            </div>
                                        )}
                                        <span className="text-sm font-medium text-gray-700">{transaction.contact}</span>
                                    </div>
                                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
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
                                                {transaction.payer?.avatar ? (
                                                    <img src={transaction.payer.avatar} alt={transaction.contact} className="w-8 h-8 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-[10px] font-bold text-gray-700">
                                                        {transaction.contact.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                )}
                                                <span className="text-sm font-medium text-gray-900">{transaction.contact}</span>
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
