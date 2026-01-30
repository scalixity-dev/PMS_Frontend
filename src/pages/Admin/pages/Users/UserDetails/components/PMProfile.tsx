import React from 'react';
import { Building2, Users, FolderOpen } from 'lucide-react';

const PMProfile: React.FC = () => {
    // Mock Data
    const stats = {
        totalProperties: 5,
        totalUnits: 42,
        occupancyRate: 92
    };

    const properties = [
        { id: 1, name: "Sunset Apartments", location: "Los Angeles, CA", units: 12, occupancy: 100 },
        { id: 2, name: "Palm Heights", location: "Santa Monica, CA", units: 8, occupancy: 85 },
        { id: 3, name: "Ocean View Villa", location: "Malibu, CA", units: 1, occupancy: 100 },
    ];

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

            {/* Managed Properties List */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Managed Properties</h3>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                        <tr>
                            <th className="px-6 py-3">Property Name</th>
                            <th className="px-6 py-3">Location</th>
                            <th className="px-6 py-3">Units</th>
                            <th className="px-6 py-3">Occupancy</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {properties.map(prop => (
                            <tr key={prop.id} className="hover:bg-gray-50/50">
                                <td className="px-6 py-4 font-medium text-gray-900">{prop.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{prop.location}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{prop.units}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${prop.occupancy >= 90 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${prop.occupancy}%` }} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">{prop.occupancy}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-sm text-blue-600 font-medium hover:underline">View</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PMProfile;
