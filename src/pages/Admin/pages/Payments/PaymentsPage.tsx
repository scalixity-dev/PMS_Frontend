import React, { useState } from 'react';
import {
    CreditCard,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download
} from 'lucide-react';
import ServiceFilters from '../../../ServiceDashboard/components/ServiceFilters';
import type { DateRange } from 'react-day-picker';
import { isWithinInterval, startOfDay, endOfDay, differenceInDays, parseISO } from 'date-fns';

// --- Mock Data ---

interface Subscription {
    id: string;
    userName: string; // User or PM Name
    userType: 'Property Manager' | 'Service Pro';
    planName: 'Basic' | 'Pro' | 'Enterprise';
    amount: number;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Expired';
}

const mockSubscriptions: Subscription[] = [
    { id: '1', userName: 'Sarah Jenkins', userType: 'Property Manager', planName: 'Pro', amount: 49.99, startDate: '2023-01-01', endDate: '2024-01-01', status: 'Active' },
    { id: '2', userName: 'Mike Ross', userType: 'Property Manager', planName: 'Basic', amount: 19.99, startDate: '2023-05-15', endDate: '2024-05-15', status: 'Active' },
    { id: '3', userName: 'John Doe', userType: 'Property Manager', planName: 'Enterprise', amount: 99.99, startDate: '2022-10-01', endDate: '2023-10-01', status: 'Expired' },
    { id: '4', userName: 'Alice Electric Co.', userType: 'Service Pro', planName: 'Pro', amount: 29.99, startDate: '2023-12-01', endDate: '2024-12-01', status: 'Active' },
    { id: '5', userName: 'Bob Repairs', userType: 'Service Pro', planName: 'Basic', amount: 9.99, startDate: '2023-02-01', endDate: '2024-02-01', status: 'Active' },
    { id: '6', userName: 'FixIt Now', userType: 'Service Pro', planName: 'Basic', amount: 9.99, startDate: '2023-01-10', endDate: '2023-02-10', status: 'Expired' },
];

// --- Components ---

const StatCard = ({ title, value, icon, colorClass, subValue }: { title: string, value: string | number, icon: React.ReactNode, colorClass: string, subValue?: string }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
            {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
        </div>
        <div className={`p-3 rounded-lg ${colorClass} text-white shadow-sm`}>
            {icon}
        </div>
    </div>
);

const PaymentsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [planFilter, setPlanFilter] = useState<string | string[]>('All');
    const [statusFilter, setStatusFilter] = useState<string | string[]>('All');
    const [dateRange, setDateRange] = useState<DateRange | undefined>();

    // Helper for filter matching
    const matchesFilter = (filterValue: string | string[], itemValue: string) => {
        if (filterValue === 'All') return true;
        if (Array.isArray(filterValue)) {
            return filterValue.includes('All') || filterValue.length === 0 || filterValue.includes(itemValue);
        }
        return filterValue === itemValue;
    };

    const filteredSubs = mockSubscriptions.filter(sub => {
        const matchesSearch = sub.userName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPlan = matchesFilter(planFilter, sub.planName);
        const matchesStatus = matchesFilter(statusFilter, sub.status);

        let matchesDate = true;
        if (dateRange?.from && dateRange?.to) {
            const subStart = parseISO(sub.startDate);
            matchesDate = isWithinInterval(subStart, {
                start: startOfDay(dateRange.from),
                end: endOfDay(dateRange.to)
            });
        }

        return matchesSearch && matchesPlan && matchesStatus && matchesDate;
    });

    // Stats Calculation
    const totalPaymentsReceived = mockSubscriptions.reduce((acc, curr) => acc + curr.amount, 0);
    // Mocking monthly revenue as 1/12th of total for basics
    const monthlyRevenue = totalPaymentsReceived / 12;
    const pendingPayments = 2; // Hardcoded mock for pending count
    const pendingAmount = 450.00; // Hardcoded mock for pending amount

    const activeSubs = mockSubscriptions.filter(s => s.status === 'Active').length;
    const expiredSubs = mockSubscriptions.filter(s => s.status === 'Expired').length;

    // Expiring soon logic (next 30 days)
    const today = new Date();
    const expiringSoon = mockSubscriptions.filter(s => {
        if (s.status !== 'Active') return false;
        const endDate = parseISO(s.endDate);
        const daysUntilEnd = differenceInDays(endDate, today);
        return daysUntilEnd >= 0 && daysUntilEnd <= 30;
    }).length;

    // Filter Options
    const planOptions = ['All', 'Basic', 'Pro', 'Enterprise'];
    const statusOptions = ['All', 'Active', 'Expired'];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Payments & Subscriptions</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage revenue, billing, and subscription plans.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Download size={16} />
                    Export Report
                </button>
            </div>

            {/* Payments Overview Stats */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Financial Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Total Received"
                        value={formatCurrency(totalPaymentsReceived)}
                        icon={<DollarSign size={20} />}
                        colorClass="bg-green-600"
                        subValue="Lifetime revenue"
                    />
                    <StatCard
                        title="Monthly Revenue"
                        value={formatCurrency(monthlyRevenue)}
                        icon={<CreditCard size={20} />}
                        colorClass="bg-blue-600"
                        subValue="Current month estimate"
                    />
                    <StatCard
                        title="Pending Payments"
                        value={formatCurrency(pendingAmount)}
                        icon={<Clock size={20} />}
                        colorClass="bg-orange-500"
                        subValue={`${pendingPayments} transactions pending`}
                    />
                </div>
            </div>

            {/* Subscription Tracking Stats */}
            <div>
                <h2 className="text-lg font-bold text-gray-900 mb-4">Subscription Health</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard
                        title="Active Subscriptions"
                        value={activeSubs}
                        icon={<CheckCircle size={20} />}
                        colorClass="bg-teal-500"
                    />
                    <StatCard
                        title="Expiring Soon"
                        value={expiringSoon}
                        icon={<AlertCircle size={20} />}
                        colorClass="bg-yellow-500"
                        subValue="Next 30 days"
                    />
                    <StatCard
                        title="Expired Subscriptions"
                        value={expiredSubs}
                        icon={<XCircle size={20} />}
                        colorClass="bg-gray-500"
                    />
                </div>
            </div>

            {/* Filters */}
            <div>
                <ServiceFilters
                    onSearch={setSearchTerm}

                    categoryLabel="Plan"
                    currentCategory={planFilter}
                    onCategoryChange={setPlanFilter}
                    categoryOptions={planOptions}

                    statusLabel="Status"
                    currentStatus={statusFilter}
                    onStatusChange={setStatusFilter}
                    statusOptions={statusOptions}

                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                />
            </div>

            {/* Subscriptions Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#7BD747] border-b border-[#7BD747]">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">User / PM Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Plan Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredSubs.length > 0 ? (
                                filteredSubs.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="font-medium text-gray-900">{sub.userName}</div>
                                                <div className="text-xs text-gray-500">{sub.userType}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                                                {sub.planName}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {formatCurrency(sub.amount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                            {new Date(sub.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                            {new Date(sub.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${sub.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {sub.status === 'Active' ? <CheckCircle size={10} className="mr-1" /> : <XCircle size={10} className="mr-1" />}
                                                {sub.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <CreditCard size={48} className="text-gray-200 mb-4" />
                                            <p className="text-lg font-medium text-gray-900">No subscriptions found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination - Simplified */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing <span className="font-medium">{filteredSubs.length}</span> results</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentsPage;
