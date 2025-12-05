import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import DashboardFilter, { type FilterOption } from '../../components/DashboardFilter';
import UnitGroupCard, { type UnitGroup } from './components/UnitGroupCard';
import SingleUnitCard from './components/SingleUnitCard';

const Units: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Record<string, string[]>>({});

    // Mock Data
    const allUnitGroups: UnitGroup[] = [
        // Single Unit Property - Occupied
        {
            id: '1',
            propertyName: 'Downtown Loft',
            address: '12 MG Road, Bangalore, KA 560001, IN',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            status: 'Occupied',
            units: [
                {
                    id: 'u1',
                    name: 'Studio',
                    type: 'Single-Family',
                    status: 'Occupied',
                    rent: 18000,
                    beds: 1,
                    baths: 1,
                    sqft: 850,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                }
            ]
        },
        // Single Unit Property - Vacant
        {
            id: '1a',
            propertyName: 'Skyline Villa',
            address: '89 Whitefield, Bangalore, KA 560066, IN',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            status: 'Vacant',
            units: [
                {
                    id: 'u1a',
                    name: 'Penthouse',
                    type: 'Single-Family',
                    status: 'Vacant',
                    rent: 35000,
                    beds: 3,
                    baths: 2,
                    sqft: 1800,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                }
            ]
        },
        // 2 Units Property
        {
            id: '2',
            propertyName: 'Green Valley Complex',
            address: '45 Residency Road, Mumbai, MH 400020, IN',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            status: 'Partially Occupied',
            units: [
                {
                    id: 'u2',
                    name: 'Unit A',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 22000,
                    beds: 2,
                    baths: 2,
                    sqft: 1400,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u3',
                    name: 'Unit B',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 22000,
                    beds: 2,
                    baths: 2,
                    sqft: 1400,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                }
            ]
        },
        // 5 Units Property
        {
            id: '3',
            propertyName: 'Sunrise Apartments',
            address: '78 Scheme No 78 - II, Indore, MP 452010, IN',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            status: 'Partially Occupied',
            units: [
                {
                    id: 'u4',
                    name: 'Unit 101',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 15000,
                    beds: 1,
                    baths: 1,
                    sqft: 950,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u5',
                    name: 'Unit 102',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 15000,
                    beds: 1,
                    baths: 1,
                    sqft: 950,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u6',
                    name: 'Unit 201',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 16000,
                    beds: 2,
                    baths: 1,
                    sqft: 1100,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u7',
                    name: 'Unit 202',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 16000,
                    beds: 2,
                    baths: 1,
                    sqft: 1100,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u8',
                    name: 'Unit 301',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 18000,
                    beds: 3,
                    baths: 2,
                    sqft: 1500,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                }
            ]
        },
        // 7 Units Property
        {
            id: '4',
            propertyName: 'Maple Heights',
            address: '23 Park Street, Pune, MH 411001, IN',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            status: 'Partially Occupied',
            units: [
                {
                    id: 'u9',
                    name: 'Unit 1A',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 25000,
                    beds: 2,
                    baths: 2,
                    sqft: 1300,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u10',
                    name: 'Unit 1B',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 25000,
                    beds: 2,
                    baths: 2,
                    sqft: 1300,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u11',
                    name: 'Unit 2A',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 27000,
                    beds: 2,
                    baths: 2,
                    sqft: 1400,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u12',
                    name: 'Unit 2B',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 27000,
                    beds: 2,
                    baths: 2,
                    sqft: 1400,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u13',
                    name: 'Unit 3A',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 30000,
                    beds: 3,
                    baths: 2,
                    sqft: 1600,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u14',
                    name: 'Unit 3B',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 30000,
                    beds: 3,
                    baths: 2,
                    sqft: 1600,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u15',
                    name: 'Unit 4A',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 32000,
                    beds: 3,
                    baths: 3,
                    sqft: 1800,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                }
            ]
        },
        // 8 Units Property
        {
            id: '5',
            propertyName: 'Ocean View Residency',
            address: '56 Marine Drive, Chennai, TN 600001, IN',
            image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            status: 'Partially Occupied',
            units: [
                {
                    id: 'u16',
                    name: 'Unit 101',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 20000,
                    beds: 2,
                    baths: 1,
                    sqft: 1200,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u17',
                    name: 'Unit 102',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 20000,
                    beds: 2,
                    baths: 1,
                    sqft: 1200,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u18',
                    name: 'Unit 201',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 21000,
                    beds: 2,
                    baths: 2,
                    sqft: 1250,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u19',
                    name: 'Unit 202',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 21000,
                    beds: 2,
                    baths: 2,
                    sqft: 1250,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u20',
                    name: 'Unit 301',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 23000,
                    beds: 3,
                    baths: 2,
                    sqft: 1400,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u21',
                    name: 'Unit 302',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 23000,
                    beds: 3,
                    baths: 2,
                    sqft: 1400,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u22',
                    name: 'Unit 401',
                    type: 'Apartment',
                    status: 'Occupied',
                    rent: 25000,
                    beds: 3,
                    baths: 3,
                    sqft: 1600,
                    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
                },
                {
                    id: 'u23',
                    name: 'Unit 402',
                    type: 'Apartment',
                    status: 'Vacant',
                    rent: 25000,
                    beds: 3,
                    baths: 3,
                    sqft: 1600,
                    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80'
                }
            ]
        }
    ];

    const unitGroups = useMemo(() => {
        return allUnitGroups.filter(group => {
            const matchesSearch = group.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                group.address.toLowerCase().includes(searchQuery.toLowerCase());

            // Basic filter implementation - can be expanded based on specific requirements
            // Treat 'Partially Occupied' as occupied for filtering purposes
            const matchesDisplay = !filters.display?.length ||
                (filters.display.includes('occupied') && (group.status === 'Occupied' || group.status === 'Partially Occupied')) ||
                (filters.display.includes('vacant') && group.status === 'Vacant');

            return matchesSearch && matchesDisplay;
        });
    }, [searchQuery, filters]);

    const filterOptions: Record<string, FilterOption[]> = {
        display: [
            { value: 'all', label: 'All' },
            { value: 'occupied', label: 'Occupied' },
            { value: 'vacant', label: 'Vacant' }
        ],
        property: [
            { value: 'luxury', label: 'Luxury Apartment' },
            { value: 'avaza', label: 'Avaza Apartment' }
        ],
        unitType: [
            { value: 'single', label: 'Single Family' },
            { value: 'apartment', label: 'Apartment' }
        ],
        marketingStatus: [
            { value: 'listed', label: 'Listed' },
            { value: 'unlisted', label: 'Unlisted' }
        ]
    };

    const filterLabels: Record<string, string> = {
        display: 'Display',
        property: 'Property',
        unitType: 'Unit Type',
        marketingStatus: 'Marketing Status'
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold">Dashboard</span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">Units</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] overflow-visible">
                {/* Header */}
                <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                        <button onClick={() => window.history.back()} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                        <h1 className="text-2xl font-bold text-gray-800">Units</h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="bg-[#3A6D6C] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2">
                            Import
                        </button>
                        <button className="bg-[#3A6D6C] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2">
                            Add Properties
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter */}
                <DashboardFilter
                    filterOptions={filterOptions}
                    filterLabels={filterLabels}
                    onSearchChange={setSearchQuery}
                    onFiltersChange={setFilters}
                />

                {/* Units List */}
                <div className="flex flex-col">
                    {unitGroups.map(group => (
                        group.units.length === 1 ? (
                            <SingleUnitCard key={group.id} group={group} />
                        ) : (
                            <UnitGroupCard key={group.id} group={group} />
                        )
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Units;
