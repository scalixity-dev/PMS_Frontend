import React from 'react';
import { Star, CheckCircle, Clock, Wrench } from 'lucide-react';

const ServiceProProfile: React.FC = () => {
    // Mock Data
    const serviceInfo = {
        category: "Plumbing",
        rating: 4.9,
        jobsCompleted: 154,
        onTimeRate: "98%"
    };

    const recentJobs = [
        { id: 101, title: "Leaking Sink Repair", property: "Sunset Apartments #204", date: "2023-11-10", status: "Completed", amount: 150 },
        { id: 102, title: "Water Heater Check", property: "Ocean View Villa", date: "2023-11-05", status: "Completed", amount: 200 },
        { id: 103, title: "Pipe Burst Emergency", property: "Urban Heights #5B", date: "2023-10-28", status: "Completed", amount: 450 },
    ];

    return (
        <div className="space-y-6">
            {/* Service Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            </div>

            {/* Job History */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900">Recent Job History</h3>
                    <button className="text-sm text-blue-600 font-medium hover:underline">View All</button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-3">Job Title</th>
                            <th className="px-6 py-3">Property</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Amount</th>
                            <th className="px-6 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recentJobs.map(job => (
                            <tr key={job.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-gray-900">{job.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{job.property}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{job.date}</td>
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">${job.amount}</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                        {job.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceProProfile;
