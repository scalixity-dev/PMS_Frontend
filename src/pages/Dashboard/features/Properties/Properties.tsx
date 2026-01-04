import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Loader2, Building2 } from 'lucide-react';
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
    status: 'active' | 'archived';
    occupancy: 'vacant' | 'occupied' | 'partially_occupied';
    propertyType: 'single_apartment' | 'multi_apartment';
    balanceCategory: 'low' | 'medium' | 'high';
    country?: string;
    marketingStatus: 'listed' | 'unlisted' | 'draft';
    currency?: string;
}

const Properties: React.FC = () => {
    const navigate = useNavigate();
    const { sidebarCollapsed } = useOutletContext<{ sidebarCollapsed: boolean }>() || { sidebarCollapsed: false };
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
        marketingStatus: string[];
        balance: string[];
    }>({
        status: [],
        occupancy: [],
        propertyType: [],
        marketingStatus: [],
        balance: []
    });

    // Transform backend property to frontend format
    const transformProperty = (backendProperty: BackendProperty): Property => {
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

        const image = backendProperty.coverPhotoUrl
            || backendProperty.photos?.find((p) => p.isPrimary)?.photoUrl
            || backendProperty.photos?.[0]?.photoUrl
            || null;

        const statusMap: Record<string, 'active' | 'archived'> = {
            'ACTIVE': 'active',
            'ARCHIVED': 'archived',
        };
        const status = backendProperty.status
            ? statusMap[backendProperty.status] || 'archived'
            : 'archived';

        const propertyTypeMap: Record<string, 'single_apartment' | 'multi_apartment'> = {
            'SINGLE': 'single_apartment',
            'MULTI': 'multi_apartment',
        };
        const propertyType = propertyTypeMap[backendProperty.propertyType] || 'single_apartment';

        let occupancy: 'vacant' | 'occupied' | 'partially_occupied' = 'vacant';
        if (backendProperty.leasing?.occupancyStatus) {
            const occupancyMap: Record<string, 'vacant' | 'occupied' | 'partially_occupied'> = {
                'VACANT': 'vacant',
                'OCCUPIED': 'occupied',
                'PARTIALLY_OCCUPIED': 'partially_occupied',
            };
            occupancy = occupancyMap[backendProperty.leasing.occupancyStatus] || 'vacant';
        }

        let monthlyRent = 0;
        if (backendProperty.leasing?.monthlyRent) {
            monthlyRent = typeof backendProperty.leasing.monthlyRent === 'string'
                ? parseFloat(backendProperty.leasing.monthlyRent) || 0
                : Number(backendProperty.leasing.monthlyRent) || 0;
        } else if (backendProperty.marketRent) {
            monthlyRent = typeof backendProperty.marketRent === 'string'
                ? parseFloat(backendProperty.marketRent) || 0
                : Number(backendProperty.marketRent) || 0;
        }

        const countryToCurrency: Record<string, string> = {
            'United States': 'USD',
            'USA': 'USD',
            'US': 'USD',
            'Canada': 'CAD',
            'United Kingdom': 'GBP',
            'UK': 'GBP',
            'Australia': 'AUD',
            'New Zealand': 'NZD',
            'India': 'INR',
            'China': 'CNY',
            'Japan': 'JPY',
            'Germany': 'EUR',
            'France': 'EUR',
            'Italy': 'EUR',
            'Spain': 'EUR',
            'Netherlands': 'EUR',
            'Belgium': 'EUR',
            'Switzerland': 'CHF',
            'Singapore': 'SGD',
            'Hong Kong': 'HKD',
            'UAE': 'AED',
            'United Arab Emirates': 'AED',
            'Saudi Arabia': 'SAR',
            'South Africa': 'ZAR',
            'Brazil': 'BRL',
            'Mexico': 'MXN',
        };
        const currency = country ? (countryToCurrency[country] || 'USD') : 'USD';

        let balanceCategory: 'low' | 'medium' | 'high' = 'medium';
        const currencyThresholds: Record<string, { low: number; high: number }> = {
            'USD': { low: 25000, high: 75000 },
            'CAD': { low: 33000, high: 100000 },
            'GBP': { low: 20000, high: 60000 },
            'EUR': { low: 23000, high: 69000 },
            'AUD': { low: 37000, high: 110000 },
            'INR': { low: 2000000, high: 6000000 },
            'CNY': { low: 180000, high: 540000 },
            'JPY': { low: 3500000, high: 10500000 },
            'SGD': { low: 33000, high: 100000 },
            'HKD': { low: 195000, high: 585000 },
            'AED': { low: 92000, high: 275000 },
            'SAR': { low: 94000, high: 280000 },
        };

        const thresholds = currencyThresholds[currency] || currencyThresholds['USD'];
        if (monthlyRent < thresholds.low) {
            balanceCategory = 'low';
        } else if (monthlyRent > thresholds.high) {
            balanceCategory = 'high';
        }

        let marketingStatus: 'listed' | 'unlisted' | 'draft' = 'unlisted';
        if (backendProperty.listings && backendProperty.listings.length > 0) {
            const hasActiveListing = backendProperty.listings.some(
                listing => listing.listingStatus === 'ACTIVE'
            );
            const hasDraftListing = backendProperty.listings.some(
                listing => listing.listingStatus === 'DRAFT'
            );

            if (hasActiveListing) {
                marketingStatus = 'listed';
            } else if (hasDraftListing) {
                marketingStatus = 'draft';
            }
        }

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
            marketingStatus,
            currency,
        };
    };

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const backendProperties = await propertyService.getAll(true);
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

    const handleImport = () => {
        navigate('/dashboard/properties/import');
    };

    const filterOptions: Record<string, FilterOption[]> = useMemo(() => ({
        status: [
            { value: 'active', label: 'Active' },
            { value: 'archived', label: 'Archived' },
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
        marketingStatus: [
            { value: 'listed', label: 'Listed' },
            { value: 'unlisted', label: 'Unlisted' },
            { value: 'draft', label: 'Draft' },
        ],
        balance: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
        ]
    }), []);

    const filterLabels: Record<string, string> = useMemo(() => ({
        status: 'Status',
        occupancy: 'Occupancy',
        propertyType: 'Property Type',
        marketingStatus: 'Marketing Status',
        balance: 'Balance'
    }), []);

    const filteredProperties = useMemo(() => {
        return properties.filter(property => {
            const matchesSearch = searchQuery === '' ||
                property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                property.type.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(property.status);

            const matchesOccupancy = filters.occupancy.length === 0 ||
                filters.occupancy.includes(property.occupancy);

            const matchesPropertyType = filters.propertyType.length === 0 ||
                filters.propertyType.includes(property.propertyType);

            const matchesMarketingStatus = filters.marketingStatus.length === 0 ||
                filters.marketingStatus.includes(property.marketingStatus);

            const matchesBalance = filters.balance.length === 0 ||
                filters.balance.includes(property.balanceCategory);

            return matchesSearch && matchesStatus && matchesOccupancy && matchesPropertyType && matchesMarketingStatus && matchesBalance;
        });
    }, [properties, searchQuery, filters]);

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
        <div className={`${sidebarCollapsed ? 'max-w-full' : 'max-w-7xl'} mx-auto min-h-screen transition-all duration-300`}>
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-4 md:mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Properties</span>
            </div>

            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-[1.5rem] md:rounded-[2rem] overflow-visible flex flex-col">
                <PropertiesHeader onAddProperty={handleAddProperty} onImport={handleImport} />

                {/* Filters - Now uses built-in mobile support */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                    searchPlaceholder="Search properties..."
                />

                {loading ? (
                    <div className="text-center py-12 bg-white rounded-2xl mt-4">
                        <Loader2 className="w-8 h-8 animate-spin text-[#3A6D6C] mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">Loading properties...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-12 bg-white rounded-2xl mt-4">
                        <p className="text-red-500 text-lg">Error: {error}</p>
                        <p className="text-gray-400 text-sm mt-2">Please try refreshing the page</p>
                    </div>
                ) : filteredProperties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 mt-4">
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
                            className="mt-auto py-6"
                        />
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl mt-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F5F5DC] rounded-2xl mb-4">
                            <Building2 className="w-8 h-8 text-[#8B8B4A]" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">No properties yet</h3>
                        <p className="text-gray-500 text-sm mb-4">Add your first property to get started</p>
                        <button
                            onClick={handleAddProperty}
                            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#7BD747] text-white font-medium rounded-full hover:bg-[#6bc93a] transition-colors"
                        >
                            Add Property
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Properties;
