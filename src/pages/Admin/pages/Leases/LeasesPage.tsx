import React, { useState } from 'react';
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    Eye,
    Pencil,
    Trash2
} from 'lucide-react';
import ServiceFilters from '../../../ServiceDashboard/components/ServiceFilters';
import type { DateRange } from 'react-day-picker';
import { isWithinInterval, startOfDay, endOfDay, differenceInDays, parseISO } from 'date-fns';

// --- Mock Data ---

interface Lease {
    id: string;
    tenantName: string;
    propertyName: string;
    pmName: string;
    startDate: string;
    endDate: string;
    status: 'Active' | 'Ended' | 'Terminated';
}

const mockLeases: Lease[] = [
    { id: '1', tenantName: 'Alice Johnson', propertyName: 'Sunset Apartments', pmName: 'Sarah Jenkins', startDate: '2023-01-01', endDate: '2024-01-01', status: 'Active' },
    { id: '2', tenantName: 'Mark Evans', propertyName: 'Downtown Lofts', pmName: 'John Doe', startDate: '2023-06-15', endDate: '2024-06-15', status: 'Active' },
    { id: '3', tenantName: 'Susan Lee', propertyName: 'Ocean View Villa', pmName: 'Sarah Jenkins', startDate: '2022-05-01', endDate: '2023-05-01', status: 'Ended' },
    { id: '4', tenantName: 'David Chen', propertyName: 'Urban Heights', pmName: 'Mike Ross', startDate: '2023-11-01', endDate: '2024-11-01', status: 'Active' },
    { id: '5', tenantName: 'Emily Wilson', propertyName: 'Green Valley', pmName: 'John Doe', startDate: '2023-02-01', endDate: '2023-08-01', status: 'Terminated' },
    { id: '6', tenantName: 'Tom Brown', propertyName: 'Lakeside Condo', pmName: 'Mike Ross', startDate: '2023-03-01', endDate: '2024-03-01', status: 'Active' }, // Expiring soon relative to a hypothetic date, let's just make one clearly expiring soon based on current date if we want dynamic testing, but static is fine for layout.
];

// --- Components ---

const StatCard = ({ title, value, icon, colorClass }: { title: string, value: string | number, icon: React.ReactNode, colorClass: string }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
        <div>
            <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${colorClass} text-white shadow-sm`}>
            {icon}
        </div>
    </div>
);

const LeasesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [pmFilter, setPmFilter] = useState<string | string[]>('All');
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

    const filteredLeases = mockLeases.filter(lease => {
        const matchesSearch = lease.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lease.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesPM = matchesFilter(pmFilter, lease.pmName);
        const matchesStatus = matchesFilter(statusFilter, lease.status);

        let matchesDate = true;
        if (dateRange?.from && dateRange?.to) {
            const leaseStart = parseISO(lease.startDate);
            matchesDate = isWithinInterval(leaseStart, {
                start: startOfDay(dateRange.from),
                end: endOfDay(dateRange.to)
            });
        }

        return matchesSearch && matchesPM && matchesStatus && matchesDate;
    });

    // Stats Calculation
    const totalLeases = mockLeases.length;
    const activeLeases = mockLeases.filter(l => l.status === 'Active').length;
    const endedLeases = mockLeases.filter(l => ['Ended', 'Terminated'].includes(l.status)).length;

    // Calculate expiring soon (next 30 days)
    // For demo purposes, let's assume "Today" is 2023-12-15 to make some expire, or better yet, check against a fixed near-future date relative to the mock data.
    // Actually, let's just use current date. Since mock data is 2024, most are active. 
    // Let's purposefully verify against real time.
    const today = new Date();
    const expiringSoon = mockLeases.filter(l => {
        if (l.status !== 'Active') return false;
        const endDate = parseISO(l.endDate);
        const daysUntilEnd = differenceInDays(endDate, today);
        return daysUntilEnd >= 0 && daysUntilEnd <= 30;
    }).length;

    // Filter Options
    const pmOptions = ['All', ...Array.from(new Set(mockLeases.map(l => l.pmName)))];
    const statusOptions = ['All', 'Active', 'Ended', 'Terminated'];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Leases</h1>
                    <p className="text-gray-500 text-sm mt-1">Track rental agreements and expiration dates.</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Leases"
                    value={totalLeases}
                    icon={<FileText size={20} />}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="Active Leases"
                    value={activeLeases}
                    icon={<CheckCircle size={20} />}
                    colorClass="bg-green-500"
                />
                <StatCard
                    title="Ended / Terminated"
                    value={endedLeases}
                    icon={<XCircle size={20} />}
                    colorClass="bg-gray-500"
                />
                <StatCard
                    title="Expiring Soon (30 days)"
                    value={expiringSoon}
                    icon={<Clock size={20} />}
                    colorClass="bg-orange-500"
                />
            </div>

            {/* Filters */}
            <div>
                <ServiceFilters
                    onSearch={setSearchTerm}

                    categoryLabel="Property Manager"
                    currentCategory={pmFilter}
                    onCategoryChange={setPmFilter}
                    categoryOptions={pmOptions}

                    statusLabel="Status"
                    currentStatus={statusFilter}
                    onStatusChange={setStatusFilter}
                    statusOptions={statusOptions}

                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                />
            </div>

            {/* Leases Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#7BD747] border-b border-[#7BD747]">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Tenant Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Property</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">PM Name</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">End Date</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredLeases.length > 0 ? (
                                filteredLeases.map((lease) => (
                                    <tr key={lease.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {lease.tenantName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {lease.propertyName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                            {lease.pmName}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                            {new Date(lease.startDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                                            {new Date(lease.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${lease.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                                                lease.status === 'Ended' ? 'bg-gray-50 text-gray-700 border-gray-100' :
                                                    'bg-red-50 text-red-700 border-red-100'
                                                }`}>
                                                {lease.status === 'Active' && <CheckCircle size={10} className="mr-1" />}
                                                {lease.status !== 'Active' && <XCircle size={10} className="mr-1" />}
                                                {lease.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Lease">
                                                    <Eye size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Lease">
                                                    <Pencil size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Lease">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <FileText size={48} className="text-gray-200 mb-4" />
                                            <p className="text-lg font-medium text-gray-900">No leases found</p>
                                            <p className="text-sm text-gray-500 max-w-sm mt-1">
                                                Try adjusting your filters to find what you're looking for.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination (Simplified) */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing <span className="font-medium">{filteredLeases.length}</span> results</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LeasesPage;
