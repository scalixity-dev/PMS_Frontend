import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckSquare, Square } from 'lucide-react';
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
    status: 'active' | 'archived' ;
    occupancy: 'vacant' | 'occupied' | 'partially_occupied';
    propertyType: 'single_apartment' | 'multi_apartment';
    balanceCategory: 'low' | 'medium' | 'high';
    country?: string;
    marketingStatus: 'listed' | 'unlisted' | 'draft';
    currency?: string;
}

const Properties: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectionMode, setSelectionMode] = useState(false);
    const [selectedProperties, setSelectedProperties] = useState<Set<string>>(new Set());
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
        const statusMap: Record<string, 'active' | 'archived'> = {
            'ACTIVE': 'active',
            'ARCHIVED': 'archived',
        };
        const status = backendProperty.status
            ? statusMap[backendProperty.status] || 'archived'
            : 'archived';

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

        // Map country to currency (default to USD if country not found)
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

        // Determine balance category based on monthly rent and currency
        // Use currency-agnostic percentiles or currency-specific thresholds
        let balanceCategory: 'low' | 'medium' | 'high' = 'medium';
        
        // Currency-specific thresholds (in base currency units)
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

        // Determine marketing status from listings
        let marketingStatus: 'listed' | 'unlisted' | 'draft' = 'unlisted';
        if (backendProperty.listings && backendProperty.listings.length > 0) {
            // Check if any listing is ACTIVE
            const hasActiveListing = backendProperty.listings.some(
                listing => listing.listingStatus === 'ACTIVE'
            );
            // Check if any listing is DRAFT
            const hasDraftListing = backendProperty.listings.some(
                listing => listing.listingStatus === 'DRAFT'
            );
            
            if (hasActiveListing) {
                marketingStatus = 'listed';
            } else if (hasDraftListing) {
                marketingStatus = 'draft';
            }
            // Otherwise remains 'unlisted'
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
            marketingStatus,
            currency,
        };
    };

    // Fetch properties from API (include listings to determine marketing status)
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                setLoading(true);
                setError(null);
                const backendProperties = await propertyService.getAll(true); // Include listings
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

    const handleToggleSelectionMode = () => {
        setSelectionMode(!selectionMode);
        setSelectedProperties(new Set());
    };

    const handleSelectProperty = (id: string | number, selected: boolean) => {
        const idString = String(id);
        setSelectedProperties(prev => {
            const newSet = new Set(prev);
            if (selected) {
                newSet.add(idString);
            } else {
                newSet.delete(idString);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedProperties.size === filteredProperties.length) {
            setSelectedProperties(new Set());
        } else {
            setSelectedProperties(new Set(filteredProperties.map(p => p.id)));
        }
    };

    const handleBulkDelete = async () => {
        if (selectedProperties.size === 0) return;

        setIsDeleting(true);
        setError(null);

        try {
            const propertyIds = Array.from(selectedProperties);
            const result = await propertyService.bulkDelete(propertyIds);

            if (result.errors.length > 0) {
                const errorMessages = result.errors.map(e => `${e.id}: ${e.error}`).join(', ');
                setError(`Some properties could not be deleted: ${errorMessages}`);
            }

            // Refresh properties list
            const backendProperties = await propertyService.getAll(true);
            const transformedProperties = backendProperties.map(transformProperty);
            setProperties(transformedProperties);

            // Clear selection
            setSelectedProperties(new Set());
            setSelectionMode(false);
            setShowDeleteConfirm(false);

            if (result.deleted > 0) {
                // Show success message (you can add a toast notification here)
                console.log(`Successfully deleted ${result.deleted} property(ies)`);
            }
        } catch (err) {
            console.error('Error deleting properties:', err);
            setError(err instanceof Error ? err.message : 'Failed to delete properties');
        } finally {
            setIsDeleting(false);
        }
    };

    const filterOptions: Record<string, FilterOption[]> = {
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
    };

    const filterLabels: Record<string, string> = {
        status: 'Status',
        occupancy: 'Occupancy',
        propertyType: 'Property Type',
        marketingStatus: 'Marketing Status',
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

            // Marketing Status filter
            const matchesMarketingStatus = filters.marketingStatus.length === 0 ||
                filters.marketingStatus.includes(property.marketingStatus);

            // Balance filter (currency-agnostic - uses relative categories)
            const matchesBalance = filters.balance.length === 0 ||
                filters.balance.includes(property.balanceCategory);

            return matchesSearch && matchesStatus && matchesOccupancy && matchesPropertyType && matchesMarketingStatus && matchesBalance;
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
                <PropertiesHeader onAddProperty={handleAddProperty} onImport={handleImport} />

                {/* Selection Mode Controls */}
                {selectionMode && (
                    <div className="mb-4 bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleSelectAll}
                                className="flex items-center gap-2 text-gray-700 hover:text-[#3A6D6C] transition-colors"
                            >
                                {selectedProperties.size === filteredProperties.length ? (
                                    <CheckSquare className="w-5 h-5 text-[#82D64D]" />
                                ) : (
                                    <Square className="w-5 h-5" />
                                )}
                                <span className="text-sm font-medium">
                                    {selectedProperties.size === filteredProperties.length 
                                        ? 'Deselect All' 
                                        : 'Select All'}
                                </span>
                            </button>
                            <span className="text-sm text-gray-600">
                                {selectedProperties.size} of {filteredProperties.length} selected
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleToggleSelectionMode}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={selectedProperties.size === 0 || isDeleting}
                                className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete ({selectedProperties.size})
                            </button>
                        </div>
                    </div>
                )}

                {/* Selection Mode Toggle Button */}
                {!selectionMode && (
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={handleToggleSelectionMode}
                            className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
                        >
                            <CheckSquare className="w-4 h-4" />
                            Select Properties
                        </button>
                    </div>
                )}

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
                                    isSelected={selectedProperties.has(property.id)}
                                    onSelect={handleSelectProperty}
                                    selectionMode={selectionMode}
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

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div 
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
                        onClick={(e) => {
                            if (e.target === e.currentTarget && !isDeleting) {
                                setShowDeleteConfirm(false);
                            }
                        }}
                    >
                        <div 
                            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                Delete Properties?
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete {selectedProperties.size} property(ies)? 
                                This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <span className="animate-spin">⏳</span>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            Delete
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
};

export default Properties;
