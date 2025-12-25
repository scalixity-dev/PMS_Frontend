import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, ChevronLeft, Search, ChevronDown } from 'lucide-react';
import { Country } from 'country-state-city';
import DatePicker from '@/components/ui/DatePicker';
import CustomDropdown from '../../../components/CustomDropdown';

export interface OccupantFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode?: string;
    dob: Date | undefined;
    relationship: string;
}

interface AddOccupantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: OccupantFormData) => void;
    initialData?: OccupantFormData;
}

const relationshipOptions = [
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Child', label: 'Child' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Sibling', label: 'Sibling' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Other', label: 'Other' }
];

const AddOccupantModal: React.FC<AddOccupantModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<OccupantFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        phoneCountryCode: undefined,
        dob: undefined,
        relationship: ''
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
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Reset form and errors when modal closes
    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (!isOpen) {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                phoneCountryCode: undefined,
                dob: undefined,
                relationship: ''
            });
            setErrors({});
            setTouched({});
            setIsPhoneCodeOpen(false);
            setPhoneCodeSearch('');
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const validateField = (key: keyof OccupantFormData, value: any): string => {
        switch (key) {
            case 'firstName':
                if (!value || value.trim() === '') {
                    return 'First name is required';
                }
                break;
            case 'lastName':
                if (!value || value.trim() === '') {
                    return 'Last name is required';
                }
                break;
            case 'email':
                if (!value || value.trim() === '') {
                    return 'Email is required';
                }
                // Email format validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address';
                }
                break;
            case 'phoneNumber':
                if (!value || value.trim() === '') {
                    return 'Phone number is required';
                }
                // Phone format validation (allows various international formats)
                const digitsOnly = value.replace(/[\s\-\+\(\)]/g, '');
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;

                // Check if it contains only valid characters
                if (!phoneRegex.test(value)) {
                    return 'Please enter a valid phone number';
                }

                // Check if it has at least 4 digits (minimum for most countries)
                // and at most 15 digits (ITU-T E.164 standard maximum)
                if (digitsOnly.length < 4) {
                    return 'Phone number must contain at least 4 digits';
                }

                if (digitsOnly.length > 15) {
                    return 'Phone number cannot exceed 15 digits';
                }
                break;
            case 'dob':
                if (!value) {
                    return 'Date of birth is required';
                }
                break;
            case 'relationship':
                if (!value || value.trim() === '') {
                    return 'Relationship is required';
                }
                break;
        }
        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof OccupantFormData>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (key: keyof OccupantFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        // Clear error for this field when user starts typing
        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof OccupantFormData, currentValue?: any) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const value = currentValue !== undefined ? currentValue : formData[key];
        const error = validateField(key, value);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        // Mark all fields as touched
        const allTouched = (Object.keys(formData) as Array<keyof OccupantFormData>).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        // Validate all fields
        if (validateAllFields()) {
            onSave(formData);
            onClose();
        }
    };

    // Check if form is valid for button state
    const isFormValid = () => {
        return (Object.keys(formData) as Array<keyof OccupantFormData>).every(key => {
            return !validateField(key, formData[key]);
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            {/* Removed overflow-hidden to allow datepicker/dropdown overflow */}
            <div className="bg-[#EAEAEA] rounded-3xl w-full max-w-[400px] shadow-2xl animate-slide-in-from-right relative">

                {/* Header - Added rounded-t-3xl to clip background since container overflow is visible */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-3xl">
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-lg font-medium">{initialData ? 'Edit co-occupant' : 'Add a new co-occupant'}</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-5 space-y-3">

                    {/* First Name */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">First Name *</label>
                        <input
                            type="text"
                            placeholder="Enter First Name"
                            className={`w-full bg-white p-2.5 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.firstName && errors.firstName ? 'border-2 border-red-500' : 'border-none'
                                }`}
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                            onBlur={() => handleBlur('firstName')}
                        />
                        {touched.firstName && errors.firstName && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>
                        )}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Last Name*</label>
                        <input
                            type="text"
                            placeholder="Enter Last Name"
                            className={`w-full bg-white p-2.5 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.lastName && errors.lastName ? 'border-2 border-red-500' : 'border-none'
                                }`}
                            value={formData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                            onBlur={() => handleBlur('lastName')}
                        />
                        {touched.lastName && errors.lastName && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Email*</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className={`w-full bg-white p-2.5 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.email && errors.email ? 'border-2 border-red-500' : 'border-none'
                                }`}
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Phone Number*</label>
                        <div className={`flex border rounded-xl transition-all ${touched.phoneNumber && errors.phoneNumber
                                ? 'border-red-500 border-2'
                                : 'border-gray-200 focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C]'
                            }`}>
                            {/* Phone Code Selector */}
                            <div className="relative" ref={phoneCodeRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                                    className={`flex items-center gap-1 px-3 py-2.5 border-r bg-white rounded-l-xl focus:outline-none text-sm min-w-[100px] hover:bg-gray-50 transition-colors ${touched.phoneNumber && errors.phoneNumber
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
                                placeholder="Enter Phone Number"
                                className={`flex-1 min-w-0 px-4 py-2.5 rounded-r-xl focus:outline-none text-sm placeholder-gray-400 bg-white border-0 ${touched.phoneNumber && errors.phoneNumber ? 'text-red-500' : 'text-gray-700'
                                    }`}
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                onBlur={() => handleBlur('phoneNumber')}
                            />
                        </div>
                        {touched.phoneNumber && errors.phoneNumber && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.phoneNumber}</p>
                        )}
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Date of birth*</label>
                        <div className="relative">
                            <DatePicker
                                value={formData.dob}
                                onChange={(date) => {
                                    handleChange('dob', date);
                                    if (!touched.dob) {
                                        handleBlur('dob', date);
                                    }
                                }}
                                placeholder="DD/MM/YYYY"
                                className={`w-full bg-white p-2.5 rounded-xl outline-none text-gray-700 shadow-sm text-sm ${touched.dob && errors.dob ? 'border-2 border-red-500' : 'border-none'
                                    }`}
                                popoverClassName="bottom-full mb-2"
                            />
                        </div>
                        {touched.dob && errors.dob && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.dob}</p>
                        )}
                    </div>

                    {/* Relationship */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Relationship*</label>
                        <div className="relative">
                            <CustomDropdown
                                value={formData.relationship}
                                onChange={(val) => {
                                    handleChange('relationship', val);
                                    if (!touched.relationship) {
                                        handleBlur('relationship', val);
                                    }
                                }}
                                options={relationshipOptions}
                                placeholder="Select Relationship"
                                buttonClassName={`w-full bg-white p-2.5 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${touched.relationship && errors.relationship ? 'border-2 border-red-500' : 'border-none'
                                    }`}
                                dropdownClassName="max-h-80 bottom-full mb-2"
                            />
                        </div>
                        {touched.relationship && errors.relationship && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.relationship}</p>
                        )}
                    </div>

                    {/* Add Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid()}
                            className={`px-8 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-md ${isFormValid()
                                ? 'bg-[#3A6D6C] text-white hover:bg-[#2c5251] cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {initialData ? 'Save' : 'Add'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddOccupantModal;
