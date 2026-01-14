import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import DatePicker from '../../../../../components/ui/DatePicker';
import CurrencySelector from '../../../../../components/ui/CurrencySelector';
import { format } from 'date-fns';
import { cn } from '../../../../../lib/utils';
import { Country } from 'country-state-city';
import { ChevronDown, Search } from 'lucide-react';

interface AddInsuranceModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: {
        companyName: string;
        companyWebsite: string;
        agentName: string;
        agentEmail: string;
        agentPhone: string;
        policyNumber: string;
        price: string;
        effectiveDate: string;
        expirationDate: string;
        details: string;
        emailNotification: boolean;
    };
    onAdd: (data: {
        companyName: string;
        companyWebsite: string;
        agentName: string;
        agentEmail: string;
        agentPhone: string;
        policyNumber: string;
        price: string;
        effectiveDate: string;
        expirationDate: string;
        details: string;
        emailNotification: boolean;
    }) => void;
}

const AddInsuranceModal: React.FC<AddInsuranceModalProps> = ({ isOpen, onClose, onAdd, initialData }) => {
    // Phone country codes
    const phoneCountryCodes = React.useMemo(() => {
        return Country.getAllCountries().map(country => ({
            label: `${country.flag} ${country.phonecode.startsWith('+') ? '' : '+'}${country.phonecode}`,
            value: `${country.isoCode}|${country.phonecode}`,
            name: country.name,
            phonecode: country.phonecode.startsWith('+') ? country.phonecode : `+${country.phonecode}`,
            flag: country.flag,
            isoCode: country.isoCode,
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
    const [phoneCodeSearch, setPhoneCodeSearch] = useState('');
    const phoneCodeRef = React.useRef<HTMLDivElement>(null);

    // Form State
    const [companyName, setCompanyName] = useState('');
    const [companyWebsite, setCompanyWebsite] = useState('');
    const [agentName, setAgentName] = useState('');
    const [agentEmail, setAgentEmail] = useState('');
    const [agentPhone, setAgentPhone] = useState('');
    const [phoneCountryCode, setPhoneCountryCode] = useState('');
    const [policyNumber, setPolicyNumber] = useState('');
    const [price, setPrice] = useState('');
    const [currency, setCurrency] = useState('INR');
    const [effectiveDate, setEffectiveDate] = useState<Date>();
    const [expirationDate, setExpirationDate] = useState<Date>();
    const [details, setDetails] = useState('');
    const [emailNotification, setEmailNotification] = useState(false);

    // Effect to populate data on open
    React.useEffect(() => {
        if (isOpen && initialData) {
            setCompanyName(initialData.companyName || '');
            setCompanyWebsite(initialData.companyWebsite || '');
            setAgentName(initialData.agentName || '');
            setAgentEmail(initialData.agentEmail || '');

            // Simple split logic for demo
            const phoneParts = (initialData.agentPhone || '').split(' ');
            let code = '+91';
            let number = '';

            if (phoneParts.length > 1 && phoneParts[0].startsWith('+')) {
                code = phoneParts[0];
                number = phoneParts.slice(1).join(' ');
            } else {
                number = initialData.agentPhone || '';
            }

            // Find matching value
            const matching = phoneCountryCodes.find(c => c.phonecode === code);
            setPhoneCountryCode(matching ? matching.value : (phoneCountryCodes.find(c => c.phonecode === '+91')?.value || ''));
            setAgentPhone(number);

            setPolicyNumber(initialData.policyNumber || '');

            // Extract currency
            const priceParts = (initialData.price || '').split(' ');
            if (priceParts.length > 1 && isNaN(Number(priceParts[0]))) {
                setCurrency(priceParts[0]);
                setPrice(priceParts.slice(1).join(' '));
            } else {
                setPrice(initialData.price || '');
            }

            setEffectiveDate(initialData.effectiveDate ? new Date(initialData.effectiveDate) : undefined);
            setExpirationDate(initialData.expirationDate ? new Date(initialData.expirationDate) : undefined);
            setDetails(initialData.details || '');
            setEmailNotification(initialData.emailNotification || false);
        } else if (isOpen) {
            // Reset if opening in add mode
            setCompanyName('');
            setCompanyWebsite('');
            setAgentName('');
            setAgentEmail('');
            setAgentPhone('');
            // Default to IN|91
            const defaultCode = phoneCountryCodes.find(c => c.phonecode === '+91')?.value || '';
            setPhoneCountryCode(defaultCode);
            setPolicyNumber('');
            setPrice('');
            setCurrency('INR');
            setEffectiveDate(undefined);
            setExpirationDate(undefined);
            setDetails('');
            setEmailNotification(false);
            setErrors({});
        }
    }, [isOpen, initialData, phoneCountryCodes]);

    // Prevent background scrolling when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close dropdown on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (phoneCodeRef.current && !phoneCodeRef.current.contains(event.target as Node)) {
                setIsPhoneCodeOpen(false);
                setPhoneCodeSearch('');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredPhoneCodes = React.useMemo(() => {
        if (!phoneCodeSearch) return phoneCountryCodes;
        const searchLower = phoneCodeSearch.toLowerCase();
        return phoneCountryCodes.filter(code =>
            code.name.toLowerCase().includes(searchLower) ||
            code.phonecode.includes(searchLower) ||
            code.isoCode.toLowerCase().includes(searchLower)
        );
    }, [phoneCodeSearch, phoneCountryCodes]);

    const selectedPhoneCode = React.useMemo(() => {
        if (!phoneCountryCode) return null;
        return phoneCountryCodes.find(code => code.value === phoneCountryCode);
    }, [phoneCountryCode, phoneCountryCodes]);

    // Validation State
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleAdd = () => {
        const newErrors: { [key: string]: string } = {};

        if (!companyName.trim()) newErrors.companyName = 'Company name is required';
        if (!companyWebsite.trim()) newErrors.companyWebsite = 'Company website is required';
        if (!policyNumber.trim()) newErrors.policyNumber = 'Policy number is required';
        if (!price.trim()) newErrors.price = 'Price is required';
        if (!effectiveDate) newErrors.effectiveDate = 'Effective date is required';
        if (!expirationDate) newErrors.expirationDate = 'Expiration date is required';

        if (agentEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agentEmail)) {
            newErrors.agentEmail = 'Invalid email format';
        }

        // Basic phone validation
        if (agentPhone.trim() && agentPhone.length < 5) {
            newErrors.agentPhone = 'Phone number too short';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const code = selectedPhoneCode ? selectedPhoneCode.phonecode : '';

        onAdd({
            companyName: companyName.trim(),
            companyWebsite: companyWebsite.trim(),
            agentName: agentName.trim(),
            agentEmail: agentEmail.trim(),
            agentPhone: `${code} ${agentPhone.trim()}`,
            policyNumber: policyNumber.trim(),
            price: price.trim(), // Storing just amount or "INR 500"? Let's store "500" for now as per typings, or maybe updated to "INR 500" if backend supports string. Keeping simple as per request context
            effectiveDate: effectiveDate ? format(effectiveDate, 'dd MMM, yyyy') : '',
            expirationDate: expirationDate ? format(expirationDate, 'dd MMM, yyyy') : '',
            details: details.trim(),
            emailNotification
        });

        // Reset and close (optional, as effect handles it)
        onClose();
    };

    if (!isOpen) return null;

    const inputClasses = "w-full p-3 rounded-lg border border-gray-200 outline-none text-gray-700 placeholder-gray-400 font-medium focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all bg-white";

    // Country codes for phone


    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">{initialData ? 'Edit insurance' : 'Add insurance'}</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    <div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            You can add, store and track the expiration of homeowners insurance, flood insurance and earthquake insurance. You can add up to 10 insurance records.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="font-bold text-[#2c3e50]">New Insurance</div>

                        {/* Company Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Company name <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={companyName}
                                        onChange={(e) => {
                                            setCompanyName(e.target.value);
                                            if (errors.companyName) setErrors({ ...errors, companyName: '' });
                                        }}
                                        className={cn(inputClasses, errors.companyName && 'border-red-500 focus:ring-red-500/20')}
                                        placeholder="Company name"
                                    />
                                </div>
                                {errors.companyName && <p className="text-red-600 text-xs mt-1 ml-1">{errors.companyName}</p>}
                            </div>

                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Company website <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={companyWebsite}
                                        onChange={(e) => {
                                            setCompanyWebsite(e.target.value);
                                            if (errors.companyWebsite) setErrors({ ...errors, companyWebsite: '' });
                                        }}
                                        className={cn(inputClasses, errors.companyWebsite && 'border-red-500 focus:ring-red-500/20')}
                                        placeholder="Company website"
                                    />
                                </div>
                                {errors.companyWebsite && <p className="text-red-600 text-xs mt-1 ml-1">{errors.companyWebsite}</p>}
                            </div>
                        </div>

                        {/* Agent Info */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Agent name</label>
                                <input
                                    type="text"
                                    value={agentName}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (!/[0-9]/.test(val)) {
                                            setAgentName(val);
                                        }
                                    }}
                                    className={inputClasses}
                                    placeholder="Agent name"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Agent email</label>
                                <input
                                    type="email"
                                    value={agentEmail}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setAgentEmail(val);
                                        if (val.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
                                            setErrors({ ...errors, agentEmail: 'Invalid email format' });
                                        } else {
                                            const newErrors = { ...errors };
                                            delete newErrors.agentEmail;
                                            setErrors(newErrors);
                                        }
                                    }}
                                    className={cn(inputClasses, errors.agentEmail && 'border-red-500 focus:ring-red-500/20')}
                                    placeholder="Agent email"
                                />
                                {errors.agentEmail && <p className="text-red-600 text-xs mt-1 ml-1">{errors.agentEmail}</p>}
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Agent phone</label>
                                <div className={`flex border rounded-lg transition-all ${errors.agentPhone ? 'border-red-500 border-2' : 'border-gray-200 focus-within:ring-2 focus-within:ring-[#3A6D6C]/20'}`}>
                                    <div className="relative" ref={phoneCodeRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                                            className="flex items-center gap-1 px-3 py-3 border-r border-gray-200 bg-white rounded-l-lg hover:bg-gray-50 transition-colors h-full min-w-[100px]"
                                        >
                                            <span className="text-sm font-medium">
                                                {selectedPhoneCode ? (
                                                    <span className="flex items-center gap-1">
                                                        <span>{selectedPhoneCode.flag}</span>
                                                        <span className="hidden sm:inline">{selectedPhoneCode.phonecode}</span>
                                                    </span>
                                                ) : <span className="text-gray-500">Code</span>}
                                            </span>
                                            <ChevronDown size={16} className={`text-gray-500 ml-auto transition-transform ${isPhoneCodeOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isPhoneCodeOpen && (
                                            <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-300 rounded-xl shadow-lg z-[100] max-h-80 overflow-hidden flex flex-col">
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search..."
                                                            value={phoneCodeSearch}
                                                            onChange={(e) => setPhoneCodeSearch(e.target.value)}
                                                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-sm"
                                                            autoFocus
                                                        />
                                                    </div>
                                                </div>
                                                <div className="overflow-y-auto max-h-64">
                                                    {filteredPhoneCodes.length > 0 ? (
                                                        filteredPhoneCodes.map((code) => (
                                                            <button
                                                                key={code.value}
                                                                type="button"
                                                                onClick={() => {
                                                                    setPhoneCountryCode(code.value);
                                                                    setIsPhoneCodeOpen(false);
                                                                    setPhoneCodeSearch('');
                                                                }}
                                                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${phoneCountryCode === code.value ? 'bg-[#3A6D6C]/10' : ''}`}
                                                            >
                                                                <span className="text-xl">{code.flag}</span>
                                                                <span className="flex-1 text-sm font-medium text-gray-900">{code.name}</span>
                                                                <span className="text-sm text-gray-600">{code.phonecode}</span>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-8 text-center text-sm text-gray-500">No countries found</div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="tel"
                                        value={agentPhone}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setAgentPhone(val);
                                            if (errors.agentPhone) setErrors({ ...errors, agentPhone: '' });
                                        }}
                                        className="flex-1 min-w-0 px-4 py-3 rounded-r-lg outline-none text-gray-700 placeholder-gray-400 font-medium bg-white"
                                        placeholder="Phone number"
                                    />
                                </div>
                                {errors.agentPhone && <p className="text-red-600 text-xs mt-1 ml-1">{errors.agentPhone}</p>}
                            </div>
                        </div>

                        {/* Policy & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Policy #</label>
                                <input
                                    type="text"
                                    value={policyNumber}
                                    onChange={(e) => setPolicyNumber(e.target.value)}
                                    className={inputClasses}
                                    placeholder="Policy #"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Price <span className="text-red-500">*</span></label>
                                <div className="flex relative">
                                    <CurrencySelector
                                        value={currency}
                                        onChange={setCurrency}
                                        className="rounded-l-lg rounded-r-none border-r-0"
                                    />
                                    <input
                                        type="number"
                                        value={price}
                                        onChange={(e) => {
                                            setPrice(e.target.value);
                                            if (errors.price) setErrors({ ...errors, price: '' });
                                        }}
                                        className={cn(inputClasses, "rounded-l-none", errors.price && 'border-red-500 focus:ring-red-500/20')}
                                        placeholder="Price"
                                    />
                                </div>
                                {errors.price && <p className="text-red-600 text-xs mt-1 ml-1">{errors.price}</p>}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Effective date</label>
                                <DatePicker
                                    value={effectiveDate}
                                    onChange={setEffectiveDate}
                                    className="w-full border-gray-200"
                                    placeholder="Select date"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Expiration date</label>
                                <DatePicker
                                    value={expirationDate}
                                    onChange={setExpirationDate}
                                    className="w-full border-gray-200"
                                    placeholder="Select date"
                                />
                            </div>
                        </div>

                        {/* Details */}
                        <div>
                            <label className="block text-xs text-gray-900 font-medium mb-1 ml-1">Details</label>
                            <textarea
                                value={details}
                                onChange={(e) => setDetails(e.target.value)}
                                className={`${inputClasses} h-24 resize-none`}
                                placeholder="Details"
                                maxLength={500}
                            />
                            <div className="text-right text-xs text-gray-400 mt-1">
                                Character limit: {details.length} / 500
                            </div>
                        </div>

                        {/* Toggle */}
                        <div className="flex items-center gap-3 pt-2">
                            <button
                                onClick={() => setEmailNotification(!emailNotification)}
                                className={`w-12 h-7 rounded-full transition-colors relative ${emailNotification ? 'bg-[#5F8B8A]' : 'bg-gray-300'}`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full shadow-sm transition-transform ${emailNotification ? 'translate-x-5' : 'translate-x-0'}`} />
                            </button>
                            <span className="text-[#2c3e50] font-medium">Email notification due to expiration</span>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 shrink-0">
                        <button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="w-full sm:flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            {initialData ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default AddInsuranceModal;
