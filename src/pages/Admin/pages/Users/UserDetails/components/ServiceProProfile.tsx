import React from 'react';
import { Star, CheckCircle, Clock, Wrench, DollarSign } from 'lucide-react';

const ServiceProProfile: React.FC = () => {
    // Mock Data
    const serviceInfo = {
        category: "Plumbing",
        rating: 4.9,
        jobsCompleted: 154,
        onTimeRate: "98%",
        totalIncome: 45750
    };

    return (
        <div className="space-y-6">
            {/* Service Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className="mx-auto w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3">
                        <Wrench size={20} />
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Category</p>
                    <h3 className="text-lg font-bold text-gray-900">{serviceInfo.category}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className="mx-auto w-10 h-10 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mb-3">
                        <Star size={20} />
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Rating</p>
                    <h3 className="text-lg font-bold text-gray-900">{serviceInfo.rating} / 5.0</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className="mx-auto w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <CheckCircle size={20} />
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Jobs Completed</p>
                    <h3 className="text-lg font-bold text-gray-900">{serviceInfo.jobsCompleted}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className="mx-auto w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Clock size={20} />
                    </div>
                    <p className="text-gray-500 text-sm mb-1">On-Time Rate</p>
                    <h3 className="text-lg font-bold text-gray-900">{serviceInfo.onTimeRate}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className="mx-auto w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                        <DollarSign size={20} />
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Total Income</p>
                    <h3 className="text-lg font-bold text-gray-900">${serviceInfo.totalIncome.toLocaleString()}</h3>
                </div>
            </div>
        </div>
    );
};

export default ServiceProProfile;
