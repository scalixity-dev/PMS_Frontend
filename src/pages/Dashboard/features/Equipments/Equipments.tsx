import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Trash2, Check, ChevronLeft, Plus, Loader2 } from 'lucide-react';
import EquipmentsStats from './components/EquipmentsStats';
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
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
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
        return equipment.map((eq: BackendEquipment) => ({
            id: eq.id,
            brand: eq.brand,
            category: eq.category,
            subcategory: '', // Backend doesn't have subcategory, can be added if needed
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
        }));
    }, [equipment]);

    // Get unique categories and properties for filters
    const uniqueCategories = useMemo(() => {
        const categories = new Set(equipment.map((eq: BackendEquipment) => eq.category));
        return Array.from(categories).map(cat => ({
            value: cat.toLowerCase().replace(/\s+/g, '_'),
            label: cat,
        }));
    }, [equipment]);

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

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this equipment?')) {
            try {
                await deleteEquipmentMutation.mutateAsync(id);
            } catch (error) {
                console.error('Error deleting equipment:', error);
                alert(error instanceof Error ? error.message : 'Failed to delete equipment');
            }
        }
    };

    const handleEdit = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/dashboard/equipments/edit/${id}`);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Equipments</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-gray-600 transition-colors">
                            <ChevronLeft className="w-6 h-6" />
                            Equipments
                        </button>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard/equipments/add')}
                        className="px-6 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm flex items-center gap-2"
                    >
                        Add Equipment
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <EquipmentsStats />

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
                <div className="bg-[#3A6D6C] rounded-t-[1.5rem] overflow-hidden shadow-sm mt-8">
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
                <div className="flex flex-col gap-3 bg-[#F0F0F6] p-4 rounded-[2rem] rounded-t">
                    {paginatedEquipments.length > 0 ? (
                        paginatedEquipments.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/dashboard/equipments/${item.id}`)}
                                className="bg-white rounded-2xl px-6 py-4 grid grid-cols-[40px_80px_1fr_1.5fr_1fr_120px] gap-4 items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            >
                                <div className="flex items-center justify-center">
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
                                <div className="font-bold text-gray-800 text-sm">{item.id.slice(0, 8)}</div>
                                <div className="font-semibold text-gray-800 text-sm">{item.brand}</div>
                                <div className="text-gray-800 text-sm font-semibold">
                                    {item.category} {item.subcategory ? `/ ${item.subcategory}` : ''}
                                </div>
                                <div className="text-[#2E6819] text-sm font-semibold">{item.property}</div>

                                <div className="flex items-center justify-end gap-3">
                                    <button className="px-4 py-1 bg-[#82D64D] text-white text-xs font-medium rounded-full hover:bg-[#72bd42] transition-colors">
                                        Assign
                                    </button>
                                    <button
                                        onClick={(e) => handleEdit(item.id, e)}
                                        className="text-[#3A6D6C] hover:text-[#2c5251] transition-colors"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
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

                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                )}
                </>
                )}
            </div >
        </div >
    );
};

export default Equipments;
