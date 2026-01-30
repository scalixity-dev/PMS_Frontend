import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Pencil,
    Trash2,
    Ban,
    Briefcase,
    Shield,
    CheckCircle,
    Download
} from 'lucide-react';
import ServiceFilters from '../../../ServiceDashboard/components/ServiceFilters';
import type { DateRange } from 'react-day-picker';
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';

// --- Mock Data ---

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Tenant' | 'Property Manager' | 'Service Pro';
    status: 'Active' | 'Blocked' | 'Inactive';
    createdDate: string;
    avatar?: string;
}

const mockUsers: User[] = [
    { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Tenant', status: 'Active', createdDate: '2023-10-15' },
    { id: '2', name: 'Bob Smith', email: 'bob.pm@example.com', role: 'Property Manager', status: 'Active', createdDate: '2023-09-20' },
    { id: '3', name: 'Charlie Brown', email: 'charlie.electric@example.com', role: 'Service Pro', status: 'Active', createdDate: '2023-11-05' },
    { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'Tenant', status: 'Blocked', createdDate: '2024-01-10' },
    { id: '5', name: 'Evan Wright', email: 'evan@example.com', role: 'Tenant', status: 'Inactive', createdDate: '2023-12-01' },
    { id: '6', name: 'Fiona Gallagher', email: 'fiona.pm@example.com', role: 'Property Manager', status: 'Active', createdDate: '2023-08-15' },
    { id: '7', name: 'George Miller', email: 'george.plumbing@example.com', role: 'Service Pro', status: 'Blocked', createdDate: '2023-10-25' },
];

// --- Components ---

const StatCard = ({ title, value, icon, colorClass }: { title: string, value: string, icon: React.ReactNode, colorClass: string }) => (
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

const UsersPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<string | string[]>('All');
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

    // Filter Logic
    const filteredUsers = mockUsers.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = matchesFilter(roleFilter, user.role);
        const matchesStatus = matchesFilter(statusFilter, user.status);

        let matchesDate = true;
        if (dateRange?.from && dateRange?.to) {
            const userDate = new Date(user.createdDate);
            matchesDate = isWithinInterval(userDate, {
                start: startOfDay(dateRange.from),
                end: endOfDay(dateRange.to)
            });
        }

        return matchesSearch && matchesRole && matchesStatus && matchesDate;
    });

    // Stats Calculation
    const totalTenants = mockUsers.filter(u => u.role === 'Tenant').length;
    const totalPMs = mockUsers.filter(u => u.role === 'Property Manager').length;
    const totalServicePros = mockUsers.filter(u => u.role === 'Service Pro').length;

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'Tenant': return 'bg-blue-50 text-blue-700 border-blue-100';
            case 'Property Manager': return 'bg-purple-50 text-purple-700 border-purple-100';
            case 'Service Pro': return 'bg-orange-50 text-orange-700 border-orange-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    const getStatusBadgeColor = (status: string) => {
        switch (status) {
            case 'Active': return 'bg-green-50 text-green-700 border-green-100';
            case 'Blocked': return 'bg-red-50 text-red-700 border-red-100';
            case 'Inactive': return 'bg-gray-50 text-gray-700 border-gray-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">User Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage tenants, property managers, and service professionals.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        <Download size={16} />
                        Export
                    </button>
                    {/* Add User button could go here */}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Tenants"
                    value={totalTenants.toString()}
                    icon={<Users size={20} />}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="Property Managers"
                    value={totalPMs.toString()}
                    icon={<Briefcase size={20} />}
                    colorClass="bg-purple-500"
                />
                <StatCard
                    title="Service Professionals"
                    value={totalServicePros.toString()}
                    icon={<Shield size={20} />}
                    colorClass="bg-orange-500"
                />
            </div>

            {/* Filters */}
            <div>
                <ServiceFilters
                    onSearch={setSearchTerm}

                    // Role Filter (Mapped to Category)
                    categoryLabel="Role"
                    currentCategory={roleFilter}
                    onCategoryChange={setRoleFilter}
                    categoryOptions={['All', 'Tenant', 'Property Manager', 'Service Pro']}

                    // Status Filter
                    statusLabel="Status"
                    currentStatus={statusFilter}
                    onStatusChange={setStatusFilter}
                    statusOptions={['All', 'Active', 'Blocked', 'Inactive']}

                    // Date Range
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                />
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#7BD747] border-b border-[#7BD747]">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Joined Date</th>
                                <th className="px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div
                                                className="flex items-center gap-3 cursor-pointer group-hover:opacity-80 transition-opacity"
                                                onClick={() => navigate(`/admin/users/${user.id}`)}
                                            >
                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-sm">
                                                    {user.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" /> : user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 hover:text-blue-600 transition-colors">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(user.role)}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeColor(user.status)}`}>
                                                {user.status === 'Active' && <CheckCircle size={12} className="mr-1" />}
                                                {user.status === 'Blocked' && <Ban size={12} className="mr-1" />}
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(user.createdDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit User">
                                                    <Pencil size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title={user.status === 'Blocked' ? 'Unblock User' : 'Block User'}>
                                                    <Ban size={18} />
                                                </button>
                                                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete User">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center">
                                            <Users size={48} className="text-gray-200 mb-4" />
                                            <p className="text-lg font-medium text-gray-900">No users found</p>
                                            <p className="text-sm text-gray-500 max-w-sm mt-1">
                                                Try adjusting your search or filters to find what you're looking for.
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
                    <p className="text-sm text-gray-500">Showing <span className="font-medium">{filteredUsers.length}</span> results</p>
                    <div className="flex items-center gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
