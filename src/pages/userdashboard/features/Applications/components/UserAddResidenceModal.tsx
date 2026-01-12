import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Calendar as CalendarIcon, Search, ChevronDown, Check } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';
import DatePicker from '@/components/ui/DatePicker';
import CustomDropdown from '../../../../Dashboard/components/CustomDropdown';
import BaseModal from '@/components/common/modals/BaseModal';

export interface ResidenceFormData {
    isCurrent: boolean;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    residencyType: 'Rent' | 'Own' | 'Others';
    otherResidencyType?: string;
    moveInDate: Date | undefined;
    moveOutDate: Date | undefined;
    reason: string;
    // Rent specific
    landlordName?: string;
    landlordPhone?: string;
    landlordEmail?: string;
    landlordPhoneCountryCode?: string;
    rentAmount?: string;
}

interface UserAddResidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ResidenceFormData) => void;
    initialData?: ResidenceFormData;
}

const UserAddResidenceModal: React.FC<UserAddResidenceModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);

    const [formData, setFormData] = useState<ResidenceFormData>({
        isCurrent: true,
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        residencyType: 'Rent',
        otherResidencyType: '',
        moveInDate: undefined,
        moveOutDate: undefined,
        reason: '',
        landlordName: '',
        landlordPhone: '',
        landlordEmail: '',
        landlordPhoneCountryCode: undefined,
        rentAmount: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isLandlordPhoneCodeOpen, setIsLandlordPhoneCodeOpen] = useState(false);
    const [landlordPhoneCodeSearch, setLandlordPhoneCodeSearch] = useState('');
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    const landlordPhoneCodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (formData.country) {
            const countryStates = State.getStatesOfCountry(formData.country);
            setStates(countryStates);
        } else {
            setStates([]);
        }
    }, [formData.country]);

    useEffect(() => {
        if (formData.country && formData.state) {
            const stateCities = City.getCitiesOfState(formData.country, formData.state);
            setCities(stateCities);
        } else {
            setCities([]);
        }
    }, [formData.country, formData.state]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (landlordPhoneCodeRef.current && !landlordPhoneCodeRef.current.contains(event.target as Node)) {
                setIsLandlordPhoneCodeOpen(false);
                setLandlordPhoneCodeSearch('');
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            setFormData({
                isCurrent: true,
                address: '',
                city: '',
                state: '',
                zip: '',
                country: '',
                residencyType: 'Rent',
                moveInDate: undefined,
                moveOutDate: undefined,
                reason: '',
                landlordName: '',
                landlordPhone: '',
                landlordEmail: '',
                landlordPhoneCountryCode: undefined,
                rentAmount: '',
                otherResidencyType: ''
            });
            setErrors({});
            setTouched({});
            setIsLandlordPhoneCodeOpen(false);
            setIsCityDropdownOpen(false);
        } else if (initialData) {
            setFormData(initialData);
        }
    }, [isOpen, initialData]);

    const countryOptions = useMemo(() => countries.map(c => ({ value: c.isoCode, label: c.name })).sort((a, b) => a.label.localeCompare(b.label)), [countries]);
    const stateOptions = useMemo(() => states.map(s => ({ value: s.isoCode, label: s.name })).sort((a, b) => a.label.localeCompare(b.label)), [states]);
    const cityOptions = useMemo(() => cities.map(c => ({ value: c.name, label: c.name })).sort((a, b) => a.label.localeCompare(b.label)), [cities]);

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

    const filteredLandlordPhoneCodes = useMemo(() => {
        if (!landlordPhoneCodeSearch) return phoneCountryCodes;
        const searchLower = landlordPhoneCodeSearch.toLowerCase();
        return phoneCountryCodes.filter(code =>
            code.name.toLowerCase().includes(searchLower) ||
            code.phonecode.includes(searchLower) ||
            code.isoCode.toLowerCase().includes(searchLower)
        );
    }, [landlordPhoneCodeSearch, phoneCountryCodes]);

    const selectedLandlordPhoneCode = useMemo(() => {
        if (!formData.landlordPhoneCountryCode) return null;
        return phoneCountryCodes.find(code => code.value === formData.landlordPhoneCountryCode);
    }, [formData.landlordPhoneCountryCode, phoneCountryCodes]);

    const validateField = (key: string, value: any): string => {
        if (['address', 'state', 'zip', 'country'].includes(key)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                const map: Record<string, string> = { address: 'Address', state: 'State', zip: 'Zip', country: 'Country' };
                return `${map[key]} is required`;
            }
        }
        if (key === 'moveInDate' && !value) return 'Move in date is required';
        if (key === 'moveOutDate' && formData.residencyType === 'Rent' && !value) return 'Move out date is required for rented properties';
        if (formData.residencyType === 'Rent') {
            if (key === 'landlordName' && (!value || value.trim() === '')) return 'Landlord name is required';
            if (key === 'landlordPhone') {
                if (!formData.landlordPhoneCountryCode) {
                    return 'Please select a country code first';
                }
                if (!value || value.trim() === '') return 'Landlord phone is required';
            }
            if (key === 'landlordEmail') {
                if (!value || value.trim() === '') return 'Landlord email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter valid email';
            }
        }
        if (formData.residencyType === 'Others' && key === 'otherResidencyType' && (!value || value.trim() === '')) return 'Specify residence type';
        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
        const check = (field: string) => {
            const err = validateField(field, (formData as any)[field]);
            if (err) { newErrors[field] = err; isValid = false; }
        };

        ['address', 'state', 'zip', 'country', 'moveInDate'].forEach(check);
        if (formData.residencyType === 'Rent') {
            check('moveOutDate');
            ['landlordName', 'landlordPhone', 'landlordEmail'].forEach(check);
        }
        if (formData.residencyType === 'Others') check('otherResidencyType');

        setErrors(newErrors);
        return isValid;
    };

    const isFormValid = () => {
        const check = (field: string) => !!validateField(field, (formData as any)[field]);

        if (['address', 'state', 'zip', 'country', 'moveInDate'].some(check)) return false;

        if (formData.residencyType === 'Rent') {
            if (check('moveOutDate')) return false;
            if (['landlordName', 'landlordPhone', 'landlordEmail'].some(check)) return false;
        }

        if (formData.residencyType === 'Others' && check('otherResidencyType')) return false;

        return true;
    };

    const handleChange = (key: keyof ResidenceFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
        if (key === 'residencyType') {
            // Reset validation for conditional fields
            setErrors(prev => {
                const newErrors = { ...prev };
                if (value !== 'Rent') {
                    delete newErrors.moveOutDate;
                    delete newErrors.landlordName;
                    delete newErrors.landlordPhone;
                    delete newErrors.landlordEmail;
                }
                if (value !== 'Others') delete newErrors.otherResidencyType;
                return newErrors;
            });
        }
    };

    const handleBlur = (key: string, currentValue?: any) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const value = currentValue !== undefined ? currentValue : (formData as any)[key];
        const error = validateField(key, value);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        // Mark all fields as touched to show validation errors
        const allTouched = (Object.keys(formData) as Array<keyof ResidenceFormData>).reduce((acc, key) => {
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
            title={initialData ? 'Edit residence' : 'Add a new residence'}
            maxWidth="max-w-3xl"
            footerButtons={[
                { label: 'Cancel', onClick: onClose, variant: 'ghost' },
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
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-[#2c3e50]">Current residence?</span>
                    <div
                        className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${formData.isCurrent ? 'bg-[#7ED957]' : 'bg-gray-300'}`}
                        onClick={() => handleChange('isCurrent', !formData.isCurrent)}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${formData.isCurrent ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                </div>

                <div>
                    <label className={labelClasses}>Address *</label>
                    <input
                        type="text"
                        placeholder="Enter address"
                        className={`${inputClasses} ${touched.address && errors.address ? 'border-red-500' : ''}`}
                        value={formData.address}
                        onChange={(e) => handleChange('address', e.target.value)}
                        onBlur={() => handleBlur('address')}
                    />
                    {touched.address && errors.address && <p className={errorClasses}>{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Country *</label>
                        <CustomDropdown
                            value={formData.country}
                            onChange={(val: string) => { handleChange('country', val); if (!touched.country) handleBlur('country', val); }}
                            options={countryOptions}
                            placeholder="Select country"
                            searchable
                            buttonClassName={`${inputClasses} ${touched.country && errors.country ? 'border-red-500' : ''}`}
                        />
                        {touched.country && errors.country && <p className={errorClasses}>{errors.country}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>State *</label>
                        <CustomDropdown
                            value={formData.state}
                            onChange={(val: string) => { handleChange('state', val); if (!touched.state) handleBlur('state', val); }}
                            options={stateOptions}
                            placeholder="Select state"
                            searchable
                            disabled={!formData.country}
                            buttonClassName={`${inputClasses} ${touched.state && errors.state ? 'border-red-500' : ''}`}
                        />
                        {touched.state && errors.state && <p className={errorClasses}>{errors.state}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>City</label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={formData.state ? "Type or select city" : "Select state first"}
                                className={`${inputClasses} ${touched.city && errors.city ? 'border-red-500' : ''}`}
                                value={formData.city}
                                onChange={(e) => {
                                    handleChange('city', e.target.value);
                                    setIsCityDropdownOpen(true);
                                }}
                                onFocus={() => setIsCityDropdownOpen(true)}
                                onBlur={() => {
                                    // Delay to allow click on dropdown item
                                    setTimeout(() => {
                                        setIsCityDropdownOpen(false);
                                        handleBlur('city');
                                    }, 200);
                                }}
                                disabled={!formData.state}
                            />

                            {/* City Suggestions Dropdown */}
                            {isCityDropdownOpen && formData.state && (
                                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {cityOptions.filter(city =>
                                        city.label.toLowerCase().includes(formData.city.toLowerCase())
                                    ).length > 0 ? (
                                        cityOptions
                                            .filter(city => city.label.toLowerCase().includes(formData.city.toLowerCase()))
                                            .slice(0, 50) // Limit to 50 results
                                            .map((city) => (
                                                <button
                                                    key={city.value}
                                                    type="button"
                                                    onClick={() => {
                                                        handleChange('city', city.label);
                                                        setIsCityDropdownOpen(false);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 transition-colors"
                                                >
                                                    {city.label}
                                                </button>
                                            ))
                                    ) : formData.city.trim() ? (
                                        <div className="px-4 py-3 text-sm text-gray-500">
                                            <p className="mb-2">No cities found matching "{formData.city}"</p>
                                            <button
                                                type="button"
                                                onClick={() => setIsCityDropdownOpen(false)}
                                                className="text-[#7ED957] font-medium hover:underline"
                                            >
                                                ✓ Use "{formData.city}" as custom city
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                            Start typing to search cities...
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {touched.city && errors.city && <p className={errorClasses}>{errors.city}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Zip Code *</label>
                        <input
                            type="text"
                            placeholder="Enter zip code"
                            className={`${inputClasses} ${touched.zip && errors.zip ? 'border-red-500' : ''}`}
                            value={formData.zip}
                            onChange={(e) => handleChange('zip', e.target.value)}
                            onBlur={() => handleBlur('zip')}
                        />
                        {touched.zip && errors.zip && <p className={errorClasses}>{errors.zip}</p>}
                    </div>
                </div>

                <div className="flex items-center gap-2 py-2">
                    {['Rent', 'Own', 'Others'].map((type) => (
                        <button
                            key={type}
                            className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-full font-medium text-xs transition-all ${formData.residencyType === type
                                ? 'bg-[#7ED957] text-white shadow-sm'
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            onClick={() => handleChange('residencyType', type as any)}
                        >
                            <div className={`w-3 h-3 rounded-full border ${formData.residencyType === type ? 'border-white bg-white' : 'border-gray-400'}`} />
                            {type}
                        </button>
                    ))}
                </div>

                {formData.residencyType === 'Others' && (
                    <div className="animate-in fade-in slide-in-from-top-1">
                        <label className={labelClasses}>Please Specify *</label>
                        <input
                            type="text"
                            placeholder="Enter residence type"
                            className={`${inputClasses} ${touched.otherResidencyType && errors.otherResidencyType ? 'border-red-500' : ''}`}
                            value={formData.otherResidencyType || ''}
                            onChange={(e) => handleChange('otherResidencyType', e.target.value)}
                        />
                        {touched.otherResidencyType && errors.otherResidencyType && <p className={errorClasses}>{errors.otherResidencyType}</p>}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelClasses}>Move in Date *</label>
                        <DatePicker
                            value={formData.moveInDate}
                            onChange={(date) => { handleChange('moveInDate', date); if (!touched.moveInDate) handleBlur('moveInDate', date); }}
                            placeholder="DD/MM/YYYY"
                            className={`${inputClasses} ${touched.moveInDate && errors.moveInDate ? 'border-red-500' : ''}`}
                            popoverClassName="bottom-full mb-2"
                        />
                        {touched.moveInDate && errors.moveInDate && <p className={errorClasses}>{errors.moveInDate}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Move Out Date {formData.residencyType === 'Rent' && '*'}</label>
                        {formData.residencyType === 'Rent' ? (
                            <DatePicker
                                value={formData.moveOutDate}
                                onChange={(date) => { handleChange('moveOutDate', date); if (!touched.moveOutDate) handleBlur('moveOutDate', date); }}
                                placeholder="DD/MM/YYYY"
                                className={`${inputClasses} ${touched.moveOutDate && errors.moveOutDate ? 'border-red-500' : ''}`}
                                popoverClassName="bottom-full mb-2"
                            />
                        ) : (
                            <div className="w-full text-left rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-400 flex items-center justify-between cursor-not-allowed border border-gray-200">
                                <span>DD/MM/YYYY</span>
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                            </div>
                        )}
                        {touched.moveOutDate && errors.moveOutDate && <p className={errorClasses}>{errors.moveOutDate}</p>}
                    </div>
                </div>

                {formData.residencyType === 'Rent' && (
                    <div className="space-y-4 pt-2 border-t border-gray-100 mt-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Landlord Name *</label>
                                <input type="text" placeholder="Enter name" className={`${inputClasses} ${touched.landlordName && errors.landlordName ? 'border-red-500' : ''}`} value={formData.landlordName || ''} onChange={(e) => handleChange('landlordName', e.target.value)} onBlur={() => handleBlur('landlordName')} />
                                {touched.landlordName && errors.landlordName && <p className={errorClasses}>{errors.landlordName}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Landlord Phone *</label>
                                <div className={`flex border rounded-md transition-all ${(touched.landlordPhone && errors.landlordPhone) || (!formData.landlordPhoneCountryCode && touched.landlordPhone) ? 'border-red-500' : 'border-gray-300'}`}>
                                    <div className="relative" ref={landlordPhoneCodeRef}>
                                        <button type="button" onClick={() => setIsLandlordPhoneCodeOpen(!isLandlordPhoneCodeOpen)} className={`flex items-center gap-1 px-3 py-2 border-r border-gray-300 bg-gray-50 rounded-l-md focus:outline-none text-sm min-w-[80px] hover:bg-gray-100 h-full ${touched.landlordPhone && !formData.landlordPhoneCountryCode ? 'border-red-500' : ''
                                            }`}>
                                            <span className="text-sm font-medium truncate">{selectedLandlordPhoneCode ? `${selectedLandlordPhoneCode.flag} ${selectedLandlordPhoneCode.phonecode}` : <span className="text-gray-500">Code</span>}</span>
                                            <ChevronDown size={14} className="text-gray-500 ml-auto" />
                                        </button>
                                        {isLandlordPhoneCodeOpen && (
                                            <div className="absolute left-0 top-full mt-1 w-60 bg-white border border-gray-300 rounded-lg shadow-lg z-[100] max-h-60 overflow-hidden flex flex-col">
                                                <div className="p-2 border-b border-gray-200">
                                                    <div className="relative"><Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search..." value={landlordPhoneCodeSearch} onChange={(e) => setLandlordPhoneCodeSearch(e.target.value)} className="w-full pl-8 pr-2 py-1.5 border border-gray-200 rounded text-xs focus:outline-none focus:border-[#7CD947]" autoFocus /></div>
                                                </div>
                                                <div className="overflow-y-auto">
                                                    {filteredLandlordPhoneCodes.map((code) => (
                                                        <button key={code.value} type="button" onClick={() => {
                                                            handleChange('landlordPhoneCountryCode', code.value);
                                                            setIsLandlordPhoneCodeOpen(false);
                                                            setLandlordPhoneCodeSearch('');
                                                            if (touched.landlordPhone && formData.landlordPhone) {
                                                                // Defer validation to next tick to avoid race condition with state update
                                                                setTimeout(() => {
                                                                    handleBlur('landlordPhone');
                                                                }, 0);
                                                            }
                                                        }} className={`w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 text-left ${formData.landlordPhoneCountryCode === code.value ? 'bg-gray-50' : ''}`}>
                                                            <span className="text-lg">{code.flag}</span><span className="text-xs font-medium text-gray-900 truncate flex-1">{code.name}</span><span className="text-xs text-gray-500">{code.phonecode}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <input type="tel" placeholder="Enter phone" className={`flex-1 px-3 py-2 rounded-r-md focus:outline-none text-sm bg-white border-0 ${!formData.landlordPhoneCountryCode ? 'opacity-60 cursor-not-allowed' : ''}`} value={formData.landlordPhone || ''} onChange={(e) => {
                                        if (!formData.landlordPhoneCountryCode) return;
                                        const value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
                                        handleChange('landlordPhone', value);
                                    }} onBlur={() => handleBlur('landlordPhone')} disabled={!formData.landlordPhoneCountryCode} />
                                </div>
                                {(touched.landlordPhone && errors.landlordPhone) || (!formData.landlordPhoneCountryCode && touched.landlordPhone) ? (
                                    <p className={errorClasses}>
                                        {errors.landlordPhone || 'Please select a country code first'}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Landlord Email *</label>
                                <input type="email" placeholder="Enter email" className={`${inputClasses} ${touched.landlordEmail && errors.landlordEmail ? 'border-red-500' : ''}`} value={formData.landlordEmail || ''} onChange={(e) => handleChange('landlordEmail', e.target.value)} onBlur={() => handleBlur('landlordEmail')} />
                                {touched.landlordEmail && errors.landlordEmail && <p className={errorClasses}>{errors.landlordEmail}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Rent Amount</label>
                                <input type="text" placeholder="Enter amount" className={inputClasses} value={formData.rentAmount || ''} onChange={(e) => handleChange('rentAmount', e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default UserAddResidenceModal;
