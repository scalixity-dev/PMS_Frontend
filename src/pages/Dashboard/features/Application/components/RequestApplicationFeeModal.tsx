import React, { useState, useMemo, useRef, useEffect } from 'react';
import { X, ChevronDown, Search } from 'lucide-react';

// Common currencies with symbols
const currencyOptions = [
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

interface RequestApplicationFeeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (amount: string, currency: string) => void;
}

const RequestApplicationFeeModal: React.FC<RequestApplicationFeeModalProps> = ({ isOpen, onClose, onSend }) => {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('USD');
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [currencySearch, setCurrencySearch] = useState('');
    const currencyRef = useRef<HTMLDivElement>(null);

    // Reset state when modal opens
    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setCurrency('USD');
            setIsCurrencyOpen(false);
            setCurrencySearch('');
        }
    }, [isOpen]);

    // Filter currencies
    const filteredCurrencies = useMemo(() => {
        if (!currencySearch) return currencyOptions;
        const searchLower = currencySearch.toLowerCase();
        return currencyOptions.filter(c =>
            c.name.toLowerCase().includes(searchLower) ||
            c.code.toLowerCase().includes(searchLower) ||
            c.symbol.toLowerCase().includes(searchLower)
        );
    }, [currencySearch]);

    // Selected currency object
    const selectedCurrency = useMemo(() => {
        return currencyOptions.find(c => c.code === currency) || currencyOptions[0];
    }, [currency]);

    // Handle click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
                setIsCurrencyOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-slide-in-from-bottom-8 relative overflow-hidden flex flex-col font-sans">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-5 flex items-center justify-between text-white rounded-t-2xl">
                    <h2 className="text-lg font-medium">Request application fee</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8">
                    <p className="text-gray-700 text-sm mb-6 leading-relaxed">
                        You are about to send a request for the application fee to this applicant. They will be notified to complete the payment.
                    </p>

                    <div className="mb-8">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Amount</label>
                        <div className="flex border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C] transition-all bg-white relative">
                            {/* Currency Selector */}
                            <div className="relative" ref={currencyRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                    className="flex items-center gap-1 px-3 py-3 border-r border-gray-200 bg-gray-50 rounded-l-xl focus:outline-none text-sm min-w-[80px] hover:bg-gray-100 transition-colors h-full"
                                >
                                    <span className="text-sm font-bold text-gray-700">
                                        <span className="flex items-center gap-1">
                                            <span>{selectedCurrency.symbol}</span>
                                            <span className="text-xs text-gray-500">{selectedCurrency.code}</span>
                                        </span>
                                    </span>
                                    <ChevronDown size={14} className={`text-gray-500 transition-transform ml-auto ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {isCurrencyOpen && (
                                    <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-[60] max-h-64 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
                                        <div className="p-2 border-b border-gray-100">
                                            <div className="relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={currencySearch}
                                                    onChange={(e) => setCurrencySearch(e.target.value)}
                                                    className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#3A6D6C]"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto flex-1">
                                            {filteredCurrencies.map((c) => (
                                                <button
                                                    key={c.code}
                                                    onClick={() => {
                                                        setCurrency(c.code);
                                                        setIsCurrencyOpen(false);
                                                        setCurrencySearch('');
                                                    }}
                                                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center justify-between ${currency === c.code ? 'bg-gray-50 text-[#3A6D6C] font-bold' : 'text-gray-700'}`}
                                                >
                                                    <span className="flex items-center gap-2">
                                                        <span className="w-6 text-center">{c.symbol}</span>
                                                        <span>{c.name}</span>
                                                    </span>
                                                    <span className="text-xs text-gray-400">{c.code}</span>
                                                </button>
                                            ))}
                                            {filteredCurrencies.length === 0 && (
                                                <div className="p-4 text-center text-xs text-gray-500">No results</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Amount Input */}
                            <input
                                type="text"
                                placeholder="0.00"
                                value={amount}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^\d.]/g, '');
                                    setAmount(val);
                                }}
                                className="flex-1 min-w-0 px-4 py-3 rounded-r-xl focus:outline-none text-sm font-medium text-gray-900 placeholder-gray-400 bg-transparent"
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center gap-4 pt-2">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-[#4A5568] text-white py-3 rounded-xl font-medium hover:bg-[#2D3748] transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onSend(amount, currency);
                                onClose();
                            }}
                            disabled={!amount}
                            className="flex-1 bg-[#3A6D6C] text-white py-3 rounded-xl font-medium hover:bg-[#2c5251] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send Request
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RequestApplicationFeeModal;
