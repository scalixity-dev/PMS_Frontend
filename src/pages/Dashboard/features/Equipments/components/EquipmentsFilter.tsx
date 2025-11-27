import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, MoreHorizontal, X } from 'lucide-react';

interface FilterOption {
    value: string;
    label: string;
}

interface EquipmentsFilterProps {
    onSearchChange: (search: string) => void;
    onFiltersChange: (filters: { status: string[]; occupancy: string[]; propertyType: string[] }) => void;
}

const EquipmentsFilter: React.FC<EquipmentsFilterProps> = ({ onSearchChange, onFiltersChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilters, setSelectedFilters] = useState<{
        status: string[];
        occupancy: string[];
        propertyType: string[];
    }>({
        status: [],
        occupancy: [],
        propertyType: []
    });
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        };

        if (openDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

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

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearchChange(value);
    };

    const handleFilterToggle = (filterType: string, value: string) => {
        setSelectedFilters(prev => {
            const currentValues = prev[filterType as keyof typeof prev];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            
            const updatedFilters = { ...prev, [filterType]: newValues };
            onFiltersChange(updatedFilters);
            return updatedFilters;
        });
    };

    const handleClearAll = () => {
        setSearchQuery('');
        setSelectedFilters({ status: [], occupancy: [], propertyType: [] });
        onSearchChange('');
        onFiltersChange({ status: [], occupancy: [], propertyType: [] });
    };

    const getFilterLabel = (filterType: string) => {
        const count = selectedFilters[filterType as keyof typeof selectedFilters].length;
        const labels: Record<string, string> = {
            status: 'Status',
            occupancy: 'Occupancy',
            propertyType: 'Property Type'
        };
        return count > 0 ? `${labels[filterType]} (${count})` : labels[filterType];
    };

    const hasActiveFilters = () => {
        return searchQuery || Object.values(selectedFilters).some(arr => arr.length > 0);
    };

    return (
        <div ref={dropdownRef} className="bg-[#3A6D6C] p-4 rounded-full flex items-center gap-4 mb-8 justify-between relative">
            <div className="flex items-center gap-4 flex-1 overflow-visible flex-wrap">
                <div className="relative flex-shrink-0">
                    <input
                        type="text"
                        placeholder="Search Here..."
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-4 pr-10 py-2 bg-white rounded-full text-sm w-64 focus:outline-none"
                    />
                    {searchQuery ? (
                        <button
                            onClick={() => handleSearchChange('')}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-1 hover:bg-gray-700"
                        >
                            <X className="w-3 h-3 text-white" />
                        </button>
                    ) : (
                        <div className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-gray-800 rounded-full p-1">
                            <Search className="w-5 h-5 text-white" />
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {['status', 'occupancy', 'propertyType'].map((filterType) => (
                        <div key={filterType} className="relative">
                            <button
                                onClick={() => setOpenDropdown(openDropdown === filterType ? null : filterType)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                                    selectedFilters[filterType as keyof typeof selectedFilters].length > 0
                                        ? 'bg-[#7BD747] text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {getFilterLabel(filterType)}
                                <Plus className="w-4 h-4" />
                            </button>

                            {openDropdown === filterType && (
                                <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[200px] z-[100]">
                                    <div className="p-2">
                                        {filterOptions[filterType].map((option) => (
                                            <label
                                                key={option.value}
                                                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters[filterType as keyof typeof selectedFilters].includes(option.value)}
                                                    onChange={() => handleFilterToggle(filterType, option.value)}
                                                    className="rounded border-gray-300 text-[#7BD747] focus:ring-[#7BD747]"
                                                />
                                                <span className="text-sm text-gray-700">{option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap">
                        More Filters
                        <MoreHorizontal className="w-4 h-4 text-gray-800" />
                    </button>
                </div>
            </div>

            <button
                onClick={handleClearAll}
                className={`px-6 py-2 bg-white rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors whitespace-nowrap flex-shrink-0 ${
                    hasActiveFilters() ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
                }`}
                disabled={!hasActiveFilters()}
            >
                Clear All
            </button>
        </div>
    );
};

export default EquipmentsFilter;
