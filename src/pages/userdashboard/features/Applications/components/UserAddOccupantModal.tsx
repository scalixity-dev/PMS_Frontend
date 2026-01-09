import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Country } from 'country-state-city';
import { Search, ChevronDown, Check } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
import CustomDropdown from '../../../../Dashboard/components/CustomDropdown';
import BaseModal from '@/components/common/modals/BaseModal';

export interface OccupantFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode?: string;
    dob: Date | undefined;
    relationship: string;
}

interface UserAddOccupantModalProps {
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

const UserAddOccupantModal: React.FC<UserAddOccupantModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
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

    const validateField = (key: keyof OccupantFormData, value: any): string => {
        switch (key) {
            case 'firstName':
                if (!value || value.trim() === '') return 'First name is required';
                break;
            case 'lastName':
                if (!value || value.trim() === '') return 'Last name is required';
                break;
            case 'email':
                if (!value || value.trim() === '') return 'Email is required';
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) return 'Please enter a valid email address';
                break;
            case 'phoneNumber':
                if (!value || value.trim() === '') return 'Phone number is required';
                const digitsOnly = value.replace(/[\s\-\+\(\)]/g, '');
                const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
                if (digitsOnly.length < 4) return 'Phone number must contain at least 4 digits';
                if (digitsOnly.length > 15) return 'Phone number cannot exceed 15 digits';
                break;
            case 'dob':
                if (!value) return 'Date of birth is required';
                break;
            case 'relationship':
                if (!value || value.trim() === '') return 'Relationship is required';
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

    const isFormValid = () => {
        return (Object.keys(formData) as Array<keyof OccupantFormData>).every(key => !validateField(key, formData[key]));
    };

    const handleSubmit = () => {
        const allTouched = (Object.keys(formData) as Array<keyof OccupantFormData>).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        if (validateAllFields()) {
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
            title={initialData ? 'Edit co-occupant' : 'Add a new co-occupant'}
            maxWidth="max-w-md"
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
            <div className="space-y-4 py-2">
                <div>
                    <label className={labelClasses}>First Name</label>
                    <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                        className={`${inputClasses} ${touched.firstName && errors.firstName ? 'border-red-500' : ''}`}
                        placeholder="Enter First Name"
                    />
                    {touched.firstName && errors.firstName && <p className={errorClasses}>{errors.firstName}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Last Name</label>
                    <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                        className={`${inputClasses} ${touched.lastName && errors.lastName ? 'border-red-500' : ''}`}
                        placeholder="Enter Last Name"
                    />
                    {touched.lastName && errors.lastName && <p className={errorClasses}>{errors.lastName}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        onBlur={() => handleBlur('email')}
                        className={`${inputClasses} ${touched.email && errors.email ? 'border-red-500' : ''}`}
                        placeholder="Enter Email"
                    />
                    {touched.email && errors.email && <p className={errorClasses}>{errors.email}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Phone Number</label>
                    <div className={`flex border rounded-md transition-all ${touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : 'border-gray-300 focus-within:ring-1 focus-within:ring-[#7CD947] focus-within:border-[#7CD947]'}`}>
                        <div className="relative" ref={phoneCodeRef}>
                            <button
                                type="button"
                                onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                                className="flex items-center gap-1 px-3 py-2 border-r border-gray-300 bg-gray-50 rounded-l-md focus:outline-none text-sm min-w-[80px] hover:bg-gray-100 transition-colors h-full"
                            >
                                <span className="text-sm font-medium truncate">
                                    {selectedPhoneCode ? (
                                        <span className="flex items-center gap-1">
                                            <span>{selectedPhoneCode.flag}</span>
                                            <span className="hidden sm:inline">{selectedPhoneCode.phonecode}</span>
                                        </span>
                                    ) : (
                                        <span className="text-gray-500">Code</span>
                                    )}
                                </span>
                                <ChevronDown size={14} className={`text-gray-500 ml-auto transition-transform ${isPhoneCodeOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isPhoneCodeOpen && (
                                <div className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-300 rounded-lg shadow-lg z-[100] max-h-60 overflow-hidden flex flex-col">
                                    <div className="p-2 border-b border-gray-200 sticky top-0 bg-white z-10">
                                        <div className="relative">
                                            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                value={phoneCodeSearch}
                                                onChange={(e) => setPhoneCodeSearch(e.target.value)}
                                                className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#7CD947]"
                                                autoFocus
                                            />
                                        </div>
                                    </div>
                                    <div className="overflow-y-auto">
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
                                                    className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors text-left ${formData.phoneCountryCode === code.value ? 'bg-gray-50' : ''}`}
                                                >
                                                    <span className="text-lg">{code.flag}</span>
                                                    <span className="flex-1 text-xs font-medium text-gray-900 truncate">{code.name}</span>
                                                    <span className="text-xs text-gray-500">{code.phonecode}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-4 text-center text-xs text-gray-500">No results</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <input
                            type="tel"
                            placeholder="Enter Phone Number"
                            className="flex-1 px-3 py-2 rounded-r-md focus:outline-none text-sm bg-white border-0"
                            value={formData.phoneNumber}
                            onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            onBlur={() => handleBlur('phoneNumber')}
                        />
                    </div>
                    {touched.phoneNumber && errors.phoneNumber && <p className={errorClasses}>{errors.phoneNumber}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Date of Birth</label>
                    <div className="relative">
                        <DatePicker
                            value={formData.dob}
                            onChange={(date) => {
                                handleChange('dob', date);
                                if (!touched.dob) handleBlur('dob', date);
                            }}
                            placeholder="DD/MM/YYYY"
                            className={`${inputClasses} ${touched.dob && errors.dob ? 'border-red-500' : ''}`}
                            popoverClassName="bottom-full mb-2"
                        />
                    </div>
                    {touched.dob && errors.dob && <p className={errorClasses}>{errors.dob}</p>}
                </div>

                <div>
                    <label className={labelClasses}>Relationship</label>
                    <CustomDropdown
                        value={formData.relationship}
                        onChange={(val) => {
                            handleChange('relationship', val);
                            if (!touched.relationship) handleBlur('relationship', val);
                        }}
                        options={relationshipOptions}
                        placeholder="Select Relationship"
                        buttonClassName={`${inputClasses} ${touched.relationship && errors.relationship ? 'border-red-500' : ''}`}
                        dropdownClassName="max-h-60 bottom-full mb-2"
                    />
                    {touched.relationship && errors.relationship && <p className={errorClasses}>{errors.relationship}</p>}
                </div>
            </div>
        </BaseModal>
    );
};

export default UserAddOccupantModal;
