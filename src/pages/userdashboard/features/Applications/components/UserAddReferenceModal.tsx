import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Check, Mail, Phone, User, Search, ChevronDown } from 'lucide-react';
import { Country } from 'country-state-city';
import BaseModal from '@/components/common/modals/BaseModal';
import { formatPhoneNumber, isValidPhoneNumber } from '../../../../../utils/phone.utils';


export interface ReferenceFormData {
    fullName: string;
    relationship: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode?: string;
}

interface UserAddReferenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ReferenceFormData) => void;
    initialData?: ReferenceFormData;
}

const UserAddReferenceModal: React.FC<UserAddReferenceModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<ReferenceFormData>({
        fullName: '',
        relationship: '',
        email: '',
        phoneNumber: '',
        phoneCountryCode: 'US|1'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
    const [phoneCodeSearch, setPhoneCodeSearch] = useState('');
    const phoneCodeRef = useRef<HTMLDivElement>(null);

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
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (!isOpen) {
            setFormData({
                fullName: '',
                relationship: '',
                email: '',
                phoneNumber: '',
                phoneCountryCode: 'US|1'
            });
            setErrors({});
            setTouched({});
            setIsPhoneCodeOpen(false);
            setPhoneCodeSearch('');
        }
    }, [isOpen, initialData]);

    const validateField = (key: keyof ReferenceFormData, value: string): string => {
        switch (key) {
            case 'fullName':
                if (!value.trim()) return 'Full Name is required';
                break;
            case 'relationship':
                if (!value.trim()) return 'Relationship is required';
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
                break;
            case 'phoneNumber':
                if (!formData.phoneCountryCode) return 'Please select a country code first';
                if (!value.trim()) return 'Phone Number is required';
                if (!isValidPhoneNumber(formData.phoneCountryCode, value)) {
                    return 'Please enter a valid phone number for the selected country';
                }
                break;
        }
        return '';
    };

    const isFormValid = () => {
        const requiredFields: Array<keyof ReferenceFormData> = ['fullName', 'relationship', 'phoneNumber'];
        let isValid = requiredFields.every(key => !validateField(key, formData[key] ?? ''));
        if (formData.email && validateField('email', formData.email)) isValid = false;
        return isValid;
    };

    const handleChange = (key: keyof ReferenceFormData | 'phoneCountryCode', value: string) => {
        let finalValue = value;
        if (key === 'phoneNumber') {
            finalValue = formatPhoneNumber(value);
        }
        setFormData(prev => ({ ...prev, [key]: finalValue }));
        if (key !== 'phoneCountryCode' && touched[key as keyof ReferenceFormData]) {
            const error = validateField(key as keyof ReferenceFormData, finalValue);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };


    const handleBlur = (key: keyof ReferenceFormData) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const error = validateField(key, formData[key] ?? '');
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        const allTouched: Record<string, boolean> = {};
        const allErrors: Record<string, string> = {};

        (Object.keys(formData) as Array<keyof ReferenceFormData>).forEach(key => {
            allTouched[key] = true;
            const error = validateField(key, formData[key] ?? '');
            if (error) allErrors[key] = error;
        });

        setTouched(allTouched);
        setErrors(allErrors);

        if (isFormValid()) {
            onSave(formData);
            onClose();
        }
    };

    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7ED957] focus:ring-1 focus:ring-[#7ED957]";
    const labelClasses = "block text-xs font-semibold text-gray-700 mb-1";
    const errorClasses = "text-red-500 text-xs mt-1";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={initialData ? 'Edit reference' : 'Add reference'}
            maxWidth="max-w-xl"
            footerButtons={[
                {
                    label: 'Cancel',
                    onClick: onClose,
                    variant: 'ghost',
                },
                {
                    label: initialData ? 'Save Changes' : 'Add',
                    onClick: handleSubmit,
                    disabled: false,
                    variant: 'primary',
                    className: "bg-[#7ED957] hover:bg-[#6BC847] border-none text-white",
                    icon: <Check size={16} strokeWidth={3} />
                }
            ]}
        >
            <div className="py-2 space-y-4">
                {/* Full Name */}
                <div>
                    <label className={labelClasses}>Full Name *</label>
                    <div className="relative">
                        <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Enter full name"
                            className={`${inputClasses} pl-9 ${touched.fullName && errors.fullName ? 'border-red-500' : ''}`}
                            value={formData.fullName}
                            onChange={(e) => handleChange('fullName', e.target.value)}
                            onBlur={() => handleBlur('fullName')}
                        />
                    </div>
                    {touched.fullName && errors.fullName && <p className={errorClasses}>{errors.fullName}</p>}
                </div>

                {/* Relationship */}
                <div>
                    <label className={labelClasses}>Relationship *</label>
                    <input
                        type="text"
                        placeholder="e.g. Landlord, Employer, Friend"
                        className={`${inputClasses} ${touched.relationship && errors.relationship ? 'border-red-500' : ''}`}
                        value={formData.relationship}
                        onChange={(e) => handleChange('relationship', e.target.value)}
                        onBlur={() => handleBlur('relationship')}
                    />
                    {touched.relationship && errors.relationship && <p className={errorClasses}>{errors.relationship}</p>}
                </div>

                {/* Contact Info Group */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div>
                        <label className={labelClasses}>Phone Number *</label>
                        <div className={`flex border rounded-md transition-all ${(touched.phoneNumber && errors.phoneNumber) || (!formData.phoneCountryCode && touched.phoneNumber)
                            ? 'border-red-500'
                            : 'border-gray-300 focus-within:border-[#7ED957] focus-within:ring-1 focus-within:ring-[#7ED957]'
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
                                        <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
                                            <div className="relative">
                                                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={phoneCodeSearch}
                                                    onChange={(e) => setPhoneCodeSearch(e.target.value)}
                                                    className="w-full pl-8 pr-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:border-[#7ED957]"
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

                    {/* Email */}
                    <div>
                        <label className={labelClasses}>Email</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Enter email address"
                                className={`${inputClasses} pl-9 ${touched.email && errors.email ? 'border-red-500' : ''}`}
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                onBlur={() => handleBlur('email')}
                            />
                        </div>
                        {touched.email && errors.email && <p className={errorClasses}>{errors.email}</p>}
                    </div>
                </div>
            </div>
        </BaseModal>
    );
};

export default UserAddReferenceModal;
