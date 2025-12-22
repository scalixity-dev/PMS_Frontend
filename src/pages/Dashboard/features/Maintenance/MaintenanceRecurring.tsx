import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Check, Trash2 } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import ConfirmationModal from '../KeysLocks/ConfirmationModal';
import MakeRecurringModal from './components/MakeRecurringModal';

// Mock Data for recurring maintenance requests
const MOCK_RECURRING_REQUESTS = [
    {
        id: '1',
        index: 1,
        status: 'New',
        category: 'Luxury',
        subCategory: 'Lights/Beaping',
        startDate: '10 Nov 2025',
        endDate: '12 Nov 2025',
    },
    {
        id: '2',
        index: 2,
        status: 'Active',
        category: 'Exterior',
        subCategory: 'Roof & Gutters',
        startDate: '15 Nov 2025',
        endDate: '20 Nov 2025',
    },
    {
        id: '3',
        index: 3,
        status: 'Paused',
        category: 'Interior',
        subCategory: 'Plumbing',
        startDate: '01 Dec 2025',
        endDate: '05 Dec 2025',
    },
    {
        id: '4',
        index: 4,
        status: 'New',
        category: 'HVAC',
        subCategory: 'Filter Replacement',
        startDate: '10 Dec 2025',
        endDate: '10 Dec 2025',
    },
];

const MaintenanceRecurring: React.FC = () => {
    const navigate = useNavigate();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [filters, setFilters] = useState<{
        display: string[];
        category: string[];
        property: string[];
        equipment: string[];
    }>({
        display: [],
        category: [],
        property: [],
        equipment: [],
    });

    const handleDeleteClick = (id: string) => {
        setRequestToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        console.log('Deleting recurring request:', requestToDelete);
        setIsDeleteModalOpen(false);
        setRequestToDelete(null);
    };

    const handleCreateRecurring = (data: any) => {
        console.log('Creating recurring request:', data);
        // TODO: Add API call to create recurring request
        setShowAddModal(false);
    };

    const filterOptions: Record<string, FilterOption[]> = {
        display: [
            { value: 'all', label: 'All' },
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
        ],
        category: [
            { value: 'interior', label: 'Interior' },
            { value: 'exterior', label: 'Exterior' },
            { value: 'hvac', label: 'HVAC' },
            { value: 'plumbing', label: 'Plumbing' },
        ],
        property: [
            { value: 'property_a', label: 'Property A' },
            { value: 'property_b', label: 'Property B' },
        ],
        equipment: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
        ],
    };

    const filterLabels: Record<string, string> = {
        display: 'Display',
        category: 'Category',
        property: 'Property &Units',
        equipment: 'Equipment Status',
    };

    // Filter Logic
    const filteredRequests = useMemo(() => {
        return MOCK_RECURRING_REQUESTS.filter(item => {
            const matchesSearch = searchQuery === '' ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.subCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.status.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = filters.category.length === 0 ||
                filters.category.some(c => item.category.toLowerCase() === c.toLowerCase());

            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, filters]);

    const toggleSelection = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleAll = () => {
        const allIds = filteredRequests.map(r => r.id);
        const allSelected = allIds.every(id => selectedItems.includes(id));

        if (allSelected) {
            setSelectedItems(selectedItems.filter(id => !allIds.includes(id)));
        } else {
            setSelectedItems([...new Set([...selectedItems, ...allIds])]);
        }
    };

    const allSelected = filteredRequests.length > 0 && filteredRequests.every(r => selectedItems.includes(r.id));

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Recurring</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center gap-6 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        Recurring
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                        >
                            Add Recurring Request
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/settings/request-settings/request-settings')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
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

                {/* Table Section */}
                <div className="mt-8">
                    {/* Table Header */}
                    <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
                        <div className="text-white px-6 py-4 grid grid-cols-[60px_1.5fr_2fr_2fr_60px] gap-4 items-center text-sm font-medium">
                            <div className="flex items-center justify-center">
                                <button onClick={toggleAll} className="flex items-center justify-center">
                                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${allSelected ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                        {allSelected && <Check className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                </button>
                            </div>
                            <div>Status</div>
                            <div>Category & property</div>
                            <div>Duration</div>
                            <div></div>
                        </div>
                    </div>

                    {/* Table Body */}
                    <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-b-[2rem] min-h-[100px]">
                        {filteredRequests.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No recurring maintenance requests found.
                            </div>
                        ) : (
                            filteredRequests.map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/dashboard/maintenance/recurring/${item.id}`)}
                                    className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[60px_1.5fr_2fr_2fr_60px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
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

                                    <div className="text-sm font-semibold text-[#3A6D6C]">
                                        {item.category} <span className="text-gray-400">/</span>{item.subCategory}
                                    </div>

                                    <div className="text-[#3A6D6C] text-sm font-semibold">
                                        {item.startDate} - {item.endDate}
                                    </div>

                                    <div className="flex items-center justify-end">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(item.id);
                                            }}
                                            className="text-red-500 hover:text-red-600 transition-colors p-1"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Make Recurring Modal */}
            <MakeRecurringModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                requestDetails={{
                    category: 'Select Category',
                    subCategory: 'Select Sub-Category',
                    issue: 'Select Issue',
                    subIssue: 'Select Sub-Issue',
                    title: 'Enter Title',
                }}
                onSave={handleCreateRecurring}
            />

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Recurring Request"
                message="Are you sure you want to delete this recurring maintenance request? This action cannot be undone."
                confirmLabel="Delete"
                cancelLabel="Cancel"
            />
        </div>
    );
};

export default MaintenanceRecurring;
