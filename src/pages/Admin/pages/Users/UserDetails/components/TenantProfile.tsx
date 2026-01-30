import React from 'react';
import { Home, FileText, DollarSign, Clock } from 'lucide-react';

const TenantProfile: React.FC = () => {
    // Mock Data
    const leaseInfo = {
        property: "Sunset Apartments",
        unit: "101",
        startDate: "2023-01-01",
        endDate: "2024-01-01",
        rent: 1200
    };

    const payments = [
        { id: 1, date: "2023-11-01", amount: 1200, status: "Paid", method: "Credit Card" },
        { id: 2, date: "2023-10-01", amount: 1200, status: "Paid", method: "Auto-Pay" },
        { id: 3, date: "2023-09-01", amount: 1200, status: "Paid", method: "Bank Transfer" },
    ];

    return (
        <div className="space-y-6">
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
                <div className="mt-6 flex gap-3">
                    <button className="flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline">
                        <FileText size={16} />
                        View Lease Agreement
                    </button>
                </div>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <DollarSign size={20} className="text-gray-400" />
                        Payment History
                    </h3>
                    <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Method</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {payments.map(payment => (
                            <tr key={payment.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 text-sm text-gray-900">{payment.date}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">${payment.amount}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{payment.method}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                        {payment.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Maintenance Requests (Placeholder) */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Clock size={20} className="text-gray-400" />
                        Active Maintenance Requests
                    </h3>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500 text-sm">
                    No active maintenance requests.
                </div>
            </div>
        </div>
    );
};

export default TenantProfile;
