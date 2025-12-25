import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export const currencyOptions = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
    { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
    { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },
    { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
    { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
    { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
    { code: 'THB', symbol: '฿', name: 'Thai Baht' },
    { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
    { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
    { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
    { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
    { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
    { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee' },
    { code: 'BDT', symbol: '৳', name: 'Bangladeshi Taka' },
    { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
    { code: 'EGP', symbol: 'E£', name: 'Egyptian Pound' },
    { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
].sort((a, b) => a.name.localeCompare(b.name));

interface CurrencySelectorProps {
    value: string;
    onChange: (currencyCode: string) => void;
    className?: string;
    error?: boolean;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({ value, onChange, className = '', error = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedCurrency = useMemo(() => {
        return currencyOptions.find(c => c.code === value) || currencyOptions[0];
    }, [value]);

    const filteredOptions = useMemo(() => {
        const term = search.toLowerCase();
        return currencyOptions.filter(c =>
            c.code.toLowerCase().includes(term) ||
            c.name.toLowerCase().includes(term) ||
            c.symbol.toLowerCase().includes(term)
        );
    }, [search]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-1 px-3 py-3 border-r bg-gray-50 rounded-l-lg hover:bg-gray-100 transition-colors h-full min-w-[80px] ${className} ${error ? 'border-red-500' : 'border-gray-200'}`}
            >
                <span className="text-sm font-bold text-gray-700">
                    <span className="flex items-center gap-1">
                        <span>{selectedCurrency.symbol}</span>
                        <span className="text-xs text-gray-500">{selectedCurrency.code}</span>
                    </span>
                </span>
                <ChevronDown size={14} className={`text-gray-500 transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-64 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3A6D6C]"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {filteredOptions.map((c) => (
                            <button
                                key={c.code}
                                onClick={() => {
                                    onChange(c.code);
                                    setIsOpen(false);
                                    setSearch('');
                                }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${value === c.code ? 'bg-gray-50 text-[#3A6D6C] font-bold' : 'text-gray-700'}`}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="w-6 text-center">{c.symbol}</span>
                                    <span>{c.name}</span>
                                </span>
                                <span className="text-xs text-gray-400">{c.code}</span>
                            </button>
                        ))}
                        {filteredOptions.length === 0 && (
                            <div className="p-4 text-center text-xs text-gray-500">No results</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
