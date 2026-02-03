import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface GroupedOption {
    label: string;
    options: string[];
}

interface SearchableDropdownProps {
    label?: string;
    value: string | string[];
    options: (string | GroupedOption)[];
    onChange: (value: any) => void;
    placeholder?: string;
    className?: string;
    buttonClassName?: string;
    dropUp?: boolean;
    labelClassName?: string;
    onToggle?: (isOpen: boolean) => void;
    startIcon?: React.ReactNode;
    hideArrow?: boolean;
    allowCustomValue?: boolean;
    isMulti?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    label,
    value,
    options,
    onChange,
    placeholder = "Search",
    className,
    buttonClassName,
    dropUp = false,
    labelClassName,
    onToggle,
    startIcon,
    hideArrow = false,
    allowCustomValue = false,
    isMulti = false
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isSelected = (val: string) => {
        if (isMulti && Array.isArray(value)) {
            return value.includes(val);
        }
        return value === val;
    };

    const handleSelect = (option: string) => {
        if (isMulti) {
            const currentValues = Array.isArray(value) ? value : [];
            const newValues = currentValues.includes(option)
                ? currentValues.filter(v => v !== option)
                : [...currentValues, option];

            // If selecting something other than 'All', remove 'All'
            if (option !== 'All' && newValues.includes('All')) {
                const filtered = newValues.filter(v => v !== 'All');
                onChange(filtered.length === 0 ? ['All'] : filtered);
            }
            // If selecting 'All', clear others
            else if (option === 'All') {
                onChange(['All']);
            }
            else {
                onChange(newValues.length === 0 ? ['All'] : newValues);
            }
        } else {
            onChange(option);
            setIsOpen(false);
            onToggle?.(false);
        }
        setSearchTerm('');
    };

    const getDisplayValue = () => {
        if (isMulti && Array.isArray(value)) {
            if (value.length === 0 || (value.length === 1 && value[0] === 'All')) return placeholder;
            if (value.length > 2) return `${value.length} Selected`;
            return value.join(', ');
        }
        return (value as string) || placeholder || 'Select';
    };

    const filteredOptions = options.reduce<(string | GroupedOption)[]>((acc, option) => {
        if (typeof option === 'string') {
            if (option.toLowerCase().includes(searchTerm.toLowerCase())) {
                acc.push(option);
            }
        } else {
            const requestOptions = option.options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));
            if (requestOptions.length > 0) {
                acc.push({ label: option.label, options: requestOptions });
            }
        }
        return acc;
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                onToggle?.(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onToggle]);

    return (
        <div className={`flex flex-col gap-2 relative ${className || ''}`} ref={dropdownRef}>
            {label && <label className={`text-sm font-bold text-gray-700 ${labelClassName || ''}`}>{label}</label>}
            <div className="relative">
                <button
                    onClick={() => {
                        const newState = !isOpen;
                        setIsOpen(newState);
                        onToggle?.(newState);
                    }}
                    className={buttonClassName || "w-full flex items-center justify-between text-white bg-[#7BD747] px-4 py-3 rounded-xl font-medium shadow-sm hover:opacity-90 transition-opacity"}
                >
                    <div className="flex items-center gap-2 max-w-full overflow-hidden">
                        {startIcon}
                        <span className={`${buttonClassName ? "" : "text-white"} truncate`}>{getDisplayValue()}</span>
                    </div>
                    {!hideArrow && (
                        <ChevronDown size={20} className={`${buttonClassName ? "" : "text-white"} transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                    )}
                </button>

                {isOpen && (
                    <div className={`absolute z-50 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100 ${dropUp ? 'bottom-full mb-2' : 'mt-2'}`}>
                        <div className="p-2 border-b border-gray-100 sticky top-0 bg-white">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                <input
                                    type="text"
                                    placeholder={placeholder}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-base sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#3D7475]"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="max-h-60 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                            {filteredOptions.length === 0 ? (
                                <>
                                    <div className="px-4 py-3 text-sm text-gray-500 text-center">No options found</div>
                                    {allowCustomValue && searchTerm && (
                                        <button
                                            onClick={() => {
                                                onChange(searchTerm);
                                                setIsOpen(false);
                                                setSearchTerm('');
                                                onToggle?.(false);
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left transition-colors border-t border-gray-100"
                                        >
                                            <span className="text-base sm:text-sm text-[#7BD747] font-medium">
                                                Use "{searchTerm}"
                                            </span>
                                            <Check size={16} className="text-[#7BD747] opacity-0" />
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    {allowCustomValue && searchTerm && !filteredOptions.includes(searchTerm) && (
                                        <button
                                            onClick={() => {
                                                onChange(searchTerm);
                                                setIsOpen(false);
                                                setSearchTerm('');
                                                onToggle?.(false);
                                            }}
                                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left transition-colors border-b border-gray-100"
                                        >
                                            <span className="text-base sm:text-sm text-[#7BD747] font-medium">
                                                Use "{searchTerm}"
                                            </span>
                                        </button>
                                    )}
                                    {filteredOptions.map((option, index) => {
                                        if (typeof option === 'string') {
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => handleSelect(option)}
                                                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                                                >
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        {isMulti && option !== 'All' && (
                                                            <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${isSelected(option) ? 'bg-[#3A6D6C] border-[#3A6D6C]' : 'border-gray-300'}`}>
                                                                {isSelected(option) && <Check size={12} className="text-white" />}
                                                            </div>
                                                        )}
                                                        <span className={`text-base sm:text-sm truncate ${isSelected(option) ? 'text-[#3A6D6C] font-semibold' : 'text-gray-700'}`}>
                                                            {option}
                                                        </span>
                                                    </div>
                                                    {!isMulti && isSelected(option) && <Check size={16} className="text-[#3A6D6C] flex-shrink-0" />}
                                                </button>
                                            );
                                        } else {
                                            return (
                                                <div key={index}>
                                                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                                        {option.label}
                                                    </div>
                                                    {option.options.map((subOption, subIndex) => (
                                                        <button
                                                            key={`${index}-${subIndex}`}
                                                            onClick={() => handleSelect(subOption)}
                                                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3 overflow-hidden">
                                                                {isMulti && (
                                                                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${isSelected(subOption) ? 'bg-[#3A6D6C] border-[#3A6D6C]' : 'border-gray-300'}`}>
                                                                        {isSelected(subOption) && <Check size={12} className="text-white" />}
                                                                    </div>
                                                                )}
                                                                <span className={`text-base sm:text-sm truncate ${isSelected(subOption) ? 'text-[#3A6D6C] font-semibold' : 'text-gray-700'}`}>
                                                                    {subOption}
                                                                </span>
                                                            </div>
                                                            {!isMulti && isSelected(subOption) && <Check size={16} className="text-[#3A6D6C] flex-shrink-0" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            );
                                        }
                                    })
                                    }
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchableDropdown;
