import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Trash2, ChevronLeft, Eye, ChevronDown, Edit } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import EditLeaseTermsModal, { type Lease } from './components/EditLeaseTermsModal';


// Define LeaseItem matching usage in this file
export interface LeaseItem extends Lease {
    status: string;
    duration: string;
    rent: string;
    tenant: string | { name: string; image?: string; email?: string; description?: string };
    type: string;
}

// Mock Data
export const MOCK_LEASES: LeaseItem[] = [
    {
        id: 1,
        status: 'Draft',
        lease: 5,
        property: 'Luxury Apartments',
        tenant: 'Sam',
        duration: '25-Nov-2025 to 25-Nov-2026',
        rent: '-------',
        type: 'Active leases'
    },
    {
        id: 2,
        status: 'Active',
        lease: 6,
        property: 'Luxury Apartments',
        tenant: 'Sam',
        duration: '25-Nov-2025 to 25-Nov-2026',
        rent: '₹12,000.00',
        type: 'Active leases'
    },
    {
        id: 3,
        status: 'Draft',
        lease: 7,
        property: 'Grove Street',
        tenant: 'Tom',
        duration: '25-Nov-2025 to 25-Nov-2026',
        rent: '-------',
        type: 'Active leases'
    },
    {
        id: 4,
        status: 'Active',
        lease: 8,
        property: 'Grove Street',
        tenant: 'Abd',
        duration: '25-Nov-2025 to 25-Nov-2026',
        rent: '₹12,000.00',
        type: 'Active leases'
    }
];

const ITEMS_PER_PAGE = 9;

const Leases: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<Record<string, string[]>>({});
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedLeaseId, setSelectedLeaseId] = useState<number | string | null>(null);
    const [selectedLeaseData, setSelectedLeaseData] = useState<LeaseItem | null>(null);

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'Active', label: 'Active' },
            { value: 'Draft', label: 'Draft' },
        ],
        occupancy: [
            { value: '__no_items__', label: 'No occupancy data available' }
        ],
        propertyType: [
            { value: '__no_items__', label: 'No property types available' }
        ]
    };

    const filterLabels: Record<string, string> = {
        status: 'Status',
        occupancy: 'Occupancy',
        propertyType: 'Property Type'
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    const filteredLeases = useMemo(() => {
        return MOCK_LEASES.filter(lease => {
            // Search filter
            // Normalize property to string for search
            const propName = typeof lease.property === 'object' ? lease.property.name : lease.property;
            const tenantName = typeof lease.tenant === 'object' ? lease.tenant?.name : lease.tenant;

            const matchesSearch = searchQuery === '' ||
                (propName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (tenantName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                lease.lease.toString().includes(searchQuery);

            // Status filter
            const leaseStatus = (lease as any).status || ''; // access status safely if not in Lease interface (it is in index signature)
            const matchesStatus = !filters.status?.length ||
                filters.status.includes(leaseStatus);

            // Occupancy filter (ignore placeholder value)
            const matchesOccupancy = !filters.occupancy?.length ||
                filters.occupancy.filter(v => v !== '__no_items__').length === 0;

            // Property type filter (ignore placeholder value)
            const matchesPropertyType = !filters.propertyType?.length ||
                filters.propertyType.filter(v => v !== '__no_items__').length === 0;

            return matchesSearch && matchesStatus && matchesOccupancy && matchesPropertyType;
        });
    }, [searchQuery, filters]);

    const totalPages = Math.ceil(filteredLeases.length / ITEMS_PER_PAGE);
    const paginatedLeases = filteredLeases.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'text-[#2E6819] font-bold'; // Green color for Active
            case 'draft':
                return 'text-gray-800 font-bold';
            default:
                return 'text-gray-800';
        }
    };

    const handleDeleteClick = (e: React.MouseEvent, id: number | string) => {
        e.stopPropagation();
        setSelectedLeaseId(id);
        setIsDeleteModalOpen(true);
    };

    const handleEndLeaseClick = (e: React.MouseEvent, id: number | string) => {
        e.stopPropagation();
        navigate(`/dashboard/leasing/leases/${id}/end-lease`);
    };

    const handleEditClick = (e: React.MouseEvent, item: LeaseItem) => {
        e.stopPropagation();
        setSelectedLeaseData(item);
        setIsEditModalOpen(true);
    };

    const handleUpdateLease = (updatedData: Lease) => {
        console.log('Updating lease:', updatedData);
        // Implement update logic invoke API
        setIsEditModalOpen(false);
    };

    const handleConfirmDelete = () => {
        console.log('Deleting lease', selectedLeaseId);
        // Add actual delete logic here
        setIsDeleteModalOpen(false);
        setSelectedLeaseId(null);
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-[#4ad1a6] text-sm font-semibold">Portfolio</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Leases</span>
            </div>

            <div className="p-4 sm:p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Leases</h1>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0 md:ml-8 w-full md:w-auto">
                        <button
                            onClick={() => navigate('/dashboard/movein')}
                            className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex-1 md:flex-none text-center"
                        >
                            Move in
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/leasing/leases/import')}
                            className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex-1 md:flex-none text-center"
                        >
                            Import
                        </button>
                    </div>
                </div>

                {/* Stats Section Placeholder */}
                <div className="bg-[#F0F0F6] p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 rounded-[2rem] shadow-md mb-8">
                    <div className="bg-[#7BD747] rounded-full p-1 pl-1 flex items-center justify-between shadow-sm h-14 w-full">
                        <div className="flex flex-col justify-center pl-4">
                            <span className="text-white text-xs font-semibold">Active leases</span>
                            <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center mt-1">
                                <span className="text-gray-800 font-bold text-xs">5</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#7BD747] rounded-full p-1 flex items-center gap-3 shadow-sm h-14 w-full">
                        <div className="flex flex-col justify-center pl-4">
                            <span className="text-white text-xs font-semibold">Lease expiration</span>
                            <div className="flex gap-2 mt-1">
                                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                                    <span className="text-gray-800 font-bold text-xs">2</span>
                                </div>
                                <div className="bg-white/80 rounded-full px-2 h-6 flex items-center justify-center">
                                    <span className="text-gray-600 text-[10px] font-medium">upcoming 30 days</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-[#7BD747] rounded-full p-1 flex items-center gap-3 shadow-sm h-14 w-full">
                        <div className="flex flex-col justify-center pl-4">
                            <span className="text-white text-xs font-semibold">Scheduled</span>
                            <div className="flex gap-2 mt-1">
                                <div className="bg-white rounded-full w-6 h-6 flex items-center justify-center">
                                    <span className="text-gray-800 font-bold text-xs">0</span>
                                </div>
                                <div className="bg-white/80 rounded-full px-2 h-6 flex items-center justify-center">
                                    <span className="text-gray-600 text-[10px] font-medium">Future leases</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters)}
                    initialFilters={filters}
                    showClearAll={true}
                />

                {/* Group By Property Header - Mimicking the Design in Screenshot */}
                <div className='mb-4 flex items-center'>
                    <div className="bg-[#7BD747] rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                        <span className="text-white font-semibold pr-2 border-r border-white/30">Luxury Apartments</span>
                        <ChevronDown className="text-white w-4 h-4 ml-1" />
                        <div className="bg-white rounded-full px-2 py-0.5 flex items-center gap-1">
                            <span className="text-gray-600 text-xs font-medium">Lease</span>
                            <div className="bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center">
                                <span className="text-gray-600 text-[10px] font-bold">2</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                    {/* Table Header */}
                    <div className="text-white px-6 py-4 hidden md:grid grid-cols-[0.8fr_0.6fr_1.4fr_1fr_1.4fr_1.5fr_1fr] gap-4 items-center text-sm font-medium">
                        <div className="text-center">Status</div>
                        <div className="text-center">Lease</div>
                        <div className="text-center">Property & Units</div>
                        <div className="text-center">Tenants</div>
                        <div className="text-center">Duration</div>
                        <div className="text-center">Rent & schedule</div>
                        <div className="text-center">Actions</div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t">
                    {paginatedLeases.length > 0 ? (
                        paginatedLeases.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/dashboard/portfolio/leases/${item.id}`)}
                                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer block md:grid md:grid-cols-[0.8fr_0.6fr_1.4fr_1fr_1.4fr_1.5fr_1fr] md:gap-4 md:items-center md:px-6 md:py-4"
                            >
                                {/* Mobile View */}
                                <div className="md:hidden flex flex-col gap-3">
                                    <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                                        <div className={`${getStatusColor(item.status)}`}>{item.status}</div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="px-3 py-1 bg-[#82D64D] text-white text-xs font-medium rounded-full hover:bg-[#72bd42] transition-colors"
                                                onClick={(e) => handleEndLeaseClick(e, item.id)}
                                            >
                                                End Lease
                                            </button>
                                            <button
                                                className="text-[#3A6D6C] p-2 hover:bg-gray-100 rounded-full"
                                                onClick={(e) => handleEditClick(e, item)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-[#3A6D6C] p-2 hover:bg-gray-100 rounded-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/dashboard/portfolio/leases/${item.id}`);
                                                }}
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                                                onClick={(e) => handleDeleteClick(e, item.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-[#2E6819] font-bold text-lg">
                                            {typeof item.property === 'object' ? item.property.name : item.property}
                                        </div>
                                        <div className="text-gray-500 text-xs">Lease #{item.lease}</div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Tenant</p>
                                            <p className="text-[#2E6819] font-semibold text-sm">
                                                {typeof item.tenant === 'object' ? item.tenant.name : item.tenant}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">Rent</p>
                                            <p className="text-gray-800 font-semibold text-sm">{item.rent}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-400 mb-1">Duration</p>
                                            <p className="text-[#2E6819] font-medium text-xs">{item.duration}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Desktop View */}
                                <div className="hidden md:block text-center"><span className={getStatusColor(item.status)}>{item.status}</span></div>
                                <div className="hidden md:block text-gray-600 text-sm font-medium text-center">{item.lease}</div>
                                <div className="hidden md:block text-[#2E6819] text-sm font-semibold text-center">
                                    {typeof item.property === 'object' ? item.property.name : item.property}
                                </div>
                                <div className="hidden md:block text-[#2E6819] text-sm font-semibold text-center">
                                    {typeof item.tenant === 'object' ? item.tenant.name : item.tenant}
                                </div>
                                <div className="hidden md:block text-[#2E6819] text-sm font-semibold text-center">{item.duration}</div>
                                <div className="hidden md:block text-gray-600 text-sm font-medium text-center">{item.rent}</div>
                                <div className="hidden md:flex items-center justify-center gap-2">
                                    <button
                                        className="px-3 py-1 bg-[#82D64D] text-white text-xs font-medium rounded-full hover:bg-[#72bd42] transition-colors"
                                        onClick={(e) => handleEndLeaseClick(e, item.id)}
                                    >
                                        End Lease
                                    </button>
                                    <button
                                        className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                        onClick={(e) => handleEditClick(e, item)}
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/dashboard/portfolio/leases/${item.id}`);
                                        }}
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button
                                        className="text-red-500 hover:text-red-600 transition-colors"
                                        onClick={(e) => handleDeleteClick(e, item.id)}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-12 bg-white rounded-2xl">
                            <p className="text-gray-500 text-lg">No leases found matching your filters</p>
                        </div>
                    )}
                </div>

                {/* Group By Property Header - Second Group Example */}
                <div className='mb-4 mt-8 flex items-center'>
                    <div className="bg-[#7BD747] rounded-full px-4 py-2 flex items-center gap-2 shadow-sm">
                        <span className="text-white font-semibold pr-2 border-r border-white/30">Grove Street</span>
                        <ChevronDown className="text-white w-4 h-4 ml-1" />
                        <div className="bg-white rounded-full px-2 py-0.5 flex items-center gap-1">
                            <span className="text-gray-600 text-xs font-medium">Lease</span>
                            <div className="bg-gray-200 rounded-full w-4 h-4 flex items-center justify-center">
                                <span className="text-gray-600 text-[10px] font-bold">2</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section 2 */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                    {/* Table Header */}
                    <div className="text-white px-6 py-4 hidden md:grid grid-cols-[0.8fr_0.6fr_1.4fr_1fr_1.4fr_1.5fr_1fr] gap-4 items-center text-sm font-medium">
                        <div className="text-center">Status</div>
                        <div className="text-center">Lease</div>
                        <div className="text-center">Property & Units</div>
                        <div className="text-center">Tenants</div>
                        <div className="text-center">Duration</div>
                        <div className="text-center">Rent & schedule</div>
                        <div className="text-center">Actions</div>
                    </div>
                </div>

                {/* Table Body 2 */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t">
                    {/* Just filtering mock data for demonstration purposes */}
                    {MOCK_LEASES.slice(2, 4).map((item) => (
                        <div
                            key={item.id}
                            onClick={() => navigate(`/dashboard/portfolio/leases/${item.id}`)}
                            className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer block md:grid md:grid-cols-[0.8fr_0.6fr_1.4fr_1fr_1.4fr_1.5fr_1fr] md:gap-4 md:items-center md:px-6 md:py-4"
                        >
                            {/* Mobile View */}
                            <div className="md:hidden flex flex-col gap-3">
                                <div className="flex justify-between items-start border-b border-gray-100 pb-2">
                                    <div className={`${getStatusColor(item.status)}`}>{item.status}</div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="px-3 py-1 bg-[#82D64D] text-white text-xs font-medium rounded-full hover:bg-[#72bd42] transition-colors"
                                            onClick={(e) => handleEndLeaseClick(e, item.id)}
                                        >
                                            End Lease
                                        </button>
                                        <button
                                            className="text-[#3A6D6C] p-2 hover:bg-gray-100 rounded-full"
                                            onClick={(e) => handleEditClick(e, item)}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="text-[#3A6D6C] p-2 hover:bg-gray-100 rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/dashboard/portfolio/leases/${item.id}`);
                                            }}
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="text-red-500 p-2 hover:bg-red-50 rounded-full"
                                            onClick={(e) => handleDeleteClick(e, item.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[#2E6819] font-bold text-lg">
                                        {typeof item.property === 'object' ? item.property.name : item.property}
                                    </div>
                                    <div className="text-gray-500 text-xs">Lease #{item.lease}</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded-xl">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Tenant</p>
                                        <p className="text-[#2E6819] font-semibold text-sm">
                                            {typeof item.tenant === 'object' ? item.tenant.name : item.tenant}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">Rent</p>
                                        <p className="text-gray-800 font-semibold text-sm">{item.rent}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-400 mb-1">Duration</p>
                                        <p className="text-[#2E6819] font-medium text-xs">{item.duration}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop View */}
                            <div className="hidden md:block text-center"><span className={getStatusColor(item.status)}>{item.status}</span></div>
                            <div className="hidden md:block text-gray-600 text-sm font-medium text-center">{item.lease}</div>
                            <div className="hidden md:block text-[#2E6819] text-sm font-semibold text-center">
                                {typeof item.property === 'object' ? item.property.name : item.property}
                            </div>
                            <div className="hidden md:block text-[#2E6819] text-sm font-semibold text-center">
                                {typeof item.tenant === 'object' ? item.tenant.name : item.tenant}
                            </div>
                            <div className="hidden md:flex items-center justify-center gap-2">
                                <button
                                    className="px-3 py-1 bg-[#82D64D] text-white text-xs font-medium rounded-full hover:bg-[#72bd42] transition-colors"
                                    onClick={(e) => handleEndLeaseClick(e, item.id)}
                                >
                                    End Lease
                                </button>
                                <button
                                    className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                    onClick={(e) => handleEditClick(e, item)}
                                >
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigate(`/dashboard/portfolio/leases/${item.id}`);
                                    }}
                                >
                                    <Eye className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                    onClick={(e) => handleDeleteClick(e, item.id)}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
            </div >

            {/* Confirmation Modals */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Lease"
                message="Are you sure you want to delete this lease? This action cannot be undone."
                itemName={selectedLeaseId ? `Lease #${selectedLeaseId}` : 'Lease'}
            />

            <EditLeaseTermsModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={selectedLeaseData || undefined}
                onUpdate={handleUpdateLease}
            />
        </div >
    );
};

export default Leases;
