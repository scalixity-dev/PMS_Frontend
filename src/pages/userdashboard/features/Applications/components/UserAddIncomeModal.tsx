import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Search, ChevronDown } from 'lucide-react';
import CustomDropdown from '../../../../Dashboard/components/CustomDropdown';
import DatePicker from '@/components/ui/DatePicker';
import BaseModal from '@/components/common/modals/BaseModal';

export interface IncomeFormData {
    currentEmployment: boolean;
    incomeType: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
    company: string;
    position: string;
    monthlyAmount: string;
    currency?: string;
    address: string;
    office: string;
    companyPhone: string;
    supervisorName: string;
    supervisorEmail: string;
    supervisorPhone: string;
}

interface UserAddIncomeModalProps {
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

const UserAddIncomeModal: React.FC<UserAddIncomeModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<IncomeFormData>({
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

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [currencySearch, setCurrencySearch] = useState('');
    const currencyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (!isOpen) {
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
            setErrors({});
            setTouched({});
        }
    }, [isOpen, initialData]);

    const filteredCurrencies = useMemo(() => {
        if (!currencySearch) return currencyOptions;
        const searchLower = currencySearch.toLowerCase();
        return currencyOptions.filter(currency =>
            currency.name.toLowerCase().includes(searchLower) ||
            currency.code.toLowerCase().includes(searchLower) ||
            currency.symbol.toLowerCase().includes(searchLower)
        );
    }, [currencySearch]);

    const selectedCurrency = useMemo(() => {
        if (!formData.currency) return currencyOptions[0];
        return currencyOptions.find(c => c.code === formData.currency) || currencyOptions[0];
    }, [formData.currency]);

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

    const validateField = (key: keyof IncomeFormData, value: any): string => {
        switch (key) {
            case 'startDate':
                if (!value) return 'Start Date is required';
                break;
            case 'endDate':
                if (!formData.currentEmployment && !value) return 'End Date is required';
                if (formData.currentEmployment) return '';
                if (!value) return 'End Date is required';
                break;
            case 'company':
                if (!value || String(value).trim() === '') return 'Company is required';
                break;
            case 'position':
                if (!value || String(value).trim() === '') return 'Position is required';
                break;
            case 'monthlyAmount':
                if (!value || String(value).trim() === '') return 'Monthly Income is required';
                break;
            case 'address':
                if (!value || String(value).trim() === '') return 'Address is required';
                break;
            case 'office':
                if (!value || String(value).trim() === '') return 'Office is required';
                break;
            case 'companyPhone':
                if (!value || String(value).trim() === '') return 'Company Phone is required';
                break;
            case 'supervisorName':
                if (!value || String(value).trim() === '') return 'Supervisor Name is required';
                break;
            case 'supervisorEmail':
                if (value && String(value).trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) return 'Invalid email';
                break;
            case 'supervisorPhone':
                if (!value || String(value).trim() === '') return 'Supervisor Phone is required';
                break;
        }
        return '';
    };

    const isFormValid = () => {
        const requiredFields: Array<keyof IncomeFormData> = [
            'startDate', 'company', 'position', 'monthlyAmount', 'address', 'office', 'companyPhone', 'supervisorName', 'supervisorPhone'
        ];

        let isValid = requiredFields.every(key => !validateField(key, formData[key]));

        if (!formData.currentEmployment && !formData.endDate) isValid = false;

        // Check optional email if present
        if (formData.supervisorEmail && validateField('supervisorEmail', formData.supervisorEmail)) isValid = false;

        return isValid;
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
        const allTouched = (Object.keys(formData) as Array<keyof IncomeFormData>).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        if (isFormValid()) {
            onSave(formData);
            onClose();
        }
    };

    const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: (checked: boolean) => void }) => (
        <button
            type="button"
            onClick={() => onChange(!checked)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#7ED957]' : 'bg-gray-300'}`}
        >
            <div
                className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`}
            />
        </button>
    );

    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]";
    const labelClasses = "block text-xs font-semibold text-gray-700 mb-1";
    const errorClasses = "text-red-500 text-xs mt-1";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit income' : 'Add a new income'}
            maxWidth="max-w-4xl"
            footerButtons={[
                {
                    label: 'Cancel',
                    onClick: onClose,
                    variant: 'ghost',
                },
                {
                    label: initialData ? 'Save Changes' : 'Add',
                    onClick: handleSubmit,
                    disabled: !isFormValid(),
                    variant: 'primary',
                    className: "bg-[#7ED957] hover:bg-[#6BC847] border-none text-white",
                    icon: <Check size={16} strokeWidth={3} />
                }
            ]}
        >
            <div className="py-2 space-y-6">

                {/* Current Employment & Type */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="w-full sm:w-1/2">
                        <label className={labelClasses}>Income Type</label>
                        <CustomDropdown
                            value={formData.incomeType}
                            onChange={(val: string) => handleChange('incomeType', val)}
                            options={incomeTypeOptions}
                            placeholder="Select Income Type"
                            buttonClassName={inputClasses}
                        />
                    </div>
                    <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 w-full sm:w-auto">
                        <span className="text-sm font-semibold text-gray-700">Current Employment?</span>
                        <ToggleSwitch
                            checked={formData.currentEmployment}
                            onChange={(val) => handleChange('currentEmployment', val)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div>
                        <label className={labelClasses}>Start Date *</label>
                        <DatePicker
                            value={formData.startDate}
                            onChange={(date) => {
                                handleChange('startDate', date);
                                handleBlur('startDate', date);
                            }}
                            placeholder="DD/MM/YYYY"
                            className={`${inputClasses} ${touched.startDate && errors.startDate ? 'border-red-500' : ''}`}
                        />
                        {touched.startDate && errors.startDate && <p className={errorClasses}>{errors.startDate}</p>}
                    </div>

                    {/* End Date */}
                    <div>
                        <label className={`${labelClasses} ${formData.currentEmployment ? 'text-gray-400' : ''}`}>End Date {formData.currentEmployment ? '' : '*'}</label>
                        <div className={formData.currentEmployment ? 'opacity-50 pointer-events-none' : ''}>
                            <DatePicker
                                value={formData.endDate}
                                onChange={(date) => {
                                    handleChange('endDate', date);
                                    handleBlur('endDate', date);
                                }}
                                placeholder="DD/MM/YYYY"
                                className={`${inputClasses} ${touched.endDate && errors.endDate ? 'border-red-500' : ''}`}
                            />
                        </div>
                        {touched.endDate && errors.endDate && <p className={errorClasses}>{errors.endDate}</p>}
                    </div>

                    {/* Company */}
                    <div>
                        <label className={labelClasses}>Company *</label>
                        <input
                            type="text"
                            placeholder="Type Here"
                            className={`${inputClasses} ${touched.company && errors.company ? 'border-red-500' : ''}`}
                            value={formData.company}
                            onChange={(e) => handleChange('company', e.target.value)}
                            onBlur={() => handleBlur('company')}
                        />
                        {touched.company && errors.company && <p className={errorClasses}>{errors.company}</p>}
                    </div>

                    {/* Position */}
                    <div>
                        <label className={labelClasses}>Position / Title *</label>
                        <input
                            type="text"
                            placeholder="Type Here"
                            className={`${inputClasses} ${touched.position && errors.position ? 'border-red-500' : ''}`}
                            value={formData.position}
                            onChange={(e) => handleChange('position', e.target.value)}
                            onBlur={() => handleBlur('position')}
                        />
                        {touched.position && errors.position && <p className={errorClasses}>{errors.position}</p>}
                    </div>

                    {/* Monthly Income */}
                    <div>
                        <label className={labelClasses}>Monthly Income *</label>
                        <div className={`flex border rounded-md transition-all ${touched.monthlyAmount && errors.monthlyAmount
                            ? 'border-red-500'
                            : 'border-gray-300 focus-within:border-[#7CD947] focus-within:ring-1 focus-within:ring-[#7CD947]'
                            }`}>

                            {/* Currency Selector */}
                            <div className="relative" ref={currencyRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                    className="flex items-center gap-1 px-3 py-2 border-r bg-gray-50 rounded-l-md focus:outline-none text-sm hover:bg-gray-100 transition-colors h-full"
                                >
                                    <span className="text-sm font-medium">
                                        {selectedCurrency ? (
                                            <span className="flex items-center gap-1">
                                                <span>{selectedCurrency.symbol}</span>
                                                <span className="hidden sm:inline text-xs text-gray-500">{selectedCurrency.code}</span>
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">$</span>
                                        )}
                                    </span>
                                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {isCurrencyOpen && (
                                    <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-[100] max-h-60 overflow-hidden flex flex-col">
                                        <div className="p-2 border-b border-gray-200">
                                            <div className="relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={currencySearch}
                                                    onChange={(e) => setCurrencySearch(e.target.value)}
                                                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#7CD947]"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto max-h-48">
                                            {filteredCurrencies.map((currency) => (
                                                <button
                                                    key={currency.code}
                                                    type="button"
                                                    onClick={() => {
                                                        handleChange('currency', currency.code);
                                                        setIsCurrencyOpen(false);
                                                        setCurrencySearch('');
                                                    }}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left ${formData.currency === currency.code ? 'bg-[#7ED957]/10' : ''}`}
                                                >
                                                    <span className="font-semibold text-sm w-8">{currency.symbol}</span>
                                                    <span className="flex-1 text-xs font-medium text-gray-700 truncate">{currency.name}</span>
                                                    <span className="text-xs text-gray-500">{currency.code}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                type="text"
                                placeholder="0.00"
                                className="flex-1 min-w-0 px-3 py-2 rounded-r-md focus:outline-none text-sm border-0 bg-transparent"
                                value={formData.monthlyAmount}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d.]/g, '');
                                    handleChange('monthlyAmount', value);
                                }}
                                onBlur={() => handleBlur('monthlyAmount')}
                            />
                        </div>
                        {touched.monthlyAmount && errors.monthlyAmount && <p className={errorClasses}>{errors.monthlyAmount}</p>}
                    </div>

                    {/* Address */}
                    <div className="md:col-span-2">
                        <label className={labelClasses}>Address *</label>
                        <input
                            type="text"
                            placeholder="Starting Address"
                            className={`${inputClasses} ${touched.address && errors.address ? 'border-red-500' : ''}`}
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            onBlur={() => handleBlur('address')}
                        />
                        {touched.address && errors.address && <p className={errorClasses}>{errors.address}</p>}
                    </div>

                    {/* Office */}
                    <div>
                        <label className={labelClasses}>Office *</label>
                        <input
                            type="text"
                            placeholder="Type Office"
                            className={`${inputClasses} ${touched.office && errors.office ? 'border-red-500' : ''}`}
                            value={formData.office}
                            onChange={(e) => handleChange('office', e.target.value)}
                            onBlur={() => handleBlur('office')}
                        />
                        {touched.office && errors.office && <p className={errorClasses}>{errors.office}</p>}
                    </div>

                    {/* Company Phone */}
                    <div>
                        <label className={labelClasses}>Company Phone Number *</label>
                        <input
                            type="tel"
                            placeholder="Type Phone Number"
                            className={`${inputClasses} ${touched.companyPhone && errors.companyPhone ? 'border-red-500' : ''}`}
                            value={formData.companyPhone}
                            onChange={(e) => handleChange('companyPhone', e.target.value)}
                            onBlur={() => handleBlur('companyPhone')}
                        />
                        {touched.companyPhone && errors.companyPhone && <p className={errorClasses}>{errors.companyPhone}</p>}
                    </div>

                    <div className="md:col-span-2 border-t border-gray-100 pt-4 mt-2">
                        <h4 className="text-sm font-bold text-gray-800 mb-4">Supervisor Information</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Supervisor Name */}
                            <div>
                                <label className={labelClasses}>Supervisor Full Name *</label>
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    className={`${inputClasses} ${touched.supervisorName && errors.supervisorName ? 'border-red-500' : ''}`}
                                    value={formData.supervisorName}
                                    onChange={(e) => handleChange('supervisorName', e.target.value)}
                                    onBlur={() => handleBlur('supervisorName')}
                                />
                                {touched.supervisorName && errors.supervisorName && <p className={errorClasses}>{errors.supervisorName}</p>}
                            </div>

                            {/* Supervisor Email */}
                            <div>
                                <label className={labelClasses}>Supervisor Email</label>
                                <input
                                    type="email"
                                    placeholder="Add Email here"
                                    className={`${inputClasses} ${touched.supervisorEmail && errors.supervisorEmail ? 'border-red-500' : ''}`}
                                    value={formData.supervisorEmail}
                                    onChange={(e) => handleChange('supervisorEmail', e.target.value)}
                                    onBlur={() => handleBlur('supervisorEmail')}
                                />
                                {touched.supervisorEmail && errors.supervisorEmail && <p className={errorClasses}>{errors.supervisorEmail}</p>}
                            </div>

                            {/* Supervisor Phone */}
                            <div>
                                <label className={labelClasses}>Supervisor Phone *</label>
                                <input
                                    type="tel"
                                    placeholder="Add Phone number here"
                                    className={`${inputClasses} ${touched.supervisorPhone && errors.supervisorPhone ? 'border-red-500' : ''}`}
                                    value={formData.supervisorPhone}
                                    onChange={(e) => handleChange('supervisorPhone', e.target.value)}
                                    onBlur={() => handleBlur('supervisorPhone')}
                                />
                                {touched.supervisorPhone && errors.supervisorPhone && <p className={errorClasses}>{errors.supervisorPhone}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default UserAddIncomeModal;
