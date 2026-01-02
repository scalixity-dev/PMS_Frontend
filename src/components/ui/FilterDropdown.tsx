import React, { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronDown } from "lucide-react";

interface FilterDropdownProps {
    value: string | null;
    options: { label: string; value: string }[];
    onSelect: (value: string | null) => void;
    placeholder: string;
    className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ value, options, onSelect, placeholder, className }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    return (
        <div className={`relative ${className || ""}`} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${value
                    ? "bg-[#7ED957] text-white border-transparent shadow-[0px_3.9px_3.9px_0px_rgba(0,0,0,0.25)]"
                    : "bg-[#F7F7F7] border-[0.97px] border-white text-gray-700 shadow-[0px_3.9px_3.9px_0px_#00000040] hover:bg-gray-200"
                    }`}
            >
                {value ? (
                    <>
                        <span>{selectedOption?.label || value}</span>
                        <X
                            size={14}
                            className="ml-1 hover:scale-110 transition-transform"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect(null);
                                setIsOpen(false);
                            }}
                        />
                    </>
                ) : (
                    <>
                        <Plus size={16} className="text-[#000000]/80" />
                        <span>{placeholder}</span>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-60 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-1">
                        {options.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    onSelect(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-all rounded-lg hover:bg-gray-50 ${value === option.value ? "text-[#7ED957] font-semibold bg-green-50" : "text-gray-700"
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
