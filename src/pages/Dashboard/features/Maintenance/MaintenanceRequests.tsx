import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Printer, Edit, Trash2, Plus, Check } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import ConfirmationModal from '../KeysLocks/ConfirmationModal';

// Mock Data
const MOCK_REQUESTS = [
    {
        id: '1234',
        index: 1,
        status: 'New',
        category: 'Exterior',
        subCategory: 'Roof & Gutters',
        priority: 'Normal',
        assignee: 'UnAssignee',
    },
    {
        id: '1234',
        index: 2,
        status: 'New',
        category: 'Exterior',
        subCategory: 'Roof & Gutters',
        priority: 'Normal',
        assignee: 'UnAssignee',
    },
    {
        id: '1234',
        index: 3,
        status: 'New',
        category: 'Exterior',
        subCategory: 'Roof & Gutters',
        priority: 'Normal',
        assignee: 'UnAssignee',
    },
    {
        id: '1234',
        index: 4,
        status: 'New',
        category: 'Exterior',
        subCategory: 'Roof & Gutters',
        priority: 'Normal',
        assignee: 'UnAssignee',
    },
];

const Requests: React.FC = () => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
    const [filters, setFilters] = useState<{
        status: string[];
        assignee: string[];
        property: string[];
    }>({
        status: [],
        assignee: [],
        property: [],
    });

    const handleDeleteClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setRequestToDelete(id);
        setIsDeleteModalOpen(true);
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

            // Note: Property is not in mock data explicitly, but assuming filtering logic would go here.
            // For now, we ignore property filter if not present in data
            const matchesProperty = true;

            return matchesSearch && matchesStatus && matchesAssignee && matchesProperty;
        });
    }, [searchQuery, filters]);

    const toggleSelection = (index: number) => {
        const idStr = index.toString();
        if (selectedItems.includes(idStr)) {
            setSelectedItems(selectedItems.filter(item => item !== idStr));
        } else {
            setSelectedItems([...selectedItems, idStr]);
        }
    };

    const toggleAll = () => {
        if (selectedItems.length === filteredRequests.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredRequests.map(item => item.index.toString()));
        }
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
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
                            Add Request
                            <Plus className="w-4 h-4" />
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

                {/* Table Section */}
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 pl-4">
                    {/* Table Header */}
                    <div className="text-white px-6 py-4 grid grid-cols-[60px_1fr_1fr_2fr_1fr_1fr_120px] gap-4 items-center text-sm font-medium">
                        <div className="flex items-center justify-center">
                            <button onClick={toggleAll} className="flex items-center justify-center">
                                <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.length === filteredRequests.length && filteredRequests.length > 0 ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                    {selectedItems.length === filteredRequests.length && filteredRequests.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                                </div>
                            </button>
                        </div>
                        <div>Status</div>
                        <div>Id</div>
                        <div>Category & Property</div>
                        <div>Priority</div>
                        <div>Assignee</div>
                        <div></div>
                    </div>
                </div>

                {/* Table Body */}
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t min-h-[400px]">
                    {filteredRequests.map((item) => (
                        <div
                            key={item.index}
                            onClick={() => navigate(`/dashboard/maintenance/requests/${item.id}`)}
                            className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[60px_1fr_1fr_2fr_1fr_1fr_120px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                        >
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelection(item.index);
                                    }}
                                    className="flex items-center justify-center"
                                >
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.includes(item.index.toString()) ? 'bg-[#7BD747]' : 'bg-gray-200'}`}>
                                        {selectedItems.includes(item.index.toString()) && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </button>
                                <span className="font-bold text-gray-800 text-sm">{item.index}</span>
                            </div>

                            <div className="text-[#3A6D6C] text-sm font-semibold">{item.status}</div>
                            <div className="text-gray-800 text-sm font-semibold text-[#3A6D6C]">{item.id}</div>
                            <div className="text-sm font-semibold text-[#3A6D6C]">
                                {item.category} <span className="text-gray-400">/</span> {item.subCategory}
                            </div>
                            <div className="text-[#3A6D6C] text-sm font-semibold">{item.priority}</div>
                            <div className="text-[#4ad1a6] text-sm font-semibold">{item.assignee}</div>

                            <div className="flex items-center justify-end gap-3">
                                <button className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors">
                                    <Printer className="w-5 h-5" />
                                </button>
                                <button className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors">
                                    <Edit className="w-5 h-5" />
                                </button>
                                <button
                                    className="text-red-500 hover:text-red-600 transition-colors"
                                    onClick={(e) => handleDeleteClick(item.id, e)}
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
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
