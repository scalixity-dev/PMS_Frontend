import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Save, Filter, SlidersHorizontal } from 'lucide-react';
import SaveFilterModal from './SaveFilterModal';

export interface FilterOption {
    value: string;
    label: string;
}

export interface SavedFilter {
    name: string;
    filters: Record<string, string[]>;
}

export interface DashboardFilterProps {
    filterOptions: Record<string, FilterOption[]>;
    filterLabels?: Record<string, string>;
    onSearchChange: (search: string) => void;
    onFiltersChange: (filters: Record<string, string[]>) => void;
    showMoreFilters?: boolean;
    showClearAll?: boolean;
    initialFilters?: Record<string, string[]>;
    savedFilters?: SavedFilter[];
    onSaveFilter?: (name: string, filters: Record<string, string[]>) => void;
    onSelectSavedFilter?: (filter: SavedFilter) => void;
    searchPlaceholder?: string;
}

const DashboardFilter: React.FC<DashboardFilterProps> = ({
    filterOptions,
    filterLabels,
    onSearchChange,
    onFiltersChange,
    showClearAll = true,
    initialFilters = {},
    savedFilters = [],
    onSaveFilter,
    onSelectSavedFilter,
    searchPlaceholder = 'Search Here...'
}) => {
    const [searchQuery, setSearchQuery] = useState('');
    // Initialize selectedFilters based on keys from filterOptions
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
        const initial: Record<string, string[]> = {};
        Object.keys(filterOptions).forEach(key => {
            initial[key] = initialFilters[key] || [];
        });
        return initial;
    });

    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
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

    useEffect(() => {
        if (isMobileFiltersOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileFiltersOpen]);

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        onSearchChange(value);
    };

    const handleFilterToggle = (filterType: string, value: string) => {
        setSelectedFilters(prev => {
            const currentValues = prev[filterType] || [];
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
        const clearedFilters: Record<string, string[]> = {};
        Object.keys(filterOptions).forEach(key => {
            clearedFilters[key] = [];
        });
        setSelectedFilters(clearedFilters);
        onSearchChange('');
        onFiltersChange(clearedFilters);
    };

    const getFilterLabel = (filterType: string) => {
        const count = selectedFilters[filterType]?.length || 0;
        // Use provided label or capitalize the key
        const label = filterLabels?.[filterType] || filterType.charAt(0).toUpperCase() + filterType.slice(1).replace(/([A-Z])/g, ' $1').trim();
        return count > 0 ? `${label} (${count})` : label;
    };

    const hasActiveFilters = () => {
        return searchQuery || Object.values(selectedFilters).some(arr => arr.length > 0);
    };

    const handleSaveList = (name: string) => {
        if (onSaveFilter) {
            onSaveFilter(name, selectedFilters);
        }
        setIsSaveModalOpen(false);
    };

    // Count active filters for badge
    const activeFilterCount = Object.values(selectedFilters).reduce((count, arr) => count + arr.length, 0);

    return (
        <>
            {/* Mobile & Tablet Search & Filter Bar */}
            <div className="lg:hidden bg-white rounded-full flex items-center gap-2 p-2 mb-4 shadow-sm">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-transparent focus:outline-none"
                    />
                </div>
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium"
                >
                    <SlidersHorizontal className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="bg-white text-[#3A6D6C] text-xs font-bold px-1.5 py-0.5 rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Desktop Filter Bar */}
            <div ref={dropdownRef} className="hidden lg:flex bg-[#3A6D6C] p-4 rounded-full items-center gap-4 mb-8 justify-between relative shadow-md">
                <div className="flex items-center gap-2 flex-1 overflow-visible">
                    <div className="relative flex-shrink-0">
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
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

                    <div className="flex items-center gap-2">
                        {Object.keys(filterOptions).map((filterType) => (
                            <div key={filterType} className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === filterType ? null : filterType)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${(selectedFilters[filterType]?.length || 0) > 0
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
                                                        checked={selectedFilters[filterType]?.includes(option.value)}
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
                    </div>
                </div>

                {/* Dynamic Save/Select Filter Button */}
                <div className="flex items-center gap-1">
                    {hasActiveFilters() ? (
                        <>
                            <button
                                onClick={() => setIsSaveModalOpen(true)}
                                className="flex items-center px-2 gap-1 py-2 bg-white rounded-full text-sm font-medium text-[#3A6D6C] hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <Save className="w-4 h-4" />
                                Save Filter
                            </button>
                            {showClearAll && (
                                <button
                                    onClick={handleClearAll}
                                    className="px-4 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors whitespace-nowrap flex-shrink-0 underline-offset-4 hover:underline"
                                >
                                    Clear Filter
                                </button>
                            )}
                        </>
                    ) : (
                        savedFilters.length > 0 && (
                            <div className="relative">
                                <button
                                    onClick={() => setOpenDropdown(openDropdown === 'saved_filters' ? null : 'saved_filters')}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm ${openDropdown === 'saved_filters' ? 'bg-[#7BD747] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <Filter className="w-4 h-4" />
                                    Select Filter
                                </button>
                                {/* Saved Filters Dropdown */}
                                {openDropdown === 'saved_filters' && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                        <div className="p-1">
                                            {savedFilters.map((filter) => (
                                                <button
                                                    key={filter.name}
                                                    onClick={() => {
                                                        onSelectSavedFilter && onSelectSavedFilter(filter);
                                                        setOpenDropdown(null);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
                                                >
                                                    {filter.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </div>

            {/* Mobile & Tablet Filter Modal */}
            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFiltersOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Saved Filters Section */}
                        {savedFilters.length > 0 && (
                            <div className="mb-6 border-b border-gray-100 pb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Saved Views</h3>
                                <div className="flex flex-wrap gap-2">
                                    {savedFilters.map((filter) => (
                                        <button
                                            key={filter.name}
                                            onClick={() => {
                                                onSelectSavedFilter && onSelectSavedFilter(filter);
                                                setIsMobileFiltersOpen(false);
                                            }}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm"
                                        >
                                            {filter.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Filter Sections */}
                        {Object.entries(filterOptions).map(([filterType, options]) => (
                            <div key={filterType} className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">
                                    {filterLabels?.[filterType] || filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {options.map((option) => {
                                        const isActive = selectedFilters[filterType]?.includes(option.value);
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => handleFilterToggle(filterType, option.value)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${isActive
                                                    ? 'bg-[#7BD747] text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* Clear & Apply Buttons */}
                        {/* Mobile Actions Footer */}
                        <div className="flex flex-col gap-3 mt-6">
                            {hasActiveFilters() && (
                                <button
                                    onClick={() => {
                                        setIsSaveModalOpen(true);
                                    }}
                                    className="w-full px-4 py-3 bg-white border border-[#3A6D6C] text-[#3A6D6C] rounded-full text-sm font-medium hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Current Filter
                                </button>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        handleClearAll();
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    Clear All
                                </button>
                                <button
                                    onClick={() => setIsMobileFiltersOpen(false)}
                                    className="flex-1 px-4 py-3 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251]"
                                >
                                    Apply Filters
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <SaveFilterModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleSaveList}
            />
        </>
    );
};

export default DashboardFilter;
