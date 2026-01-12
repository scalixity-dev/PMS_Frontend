import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

interface SearchableDropdownProps {
    label?: string;
    value: string;
    options: string[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    buttonClassName?: string;
    dropUp?: boolean;
    labelClassName?: string;
    onToggle?: (isOpen: boolean) => void;
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
    onToggle
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    <span className={buttonClassName ? "" : "text-white"}>{value || placeholder || 'Select'}</span>
                    <ChevronDown size={20} className={`${buttonClassName ? "" : "text-white"} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                        <div className="max-h-60 overflow-y-auto py-1">
                            {filteredOptions.length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">No options found</div>
                            ) : (
                                filteredOptions.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => {
                                            onChange(option);
                                            setIsOpen(false);
                                            setSearchTerm('');
                                            onToggle?.(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 text-left transition-colors"
                                    >
                                        <div className="w-5 flex justify-center">
                                            {value === option && <Check size={16} className="text-[#3A6D6C]" />}
                                        </div>
                                        <span className={`text-base sm:text-sm ${value === option ? 'text-[#3A6D6C] font-semibold' : 'text-gray-700'}`}>
                                            {option}
                                        </span>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchableDropdown;
