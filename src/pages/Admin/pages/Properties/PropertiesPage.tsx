import React, { useState } from 'react';
import {
    MapPin,
    CheckCircle,
    Pencil,
    Trash2,
    Building2,
    Eye,
    Briefcase,
    Home
} from 'lucide-react';
import ServiceFilters from '../../../ServiceDashboard/components/ServiceFilters';

// --- Mock Data ---

interface PropertyManager {
    id: string;
    name: string;
    avatar: string;
    status: 'Active' | 'Expired' | 'Inactive';
    totalProperties: number;
    occupancyRate: number; // For the progress bar next to PM name in design
}

interface Property {
    id: string;
    pmId: string;
    name: string;
    location: string;
    units: number;
    occupancyRate: number;
    leaseStatus: 'Active' | 'Ending' | 'Vacant';
    status: 'Occupied' | 'Vacant' | 'Maintenance';
}

const mockPMs: PropertyManager[] = [
    { id: 'pm1', name: 'Sarah Jenkins', avatar: '', status: 'Active', totalProperties: 3, occupancyRate: 78 },
    { id: 'pm2', name: 'John Doe', avatar: '', status: 'Expired', totalProperties: 1, occupancyRate: 92 },
    { id: 'pm3', name: 'Mike Ross', avatar: '', status: 'Active', totalProperties: 2, occupancyRate: 45 },
];

const mockProperties: Property[] = [
    { id: 'p1', pmId: 'pm1', name: 'Sunset Apartments', location: 'Los Angeles', units: 24, occupancyRate: 92, leaseStatus: 'Active', status: 'Occupied' },
    { id: 'p2', pmId: 'pm1', name: 'Palm Heights', location: 'Los Angeles', units: 10, occupancyRate: 40, leaseStatus: 'Ending', status: 'Vacant' },
    { id: 'p3', pmId: 'pm1', name: 'Lakeview Homes', location: 'Miami', units: 8, occupancyRate: 100, leaseStatus: 'Active', status: 'Occupied' },
    { id: 'p4', pmId: 'pm2', name: 'Downtown Lofts', location: 'New York', units: 45, occupancyRate: 95, leaseStatus: 'Active', status: 'Occupied' },
    { id: 'p5', pmId: 'pm3', name: 'Urban Heights', location: 'Chicago', units: 30, occupancyRate: 50, leaseStatus: 'Active', status: 'Occupied' },
    { id: 'p6', pmId: 'pm3', name: 'Riverside Condo', location: 'Chicago', units: 12, occupancyRate: 40, leaseStatus: 'Vacant', status: 'Maintenance' },
    { id: 'p7', pmId: 'pm2', name: 'Ocean View Villa', location: 'Miami', units: 1, occupancyRate: 100, leaseStatus: 'Active', status: 'Occupied' },
    { id: 'p8', pmId: 'pm3', name: 'Forest Cabin', location: 'Denver', units: 1, occupancyRate: 0, leaseStatus: 'Vacant', status: 'Vacant' },
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

const ProgressBar = ({ value, className = "" }: { value: number, className?: string }) => {
    let colorClass = 'bg-blue-500';
    if (value >= 90) colorClass = 'bg-green-500';
    else if (value >= 70) colorClass = 'bg-blue-500';
    else if (value >= 40) colorClass = 'bg-yellow-500';
    else colorClass = 'bg-red-500';

    return (
        <div className={`h-2 bg-gray-100 rounded-full overflow-hidden w-24 ${className}`}>
            <div className={`h-full ${colorClass} rounded-full transition-all duration-500`} style={{ width: `${value}%` }} />
        </div>
    );
};

const PropertyManagerGroup = ({ pm, properties }: { pm: PropertyManager, properties: Property[] }) => {
    if (properties.length === 0) return null;

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            {/* PM Header */}
            <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-green-50/50 border-b border-green-100">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-lg border-2 border-white shadow-sm">
                        {pm.avatar ? <img src={pm.avatar} alt={pm.name} className="w-full h-full rounded-full object-cover" /> : pm.name.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-gray-900">{pm.name}</h3>
                            <div className={`w-2.5 h-2.5 rounded-full ${pm.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                            <span className={`px-2 py-0.5 rounded text-xs font-medium border ${pm.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                                }`}>
                                {pm.status}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>{properties.length} Properties</span>
                            <span className="text-gray-300">•</span>
                            {/* PM Overall Occupancy Bar */}
                            <div className="flex items-center gap-2" title="Overall Occupancy Rate">
                                <span className="text-xs font-medium">{pm.occupancyRate}% Occupancy</span>
                                <ProgressBar value={pm.occupancyRate} className="w-20 h-1.5" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                        <Eye size={16} /> View
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium">
                        <Pencil size={16} /> Edit
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
                        <Trash2 size={16} /> Block
                    </button>
                </div>
            </div>

            {/* Properties Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-white text-gray-400 text-xs uppercase tracking-wider font-semibold border-b border-gray-50">
                            <th className="px-6 py-3 pl-8">Property</th>
                            <th className="px-6 py-3">City</th>
                            <th className="px-6 py-3">Units</th>
                            <th className="px-6 py-3">Occupancy</th>
                            <th className="px-6 py-3">Lease</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {properties.map((property) => {
                            const occupied = Math.round(property.units * (property.occupancyRate / 100));
                            const vacant = property.units - occupied;

                            return (
                                <tr key={property.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-gray-100 text-gray-500">
                                                <Building2 size={18} />
                                            </div>
                                            <div className="font-medium text-gray-900">{property.name}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                            <MapPin size={14} />
                                            {property.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{property.units}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-bold text-gray-900 w-8">{property.occupancyRate}%</span>
                                                <ProgressBar value={property.occupancyRate} />
                                            </div>
                                            <div className="text-xs flex items-center gap-2">
                                                {property.units === 1 ? (
                                                    <span className="text-gray-500 font-medium">Single Unit</span>
                                                ) : (
                                                    <>
                                                        <span className="text-green-600 font-medium">{occupied} Occ</span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-gray-500 font-medium">{vacant} Vac</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${property.leaseStatus === 'Active' ? 'bg-green-50 text-green-700 border-green-100' :
                                            property.leaseStatus === 'Ending' ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                'bg-gray-50 text-gray-700 border-gray-100'
                                            }`}>
                                            {property.leaseStatus === 'Active' && <CheckCircle size={10} className="mr-1" />}
                                            {property.leaseStatus}
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const PropertiesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState<string | string[]>('All');
    const [statusFilter, setStatusFilter] = useState<string | string[]>('All');

    // Stats
    const totalProperties = mockProperties.length;
    const totalPMs = mockPMs.length;
    const occupiedCount = mockProperties.filter(p => p.status === 'Occupied').length;
    const vacantCount = mockProperties.filter(p => p.status === 'Vacant').length;

    // Filter Logic
    const getFilteredData = () => {
        // First filter properties
        const filteredProps = mockProperties.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                mockPMs.find(pm => pm.id === p.pmId)?.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCity = cityFilter === 'All' || (Array.isArray(cityFilter) ? cityFilter.includes(p.location) : p.location === cityFilter);
            // Assuming statusFilter maps to 'status' (Occupancy)
            const matchesStatus = statusFilter === 'All' || (Array.isArray(statusFilter) ? statusFilter.includes(p.status) : p.status === statusFilter);

            return matchesSearch && matchesCity && matchesStatus;
        });

        return filteredProps;
    };

    const filteredProperties = getFilteredData();

    // Grouping
    const groupedData = mockPMs.map(pm => ({
        pm,
        properties: filteredProperties.filter(p => p.pmId === pm.id)
    })).filter(group => group.properties.length > 0); // Only show PMs with matching properties

    // Filter Options
    const cityOptions = ['All', ...Array.from(new Set(mockProperties.map(p => p.location)))];
    const statusOptions = ['All', 'Occupied', 'Vacant', 'Maintenance'];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Properties</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage properties grouped by property managers.</p>
                </div>
            </div>

            {/* Stats Bar */}
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Properties"
                    value={totalProperties}
                    icon={<Building2 size={20} />}
                    colorClass="bg-blue-500"
                />
                <StatCard
                    title="Property Managers"
                    value={totalPMs}
                    icon={<Briefcase size={20} />}
                    colorClass="bg-purple-500"
                />
                <StatCard
                    title="Occupied Units"
                    value={occupiedCount}
                    icon={<CheckCircle size={20} />}
                    colorClass="bg-green-500"
                />
                <StatCard
                    title="Vacant Units"
                    value={vacantCount}
                    icon={<Home size={20} />}
                    colorClass="bg-orange-500"
                />
            </div>

            {/* Filters */}
            <div>
                <ServiceFilters
                    onSearch={setSearchTerm}

                    categoryLabel="City"
                    currentCategory={cityFilter}
                    onCategoryChange={setCityFilter}
                    categoryOptions={cityOptions}

                    statusLabel="Occupancy"
                    currentStatus={statusFilter}
                    onStatusChange={setStatusFilter}
                    statusOptions={statusOptions}

                // Could add Lease Status as another filter if needed
                />
            </div>

            {/* PM Groups */}
            <div className="space-y-6">
                {groupedData.length > 0 ? (
                    groupedData.map(group => (
                        <PropertyManagerGroup
                            key={group.pm.id}
                            pm={group.pm}
                            properties={group.properties}
                        />
                    ))
                ) : (
                    <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
                        <Building2 size={48} className="text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No properties found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PropertiesPage;
