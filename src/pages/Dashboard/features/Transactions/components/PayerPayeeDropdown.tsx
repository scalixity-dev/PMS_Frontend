import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Plus, X } from 'lucide-react';

export interface PayerPayeeOption {
    id: string;
    label: string;
    type: 'Service Pro' | 'tenant' | 'other';
}

interface PayerPayeeDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: PayerPayeeOption[];
    onAddTenant?: () => void;
    placeholder?: string;
}

const PayerPayeeDropdown: React.FC<PayerPayeeDropdownProps> = ({
    value,
    onChange,
    options,
    onAddTenant,
    placeholder = 'Select Payer/Payee'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const serviceProOptions = filteredOptions.filter(opt => opt.type === 'Service Pro');
    const tenantOptions = filteredOptions.filter(opt => opt.type === 'tenant');

    const handleSelect = (id: string) => {
        onChange(id);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all"
            >
                <span className={`text-sm ${selectedOption ? 'text-gray-900' : 'text-gray-400'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                    {/* Header with Add Tenant Button */}
                    <div className="bg-[#3D7475] p-4 flex items-center justify-between">
                        <button
                            onClick={onAddTenant}
                            className="bg-[#84CC16] hover:bg-[#76b814] text-white text-xs font-semibold px-4 py-2 rounded-full flex items-center gap-2 transition-colors"
                        >
                            Add service pro
                            <Plus size={14} className="stroke-[3]" />
                        </button>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="p-4">
                        {/* Search Bar */}
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[#C4C4C4] text-gray-700 placeholder-gray-600 text-sm px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-[#84CC16]/20 transition-all"
                            />
                        </div>

                        {/* Options List */}
                        <div className="max-h-60 overflow-y-auto space-y-4">
                            {/* Service Pro Group */}
                            {serviceProOptions.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-800 mb-2">Service Pro*</h4>
                                    <div className="space-y-2">
                                        {serviceProOptions.map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSelect(option.id)}
                                                className={`w-full text-left px-4 py-2 rounded-full text-sm font-medium transition-colors ${value === option.id
                                                    ? 'bg-[#84CC16] text-white'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Tenant Group */}
                            {tenantOptions.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-800 mb-2">tenant*</h4>
                                    <div className="space-y-2">
                                        {tenantOptions.map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSelect(option.id)}
                                                className={`w-full text-left px-4 py-2 rounded-full text-sm font-medium transition-colors ${value === option.id
                                                    ? 'bg-[#84CC16] text-white'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Group */}
                            {options.filter(opt => opt.type === 'other').length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-xs font-bold text-gray-800 mb-2">Other</h4>
                                    <div className="space-y-2">
                                        {options.filter(opt => opt.type === 'other').map(option => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleSelect(option.id)}
                                                className={`w-full text-left px-4 py-2 rounded-full text-sm font-medium transition-colors ${value === option.id
                                                    ? 'bg-[#84CC16] text-white'
                                                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {filteredOptions.length === 0 && (
                                <div className="text-center text-gray-500 text-sm py-2">
                                    No results found
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PayerPayeeDropdown;
