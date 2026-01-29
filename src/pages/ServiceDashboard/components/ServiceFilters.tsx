import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { PiPlusBold } from "react-icons/pi";
import SearchableDropdown from '../../../components/ui/SearchableDropdown';

interface ServiceFiltersProps {
    onSearch?: (term: string) => void;

    currentStatus?: string | string[];
    onStatusChange?: (status: any) => void;

    currentCategory?: string | string[];
    onCategoryChange?: (category: any) => void;

    currentProperty?: string | string[];
    onPropertyChange?: (property: any) => void;

    currentPriority?: string | string[];
    onPriorityChange?: (priority: any) => void;

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
    radiusLabel?: string;

    currentRadius?: string;
    onRadiusChange?: (radius: string) => void;
    radiusOptions?: string[];
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

    const {
        currentRadius, onRadiusChange
    } = props;

    const dropdownStyle = "min-w-[120px] flex items-center justify-center px-4 py-2 bg-white text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors shadow-md shadow-black/20";

    const handleFilterChange = (setter?: (val: any) => void) => (val: any) => {
        if (setter) setter(val);
    };

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false);
    const [isRadiusDropdownOpen, setIsRadiusDropdownOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const radiusDropdownRef = React.useRef<HTMLDivElement>(null);

    // Handle click outside for radius dropdown
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (radiusDropdownRef.current && !radiusDropdownRef.current.contains(event.target as Node)) {
                setIsRadiusDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isFilterActive = (val: string | string[] | undefined) => {
        if (!val) return false;
        if (Array.isArray(val)) {
            return val.length > 0 && !val.includes('All');
        }
        return val !== 'All';
    };

    // Calculate active filters count
    const activeFilterCount = [
        currentStatus,
        currentCategory,
        currentProperty,
        currentPriority,
        currentRadius
    ].filter(isFilterActive).length;

    // Helper to clear all filters
    const handleClearAll = () => {
        if (onStatusChange) onStatusChange('All');
        if (onCategoryChange) onCategoryChange('All');
        if (onPropertyChange) onPropertyChange('All');
        if (onPriorityChange) onPriorityChange('All');
        if (onRadiusChange) onRadiusChange('All');
        if (onSearch) onSearch('');
        setSearchTerm('');
    };

    const handleMobileToggle = (current: string | string[] | undefined, setter: ((val: any) => void) | undefined, option: string) => {
        if (!setter) return;
        const currentArray = Array.isArray(current) ? current : (current && current !== 'All' ? [current] : []);

        if (option === 'All') {
            setter(['All']);
            return;
        }

        let next;
        if (currentArray.includes(option)) {
            next = currentArray.filter(v => v !== option);
            if (next.length === 0) next = ['All'];
        } else {
            next = [...currentArray.filter(v => v !== 'All'), option];
        }
        setter(next);
    };

    const isOptionSelected = (current: string | string[] | undefined, option: string) => {
        if (Array.isArray(current)) {
            return current.includes(option);
        }
        return current === option;
    };

    const getStatusValue = () => {
        if (Array.isArray(currentStatus)) {
            if (currentStatus.includes('All') || currentStatus.length === 0) return props.statusLabel || 'Status';
            return currentStatus;
        }
        return currentStatus === 'All' ? (props.statusLabel || 'Status') : currentStatus || (props.statusLabel || 'Status');
    };

    const getCategoryValue = () => {
        if (Array.isArray(currentCategory)) {
            if (currentCategory.includes('All') || currentCategory.length === 0) return props.categoryLabel || 'Category';
            return currentCategory;
        }
        return currentCategory === 'All' ? (props.categoryLabel || 'Category') : currentCategory || (props.categoryLabel || 'Category');
    };

    const getPropertyValue = () => {
        if (Array.isArray(currentProperty)) {
            if (currentProperty.includes('All') || currentProperty.length === 0) return props.propertyLabel || 'Property';
            return currentProperty;
        }
        return currentProperty === 'All' ? (props.propertyLabel || 'Property') : currentProperty || (props.propertyLabel || 'Property');
    };

    const getPriorityValue = () => {
        if (Array.isArray(currentPriority)) {
            if (currentPriority.includes('All') || currentPriority.length === 0) return props.priorityLabel || 'Priority';
            return currentPriority;
        }
        return currentPriority === 'All' ? (props.priorityLabel || 'Priority') : currentPriority || (props.priorityLabel || 'Priority');
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
                        value={getStatusValue()}
                        options={statuses}
                        onChange={handleFilterChange(onStatusChange)}
                        placeholder={props.statusLabel || "Status"}
                        buttonClassName={dropdownStyle}
                        startIcon={<PiPlusBold size={14} />}
                        hideArrow
                        isMulti
                    />
                )}

                {onCategoryChange && (
                    <SearchableDropdown
                        value={getCategoryValue()}
                        options={categories}
                        onChange={handleFilterChange(onCategoryChange)}
                        placeholder={props.categoryLabel || "Category"}
                        buttonClassName={dropdownStyle}
                        startIcon={<PiPlusBold size={14} />}
                        hideArrow
                        isMulti
                    />
                )}

                {onPropertyChange && (
                    <SearchableDropdown
                        value={getPropertyValue()}
                        options={properties}
                        onChange={handleFilterChange(onPropertyChange)}
                        placeholder={props.propertyLabel || "Property"}
                        buttonClassName={dropdownStyle}
                        startIcon={<PiPlusBold size={14} />}
                        hideArrow
                        isMulti
                    />
                )}

                {onPriorityChange && (
                    <SearchableDropdown
                        value={getPriorityValue()}
                        options={priorities}
                        onChange={handleFilterChange(onPriorityChange)}
                        placeholder={props.priorityLabel || "Priority"}
                        buttonClassName={dropdownStyle}
                        startIcon={<PiPlusBold size={14} />}
                        hideArrow
                        isMulti
                    />
                )}

                {onRadiusChange && (
                    <div className="relative" ref={radiusDropdownRef}>
                        <button
                            onClick={() => setIsRadiusDropdownOpen(!isRadiusDropdownOpen)}
                            className={dropdownStyle}
                        >
                            <div className="flex items-center gap-2">
                                <PiPlusBold size={14} />
                                <span>{currentRadius === 'All' ? (props.radiusLabel || 'Radius') : currentRadius}</span>
                            </div>
                        </button>

                        {isRadiusDropdownOpen && (
                            <div className="absolute z-50 w-[240px] bg-white border border-gray-100 rounded-xl shadow-xl p-4 mt-2 animate-in fade-in zoom-in-95 duration-100">
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{props.radiusLabel || "Radius"}</span>
                                        <span className="text-sm font-bold text-[#7BD747]">
                                            {currentRadius === 'All' ? 'All miles' : currentRadius}
                                        </span>
                                    </div>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={
                                                currentRadius === 'All' ? 0 : parseInt(currentRadius?.split(' ')[0] || '0')
                                            }
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (val === 0) {
                                                    onRadiusChange('All');
                                                } else {
                                                    onRadiusChange(`${val} miles`);
                                                }
                                            }}
                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7BD747]"
                                        />
                                        <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                            <span>All</span>
                                            <span>25mi</span>
                                            <span>50mi</span>
                                            <span>75mi</span>
                                            <span>100mi</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsRadiusDropdownOpen(false)}
                                        className="w-full mt-2 py-1.5 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold hover:bg-gray-100 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
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
                                                onClick={() => handleMobileToggle(currentStatus, onStatusChange, option)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isOptionSelected(currentStatus, option)
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
                                                onClick={() => handleMobileToggle(currentCategory, onCategoryChange, option)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isOptionSelected(currentCategory, option)
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
                                                onClick={() => handleMobileToggle(currentProperty, onPropertyChange, option)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isOptionSelected(currentProperty, option)
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
                                                onClick={() => handleMobileToggle(currentPriority, onPriorityChange, option)}
                                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${isOptionSelected(currentPriority, option)
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

                            {onRadiusChange && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-sm font-semibold text-gray-900">{props.radiusLabel || "Radius"}</h3>
                                        <span className="text-sm font-bold text-[#7BD747]">
                                            {currentRadius === 'All' ? 'All miles' : currentRadius}
                                        </span>
                                    </div>
                                    <div className="px-2">
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            value={
                                                currentRadius === 'All' ? 0 : parseInt(currentRadius?.split(' ')[0] || '0')
                                            }
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value);
                                                if (val === 0) {
                                                    onRadiusChange('All');
                                                } else {
                                                    onRadiusChange(`${val} miles`);
                                                }
                                            }}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#7BD747]"
                                        />
                                        <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                                            <span>All</span>
                                            <span>25mi</span>
                                            <span>50mi</span>
                                            <span>75mi</span>
                                            <span>100mi</span>
                                        </div>
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
