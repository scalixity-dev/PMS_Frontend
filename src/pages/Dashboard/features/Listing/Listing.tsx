import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingHeader from './components/ListingHeader';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import Pagination from '../../components/Pagination';
import ListingCard from './components/ListingCard';

const MOCK_LISTINGS = [
    {
        id: 1,
        name: 'Grove Street',
        address: '11 Grove Street, Boston, MA 12114, US',
        price: 8210.00,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80',
        status: 'listed' as const,
        bathrooms: 3,
        bedrooms: 3
    },
    {
        id: 2,
        name: 'Grove Street',
        address: '11 Grove Street, Boston, MA 12114, US',
        price: 8210.00,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        status: 'listed' as const,
        bathrooms: 3,
        bedrooms: 3
    },
    {
        id: 3,
        name: 'Grove Street',
        address: '11 Grove Street, Boston, MA 12114, US',
        price: 8210.00,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80',
        status: 'listed' as const,
        bathrooms: 3,
        bedrooms: 3
    },
    {
        id: 4,
        name: 'Grove Street',
        address: '11 Grove Street, Boston, MA 12114, US',
        price: null,
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        status: 'unlisted' as const,
        bathrooms: 3,
        bedrooms: 3
    },
    {
        id: 5,
        name: 'Grove Street',
        address: '11 Grove Street, Boston, MA 12114, US',
        price: null,
        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1384&q=80',
        status: 'unlisted' as const,
        bathrooms: 3,
        bedrooms: 3
    },
    {
        id: 6,
        name: 'Grove Street',
        address: '11 Grove Street, Boston, MA 12114, US',
        price: 8210.00,
        image: 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        status: 'listed' as const,
        bathrooms: 3,
        bedrooms: 3
    },
    {
        id: 7,
        name: 'Grove Street',
        address: '11 Grove Street, Boston, MA 12114, US',
        price: 8210.00,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80',
        status: 'listed' as const,
        bathrooms: 3,
        bedrooms: 3
    },
    {
        id: 8,
        name: 'Grove Street',
        address: '11 Grove Street, Boston, MA 12114, US',
        price: 8210.00,
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
        status: 'listed' as const,
        bathrooms: 3,
        bedrooms: 3
    },
    {
        id: 9,
        name: 'Grove Street',
        address: '11 Grove Street, Boston, MA 12114, US',
        price: null,
        image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1453&q=80',
        status: 'unlisted' as const,
        bathrooms: 3,
        bedrooms: 3
    },
];

const Listing: React.FC = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<{
        status: string[];
        daysListed: string[];
        syndication: string[];
    }>({
        status: [],
        daysListed: [],
        syndication: []
    });

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    const handleAddListing = () => {
        navigate('/dashboard/list-unit');
    };

    const filterOptions: Record<string, FilterOption[]> = {
        status: [
            { value: 'listed', label: 'Listed' },
            { value: 'unlisted', label: 'Unlisted' },
        ],
        daysListed: [
            { value: 'new', label: '< 7 Days' },
            { value: 'recent', label: '7 - 30 Days' },
            { value: 'old', label: '> 30 Days' },
        ],
        syndication: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
        ]
    };

    const filterLabels: Record<string, string> = {
        status: 'Status',
        daysListed: 'Days Listed',
        syndication: 'Syndication'
    };

    const filteredListings = useMemo(() => {
        return MOCK_LISTINGS.filter(listing => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                listing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                listing.address.toLowerCase().includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus = filters.status.length === 0 ||
                filters.status.includes(listing.status);

            // Mock logic for other filters as we don't have real data for them
            const matchesDaysListed = true;
            const matchesSyndication = true;

            return matchesSearch && matchesStatus && matchesDaysListed && matchesSyndication;
        });
    }, [searchQuery, filters]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

    const currentListings = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredListings.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredListings, currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen">
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Listings</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                <ListingHeader onAddListing={handleAddListing} />

                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={(newFilters) => setFilters(newFilters as any)}
                    showMoreFilters={false}
                />

                {filteredListings.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {currentListings.map((listing) => (
                                <ListingCard
                                    key={listing.id}
                                    {...listing}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            className="pb-8"
                        />
                    </>
                ) : (
                    <div className="text-center py-12 bg-white rounded-2xl">
                        <p className="text-gray-500 text-lg">No listings found matching your filters</p>
                        <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Listing;
