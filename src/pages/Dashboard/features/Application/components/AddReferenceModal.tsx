import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, ChevronLeft, Search, ChevronDown } from 'lucide-react';
import { Country } from 'country-state-city';

export interface ReferenceFormData {
    contactName: string;
    contactEmail: string;
    contactNumber: string;
    phoneCountryCode?: string;
    relationship: string;
    yearsKnown: string;
}

interface AddReferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ReferenceFormData) => void;
    initialData?: ReferenceFormData;
}

const AddReferenceModal: React.FC<AddReferenceModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<ReferenceFormData>({
        contactName: '',
        contactEmail: '',
        contactNumber: '',
        phoneCountryCode: undefined,
        relationship: '',
        yearsKnown: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
    const [phoneCodeSearch, setPhoneCodeSearch] = useState('');
    const phoneCodeRef = useRef<HTMLDivElement>(null);

    // Phone country codes
    const phoneCountryCodes = useMemo(() => {
        return Country.getAllCountries().map(country => ({
            label: `${country.flag} ${country.phonecode.startsWith('+') ? '' : '+'}${country.phonecode}`,
            value: `${country.isoCode}|${country.phonecode}`,
            name: country.name,
            phonecode: country.phonecode.startsWith('+') ? country.phonecode : `+${country.phonecode}`,
            flag: country.flag,
            isoCode: country.isoCode,
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    // Filter phone codes based on search
    const filteredPhoneCodes = useMemo(() => {
        if (!phoneCodeSearch) return phoneCountryCodes;
        const searchLower = phoneCodeSearch.toLowerCase();
        return phoneCountryCodes.filter(code =>
            code.name.toLowerCase().includes(searchLower) ||
            code.phonecode.includes(searchLower) ||
            code.isoCode.toLowerCase().includes(searchLower)
        );
    }, [phoneCodeSearch, phoneCountryCodes]);

    // Get selected phone code display
    const selectedPhoneCode = useMemo(() => {
        if (!formData.phoneCountryCode) return null;
        return phoneCountryCodes.find(code => code.value === formData.phoneCountryCode);
    }, [formData.phoneCountryCode, phoneCountryCodes]);

    // Close phone code dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (phoneCodeRef.current && !phoneCodeRef.current.contains(event.target as Node)) {
                setIsPhoneCodeOpen(false);
                setPhoneCodeSearch('');
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    contactName: '',
                    contactEmail: '',
                    contactNumber: '',
                    phoneCountryCode: undefined,
                    relationship: '',
                    yearsKnown: ''
                });
            }
        } else {
            document.body.style.overflow = 'unset';
            setErrors({});
            setTouched({});
            setIsPhoneCodeOpen(false);
            setPhoneCodeSearch('');
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialData]);


    if (!isOpen) return null;

    const validateField = (key: keyof ReferenceFormData, value: any): string => {
        switch (key) {
            case 'contactName':
                if (!value || value.trim() === '') return 'Contact Name is required';
                break;
            case 'contactEmail':
                if (!value || value.trim() === '') return 'Contact Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
                break;
            case 'contactNumber':
                if (!value || value.trim() === '') return 'Contact Number is required';
                {
                    const digitsOnly = value.replace(/\D/g, '');
                    if (digitsOnly.length < 4 || digitsOnly.length > 15) {
                        return 'Phone number must be between 4 and 15 digits';
                    }
                }
                break;
            case 'relationship':
                if (!value || value.trim() === '') return 'Relationship is required';
                break;
            case 'yearsKnown':
                if (!value || value.trim() === '') return 'Years Known is required';
                break;
        }
        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof ReferenceFormData>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (key: keyof ReferenceFormData | 'phoneCountryCode', value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        if (key !== 'phoneCountryCode' && touched[key]) {
            const error = validateField(key as keyof ReferenceFormData, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof ReferenceFormData) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const error = validateField(key, formData[key]);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        const allTouched = (Object.keys(formData) as Array<keyof ReferenceFormData>).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        if (validateAllFields()) {
            onSave(formData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-[2rem] overflow-hidden w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative max-h-[90vh] flex flex-col font-sans">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-[2rem] shrink-0">
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-lg font-medium">Add a new reference</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#EAEAEA]">

                    {/* Form Grid */}
                    <div className="flex flex-col gap-6 mb-6">

                        {/* Row 1: Name, Email, Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Contact Name */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Contact Name*</label>
                                <input
                                    type="text"
                                    placeholder="Type here"
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.contactName && errors.contactName ? 'border-2 border-red-500' : ''}`}
                                    value={formData.contactName}
                                    onChange={(e) => handleChange('contactName', e.target.value)}
                                    onBlur={() => handleBlur('contactName')}
                                />
                                {touched.contactName && errors.contactName && <p className="text-red-500 text-xs mt-1">{errors.contactName}</p>}
                            </div>

                            {/* Contact Email */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Contact Email *</label>
                                <input
                                    type="email"
                                    placeholder="Type here"
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.contactEmail && errors.contactEmail ? 'border-2 border-red-500' : ''}`}
                                    value={formData.contactEmail}
                                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                                    onBlur={() => handleBlur('contactEmail')}
                                />
                                {touched.contactEmail && errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>}
                            </div>

                            {/* Contact Number */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Contact Number *</label>
                                <div className={`flex border rounded-xl transition-all ${touched.contactNumber && errors.contactNumber
                                        ? 'border-red-500 border-2'
                                        : 'border-gray-200 focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C]'
                                    }`}>
                                    {/* Phone Code Selector */}
                                    <div className="relative" ref={phoneCodeRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                                            className={`flex items-center gap-1 px-3 py-2.5 border-r bg-white rounded-l-xl focus:outline-none text-sm min-w-[100px] hover:bg-gray-50 transition-colors ${touched.contactNumber && errors.contactNumber
                                                    ? 'border-red-500'
                                                    : 'border-gray-200'
                                                }`}
                                        >
                                            <span className="text-sm font-medium">
                                                {selectedPhoneCode ? (
                                                    <span className="flex items-center gap-1">
                                                        <span>{selectedPhoneCode.flag}</span>
                                                        <span className="hidden sm:inline">{selectedPhoneCode.phonecode}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">Code</span>
                                                )}
                                            </span>
                                            <ChevronDown size={16} className={`text-gray-500 transition-transform ${isPhoneCodeOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Dropdown */}
                                        {isPhoneCodeOpen && (
                                            <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-300 rounded-xl shadow-lg z-[100] max-h-80 overflow-hidden flex flex-col">
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative">
                                                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                        <input
                                                            type="text"
                                                            placeholder="Search country or code..."
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
                                                                    handleChange('phoneCountryCode', code.value);
                                                                    setIsPhoneCodeOpen(false);
                                                                    setPhoneCodeSearch('');
                                                                }}
                                                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${formData.phoneCountryCode === code.value ? 'bg-[#3A6D6C]/10' : ''
                                                                    }`}
                                                            >
                                                                <span className="text-xl">{code.flag}</span>
                                                                <span className="flex-1 text-sm font-medium text-gray-900">{code.name}</span>
                                                                <span className="text-sm text-gray-600">{code.phonecode}</span>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                            No countries found
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Phone Number Input */}
                                    <input
                                        type="tel"
                                        placeholder="Type here"
                                        className={`flex-1 min-w-0 px-4 py-2.5 rounded-r-xl focus:outline-none text-sm placeholder-gray-400 bg-white border-0 ${touched.contactNumber && errors.contactNumber ? 'text-red-500' : 'text-gray-700'
                                            }`}
                                        value={formData.contactNumber}
                                        onChange={(e) => handleChange('contactNumber', e.target.value)}
                                        onBlur={() => handleBlur('contactNumber')}
                                    />
                                </div>
                                {touched.contactNumber && errors.contactNumber && <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>}
                            </div>
                        </div>

                        {/* Row 2: Relationship */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Relationship to applicant *</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={`w-full md:w-2/3 bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.relationship && errors.relationship ? 'border-2 border-red-500' : ''}`}
                                value={formData.relationship}
                                onChange={(e) => handleChange('relationship', e.target.value)}
                                onBlur={() => handleBlur('relationship')}
                            />
                            {touched.relationship && errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
                        </div>

                        {/* Row 3: Years Known */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Years Known *</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={`w-full md:w-2/3 bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.yearsKnown && errors.yearsKnown ? 'border-2 border-red-500' : ''}`}
                                value={formData.yearsKnown}
                                onChange={(e) => handleChange('yearsKnown', e.target.value)}
                                onBlur={() => handleBlur('yearsKnown')}
                            />
                            {touched.yearsKnown && errors.yearsKnown && <p className="text-red-500 text-xs mt-1">{errors.yearsKnown}</p>}
                        </div>

                    </div>

                    {/* Add Button */}
                    <div>
                        <button
                            onClick={handleSubmit}
                            className="bg-[#3A6D6C] text-white px-12 py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            {initialData ? 'Save' : 'Add'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddReferenceModal;
