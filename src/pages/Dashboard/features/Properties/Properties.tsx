import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropertiesHeader from './components/PropertiesHeader';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import PropertyCard from './components/PropertyCard';
import { propertyService, type BackendProperty } from '../../../../services/property.service';

// Property interface for the component
interface Property {
    id: string;
    name: string;
    address: string;
    balance: number;
    image: string | null;
    type: string;
    status: 'active' | 'inactive' | 'pending';
    occupancy: 'vacant' | 'occupied' | 'partially_occupied';
    propertyType: 'single_apartment' | 'multi_apartment';
    balanceCategory: 'low' | 'medium' | 'high';
    country?: string;
}

const Properties: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    // Transform backend property to frontend format
    const transformProperty = (backendProperty: BackendProperty): Property => {
        // Format address and extract country
        let address = 'Address not available';
        let country: string | undefined;
        if (backendProperty.address) {
            country = backendProperty.address.country;
            const addressParts = [
                backendProperty.address.streetAddress,
                backendProperty.address.city,
                backendProperty.address.stateRegion,
                backendProperty.address.zipCode,
                backendProperty.address.country,
            ].filter(part => part && part.trim() !== '');
            
            if (addressParts.length > 0) {
                address = addressParts.join(', ');
            }
        }

        // Get image - prioritize coverPhotoUrl, then primary photo, then first photo
        // Use null if no image exists to prevent data leakage (sharing same default image)
        const image = backendProperty.coverPhotoUrl 
            || backendProperty.photos?.find((p) => p.isPrimary)?.photoUrl 
            || backendProperty.photos?.[0]?.photoUrl 
            || null;

        // Map status from backend to frontend
        const statusMap: Record<string, 'active' | 'inactive' | 'pending'> = {
            'ACTIVE': 'active',
            'INACTIVE': 'inactive',
            'ARCHIVED': 'inactive',
        };
        const status = backendProperty.status 
            ? statusMap[backendProperty.status] || 'inactive'
            : 'inactive';

        // Map property type
        const propertyTypeMap: Record<string, 'single_apartment' | 'multi_apartment'> = {
            'SINGLE': 'single_apartment',
            'MULTI': 'multi_apartment',
        };
        const propertyType = propertyTypeMap[backendProperty.propertyType] || 'single_apartment';

        // Determine occupancy from leasing data
        let occupancy: 'vacant' | 'occupied' | 'partially_occupied' = 'vacant';
        if (backendProperty.leasing?.occupancyStatus) {
            const occupancyMap: Record<string, 'vacant' | 'occupied' | 'partially_occupied'> = {
                'VACANT': 'vacant',
                'OCCUPIED': 'occupied',
                'PARTIALLY_OCCUPIED': 'partially_occupied',
            };
            occupancy = occupancyMap[backendProperty.leasing.occupancyStatus] || 'vacant';
        }

        // Calculate balance from monthly rent (prioritize leasing monthlyRent, then marketRent)
        let monthlyRent = 0;
        
        // First check if there's monthlyRent in leasing data
        if (backendProperty.leasing?.monthlyRent) {
            monthlyRent = typeof backendProperty.leasing.monthlyRent === 'string'
                ? parseFloat(backendProperty.leasing.monthlyRent) || 0
                : Number(backendProperty.leasing.monthlyRent) || 0;
        } 
        // Fall back to marketRent from property
        else if (backendProperty.marketRent) {
            monthlyRent = typeof backendProperty.marketRent === 'string'
                ? parseFloat(backendProperty.marketRent) || 0
                : Number(backendProperty.marketRent) || 0;
        }
        
        // Determine balance category based on monthly rent
        let balanceCategory: 'low' | 'medium' | 'high' = 'medium';
        if (monthlyRent < 25000) {
            balanceCategory = 'low';
        } else if (monthlyRent > 75000) {
            balanceCategory = 'high';
        }

        // Get property type label for display
        const typeLabels: Record<string, string> = {
            'single_apartment': 'Single Apartment',
            'multi_apartment': 'Multi Apartment',
        };
        const type = typeLabels[propertyType] || 'Property';

        return {
            id: backendProperty.id,
            name: backendProperty.propertyName,
            address,
            balance: monthlyRent || 0,
            image,
            type,
            status,
            occupancy,
            propertyType,
            balanceCategory,
            country,
        };
    };

    // Fetch properties from API
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const backendProperties = await propertyService.getAll();
                const transformedProperties = backendProperties.map(transformProperty);
                setProperties(transformedProperties);
            } catch (err) {
                console.error('Error fetching properties:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch properties');
                setProperties([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

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
            { value: 'single_apartment', label: 'Single Apartment' },
            { value: 'multi_apartment', label: 'Multi Apartment' },
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
        return properties.filter(property => {
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
    }, [properties, searchQuery, filters]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
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

                {loading ? (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">Loading properties...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-red-500 text-lg">Error: {error}</p>
                        <p className="text-gray-400 text-sm mt-2">Please try refreshing the page</p>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {currentProperties.map((property) => (
                                <PropertyCard
                                    key={property.id}
                                    id={property.id}
                                    name={property.name}
                                    address={property.address}
                                    balance={property.balance}
                                    image={property.image}
                                    type={property.type}
                                    country={property.country}
                                    propertyType={property.propertyType}
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
