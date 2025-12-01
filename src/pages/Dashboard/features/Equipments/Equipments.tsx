import React, { useState, useMemo, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import EquipmentsHeader from './components/EquipmentsHeader';
import EquipmentsStats from './components/EquipmentsStats';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import EquipmentCard from './components/EquipmentCard';
import Pagination from '../../components/Pagination';

const MOCK_EQUIPMENTS = [
    {
        id: 1,
        propertyName: 'HR Apartment',
        category: 'Household / Toilet',
        unit: 'Unit 3',
        status: 'active',
        occupancy: 'occupied',
        propertyType: 'household',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80',
    },
    {
        id: 2,
        propertyName: 'HR Apartment',
        category: 'Household / Toilet',
        unit: 'Unit 3',
        status: 'maintenance',
        occupancy: 'vacant',
        propertyType: 'household',
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
        id: 3,
        propertyName: 'Sunset Villa',
        category: 'Appliances / Refrigerator',
        unit: 'Unit 5',
        status: 'active',
        occupancy: 'occupied',
        propertyType: 'appliances',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    },
    {
        id: 4,
        propertyName: 'Ocean View',
        category: 'Plumbing / Sink',
        unit: 'Unit 2',
        status: 'inactive',
        occupancy: 'occupied',
        propertyType: 'plumbing',
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80',
    }
];

const ITEMS_PER_PAGE = 9;

const Equipments: React.FC = () => {
    // const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<{
        status: string[];
        occupancy: string[];
        propertyType: string[];
    }>({
        status: [],
        occupancy: [],
        propertyType: []
    });

    const handleAddEquipment = () => {
        // navigate('/dashboard/equipment/add');
        console.log('Add Equipment Clicked');
    };

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'maintenance', label: 'Under Maintenance' },
        ],
        occupancy: [
            { value: 'occupied', label: 'Occupied' },
            { value: 'vacant', label: 'Vacant' },
        ],
        propertyType: [
            { value: 'household', label: 'Household' },
            { value: 'appliances', label: 'Appliances' },
            { value: 'plumbing', label: 'Plumbing' },
            { value: 'electrical', label: 'Electrical' },
            { value: 'exterior', label: 'Exterior' },
            { value: 'outdoors', label: 'Outdoors' },
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

    const filteredEquipments = useMemo(() => {
        return MOCK_EQUIPMENTS.filter(equipment => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                equipment.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                equipment.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                equipment.unit.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(equipment.status);

            // Occupancy filter
            const matchesOccupancy = filters.occupancy.length === 0 ||
                filters.occupancy.includes(equipment.occupancy);

            // Property Type filter
            const matchesPropertyType = filters.propertyType.length === 0 ||
                filters.propertyType.includes(equipment.propertyType);

            return matchesSearch && matchesStatus && matchesOccupancy && matchesPropertyType;
        });
    }, [searchQuery, filters]);

    const totalPages = Math.ceil(filteredEquipments.length / ITEMS_PER_PAGE);
    const paginatedEquipments = filteredEquipments.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="max-w-6xl mx-auto min-h-screen">
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Equipments</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                <EquipmentsHeader onAddEquipment={handleAddEquipment} />

                <EquipmentsStats />

                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                />

                {paginatedEquipments.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paginatedEquipments.map((equipment) => (
                                <EquipmentCard
                                    key={equipment.id}
                                    {...equipment}
                                />
                            ))}
                        </div>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages || 1}
                            onPageChange={setCurrentPage}
                        />
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">No equipments found matching your filters</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div >
        </div >
    );
};

export default Equipments;
