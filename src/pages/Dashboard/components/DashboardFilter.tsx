import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, X, Save, Filter } from 'lucide-react';
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
    onClearSavedFilter?: () => void;
    activeSavedFilter?: string | null;
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
    onClearSavedFilter,
    activeSavedFilter
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

    // Sync selectedFilters when initialFilters change (e.g., when saved filter is applied)
    useEffect(() => {
        const updated: Record<string, string[]> = {};
        Object.keys(filterOptions).forEach(key => {
            updated[key] = initialFilters[key] || [];
        });
        setSelectedFilters(updated);
    }, [initialFilters, filterOptions]);

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
            // Clear active saved filter if user manually changes filters
            if (activeSavedFilter && onClearSavedFilter) {
                onClearSavedFilter();
            }
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
        // Clear active saved filter when clearing all
        if (activeSavedFilter && onClearSavedFilter) {
            onClearSavedFilter();
        }
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

    return (
        <div ref={dropdownRef} className="bg-[#3A6D6C] p-4 rounded-full flex items-center gap-4 mb-8 justify-between relative shadow-md">
            <div className="flex items-center gap-2 flex-1 overflow-visible">
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

                <div className="flex items-center gap-2">
                    {/* Display active saved filter badge */}
                    {activeSavedFilter && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-[#7BD747] text-white rounded-full text-sm font-medium">
                            <span>{activeSavedFilter}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    // Clear all filters first
                                    setSearchQuery('');
                                    const clearedFilters: Record<string, string[]> = {};
                                    Object.keys(filterOptions).forEach(key => {
                                        clearedFilters[key] = [];
                                    });
                                    setSelectedFilters(clearedFilters);
                                    onSearchChange('');
                                    onFiltersChange(clearedFilters);
                                    // Then clear the saved filter state
                                    if (onClearSavedFilter) {
                                        onClearSavedFilter();
                                    }
                                }}
                                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                title="Remove saved filter"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}
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
                                        {filterOptions[filterType].map((option) => {
                                            const isDisabled = option.value === '__no_items__';
                                            return (
                                                <label
                                                    key={option.value}
                                                    className={`flex items-center gap-2 px-3 py-2 rounded ${isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50 cursor-pointer'}`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFilters[filterType]?.includes(option.value)}
                                                        onChange={() => !isDisabled && handleFilterToggle(filterType, option.value)}
                                                        disabled={isDisabled}
                                                        className="rounded border-gray-300 text-[#7BD747] focus:ring-[#7BD747] disabled:cursor-not-allowed"
                                                    />
                                                    <span className={`text-sm ${isDisabled ? 'text-gray-400' : 'text-gray-700'}`}>{option.label}</span>
                                                </label>
                                            );
                                        })}
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

            <SaveFilterModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onSave={handleSaveList}
            />
        </div>
    );
};

export default DashboardFilter;
