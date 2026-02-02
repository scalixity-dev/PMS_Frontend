import React from 'react';
import { Building2, Users, FolderOpen, DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const PMProfile: React.FC = () => {
    // Mock Data
    const stats = {
        totalProperties: 5,
        totalUnits: 42,
        occupancyRate: 92
    };

    const financialStats = {
        totalTransactions: 156,
        totalIncome: 125000,
        totalExpense: 45000,
        avgTransaction: 1089.74
    };

    return (
        <div className="space-y-6">
            {/* Portfolio Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Building2 size={20} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Total Properties</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalProperties}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <FolderOpen size={20} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Total Units</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.totalUnits}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                            <Users size={20} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Overall Occupancy</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</h3>
                </div>
            </div>

            {/* Financial KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Activity size={20} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Total Transactions</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{financialStats.totalTransactions}</h3>
                    <p className="text-xs text-gray-400 mt-1">All time</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Total Income</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">${financialStats.totalIncome.toLocaleString()}</h3>
                    <p className="text-xs text-green-500 mt-1">+12% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                            <TrendingDown size={20} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Total Expense</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">${financialStats.totalExpense.toLocaleString()}</h3>
                    <p className="text-xs text-red-500 mt-1">+5% from last month</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Avg Transaction</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">${financialStats.avgTransaction.toLocaleString()}</h3>
                    <p className="text-xs text-gray-400 mt-1">Per transaction</p>
                </div>
            </div>
        </div>
    );
};

export default PMProfile;
