import React from 'react';
import { Home, DollarSign, Wrench } from 'lucide-react';

const TenantProfile: React.FC = () => {
    // Mock Data
    const leaseInfo = {
        property: "Sunset Apartments",
        unit: "101",
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        rent: 1200
    };

    const tenantStats = {
        totalPayments: 14400,
        activeMaintenanceRequests: 2
    };

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Total Payments Made</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">${tenantStats.totalPayments.toLocaleString()}</h3>
                    <p className="text-xs text-gray-400 mt-1">Lifetime payments</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                            <Wrench size={20} />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">Active Maintenance Requests</p>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{tenantStats.activeMaintenanceRequests}</h3>
                    <p className="text-xs text-gray-400 mt-1">Pending requests</p>
                </div>
            </div>

            {/* Current Lease */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Home size={20} className="text-gray-400" />
                    Current Lease Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Property</p>
                        <p className="font-medium text-gray-900">{leaseInfo.property}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Unit</p>
                        <p className="font-medium text-gray-900">Unit {leaseInfo.unit}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Lease Term</p>
                        <p className="font-medium text-gray-900">{leaseInfo.startDate} - {leaseInfo.endDate}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Monthly Rent</p>
                        <p className="font-bold text-green-600">${leaseInfo.rent}/mo</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TenantProfile;
