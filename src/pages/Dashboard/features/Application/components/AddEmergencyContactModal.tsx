import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, ChevronLeft, Search, ChevronDown } from 'lucide-react';
import { Country } from 'country-state-city';
import type { EmergencyContactFormData } from '../store/applicationStore';

interface AddEmergencyContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EmergencyContactFormData) => void;
    initialData?: EmergencyContactFormData;
}

const AddEmergencyContactModal: React.FC<AddEmergencyContactModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<EmergencyContactFormData & { phoneCountryCode?: string }>({
        fullName: '',
        relationship: '',
        email: '',
        phoneNumber: '',
        phoneCountryCode: undefined,
        details: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
    const [phoneCodeSearch, setPhoneCodeSearch] = useState('');
    const phoneCodeRef = useRef<HTMLDivElement>(null);
    const [isRelationshipOpen, setIsRelationshipOpen] = useState(false);
    const relationshipRef = useRef<HTMLDivElement>(null);

    // Relationship options
    const relationshipOptions = [
        'Spouse',
        'Parent',
        'Sibling',
        'Child',
        'Friend',
        'Colleague',
        'Relative',
        'Neighbor',
        'Other'
    ];

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
            if (relationshipRef.current && !relationshipRef.current.contains(event.target as Node)) {
                setIsRelationshipOpen(false);
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
                setFormData({
                    ...initialData,
                    phoneCountryCode: (initialData as any).phoneCountryCode || undefined
                });
            } else {
                setFormData({
                    fullName: '',
                    relationship: '',
                    email: '',
                    phoneNumber: '',
                    phoneCountryCode: undefined,
                    details: ''
                });
            }
        } else {
            document.body.style.overflow = 'unset';
            setErrors({});
            setTouched({});
            setIsPhoneCodeOpen(false);
            setPhoneCodeSearch('');
            setIsRelationshipOpen(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialData]);


    if (!isOpen) return null;

    const validateField = (key: keyof EmergencyContactFormData, value: any): string => {
        switch (key) {
            case 'fullName':
                if (!value || value.trim() === '') return 'Full Name is required';
                break;
            case 'relationship':
                if (!value || value.trim() === '') return 'Relationship is required';
                break;
            case 'email':
                if (!value || value.trim() === '') return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
                break;
            case 'phoneNumber':
                if (!value || value.trim() === '') return 'Phone Number is required';
                {
                    // Count only digits for validation (allow formatting characters)
                    const digitsOnly = value.replace(/\D/g, '');
                    if (digitsOnly.length < 4 || digitsOnly.length > 15) {
                        return 'Phone number must be between 4 and 15 digits';
                    }
                }
                break;
            case 'details':
                if (!value || value.trim() === '') return 'Details are required';
                break;
        }
        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof EmergencyContactFormData>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (key: keyof EmergencyContactFormData | 'phoneCountryCode', value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        if (key !== 'phoneCountryCode' && touched[key]) {
            const error = validateField(key as keyof EmergencyContactFormData, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof EmergencyContactFormData) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const error = validateField(key, formData[key]);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        const allTouched = (Object.keys(formData) as Array<keyof EmergencyContactFormData>).reduce((acc, key) => {
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
            <div className="bg-[#EAEAEA] rounded-xl w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative max-h-[90vh] flex flex-col font-sans">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-xl shrink-0">
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-lg font-medium">{initialData ? 'Edit emergency contact' : 'Add emergency contact'}</h2>
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
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Contact Name*</label>
                                <input
                                    type="text"
                                    placeholder="Type here"
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.fullName && errors.fullName ? 'border-2 border-red-500' : ''}`}
                                    value={formData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    onBlur={() => handleBlur('fullName')}
                                />
                                {touched.fullName && errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Contact Email *</label>
                                <input
                                    type="email"
                                    placeholder="Type here"
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.email && errors.email ? 'border-2 border-red-500' : ''}`}
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                />
                                {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Contact Number *</label>
                                <div className={`flex border rounded-xl transition-all ${
                                    touched.phoneNumber && errors.phoneNumber 
                                        ? 'border-red-500 border-2' 
                                        : 'border-gray-200 focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C]'
                                }`}>
                                    {/* Phone Code Selector */}
                                    <div className="relative" ref={phoneCodeRef}>
                                        <button
                                            type="button"
                                            onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                                            className={`flex items-center gap-1 px-3 py-2.5 border-r bg-white rounded-l-xl focus:outline-none text-sm min-w-[100px] hover:bg-gray-50 transition-colors ${
                                                touched.phoneNumber && errors.phoneNumber 
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
                                                {/* Search Input */}
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

                                                {/* Options List */}
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
                                                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${
                                                                    formData.phoneCountryCode === code.value ? 'bg-[#3A6D6C]/10' : ''
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
                                        placeholder="Enter phone number"
                                        className={`flex-1 min-w-0 px-4 py-2.5 rounded-r-xl focus:outline-none text-sm placeholder-gray-400 bg-white border-0 ${
                                            touched.phoneNumber && errors.phoneNumber ? 'text-red-500' : 'text-gray-700'
                                        }`}
                                        value={formData.phoneNumber}
                                        onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                        onBlur={() => handleBlur('phoneNumber')}
                                    />
                                </div>
                                {touched.phoneNumber && errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                            </div>
                        </div>

                        {/* Row 2: Relationship */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Relationship to applicant *</label>
                            <div className="relative" ref={relationshipRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsRelationshipOpen(!isRelationshipOpen)}
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-left flex items-center justify-between text-sm ${
                                        touched.relationship && errors.relationship 
                                            ? 'border-2 border-red-500' 
                                            : 'border border-gray-200 focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C]'
                                    } ${formData.relationship ? 'text-gray-700' : 'text-gray-500'}`}
                                >
                                    <span>{formData.relationship || 'Select relationship'}</span>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isRelationshipOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {isRelationshipOpen && (
                                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                                        {relationshipOptions.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    handleChange('relationship', option);
                                                    setIsRelationshipOpen(false);
                                                }}
                                                className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#3A6D6C]/10 transition-colors text-left text-sm ${
                                                    formData.relationship === option ? 'bg-[#3A6D6C]/10 font-medium' : 'text-gray-700'
                                                }`}
                                            >
                                                <span>{option}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            {touched.relationship && errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
                        </div>

                        {/* Row 3: Details */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Details *</label>
                            <textarea
                                placeholder="Type Here"
                                className={`w-full bg-white p-4 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm min-h-[150px] resize-none ${touched.details && errors.details ? 'border-2 border-red-500' : ''}`}
                                value={formData.details}
                                onChange={(e) => handleChange('details', e.target.value)}
                                onBlur={() => handleBlur('details')}
                            />
                            {touched.details && errors.details && <p className="text-red-500 text-xs mt-1">{errors.details}</p>}
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

export default AddEmergencyContactModal;
