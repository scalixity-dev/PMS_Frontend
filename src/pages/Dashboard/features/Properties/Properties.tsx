import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertiesHeader from './components/PropertiesHeader';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import PropertyCard from './components/PropertyCard';

const PROPERTY_NAMES = [
    'Sunset Heights', 'Ocean View Villa', 'Maplewood Residency', 'Golden Palm Apartments',
    'Silver Oak Estate', 'Royal Gardens', 'Emerald Valley', 'Crystal Tower',
    'Harmony Enclave', 'Willow Creek', 'Sunrise Point', 'Blue Horizon',
    'Green Meadows', 'Prestige Towers', 'Serenity Homes', 'Urban Nest',
    'Skyline Lofts', 'Riverfront Villa', 'Mountain View', 'Cedar Grove',
    'Pine Valley', 'Lakeside Manor', 'Victoria Court', 'Grand Horizon'
];

const MOCK_PROPERTIES = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    name: PROPERTY_NAMES[i] || `Property ${i + 1}`,
    address: '78 Scheme No 78 - II Indore, MP, 452010, IN',
    balance: 50000 + (i * 1000),
    image: i % 3 === 0
        ? 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80'
        : i % 3 === 1
            ? 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
            : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    type: 'Single Family',
    status: i % 4 === 0 ? 'inactive' : 'active',
    occupancy: i % 3 === 0 ? 'vacant' : 'occupied',
    propertyType: i % 2 === 0 ? 'single_family' : 'apartment',
    balanceCategory: i % 3 === 0 ? 'high' : 'medium'
}));

const Properties: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const [filters, setFilters] = useState<{
        status: string[];
        occupancy: string[];
        propertyType: string[];
        balance: string[];
    }>({
        status: [],
        occupancy: [],
        propertyType: [],
        balance: []
    });

    const handleAddProperty = () => {
        navigate('/dashboard/property/add');
    };

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
            { value: 'pending', label: 'Pending' },
        ],
        occupancy: [
            { value: 'occupied', label: 'Occupied' },
            { value: 'vacant', label: 'Vacant' },
            { value: 'partially_occupied', label: 'Partially Occupied' },
        ],
        propertyType: [
            { value: 'single_family', label: 'Single Family' },
            { value: 'multi_family', label: 'Multi Family' },
            { value: 'apartment', label: 'Apartment' },
            { value: 'condo', label: 'Condo' },
            { value: 'townhouse', label: 'Townhouse' },
        ],
        balance: [
            { value: 'low', label: 'Low (< $25k)' },
            { value: 'medium', label: 'Medium ($25k - $75k)' },
            { value: 'high', label: 'High (> $75k)' },
        ]
    };

    const filterLabels: Record<string, string> = {
        status: 'Status',
        occupancy: 'Occupancy',
        propertyType: 'Property Type',
        balance: 'Balance'
    };

    const filteredProperties = useMemo(() => {
        return MOCK_PROPERTIES.filter(property => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.type.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(property.status);

            // Occupancy filter
            const matchesOccupancy = filters.occupancy.length === 0 ||
                filters.occupancy.includes(property.occupancy);

            // Property Type filter
            const matchesPropertyType = filters.propertyType.length === 0 ||
                filters.propertyType.includes(property.propertyType);

            // Balance filter
            const matchesBalance = filters.balance.length === 0 ||
                filters.balance.includes(property.balanceCategory);

            return matchesSearch && matchesStatus && matchesOccupancy && matchesPropertyType && matchesBalance;
        });
    }, [searchQuery, filters]);

    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    const currentProperties = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredProperties.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredProperties, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-6xl mx-auto min-h-screen">
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Properties</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                <PropertiesHeader onAddProperty={handleAddProperty} />

                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                />

                {filteredProperties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    {...property}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">No properties found matching your filters</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div >
        </div >
    );
};

export default Properties;
