import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronLeft, Plus, Check, MessageSquare, MoreHorizontal } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import ConfirmationModal from '../KeysLocks/ConfirmationModal';
import Pagination from '../../components/Pagination';

// Row Action Dropdown Component
interface RowActionDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: () => void;
    onMakeRecurring: () => void;
    onPrint: () => void;
    onDelete: () => void;
}

const RowActionDropdown: React.FC<RowActionDropdownProps> = ({
    isOpen,
    onClose,
    onEdit,
    onMakeRecurring,
    onPrint,
    onDelete,
}) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-lg border border-gray-100 py-2 z-50"
        >
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                    onClose();
                }}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-100"
            >
                Edit
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onMakeRecurring();
                    onClose();
                }}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-100"
            >
                Make Recurring
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onPrint();
                    onClose();
                }}
                className="w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors font-medium border-b border-gray-100"
            >
                Print
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                    onClose();
                }}
                className="w-full px-4 py-3 text-left text-red-500 hover:bg-gray-50 transition-colors font-medium"
            >
                Delete
            </button>
        </div>
    );
};

// Mock Data with property information
const MOCK_REQUESTS = [
    {
        id: '1234',
        index: 1,
        status: 'New',
        date: '10 Nov 2025',
        category: 'Luxury',
        subCategory: 'Lights/Beaping',
        priority: 'Normal',
        assignee: 'Vedh',
        propertyName: 'Luxury Property',
    },
    {
        id: '1235',
        index: 2,
        status: 'Reviews',
        date: '10 Nov 2025',
        category: 'Luxury',
        subCategory: 'Lights/Beaping',
        priority: 'Normal',
        assignee: 'Vedh',
        propertyName: 'Luxury Property',
    },
    {
        id: '1236',
        index: 1,
        status: 'New',
        date: '10 Nov 2025',
        category: 'Luxury',
        subCategory: 'Lights/Beaping',
        priority: 'Normal',
        assignee: 'Vedh',
        propertyName: 'Abc Apartsment',
    },
    {
        id: '1237',
        index: 2,
        status: 'Reviews',
        date: '10 Nov 2025',
        category: 'Luxury',
        subCategory: 'Lights/Beaping',
        priority: 'Normal',
        assignee: 'Vedh',
        propertyName: 'Abc Apartsment',
    },
    {
        id: '1238',
        index: 1,
        status: 'New',
        date: '12 Nov 2025',
        category: 'Exterior',
        subCategory: 'Roof & Gutters',
        priority: 'High',
        assignee: 'John',
        propertyName: 'Sunset Villa',
    },
    {
        id: '1239',
        index: 1,
        status: 'In Progress',
        date: '13 Nov 2025',
        category: 'Interior',
        subCategory: 'Plumbing',
        priority: 'Normal',
        assignee: 'Mike',
        propertyName: 'Ocean View Apartments',
    },
    {
        id: '1240',
        index: 1,
        status: 'Completed',
        date: '14 Nov 2025',
        category: 'Exterior',
        subCategory: 'Landscaping',
        priority: 'Low',
        assignee: 'Sarah',
        propertyName: 'Garden Heights',
    },
    {
        id: '1241',
        index: 1,
        status: 'New',
        date: '15 Nov 2025',
        category: 'Interior',
        subCategory: 'Electrical',
        priority: 'High',
        assignee: 'Alex',
        propertyName: 'Metro Living',
    },
];

const PROPERTIES_PER_PAGE = 5;

const Requests: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [filters, setFilters] = useState<{
        status: string[];
        assignee: string[];
        property: string[];
    }>({
        status: [],
        assignee: [],
        property: [],
    });

    const handleDeleteClick = (id: string) => {
        setRequestToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleEdit = (id: string) => {
        navigate('/dashboard/maintenance/request', { state: { editMode: true, id } });
    };

    const handleMakeRecurring = (id: string) => {
        console.log('Make recurring:', id);
        // TODO: Implement make recurring functionality
    };

    const handlePrint = (id: string) => {
        console.log('Print request:', id);
        // TODO: Implement print functionality
    };

    const confirmDelete = () => {
        console.log('Deleting request:', requestToDelete);
        setIsDeleteModalOpen(false);
        setRequestToDelete(null);
    };

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'new', label: 'New' },
            { value: 'in_progress', label: 'In Progress' },
            { value: 'completed', label: 'Completed' },
        ],
        assignee: [
            { value: 'unassignee', label: 'UnAssignee' },
            { value: 'john_doe', label: 'John Doe' },
        ],
        property: [
            { value: 'property_a', label: 'Property A' },
            { value: 'property_b', label: 'Property B' },
        ],
    };

    const filterLabels: Record<string, string> = {
        status: 'Status',
        assignee: 'Assignee',
        property: 'Property & Units',
    };

    // Filter Logic
    const filteredRequests = useMemo(() => {
        return MOCK_REQUESTS.filter(item => {
            const matchesSearch = searchQuery === '' ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.assignee.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filters.status.length === 0 || filters.status.some(s => item.status.toLowerCase() === s.toLowerCase());
            const matchesAssignee = filters.assignee.length === 0 || filters.assignee.some(a => item.assignee.toLowerCase().includes(a.toLowerCase()));
            const matchesProperty = filters.property.length === 0 || filters.property.some(p => item.propertyName.toLowerCase().includes(p.toLowerCase()));

            return matchesSearch && matchesStatus && matchesAssignee && matchesProperty;
        });
    }, [searchQuery, filters]);

    // Group requests by property
    const groupedByProperty = useMemo(() => {
        const groups: Record<string, typeof MOCK_REQUESTS> = {};
        filteredRequests.forEach(req => {
            if (!groups[req.propertyName]) groups[req.propertyName] = [];
            groups[req.propertyName].push(req);
        });
        return Object.entries(groups);
    }, [filteredRequests]);

    // Paginate properties (5 per page)
    const totalPages = Math.ceil(groupedByProperty.length / PROPERTIES_PER_PAGE);
    const paginatedProperties = useMemo(() => {
        const startIndex = (currentPage - 1) * PROPERTIES_PER_PAGE;
        return groupedByProperty.slice(startIndex, startIndex + PROPERTIES_PER_PAGE);
    }, [groupedByProperty, currentPage]);

    const toggleSelection = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleAllForProperty = (propertyRequests: typeof MOCK_REQUESTS) => {
        const propertyIds = propertyRequests.map(r => r.id);
        const allSelected = propertyIds.every(id => selectedItems.includes(id));

        if (allSelected) {
            setSelectedItems(selectedItems.filter(id => !propertyIds.includes(id)));
        } else {
            setSelectedItems([...new Set([...selectedItems, ...propertyIds])]);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Requests</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center gap-6 mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                        Requests
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/dashboard/maintenance/request')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                        >
                            Add Requests
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                        >
                            Money In
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/settings/request-settings/request-settings')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                        >
                            Settings
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                    showMoreFilters={true}
                />

                {/* Property Tables */}
                <div className="mt-8 space-y-8">
                    {paginatedProperties.map(([propertyName, requests]) => (
                        <div key={propertyName}>
                            {/* Property Pill */}
                            <div className="inline-flex items-center px-4 py-2 bg-[#3A6D6C] text-white rounded-full mb-4 shadow-sm">
                                <span className="font-medium">{propertyName}</span>
                                <span className="ml-2 bg-[#7BD747] text-white text-sm rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                                    {requests.length}
                                </span>
                            </div>

                            {/* Table Section */}
                            <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm pl-4">
                                {/* Table Header */}
                                <div className="text-white px-6 py-4 grid grid-cols-[60px_1fr_1fr_2fr_1fr_1fr_120px] gap-4 items-center text-sm font-medium">
                                    <div className="flex items-center justify-center">
                                        <button onClick={() => toggleAllForProperty(requests)} className="flex items-center justify-center">
                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${requests.every(r => selectedItems.includes(r.id)) ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                                {requests.every(r => selectedItems.includes(r.id)) && <Check className="w-3.5 h-3.5 text-white" />}
                                            </div>
                                        </button>
                                    </div>
                                    <div>Status</div>
                                    <div>Date</div>
                                    <div>Category & property</div>
                                    <div>Priority</div>
                                    <div>Assignee</div>
                                    <div></div>
                                </div>
                            </div>

                            {/* Table Body */}
                            <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t min-h-[100px]">
                                {requests.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/dashboard/maintenance/requests/${item.id}`)}
                                        className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[60px_1fr_1fr_2fr_1fr_1fr_120px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleSelection(item.id);
                                                }}
                                                className="flex items-center justify-center"
                                            >
                                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.includes(item.id) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                                    {selectedItems.includes(item.id) && <Check className="w-3.5 h-3.5 text-white" />}
                                                </div>
                                            </button>
                                            <span className="font-bold text-gray-800 text-sm">{item.index}</span>
                                        </div>

                                        <div className="text-[#3A6D6C] text-sm font-semibold">{item.status}</div>
                                        <div className="text-gray-800 text-sm font-semibold text-[#3A6D6C]">{item.date}</div>
                                        <div className="text-sm font-semibold text-[#3A6D6C]">
                                            {item.category} <span className="text-gray-400">/</span>{item.subCategory}
                                        </div>
                                        <div className="text-[#3A6D6C] text-sm font-semibold">{item.priority}</div>
                                        <div className="text-[#4ad1a6] text-sm font-semibold">{item.assignee}</div>

                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                            </button>
                                            <div className="relative">
                                                <button
                                                    className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setOpenDropdownId(openDropdownId === item.id ? null : item.id);
                                                    }}
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                                <RowActionDropdown
                                                    isOpen={openDropdownId === item.id}
                                                    onClose={() => setOpenDropdownId(null)}
                                                    onEdit={() => handleEdit(item.id)}
                                                    onMakeRecurring={() => handleMakeRecurring(item.id)}
                                                    onPrint={() => handlePrint(item.id)}
                                                    onDelete={() => handleDeleteClick(item.id)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                        className="mt-8"
                    />
                )}
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Request"
                message="Are you sure you want to delete this maintenance request? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
};

export default Requests;
