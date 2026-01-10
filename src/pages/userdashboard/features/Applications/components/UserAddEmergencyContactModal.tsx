import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Search, ChevronDown } from 'lucide-react';
import { Country } from 'country-state-city';
import BaseModal from '@/components/common/modals/BaseModal';
import type { EmergencyContactFormData } from '../store/userApplicationStore';

interface UserAddEmergencyContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EmergencyContactFormData) => void;
    initialData?: EmergencyContactFormData;
}

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

const UserAddEmergencyContactModal: React.FC<UserAddEmergencyContactModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<EmergencyContactFormData>({
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

    const filteredPhoneCodes = useMemo(() => {
        if (!phoneCodeSearch) return phoneCountryCodes;
        const searchLower = phoneCodeSearch.toLowerCase();
        return phoneCountryCodes.filter(code =>
            code.name.toLowerCase().includes(searchLower) ||
            code.phonecode.includes(searchLower) ||
            code.isoCode.toLowerCase().includes(searchLower)
        );
    }, [phoneCodeSearch, phoneCountryCodes]);

    const selectedPhoneCode = useMemo(() => {
        if (!formData.phoneCountryCode) return null;
        return phoneCountryCodes.find(code => code.value === formData.phoneCountryCode);
    }, [formData.phoneCountryCode, phoneCountryCodes]);

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

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData({
                ...initialData,
                phoneCountryCode: (initialData as any).phoneCountryCode || undefined
            });
        } else if (!isOpen) {
            setFormData({
                fullName: '',
                relationship: '',
                email: '',
                phoneNumber: '',
                phoneCountryCode: undefined,
                details: ''
            });
            setErrors({});
            setTouched({});
            setIsPhoneCodeOpen(false);
            setPhoneCodeSearch('');
            setIsRelationshipOpen(false);
        }
    }, [isOpen, initialData]);

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
                if (!formData.phoneCountryCode) {
                    return 'Please select a country code first';
                }
                if (!value || value.trim() === '') return 'Phone Number is required';
                {
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

    const isFormValid = () => {
        const requiredFields: Array<keyof EmergencyContactFormData> = ['fullName', 'relationship', 'email', 'phoneNumber', 'details'];
        return requiredFields.every(key => !validateField(key, formData[key]));
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

        if (isFormValid()) {
            onSave(formData);
            onClose();
        }
    };

    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]";
    const labelClasses = "block text-xs font-semibold text-gray-700 mb-1";
    const errorClasses = "text-red-500 text-xs mt-1";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit emergency contact' : 'Add emergency contact'}
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
            <div className="py-2 flex flex-col gap-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Full Name */}
                    <div>
                        <label className={labelClasses}>Contact Name *</label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className={`${inputClasses} ${touched.fullName && errors.fullName ? 'border-red-500' : ''}`}
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            onBlur={() => handleBlur('fullName')}
                        />
                        {touched.fullName && errors.fullName && <p className={errorClasses}>{errors.fullName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className={labelClasses}>Contact Email *</label>
                        <input
                            type="email"
                            placeholder="Type here"
                            className={`${inputClasses} ${touched.email && errors.email ? 'border-red-500' : ''}`}
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                        />
                        {touched.email && errors.email && <p className={errorClasses}>{errors.email}</p>}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className={labelClasses}>Contact Number *</label>
                        <div className={`flex border rounded-md transition-all ${(touched.phoneNumber && errors.phoneNumber) || (!formData.phoneCountryCode && touched.phoneNumber)
                            ? 'border-red-500'
                            : 'border-gray-300 focus-within:border-[#7CD947] focus-within:ring-1 focus-within:ring-[#7CD947]'
                            }`}>
                            {/* Phone Code Selector */}
                            <div className="relative" ref={phoneCodeRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                                    className={`flex items-center gap-1 px-3 py-2 border-r bg-gray-50 rounded-l-md focus:outline-none text-sm hover:bg-gray-100 transition-colors h-full min-w-[80px] ${touched.phoneNumber && !formData.phoneCountryCode ? 'border-red-500' : ''
                                        }`}
                                >
                                    <span className="text-sm font-medium">
                                        {selectedPhoneCode ? (
                                            <span className="flex items-center gap-1">
                                                <span>{selectedPhoneCode.flag}</span>
                                                <span className="hidden sm:inline text-xs text-gray-500">{selectedPhoneCode.phonecode}</span>
                                            </span>
                                        ) : (
                                            <span className="text-gray-500">Code</span>
                                        )}
                                    </span>
                                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${isPhoneCodeOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {isPhoneCodeOpen && (
                                    <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-[100] max-h-60 overflow-hidden flex flex-col">
                                        <div className="p-2 border-b border-gray-200">
                                            <div className="relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={phoneCodeSearch}
                                                    onChange={(e) => setPhoneCodeSearch(e.target.value)}
                                                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#7CD947]"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                        <div className="overflow-y-auto max-h-48">
                                            {filteredPhoneCodes.length > 0 ? (
                                                filteredPhoneCodes.map((code) => (
                                                    <button
                                                        key={code.value}
                                                        type="button"
                                                        onClick={() => {
                                                            handleChange('phoneCountryCode', code.value);
                                                            setIsPhoneCodeOpen(false);
                                                            setPhoneCodeSearch('');
                                                            if (touched.phoneNumber && formData.phoneNumber) {
                                                                // Defer validation to next tick to avoid race condition with state update
                                                                setTimeout(() => {
                                                                    handleBlur('phoneNumber');
                                                                }, 0);
                                                            }
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left ${formData.phoneCountryCode === code.value ? 'bg-[#7ED957]/10' : ''}`}
                                                    >
                                                        <span className="text-lg">{code.flag}</span>
                                                        <span className="flex-1 text-xs font-medium text-gray-700 truncate">{code.name}</span>
                                                        <span className="text-xs text-gray-500">{code.phonecode}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="p-3 text-center text-xs text-gray-500">No results</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <input
                                type="tel"
                                placeholder="Phone"
                                className={`flex-1 min-w-0 px-3 py-2 rounded-r-md focus:outline-none text-sm border-0 bg-transparent ${!formData.phoneCountryCode ? 'opacity-60 cursor-not-allowed' : ''}`}
                                value={formData.phoneNumber}
                                onChange={(e) => {
                                    if (!formData.phoneCountryCode) return;
                                    const value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
                                    handleChange('phoneNumber', value);
                                }}
                                onBlur={() => handleBlur('phoneNumber')}
                                disabled={!formData.phoneCountryCode}
                            />
                        </div>
                        {(touched.phoneNumber && errors.phoneNumber) || (!formData.phoneCountryCode && touched.phoneNumber) ? (
                            <p className={errorClasses}>
                                {errors.phoneNumber || 'Please select a country code first'}
                            </p>
                        ) : null}
                    </div>
                </div>

                {/* Relationship */}
                <div>
                    <label className={labelClasses}>Relationship to applicant *</label>
                    <div className="relative" ref={relationshipRef}>
                        <button
                            type="button"
                            onClick={() => setIsRelationshipOpen(!isRelationshipOpen)}
                            className={`${inputClasses} flex items-center justify-between text-left ${touched.relationship && errors.relationship ? 'border-red-500' : ''} ${formData.relationship ? 'text-gray-900' : 'text-gray-400'}`}
                        >
                            <span>{formData.relationship || 'Select relationship'}</span>
                            <ChevronDown size={14} className={`text-gray-500 transition-transform ${isRelationshipOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isRelationshipOpen && (
                            <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                                {relationshipOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            handleChange('relationship', option);
                                            setIsRelationshipOpen(false);
                                        }}
                                        className={`w-full flex items-center px-4 py-2 hover:bg-gray-50 transition-colors text-left text-sm ${formData.relationship === option ? 'bg-[#7ED957]/10 text-[#7ED957] font-medium' : 'text-gray-700'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {touched.relationship && errors.relationship && <p className={errorClasses}>{errors.relationship}</p>}
                </div>

                {/* Details */}
                <div>
                    <label className={labelClasses}>Details *</label>
                    <textarea
                        placeholder="Type Here"
                        className={`${inputClasses} min-h-[100px] resize-none ${touched.details && errors.details ? 'border-red-500' : ''}`}
                        value={formData.details}
                        onChange={(e) => handleChange('details', e.target.value)}
                        onBlur={() => handleBlur('details')}
                    />
                    {touched.details && errors.details && <p className={errorClasses}>{errors.details}</p>}
                </div>

            </div>
        </BaseModal>
    );
};

export default UserAddEmergencyContactModal;
