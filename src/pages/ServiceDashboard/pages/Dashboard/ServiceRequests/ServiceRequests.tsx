import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { PiChatCircleText, PiKanban, PiMagnifyingGlassLight } from "react-icons/pi";
import ServiceBreadCrumb from '../../../components/ServiceBreadCrumb';
import ServiceFilters from '../../../components/ServiceFilters';
import DashboardButton from '../../../components/DashboardButton';

interface Request {
    id: string;
    status: string;
    category: string;
    property: string;
    priority: string;
    client: string;
    avatar: string;
    subCategory?: string; // Optional since not all mock data might have it
}

interface DashboardContext {
    sidebarCollapsed: boolean;
}

const ServiceRequests = () => {
    // Enhanced Mock Data
    const [requests] = useState<Request[]>([
        {
            id: '123',
            status: 'New',
            category: 'Appliances',
            property: 'Sunset Apartments',
            priority: 'Critical',
            client: 'Alice Johnson',
            avatar: 'https://i.pravatar.cc/150?u=1'
        },
        {
            id: '124',
            status: 'New',
            category: 'Plumbing',
            property: 'Downtown Lofts',
            priority: 'Normal',
            client: 'Bob Smith',
            avatar: 'https://i.pravatar.cc/150?u=2'
        },
        {
            id: '125',
            status: 'In Progress',
            category: 'Electrical',
            property: 'Sunset Apartments',
            priority: 'High',
            client: 'Charlie Davis',
            avatar: 'https://i.pravatar.cc/150?u=3'
        },
        {
            id: '126',
            status: 'Completed',
            category: 'HVAC',
            property: 'Ocean View Villa',
            priority: 'Low',
            client: 'Diana Evans',
            avatar: 'https://i.pravatar.cc/150?u=4'
        },
        {
            id: '127',
            status: 'Cancelled',
            category: 'Appliances',
            property: 'Downtown Lofts',
            priority: 'Normal',
            client: 'Ethan Foster',
            avatar: 'https://i.pravatar.cc/150?u=5'
        },
        {
            id: '128',
            status: 'On Hold',
            category: 'General',
            property: 'Mountain Retreat',
            priority: 'Critical',
            client: 'Fiona Green',
            avatar: 'https://i.pravatar.cc/150?u=6'
        }
    ]);

    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<DashboardContext>() || { sidebarCollapsed: false };

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string | string[]>('All');
    const [categoryFilter, setCategoryFilter] = useState<string | string[]>('All');
    const [propertyFilter, setPropertyFilter] = useState<string | string[]>('All');
    const [priorityFilter, setPriorityFilter] = useState<string | string[]>('All');

    // Filter Logic
    const filteredRequests = requests.filter((req: Request) => {
        const matchesSearch =
            req.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.id.includes(searchTerm);

        const matchesStatus = statusFilter === 'All' ||
            (Array.isArray(statusFilter) ? (statusFilter.includes('All') || statusFilter.includes(req.status)) : req.status === statusFilter);
        const matchesCategory = categoryFilter === 'All' ||
            (Array.isArray(categoryFilter) ? (categoryFilter.includes('All') || categoryFilter.includes(req.category)) : req.category === categoryFilter);
        const matchesProperty = propertyFilter === 'All' ||
            (Array.isArray(propertyFilter) ? (propertyFilter.includes('All') || propertyFilter.includes(req.property)) : req.property === propertyFilter);
        const matchesPriority = priorityFilter === 'All' ||
            (Array.isArray(priorityFilter) ? (priorityFilter.includes('All') || priorityFilter.includes(req.priority)) : req.priority === priorityFilter);

        return matchesSearch && matchesStatus && matchesCategory && matchesProperty && matchesPriority;
    });

    return (
        <div className={`mx-auto min-h-screen pb-20 transition-all duration-300 ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            <ServiceBreadCrumb
                items={[
                    { label: 'Dashboard', to: '/service-dashboard' },
                    { label: 'Requests', active: true }
                ]}
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        Request
                        <span className="cursor-pointer text-gray-500"><svg width="12" height="7" viewBox="0 0 12 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L6 6L11 1" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                    </h1>
                    <span className="text-gray-400 text-sm mt-1">Total {requests.length}</span>
                </div>

                <div className="flex gap-3 flex-wrap">
                    <button
                        onClick={() => navigate('/service-dashboard/requests-board')}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                        title="Switch to Board View"
                    >
                        <PiKanban size={20} />
                    </button>
                    <DashboardButton bgColor="#8BDC5E" textColor="text-white" onClick={() => navigate('/service-dashboard/find-job')}>
                        Find a Job
                    </DashboardButton>
                </div>
            </div>

            <hr className="mb-6 border-gray-100" />

            <ServiceFilters
                onSearch={setSearchTerm}
                currentStatus={statusFilter}
                onStatusChange={setStatusFilter}
                currentCategory={categoryFilter}
                onCategoryChange={setCategoryFilter}
                currentProperty={propertyFilter}
                onPropertyChange={setPropertyFilter}
                currentPriority={priorityFilter}
                onPriorityChange={setPriorityFilter}
            />

            {filteredRequests.length > 0 ? (
                <>
                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredRequests.map((req: Request) => (
                            <div
                                key={req.id}
                                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => navigate(`/service-dashboard/requests/${req.id}`)}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <span className="text-gray-500 font-medium text-sm">#{req.id}</span>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${req.status === 'New' ? 'bg-red-50 text-red-600' :
                                        req.status === 'Completed' ? 'bg-green-50 text-green-700' :
                                            req.status === 'In Progress' ? 'bg-blue-50 text-blue-600' :
                                                req.status === 'Cancelled' ? 'bg-gray-100 text-gray-600' :
                                                    'bg-yellow-50 text-yellow-700'
                                        }`}>
                                        {req.status}
                                    </span>
                                </div>

                                <div className="mb-4">
                                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{req.category}</h3>
                                    <p className="text-gray-500 text-sm">{req.property}</p>
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${req.priority === 'Critical' ? 'bg-red-50 text-red-600 border-red-100' :
                                        req.priority === 'High' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                            req.priority === 'Low' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                'bg-green-50 text-green-600 border-green-100'
                                        }`}>
                                        {req.priority} Priority
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-xs font-bold text-gray-700">
                                            {req.client.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{req.client}</span>
                                    </div>
                                    <button
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                                        aria-label={`Chat about request ${req.id}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            // Handle chat logic here if needed, or it might be handled by parent if we didn't stop prop, 
                                            // but request was to *prevent* parent row click.
                                            // Assuming there's a chat action to invoke:
                                            console.log("Chat clicked for", req.id);
                                        }}
                                    >
                                        <PiChatCircleText size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg border border-gray-200 overflow-x-auto shadow-sm">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-[#7BE156] text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left font-semibold">Status</th>
                                    <th className="px-6 py-4 text-left font-semibold">ID</th>
                                    <th className="px-6 py-4 text-left font-semibold">Category</th>
                                    <th className="px-6 py-4 text-left font-semibold">Property</th>
                                    <th className="px-6 py-4 text-left font-semibold">Priority</th>
                                    <th className="px-6 py-4 text-left font-semibold">Client</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredRequests.map((req: Request) => (
                                    <tr
                                        key={req.id}
                                        className="hover:bg-gray-50 cursor-pointer"
                                        onClick={() => navigate(`/service-dashboard/requests/${req.id}`)}
                                    >
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 font-medium text-sm ${req.status === 'New' ? 'text-red-500' :
                                                req.status === 'Completed' ? 'text-green-600' :
                                                    req.status === 'In Progress' ? 'text-blue-500' :
                                                        req.status === 'Cancelled' ? 'text-gray-500' :
                                                            'text-yellow-600' // On Hold
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${req.status === 'New' ? 'bg-red-500' :
                                                    req.status === 'Completed' ? 'bg-green-600' :
                                                        req.status === 'In Progress' ? 'bg-blue-500' :
                                                            req.status === 'Cancelled' ? 'bg-gray-500' :
                                                                'bg-yellow-600'
                                                    }`}></span>
                                                {req.status}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{req.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{req.category}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{req.property}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${req.priority === 'Critical' ? 'bg-red-500' :
                                                req.priority === 'High' ? 'bg-orange-500' :
                                                    req.priority === 'Low' ? 'bg-blue-500' :
                                                        'bg-green-500' // Normal
                                                }`}>
                                                {req.priority}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-between items-center pr-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-coral-100 flex items-center justify-center text-[10px] font-bold text-gray-700">
                                                        {req.client.split(' ').map((n: string) => n[0]).join('')}
                                                    </div>
                                                    <span className="text-sm text-gray-900">{req.client}</span>
                                                </div>
                                                <button
                                                    className="p-1 rounded-full border border-gray-200 hover:bg-gray-100 text-gray-500 relative"
                                                    aria-label={`Chat about request ${req.id}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        console.log("Chat clicked for", req.id);
                                                    }}
                                                >
                                                    <PiChatCircleText size={18} />
                                                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500 transform translate-x-1/4 -translate-y-1/4"></span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mt-8">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <PiMagnifyingGlassLight size={40} className="text-gray-400" />
                    </div>
                    {requests.length === 0 ? (
                        <>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No requests yet</h3>
                            <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed">
                                You haven't received any maintenance requests yet. When a property owner sends you a request, it will appear here.
                            </p>
                        </>
                    ) : (
                        <>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No requests found</h3>
                            <p className="text-gray-500 text-center max-w-md px-6 leading-relaxed">
                                We couldn't find any maintenance requests matching your current filters. Try adjusting your search or filters to see more requests.
                            </p>
                        </>
                    )}
                </div>
            )}

        </div>
    );
};

export default ServiceRequests;
