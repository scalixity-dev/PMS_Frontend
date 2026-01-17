import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PiPlusBold } from "react-icons/pi";
import SearchableDropdown from '../../../components/ui/SearchableDropdown';

interface ServiceFiltersProps {
    onSearch?: (term: string) => void;

    currentStatus?: string;
    onStatusChange?: (status: string) => void;

    currentCategory?: string;
    onCategoryChange?: (category: string) => void;

    currentProperty?: string;
    onPropertyChange?: (property: string) => void;

    currentPriority?: string;
    onPriorityChange?: (priority: string) => void;

    // Optional legacy or additional props can be added here
    onStatusClick?: () => void;

    // Custom Options Props
    statusOptions?: string[];
    categoryOptions?: string[];
    propertyOptions?: string[];
    priorityOptions?: string[];

    // Label Props
    statusLabel?: string;
    categoryLabel?: string;
    propertyLabel?: string;
    priorityLabel?: string;
}

const ServiceFilters: React.FC<ServiceFiltersProps> = ({
    onSearch,
    currentStatus, onStatusChange,
    currentCategory, onCategoryChange,
    currentProperty, onPropertyChange,
    currentPriority, onPriorityChange,
    ...props // Capture rest of props
}) => {
    // Default Options
    const defaultStatuses = ['All', 'New', 'In Progress', 'Completed', 'Cancelled', 'On Hold'];
    const defaultCategories = ['All', 'Appliances', 'Plumbing', 'Electrical', 'HVAC', 'General'];
    const defaultProperties = ['All', 'Sunset Apartments', 'Downtown Lofts', 'Ocean View Villa', 'Mountain Retreat'];
    const defaultPriorities = ['All', 'Critical', 'High', 'Normal', 'Low'];

    // Use props if provided, else defaults
    const statuses = props.statusOptions || defaultStatuses;
    const categories = props.categoryOptions || defaultCategories;
    const properties = props.propertyOptions || defaultProperties;
    const priorities = props.priorityOptions || defaultPriorities;

    const dropdownStyle = "min-w-[120px] flex items-center justify-center px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors shadow-md shadow-black/20";

    const handleFilterChange = (setter?: (val: string) => void) => (val: string) => {
        if (setter) setter(val);
    };

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    // Calculate active filters count
    const activeFilterCount = [
        currentStatus,
        currentCategory,
        currentProperty,
        currentPriority
    ].filter(val => val && val !== 'All').length;

    // Helper to clear all filters
    const handleClearAll = () => {
        if (onStatusChange) onStatusChange('All');
        if (onCategoryChange) onCategoryChange('All');
        if (onPropertyChange) onPropertyChange('All');
        if (onPriorityChange) onPriorityChange('All');
        if (onPriorityChange) onPriorityChange('All');
        if (onSearch) onSearch('');
        setSearchTerm('');
    };

    return (
        <>
            {/* Mobile Search & Filter Bar */}
            <div className="lg:hidden flex gap-3 mb-6">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (onSearch) onSearch(e.target.value);
                        }}
                    />
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
                <button
                    onClick={() => setIsMobileFiltersOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#3A6D6C] text-white rounded-full text-sm font-medium shadow-sm active:scale-95 transition-transform"
                >
                    <SlidersHorizontal size={18} />
                    <span>Filters</span>
                    {activeFilterCount > 0 && (
                        <span className="bg-white text-[#3A6D6C] text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Desktop Filter Bar */}
            <div className="hidden lg:flex gap-4 mb-6 flex-wrap items-center">
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-green-500 h-[38px]"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            if (onSearch) onSearch(e.target.value);
                        }}
                    />
                    <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
                </div>

                {onStatusChange && (
                    <SearchableDropdown
                        value={currentStatus === 'All' ? (props.statusLabel || 'Status') : currentStatus || (props.statusLabel || 'Status')}
                        options={statuses}
                        onChange={handleFilterChange(onStatusChange)}
                        placeholder={props.statusLabel || "Status"}
                        buttonClassName={dropdownStyle}
                        startIcon={<PiPlusBold size={14} />}
                        hideArrow
                    />
                )}

                {onCategoryChange && (
                    <SearchableDropdown
                        value={currentCategory === 'All' ? (props.categoryLabel || 'Category') : currentCategory || (props.categoryLabel || 'Category')}
                        options={categories}
                        onChange={handleFilterChange(onCategoryChange)}
                        placeholder={props.categoryLabel || "Category"}
                        buttonClassName={dropdownStyle}
                        startIcon={<PiPlusBold size={14} />}
                        hideArrow
                    />
                )}

                {onPropertyChange && (
                    <SearchableDropdown
                        value={currentProperty === 'All' ? (props.propertyLabel || 'Property') : currentProperty || (props.propertyLabel || 'Property')}
                        options={properties}
                        onChange={handleFilterChange(onPropertyChange)}
                        placeholder={props.propertyLabel || "Property"}
                        buttonClassName={dropdownStyle}
                        startIcon={<PiPlusBold size={14} />}
                        hideArrow
                    />
                )}

                {onPriorityChange && (
                    <SearchableDropdown
                        value={currentPriority === 'All' ? (props.priorityLabel || 'Priority') : currentPriority || (props.priorityLabel || 'Priority')}
                        options={priorities}
                        onChange={handleFilterChange(onPriorityChange)}
                        placeholder={props.priorityLabel || "Priority"}
                        buttonClassName={dropdownStyle}
                        startIcon={<PiPlusBold size={14} />}
                        hideArrow
                    />
                )}
            </div>

            {/* Mobile Filter Modal */}
            {isMobileFiltersOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
                    <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Filters</h2>
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-6 pb-24">
                            {onStatusChange && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{props.statusLabel || "Status"}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {statuses.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => onStatusChange(option)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${currentStatus === option
                                                    ? 'bg-[#7BD747] text-white border-[#7BD747]'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {onCategoryChange && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{props.categoryLabel || "Category"}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {categories.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => onCategoryChange(option)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${currentCategory === option
                                                    ? 'bg-[#7BD747] text-white border-[#7BD747]'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {onPropertyChange && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{props.propertyLabel || "Property"}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {properties.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => onPropertyChange(option)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${currentProperty === option
                                                    ? 'bg-[#7BD747] text-white border-[#7BD747]'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {onPriorityChange && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">{props.priorityLabel || "Priority"}</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {priorities.map(option => (
                                            <button
                                                key={option}
                                                onClick={() => onPriorityChange(option)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${currentPriority === option
                                                    ? 'bg-[#7BD747] text-white border-[#7BD747]'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100 flex gap-4">
                            <button
                                onClick={handleClearAll}
                                className="flex-1 px-4 py-3.5 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Clear All
                            </button>
                            <button
                                onClick={() => setIsMobileFiltersOpen(false)}
                                className="flex-1 px-4 py-3.5 rounded-full bg-[#3A6D6C] text-white font-semibold hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20"
                            >
                                Show Results
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ServiceFilters;
