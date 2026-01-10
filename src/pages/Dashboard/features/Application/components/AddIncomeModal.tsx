import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, ChevronLeft, Search, ChevronDown } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';
import DatePicker from '@/components/ui/DatePicker';

export interface IncomeFormData {
    currentEmployment: boolean;
    incomeType: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    company: string;
    position: string;
    monthlyAmount: string; // "Monthly Income" in UI
    currency?: string; // Currency code (e.g., 'USD', 'EUR', 'INR')
    address: string;
    office: string;
    companyPhone: string;
    supervisorName: string;
    supervisorEmail: string;
    supervisorPhone: string;
}

interface AddIncomeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: IncomeFormData) => void;
    initialData?: IncomeFormData;
}

const incomeTypeOptions = [
    { value: 'Full Time', label: 'Full Time' },
    { value: 'Part Time', label: 'Part Time' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Contract', label: 'Contract' },
    { value: 'Other', label: 'Other' }
];

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

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<IncomeFormData>({
        currentEmployment: true,
        incomeType: '',
        startDate: undefined,
        endDate: undefined,
        company: '',
        position: '',
        monthlyAmount: '',
        currency: 'USD', // Default currency
        address: '',
        office: '',
        companyPhone: '',
        supervisorName: '',
        supervisorEmail: '',
        supervisorPhone: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [currencySearch, setCurrencySearch] = useState('');
    const currencyRef = useRef<HTMLDivElement>(null);

    // Prevent background scrolling when modal is open
    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    currentEmployment: true,
                    incomeType: '',
                    startDate: undefined,
                    endDate: undefined,
                    company: '',
                    position: '',
                    monthlyAmount: '',
                    currency: 'USD',
                    address: '',
                    office: '',
                    companyPhone: '',
                    supervisorName: '',
                    supervisorEmail: '',
                    supervisorPhone: ''
                });
            }
        } else {
            document.body.style.overflow = 'unset';
            setErrors({});
            setTouched({});
            // We don't necessarily need to reset on close if we reset on open, 
            // but keeping it clean is good.
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialData]);

    // Filter currencies based on search
    const filteredCurrencies = useMemo(() => {
        if (!currencySearch) return currencyOptions;
        const searchLower = currencySearch.toLowerCase();
        return currencyOptions.filter(currency =>
            currency.name.toLowerCase().includes(searchLower) ||
            currency.code.toLowerCase().includes(searchLower) ||
            currency.symbol.toLowerCase().includes(searchLower)
        );
    }, [currencySearch]);

    // Get selected currency display
    const selectedCurrency = useMemo(() => {
        if (!formData.currency) return currencyOptions[0]; // Default to USD
        return currencyOptions.find(c => c.code === formData.currency) || currencyOptions[0];
    }, [formData.currency]);

    // Close currency dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
                setIsCurrencyOpen(false);
                setCurrencySearch('');
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    if (!isOpen) return null;

    const validateField = (key: keyof IncomeFormData, value: any): string => {
        switch (key) {
            case 'incomeType':
                // Keeping optional as per existing logic
                break;
            case 'startDate':
                if (!value) return 'Start Date is required';
                break;
            case 'endDate':
                if (formData.currentEmployment) return '';
                if (!value) return 'End Date is required';
                break;
            case 'company':
                if (!value || value.trim() === '') return 'Company is required';
                break;
            case 'position':
                if (!value || value.trim() === '') return 'Position is required';
                break;
            case 'monthlyAmount':
                if (!value || value.trim() === '') return 'Monthly Income is required';
                break;
            case 'address':
                if (!value || value.trim() === '') return 'Address is required';
                break;
            case 'office':
                if (!value || value.trim() === '') return 'Office is required';
                break;
            case 'companyPhone':
                if (!value || value.trim() === '') return 'Company Phone is required';
                {
                    const digitsOnly = value.replace(/\D/g, '');
                    if (digitsOnly.length < 4 || digitsOnly.length > 15) {
                        return 'Phone number must be between 4 and 15 digits';
                    }
                }
                break;
            case 'supervisorName':
                if (!value || value.trim() === '') return 'Supervisor Name is required';
                break;
            case 'supervisorEmail':
                if (value && value.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
                break;
            case 'supervisorPhone':
                if (!value || value.trim() === '') return 'Supervisor Phone is required';
                {
                    const digitsOnly = value.replace(/\D/g, '');
                    if (digitsOnly.length < 4 || digitsOnly.length > 15) {
                        return 'Phone number must be between 4 and 15 digits';
                    }
                }
                break;
        }
        return '';
    };



    const isFormValid = (): boolean => {
        return (Object.keys(formData) as Array<keyof IncomeFormData>).every(key => {
            return !validateField(key, formData[key]);
        });
    };

    const handleChange = (key: keyof IncomeFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof IncomeFormData, currentValue?: any) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const value = currentValue !== undefined ? currentValue : formData[key];
        const error = validateField(key, value);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        // Even if button is disabled, we keep this check for safety
        if (isFormValid()) {
            onSave(formData);
            onClose();
        }
    };

    // Custom Toggle Switch Component
    const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`w-12 h-7 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#7BD747]' : 'bg-gray-300'}`}
        >
            <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-xl w-[95%] sm:w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative max-h-[90vh] flex flex-col font-sans">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-xl shrink-0">
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-lg font-medium">{initialData ? 'Edit income' : 'Add a new income'}</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-4 sm:p-8 overflow-y-auto custom-scrollbar flex-1">

                    {/* Current Employment & Type */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <span className="text-xl font-semibold text-[#2c3e50]">Current Employment?</span>
                            <ToggleSwitch
                                checked={formData.currentEmployment}
                                onChange={(val) => handleChange('currentEmployment', val)}
                            />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Income Type</label>
                        <CustomDropdown
                            value={formData.incomeType}
                            onChange={(val) => handleChange('incomeType', val)}
                            options={incomeTypeOptions}
                            placeholder="Select"
                            buttonClassName="w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm"
                            dropdownClassName="max-h-60"
                        />
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Start Date *</label>
                            <DatePicker
                                value={formData.startDate}
                                onChange={(date) => {
                                    handleChange('startDate', date);
                                    handleBlur('startDate', date);
                                }}
                                placeholder="DD/MM/YYYY"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 shadow-sm text-sm ${touched.startDate && errors.startDate ? 'border-2 border-red-500' : ''}`}
                            />
                            {touched.startDate && errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
                        </div>

                        {/* End Date */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">End Date *</label>
                            <DatePicker
                                value={formData.endDate}
                                onChange={(date) => {
                                    handleChange('endDate', date);
                                    handleBlur('endDate', date);
                                }}
                                placeholder="DD/MM/YYYY"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 shadow-sm text-sm ${touched.endDate && errors.endDate ? 'border-2 border-red-500' : ''} ${formData.currentEmployment ? 'opacity-50 pointer-events-none' : ''}`}
                            />
                            {touched.endDate && errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
                        </div>

                        {/* Company */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Company*</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.company && errors.company ? 'border-2 border-red-500' : ''}`}
                                value={formData.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                                onBlur={() => handleBlur('company')}
                            />
                            {touched.company && errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
                        </div>

                        {/* Position */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Position / Title *</label>
                            <input
                                type="text"
                                placeholder="Type Name"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.position && errors.position ? 'border-2 border-red-500' : ''}`}
                                value={formData.position}
                                onChange={(e) => handleChange('position', e.target.value)}
                                onBlur={() => handleBlur('position')}
                            />
                            {touched.position && errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
                        </div>

                        {/* Monthly Income */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Monthly Income*</label>
                            <div className={`flex border rounded-xl transition-all ${touched.monthlyAmount && errors.monthlyAmount
                                ? 'border-red-500 border-2'
                                : 'border-gray-200 focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C]'
                                }`}>
                                {/* Currency Selector */}
                                <div className="relative" ref={currencyRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                        className={`flex items-center gap-1 px-3 py-3 border-r bg-white rounded-l-xl focus:outline-none text-sm min-w-[80px] hover:bg-gray-50 transition-colors ${touched.monthlyAmount && errors.monthlyAmount
                                            ? 'border-red-500'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">
                                            {selectedCurrency ? (
                                                <span className="flex items-center gap-1">
                                                    <span>{selectedCurrency.symbol}</span>
                                                    <span className="hidden sm:inline text-xs">{selectedCurrency.code}</span>
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">$</span>
                                            )}
                                        </span>
                                        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown */}
                                    {isCurrencyOpen && (
                                        <div className="absolute left-0 top-full mt-1 w-72 bg-white border border-gray-300 rounded-xl shadow-lg z-[100] max-h-80 overflow-hidden flex flex-col">
                                            {/* Search Input */}
                                            <div className="p-2 border-b border-gray-200">
                                                <div className="relative">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search currency..."
                                                        value={currencySearch}
                                                        onChange={(e) => setCurrencySearch(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-sm"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            {/* Options List */}
                                            <div className="overflow-y-auto max-h-64">
                                                {filteredCurrencies.length > 0 ? (
                                                    filteredCurrencies.map((currency) => (
                                                        <button
                                                            key={currency.code}
                                                            type="button"
                                                            onClick={() => {
                                                                handleChange('currency', currency.code);
                                                                setIsCurrencyOpen(false);
                                                                setCurrencySearch('');
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${formData.currency === currency.code ? 'bg-[#3A6D6C]/10' : ''
                                                                }`}
                                                        >
                                                            <span className="text-lg font-semibold w-12">{currency.symbol}</span>
                                                            <span className="flex-1 text-sm font-medium text-gray-900">{currency.name}</span>
                                                            <span className="text-xs text-gray-600">{currency.code}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                        No currencies found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Amount Input */}
                                <input
                                    type="text"
                                    placeholder="Add Money"
                                    className={`flex-1 min-w-0 px-4 py-3 rounded-r-xl focus:outline-none text-sm placeholder-gray-400 bg-white border-0 ${touched.monthlyAmount && errors.monthlyAmount ? 'text-red-500' : 'text-gray-700'
                                        }`}
                                    value={formData.monthlyAmount}
                                    onChange={(e) => {
                                        // Allow only numbers and decimal point
                                        const value = e.target.value.replace(/[^\d.]/g, '');
                                        handleChange('monthlyAmount', value);
                                    }}
                                    onBlur={() => handleBlur('monthlyAmount')}
                                />
                            </div>
                            {touched.monthlyAmount && errors.monthlyAmount && <p className="text-red-500 text-xs mt-1">{errors.monthlyAmount}</p>}
                        </div>

                        {/* Address */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Address *</label>
                            <input
                                type="text"
                                placeholder="Starting Address"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.address && errors.address ? 'border-2 border-red-500' : ''}`}
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                onBlur={() => handleBlur('address')}
                            />
                            {touched.address && errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        {/* Office */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Office *</label>
                            <input
                                type="text"
                                placeholder="Type Office"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.office && errors.office ? 'border-2 border-red-500' : ''}`}
                                value={formData.office}
                                onChange={(e) => handleChange('office', e.target.value)}
                                onBlur={() => handleBlur('office')}
                            />
                            {touched.office && errors.office && <p className="text-red-500 text-xs mt-1">{errors.office}</p>}
                        </div>

                        {/* Company Phone */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Company Phone Number *</label>
                            <input
                                type="tel"
                                placeholder="Type Phone Number"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.companyPhone && errors.companyPhone ? 'border-2 border-red-500' : ''}`}
                                value={formData.companyPhone}
                                onChange={(e) => handleChange('companyPhone', e.target.value)}
                                onBlur={() => handleBlur('companyPhone')}
                            />
                            {touched.companyPhone && errors.companyPhone && <p className="text-red-500 text-xs mt-1">{errors.companyPhone}</p>}
                        </div>

                        {/* Supervisor Full Name */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Supervisor Full Name*</label>
                            <input
                                type="text"
                                placeholder="Full Name"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.supervisorName && errors.supervisorName ? 'border-2 border-red-500' : ''}`}
                                value={formData.supervisorName}
                                onChange={(e) => handleChange('supervisorName', e.target.value)}
                                onBlur={() => handleBlur('supervisorName')}
                            />
                            {touched.supervisorName && errors.supervisorName && <p className="text-red-500 text-xs mt-1">{errors.supervisorName}</p>}
                        </div>

                        {/* Supervisor Email */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Supervisor Email</label>
                            <input
                                type="email"
                                placeholder="Add Email here"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.supervisorEmail && errors.supervisorEmail ? 'border-2 border-red-500' : ''}`}
                                value={formData.supervisorEmail}
                                onChange={(e) => handleChange('supervisorEmail', e.target.value)}
                                onBlur={() => handleBlur('supervisorEmail')}
                            />
                            {touched.supervisorEmail && errors.supervisorEmail && <p className="text-red-500 text-xs mt-1">{errors.supervisorEmail}</p>}
                        </div>

                        {/* Supervisor Phone */}
                        <div className="md:col-span-1">
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Supervisor Phone Number *</label>
                            <input
                                type="tel"
                                placeholder="Add Phone number here"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.supervisorPhone && errors.supervisorPhone ? 'border-2 border-red-500' : ''}`}
                                value={formData.supervisorPhone}
                                onChange={(e) => handleChange('supervisorPhone', e.target.value)}
                                onBlur={() => handleBlur('supervisorPhone')}
                            />
                            {touched.supervisorPhone && errors.supervisorPhone && <p className="text-red-500 text-xs mt-1">{errors.supervisorPhone}</p>}
                        </div>

                    </div>

                    {/* Add Button */}
                    <div>
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid()}
                            className={`px-12 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm ${isFormValid() ? 'bg-[#3A6D6C] text-white hover:bg-[#2c5251]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        >
                            {initialData ? 'Save' : 'Add'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddIncomeModal;
