import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Edit, Trash2, Check, ChevronLeft, Plus, Loader2, AlertTriangle, X } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import { useGetAllEquipment, useDeleteEquipment } from '../../../../hooks/useEquipmentQueries';
import type { BackendEquipment } from '../../../../services/equipment.service';

// Map backend status to display format
const mapStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
        'ACTIVE': 'active',
        'UNDER_MAINTENANCE': 'maintenance',
        'REPLACED': 'inactive',
        'DISPOSED': 'inactive',
    };
    return statusMap[status] || status.toLowerCase();
};

// Legacy mock data for reference (can be removed)
export const MOCK_EQUIPMENTS = [
    {
        id: 96325,
        brand: 'Tata',
        category: 'Electric meter',
        subcategory: '',
        property: '-',
        status: 'active',
        occupancy: 'occupied',
        propertyType: 'household',
        description: 'Main electric meter for the building.',
        model: 'T-1000',
        serial: 'SN-998877',
        price: '$500',
        warrantyExpiration: '2026-12-31',
        additionalEmail: 'admin@example.com',
        image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 56325,
        brand: 'Croma',
        category: 'Electric meter',
        subcategory: 'ovan',
        property: '-',
        status: 'active',
        occupancy: 'occupied',
        propertyType: 'household',
        description: 'Secondary meter.',
        model: 'C-200',
        serial: 'SN-112233',
        price: '$300',
        warrantyExpiration: '2025-06-30',
        additionalEmail: 'manager@example.com',
        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 12345,
        brand: 'Samsung',
        category: 'Appliances',
        subcategory: 'Refrigerator',
        property: 'Sunset Villa',
        status: 'maintenance',
        occupancy: 'vacant',
        propertyType: 'appliances',
        description: 'Double door refrigerator.',
        model: 'RF-500',
        serial: 'SN-445566',
        price: '$1200',
        warrantyExpiration: '2024-11-15',
        additionalEmail: 'support@samsung.com',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
    },
    {
        id: 67890,
        brand: 'LG',
        category: 'Appliances',
        subcategory: 'Washing Machine',
        property: 'Ocean View',
        status: 'inactive',
        occupancy: 'occupied',
        propertyType: 'appliances',
        description: 'Front load washing machine.',
        model: 'WM-300',
        serial: 'SN-778899',
        price: '$800',
        warrantyExpiration: '2025-01-20',
        additionalEmail: 'service@lg.com',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80'
    }
];

const ITEMS_PER_PAGE = 9;

const Equipments: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed = false } = useOutletContext<{ sidebarCollapsed?: boolean }>() || {};
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [equipmentToDelete, setEquipmentToDelete] = useState<{ id: string; name: string } | null>(null);
    const [filters, setFilters] = useState<{
        status: string[];
        category: string[];
        property: string[];
    }>({
        status: [],
        category: [],
        property: []
    });

    // Fetch equipment from backend
    const { data: equipment = [], isLoading, error } = useGetAllEquipment();
    const deleteEquipmentMutation = useDeleteEquipment();

    // Transform backend equipment to display format
    const transformedEquipment = useMemo(() => {
        return equipment.map((eq: BackendEquipment) => {
            // Handle category being either a string or an object { id, name, description }
            const categoryName =
                typeof eq.category === 'string'
                    ? eq.category
                    : eq.category && typeof eq.category === 'object'
                        ? eq.category.name ?? ''
                        : '';

            // Handle subcategory being an object { id, name, description } or string (provided by backend)
            const subcategoryName =
                typeof eq.subcategory === 'object'
                    ? eq.subcategory?.name || ''
                    : (eq.subcategory || '');

            return {
                id: eq.id,
                brand: eq.brand,
                category: categoryName,
                subcategory: subcategoryName, // Extracted from backend subcategory object
                property: eq.property?.propertyName || '-',
                status: mapStatus(eq.status),
                occupancy: eq.unitId ? 'occupied' : 'vacant', // Simplified logic
                propertyType: 'household', // Default value
                description: eq.equipmentDetails || '',
                model: eq.model,
                serial: eq.serialNumber,
                price: typeof eq.price === 'string' ? eq.price : `$${eq.price}`,
                warrantyExpiration: '', // Not in backend model, can be added
                additionalEmail: '', // Not in backend model
                image: eq.photoUrl || '',
            };
        });
    }, [equipment]);

    // Get unique categories and properties for filters (based on transformed equipment)
    const uniqueCategories = useMemo(() => {
        const categories = new Set(
            transformedEquipment
                .map(item => item.category)
                .filter((cat): cat is string => typeof cat === 'string' && cat.trim().length > 0)
        );

        return Array.from(categories).map(cat => ({
            value: cat.toLowerCase().replace(/\s+/g, '_'),
            label: cat,
        }));
    }, [transformedEquipment]);

    const uniqueProperties = useMemo(() => {
        const properties = new Set(
            equipment
                .map((eq: BackendEquipment) => eq.property?.propertyName)
                .filter(Boolean)
        );
        return Array.from(properties).map((prop, idx) => ({
            value: `prop${idx + 1}`,
            label: prop as string,
        }));
    }, [equipment]);

    const filterOptions: Record<string, FilterOption[]> = {
        property: uniqueProperties.length > 0 ? uniqueProperties : [
            { value: 'prop1', label: 'Property 1' },
            { value: 'prop2', label: 'Property 2' },
        ],
        status: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'maintenance', label: 'Under Maintenance' },
        ],
        category: uniqueCategories.length > 0 ? uniqueCategories : [
            { value: 'electric_meter', label: 'Electric meter' },
            { value: 'appliances', label: 'Appliances' },
        ]
    };

    const filterLabels: Record<string, string> = {
        property: 'Properties & units',
        status: 'Equipment status',
        category: 'Category & Subcategory'
    };

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    const filteredEquipments = useMemo(() => {
        return transformedEquipment.filter(item => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.model.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(item.status);

            // Category filter
            const matchesCategory = filters.category.length === 0 ||
                filters.category.some(cat => item.category.toLowerCase().includes(cat.replace('_', ' ')));

            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [transformedEquipment, searchQuery, filters]);

    const totalPages = Math.ceil(filteredEquipments.length / ITEMS_PER_PAGE);
    const paginatedEquipments = filteredEquipments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const toggleSelection = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const toggleAll = () => {
        if (selectedItems.length === paginatedEquipments.length && paginatedEquipments.length > 0) {
            setSelectedItems([]);
        } else {
            setSelectedItems(paginatedEquipments.map(item => item.id));
        }
    };

    const openDeleteModal = (item: { id: string; brand: string }, e: React.MouseEvent) => {
        e.stopPropagation();
        setEquipmentToDelete({
            id: item.id,
            name: item.brand || item.id.slice(0, 8),
        });
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        if (deleteEquipmentMutation.isPending) return;
        setIsDeleteModalOpen(false);
        setEquipmentToDelete(null);
    };

    const confirmDelete = async () => {
        if (!equipmentToDelete) return;
        try {
            await deleteEquipmentMutation.mutateAsync(equipmentToDelete.id);
            closeDeleteModal();
        } catch (error) {
            console.error('Error deleting equipment:', error);
            alert(error instanceof Error ? error.message : 'Failed to delete equipment');
        }
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/dashboard/equipments/edit/${id}`);
    };

    return (
        <div className={`mx-auto min-h-screen font-outfit ${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'}`}>
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Equipments</span>
            </div>

            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-[1.5rem] md:rounded-[2rem] overflow-visible flex flex-col">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Equipments</h1>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/equipments/add')}
                        className="w-full md:w-auto justify-center px-5 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-1"
                    >
                        Add Equipment
                        <Plus className="w-4 h-4" />
                    </button>
                </div>

                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                />

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12 mt-8">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C]" />
                        <p className="ml-4 text-gray-600">Loading equipment...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mt-8">
                        <p className="text-red-800">
                            {error instanceof Error ? error.message : 'Failed to load equipment'}
                        </p>
                    </div>
                )}

                {/* Table Section */}
                {!isLoading && !error && (
                    <>
                        <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8 hidden md:block">
                            {/* Table Header */}
                            <div className="text-white px-6 py-4 grid grid-cols-[40px_80px_1fr_1.5fr_1fr_120px] gap-4 items-center text-sm font-medium">
                                <div className="flex items-center justify-center ml-2">
                                    <button onClick={toggleAll} className="flex items-center justify-center">
                                        <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${selectedItems.length === paginatedEquipments.length && paginatedEquipments.length > 0 ? 'bg-[#7BD747]' : 'bg-white/20 border border-white/50'}`}>
                                            {selectedItems.length === paginatedEquipments.length && paginatedEquipments.length > 0 && <Check className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </button>
                                </div>
                                <div>ID</div>
                                <div>Brand</div>
                                <div>Category & subcategory</div>
                                <div>Property</div>
                                <div></div>
                            </div>
                        </div>

                        {/* Table Body */}
                        <div className="flex flex-col gap-3 md:bg-[#F0F0F6] md:p-4 md:rounded-[2rem] md:rounded-t-none">
                            {paginatedEquipments.length > 0 ? (
                                paginatedEquipments.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => navigate(`/dashboard/equipments/${item.id}`)}
                                        className="bg-white rounded-2xl px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-[40px_80px_1fr_1.5fr_1fr_120px] gap-2 md:gap-4 items-start md:items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                                    >
                                        <div className="flex items-center justify-start md:justify-center absolute top-4 left-4 md:static">
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
                                        <div className="font-bold text-gray-500 md:text-gray-800 text-xs md:text-sm pl-8 md:pl-0 mt-0.5 md:mt-0">ID: {item.id.slice(0, 8)}</div>
                                        <div className="font-bold text-gray-800 text-lg md:text-sm md:font-semibold mt-1 md:mt-0">{item.brand}</div>
                                        <div className="text-gray-600 md:text-gray-800 text-sm font-medium md:font-semibold">
                                            <span className="md:hidden text-gray-400 text-xs block">Category</span>
                                            {item.category} {item.subcategory ? `/ ${item.subcategory}` : ''}
                                        </div>
                                        <div className="text-[#2E6819] text-sm font-semibold">
                                            <span className="md:hidden text-gray-400 text-xs block">Property</span>
                                            {item.property}
                                        </div>

                                        <div className="flex items-center justify-end gap-3 absolute top-4 right-4 md:static">
                                            <button
                                                onClick={(e) => handleEdit(item.id, e)}
                                                className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={(e) => openDeleteModal(item, e)}
                                                disabled={deleteEquipmentMutation.isPending}
                                                className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12 bg-white rounded-2xl">
                                    <p className="text-gray-500 text-lg">No equipments found matching your filters</p>
                                    <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                                </div>
                            )}
                        </div>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            className="mt-auto py-6"
                        />
                    </>
                )}

                {/* Delete Equipment Modal */}
                {isDeleteModalOpen && equipmentToDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 animate-in fade-in zoom-in-95 duration-200">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                                        <AlertTriangle className="w-5 h-5 text-red-600" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800">Delete Equipment</h3>
                                </div>
                                <button
                                    onClick={closeDeleteModal}
                                    disabled={deleteEquipmentMutation.isPending}
                                    className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-700 mb-4">
                                    Are you sure you want to delete{' '}
                                    <span className="font-semibold text-gray-900">
                                        "{equipmentToDelete.name}"
                                    </span>
                                    ?
                                </p>
                                <p className="text-sm text-gray-500 mb-6">
                                    This action cannot be undone. All associated data for this equipment will be permanently deleted.
                                </p>

                                {/* Actions */}
                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={closeDeleteModal}
                                        disabled={deleteEquipmentMutation.isPending}
                                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        disabled={deleteEquipmentMutation.isPending}
                                        className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {deleteEquipmentMutation.isPending ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            'Delete Equipment'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Equipments;
