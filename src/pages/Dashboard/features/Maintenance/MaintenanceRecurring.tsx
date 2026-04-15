import React, { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ChevronLeft, Plus, Check, Trash2 } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import MakeRecurringModal from './components/MakeRecurringModal';
import {
    useGetAllMaintenanceRecurring,
    useCreateMaintenanceRecurring,
    useDeleteMaintenanceRecurring,
    type RecurringMaintenance,
} from '../../../../hooks/useMaintenanceRecurringQueries';


const MaintenanceRecurring: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [requestToDelete, setRequestToDelete] = useState<string | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const { data: recurringRequests = [] } = useGetAllMaintenanceRecurring();
    const createMutation = useCreateMaintenanceRecurring();
    const deleteMutation = useDeleteMaintenanceRecurring();

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

    const confirmDelete = async () => {
        if (!requestToDelete) return;
        try {
            await deleteMutation.mutateAsync(requestToDelete);
            setSelectedItems(prev => prev.filter(id => id !== requestToDelete));
        } catch {
            alert('Failed to delete recurring request. Please try again.');
        } finally {
            setIsDeleteModalOpen(false);
            setRequestToDelete(null);
        }
    };

    const handleCreateRecurring = (data: any) => {
        createMutation.mutate(data, {
            onSuccess: () => setShowAddModal(false),
        });
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
        return recurringRequests.filter((item: RecurringMaintenance) => {
            const matchesSearch = searchQuery === '' ||
                (item.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.category ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.frequency.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesCategory = filters.category.length === 0 ||
                filters.category.some(c => (item.category ?? '').toLowerCase() === c.toLowerCase());

            const matchesDisplay = filters.display.length === 0 ||
                filters.display.includes('all') ||
                (filters.display.includes('active') && item.isActive) ||
                (filters.display.includes('paused') && !item.isActive);

            return matchesSearch && matchesCategory && matchesDisplay;
        });
    }, [searchQuery, filters, recurringRequests]);

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
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen font-outfit transition-all duration-300`}>
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#DFE5E3] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Recurring</span>
            </div>

            <div className="p-6 bg-[#DFE5E3] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6 mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                        Recurring
                    </button>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center justify-center gap-2"
                        >
                            Add Recurring Request
                            <Plus className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => navigate('/dashboard/settings/request-settings/request-settings')}
                            className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm text-center"
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
                    {/* Desktop Table Header */}
                    <div className="hidden md:block bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm">
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
                    <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] md:rounded-b-[2rem] md:rounded-t-none min-h-[100px]">
                        {filteredRequests.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No recurring maintenance schedules found.
                            </div>
                        ) : (
                            filteredRequests.map((item: RecurringMaintenance) => (
                                <div
                                    key={item.id}
                                    onClick={() => navigate(`/dashboard/maintenance/recurring/${item.id}`)}
                                    className="bg-white rounded-2xl p-4 md:px-6 md:py-4 grid grid-cols-1 md:grid-cols-[60px_1.5fr_2fr_2fr_60px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                                >
                                    {/* Mobile: Top Row with Selection and Delete */}
                                    <div className="flex md:hidden items-center justify-between mb-2">
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
                                        </div>
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

                                    {/* Desktop: Checkbox */}
                                    <div className="hidden md:flex items-center gap-3">
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
                                    </div>

                                    {/* Status */}
                                    <div className="flex justify-between md:justify-start">
                                        <span className="md:hidden text-gray-500 text-sm">Status:</span>
                                        <div className="text-[#3A6D6C] text-sm font-semibold">{item.isActive ? 'Active' : 'Paused'}</div>
                                    </div>

                                    {/* Category & Property */}
                                    <div className="text-sm font-semibold text-[#3A6D6C] break-words">
                                        <span className="md:hidden text-gray-800 block mb-1">Category Details:</span>
                                        {item.title} {item.category && <><span className="text-gray-400">/</span> {item.category}</>}
                                    </div>

                                    {/* Duration */}
                                    <div className="text-[#3A6D6C] text-sm font-semibold">
                                        <span className="md:hidden text-gray-500 block mb-1">Duration:</span>
                                        {item.startDate ? new Date(item.startDate).toLocaleDateString() : ''}{item.endDate ? ` - ${new Date(item.endDate).toLocaleDateString()}` : ''}
                                    </div>

                                    {/* Desktop: Delete Action */}
                                    <div className="hidden md:flex items-center justify-end">
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

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Recurring Request"
                itemName="this recurring maintenance request"
            />
        </div>
    );
};

export default MaintenanceRecurring;
