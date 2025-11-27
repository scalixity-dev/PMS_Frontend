import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertiesHeader from './components/PropertiesHeader';
import PropertiesFilter from './components/PropertiesFilter';
import PropertyCard from './components/PropertyCard';

const MOCK_PROPERTIES = [
    {
        id: 1,
        name: 'Luxury Apartment',
        address: '78 Scheme No 78 - II Indore, MP, 452010, IN',
        balance: 50000,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80',
        type: 'Single Family',
        status: 'active',
        occupancy: 'occupied',
        propertyType: 'single_family',
        balanceCategory: 'medium'
    },
    {
        id: 2,
        name: 'Avasa Apartment',
        address: '78 Scheme No 78 - II Indore, MP, 452010, IN',
        balance: 75000,
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        type: 'Single Family',
        status: 'active',
        occupancy: 'vacant',
        propertyType: 'single_family',
        balanceCategory: 'high'
    },
    {
        id: 3,
        name: 'Anaya Apartment',
        address: '78 Scheme No 78 - II Indore, MP, 452010, IN',
        balance: 50000,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
        type: 'Single Family',
        status: 'pending',
        occupancy: 'occupied',
        propertyType: 'apartment',
        balanceCategory: 'medium'
    },
    {
        id: 4,
        name: 'HR Apartment',
        address: '78 Scheme No 78 - II Indore, MP, 452010, IN',
        balance: 75000,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1453&q=80',
        type: 'Single Family',
        status: 'inactive',
        occupancy: 'partially_occupied',
        propertyType: 'condo',
        balanceCategory: 'high'
    }
];

const Properties: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
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

    return (
        <div className="max-w-6xl mx-auto min-h-screen">
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Properties</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                <PropertiesHeader onAddProperty={handleAddProperty} />

                <PropertiesFilter 
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setFilters}
                />

                {filteredProperties.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredProperties.map((property) => (
                            <PropertyCard
                                key={property.id}
                                {...property}
                            />
                        ))}
                    </div>
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
