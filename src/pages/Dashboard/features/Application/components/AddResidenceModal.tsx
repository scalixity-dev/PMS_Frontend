import React, { useState, useEffect, useMemo, useRef } from 'react';
import { X, ChevronLeft, Calendar as CalendarIcon, Search, ChevronDown } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';
import DatePicker from '@/components/ui/DatePicker';
import CustomDropdown from '../../../components/CustomDropdown';
import { cn } from '@/lib/utils';

export interface ResidenceFormData {
    isCurrent: boolean;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    residencyType: 'Rent' | 'Own';
    moveInDate: Date | undefined;
    moveOutDate: Date | undefined;
    reason: string;
    // Rent specific
    landlordName?: string;
    landlordPhone?: string;
    landlordPhoneCountryCode?: string;
    rentAmount?: string;
}

interface AddResidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ResidenceFormData) => void;
    initialData?: ResidenceFormData;
}

const AddResidenceModal: React.FC<AddResidenceModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    // Location data
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);

    const [formData, setFormData] = useState<ResidenceFormData>({
        isCurrent: true, // Default to true as per screenshot (green switch)
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
        landlordPhoneCountryCode: undefined,
        rentAmount: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isLandlordPhoneCodeOpen, setIsLandlordPhoneCodeOpen] = useState(false);
    const [landlordPhoneCodeSearch, setLandlordPhoneCodeSearch] = useState('');
    const landlordPhoneCodeRef = useRef<HTMLDivElement>(null);

    // Load all countries on mount
    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (formData.country) {
            const countryStates = State.getStatesOfCountry(formData.country);
            setStates(countryStates);
            // Reset state and city when country changes
            setFormData(prev => ({
                ...prev,
                state: '',
                city: ''
            }));
        } else {
            setStates([]);
        }
    }, [formData.country]);

    // Load cities when state changes
    useEffect(() => {
        if (formData.country && formData.state) {
            const stateCities = City.getCitiesOfState(formData.country, formData.state);
            setCities(stateCities);
            // Reset city when state changes
            setFormData(prev => ({
                ...prev,
                city: ''
            }));
        } else {
            setCities([]);
        }
    }, [formData.country, formData.state]);

    // Auto-fill city with state when cities are not available and state is selected
    useEffect(() => {
        if (formData.country && formData.state && cities.length === 0) {
            // If no cities are available for this state, use state name as city
            const stateObj = states.find(s => s.isoCode === formData.state);
            if (stateObj && (!formData.city || formData.city.trim() === '')) {
                setFormData(prev => ({
                    ...prev,
                    city: stateObj.name
                }));
            }
        }
    }, [formData.country, formData.state, cities.length, states]);

    // Convert countries to dropdown options
    const countryOptions = useMemo(() => {
        return countries.map(country => ({
            value: country.isoCode,
            label: country.name
        })).sort((a, b) => a.label.localeCompare(b.label));
    }, [countries]);

    // Convert states to dropdown options
    const stateOptions = useMemo(() => {
        return states.map(state => ({
            value: state.isoCode,
            label: state.name
        })).sort((a, b) => a.label.localeCompare(b.label));
    }, [states]);

    // Convert cities to dropdown options
    const cityOptions = useMemo(() => {
        return cities.map(city => ({
            value: city.name,
            label: city.name
        })).sort((a, b) => a.label.localeCompare(b.label));
    }, [cities]);

    // Phone country codes for landlord phone
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
    const filteredLandlordPhoneCodes = useMemo(() => {
        if (!landlordPhoneCodeSearch) return phoneCountryCodes;
        const searchLower = landlordPhoneCodeSearch.toLowerCase();
        return phoneCountryCodes.filter(code =>
            code.name.toLowerCase().includes(searchLower) ||
            code.phonecode.includes(searchLower) ||
            code.isoCode.toLowerCase().includes(searchLower)
        );
    }, [landlordPhoneCodeSearch, phoneCountryCodes]);

    // Get selected phone code display
    const selectedLandlordPhoneCode = useMemo(() => {
        if (!formData.landlordPhoneCountryCode) return null;
        return phoneCountryCodes.find(code => code.value === formData.landlordPhoneCountryCode);
    }, [formData.landlordPhoneCountryCode, phoneCountryCodes]);

    // Close phone code dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (landlordPhoneCodeRef.current && !landlordPhoneCodeRef.current.contains(event.target as Node)) {
                setIsLandlordPhoneCodeOpen(false);
                setLandlordPhoneCodeSearch('');
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Prevent background scrolling
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
                landlordPhoneCountryCode: undefined,
                rentAmount: ''
            });
            setErrors({});
            setTouched({});
            setIsLandlordPhoneCodeOpen(false);
            setLandlordPhoneCodeSearch('');
        } else if (initialData) {
            setFormData(initialData);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const validateField = (key: string, value: any): string => {
        // Always required fields (city and reason are optional)
        if (['address', 'state', 'zip', 'country'].includes(key)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                return `${fieldName} is required`;
            }
        }

        // moveInDate is always required
        if (key === 'moveInDate' && !value) {
            return 'Move in date is required';
        }

        // moveOutDate is required when residency type is Rent
        if (key === 'moveOutDate' && formData.residencyType === 'Rent' && !value) {
            return 'Move out date is required for rented properties';
        }

        // Conditional fields for Rent
        if (formData.residencyType === 'Rent') {
            if (key === 'landlordName' && (!value || value.trim() === '')) {
                return 'Landlord name is required';
            }
            if (key === 'landlordPhone' && (!value || value.trim() === '')) {
                return 'Landlord phone is required';
            }
        }

        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // Always required fields (city and reason are optional)
        const requiredFields = ['address', 'state', 'zip', 'country', 'moveInDate'];

        requiredFields.forEach(field => {
            const error = validateField(field, (formData as any)[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        // Conditional: moveOutDate when Rent
        if (formData.residencyType === 'Rent') {
            const error = validateField('moveOutDate', formData.moveOutDate);
            if (error) {
                newErrors.moveOutDate = error;
                isValid = false;
            }
        }

        // Conditional: landlord fields when Rent
        if (formData.residencyType === 'Rent') {
            ['landlordName', 'landlordPhone'].forEach(field => {
                const error = validateField(field, (formData as any)[field]);
                if (error) {
                    newErrors[field] = error;
                    isValid = false;
                }
            });
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (key: keyof ResidenceFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        // Clear error for this field when user starts typing/selecting
        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }

        // Special case: when residencyType changes, revalidate conditional fields
        if (key === 'residencyType') {
            setErrors(prev => {
                const newErrors = { ...prev };
                if (value === 'Rent') {
                    // Validate moveOutDate and landlord fields for Rent
                    const moveOutDateError = validateField('moveOutDate', formData.moveOutDate);
                    const landlordNameError = validateField('landlordName', formData.landlordName);
                    const landlordPhoneError = validateField('landlordPhone', formData.landlordPhone);
                    if (moveOutDateError) newErrors.moveOutDate = moveOutDateError;
                    if (landlordNameError) newErrors.landlordName = landlordNameError;
                    if (landlordPhoneError) newErrors.landlordPhone = landlordPhoneError;
                } else {
                    // Clear moveOutDate and landlord field errors when switching to Own
                    delete newErrors.moveOutDate;
                    delete newErrors.landlordName;
                    delete newErrors.landlordPhone;
                    // Clear moveOutDate value when switching to Own
                    setFormData(prev => ({ ...prev, moveOutDate: undefined }));
                }
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
        // Mark all relevant fields as touched
        const allTouched: Record<string, boolean> = {
            address: true,
            state: true,
            zip: true,
            country: true,
            moveInDate: true
        };

        if (formData.residencyType === 'Rent') {
            allTouched.moveOutDate = true;
            allTouched.landlordName = true;
            allTouched.landlordPhone = true;
        }

        setTouched(allTouched);

        // Validate all fields
        if (validateAllFields()) {
            onSave(formData);
            onClose();
            // Reset form after successful save
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
                rentAmount: ''
            });
            setErrors({});
            setTouched({});
        }
    };

    // Check if form is valid for button state
    const isFormValid = () => {
        const requiredFields = ['address', 'state', 'zip', 'country', 'moveInDate'];

        // Check always required fields
        const baseValid = requiredFields.every(field => {
            return !validateField(field, (formData as any)[field]);
        });

        // Check conditional moveOutDate when Rent
        if (formData.residencyType === 'Rent') {
            const moveOutValid = !validateField('moveOutDate', formData.moveOutDate);
            if (!moveOutValid) return false;
        }

        // Check conditional landlord fields when Rent
        if (formData.residencyType === 'Rent') {
            const landlordValid = ['landlordName', 'landlordPhone'].every(field => {
                return !validateField(field, (formData as any)[field]);
            });
            if (!landlordValid) return false;
        }

        return baseValid;
    };

    const inputClasses = "w-full bg-white p-4 rounded-lg outline-none text-gray-700 placeholder-gray-400 font-medium";
    const getInputClassWithError = (fieldName: string) => {
        return `${inputClasses} ${touched[fieldName] && errors[fieldName] ? 'border-2 border-red-500' : 'border-none'}`;
    };
    const labelClasses = "block text-sm font-bold text-[#2c3e50] mb-2";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
            <div className="bg-[#EAEAEA] rounded-[2rem] w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative flex flex-col max-h-[90vh] overflow-hidden">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-6 flex items-center justify-between text-white rounded-t-[2rem]">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ChevronLeft size={28} />
                    </button>
                    <h2 className="text-2xl font-medium">{initialData ? 'Edit residence' : 'Add a new residence'}</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar relative">

                    {/* Current Residence Switch */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-xl font-medium text-[#2c3e50]">Current residence ?</span>
                        <div
                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${formData.isCurrent ? 'bg-[#84D34C]' : 'bg-gray-300'}`}
                            onClick={() => handleChange('isCurrent', !formData.isCurrent)}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${formData.isCurrent ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Row 1: Address */}
                        <div>
                            <label className={labelClasses}>Address*</label>
                            <input
                                type="text"
                                placeholder="Enter address"
                                className={getInputClassWithError('address')}
                                value={formData.address}
                                onChange={(e) => handleChange('address', e.target.value)}
                                onBlur={() => handleBlur('address')}
                            />
                            {touched.address && errors.address && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>
                            )}
                        </div>

                        {/* Row 2: Country, State */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <CustomDropdown
                                    label="Country"
                                    value={formData.country}
                                    onChange={(value) => {
                                        handleChange('country', value);
                                        if (!touched.country) {
                                            handleBlur('country', value);
                                        }
                                    }}
                                    options={countryOptions}
                                    placeholder="Select country"
                                    required
                                    disabled={countryOptions.length === 0}
                                    searchable={true}
                                    buttonClassName={getInputClassWithError('country')}
                                />
                                {touched.country && errors.country && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.country}</p>
                                )}
                            </div>
                            <div>
                                <CustomDropdown
                                    label="State"
                                    value={formData.state}
                                    onChange={(value) => {
                                        handleChange('state', value);
                                        if (!touched.state) {
                                            handleBlur('state', value);
                                        }
                                    }}
                                    options={stateOptions}
                                    placeholder={formData.country ? "Select state" : "Select country first"}
                                    required
                                    disabled={!formData.country || stateOptions.length === 0}
                                    searchable={true}
                                    buttonClassName={getInputClassWithError('state')}
                                />
                                {touched.state && errors.state && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.state}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 3: City, Zip */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <CustomDropdown
                                    label="City"
                                    value={formData.city}
                                    onChange={(value) => {
                                        handleChange('city', value);
                                        if (!touched.city) {
                                            handleBlur('city', value);
                                        }
                                    }}
                                    options={cityOptions}
                                    placeholder={formData.state ? (cityOptions.length > 0 ? "Select city" : "No cities available") : formData.country ? "Select state first" : "Select country first"}
                                    required={false}
                                    disabled={!formData.state || cityOptions.length === 0}
                                    searchable={true}
                                    buttonClassName={getInputClassWithError('city')}
                                />
                                {touched.city && errors.city && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>Zip *</label>
                                <input
                                    type="text"
                                    placeholder="Enter zip code"
                                    className={getInputClassWithError('zip')}
                                    value={formData.zip}
                                    onChange={(e) => handleChange('zip', e.target.value)}
                                    onBlur={() => handleBlur('zip')}
                                />
                                {touched.zip && errors.zip && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.zip}</p>
                                )}
                            </div>
                        </div>

                        {/* Rent / Own Toggle */}
                        <div className="flex items-center gap-4 py-2">
                            <div className="flex bg-transparent gap-4">
                                <button
                                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${formData.residencyType === 'Rent'
                                        ? 'bg-[#84D34C] text-white shadow-md'
                                        : 'bg-white text-gray-500'
                                        }`}
                                    onClick={() => handleChange('residencyType', 'Rent')}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 ${formData.residencyType === 'Rent' ? 'border-white bg-transparent' : 'border-gray-400'}`} >
                                        {formData.residencyType === 'Rent' && <div className="w-full h-full bg-white rounded-full scale-50" />}
                                    </div>
                                    Rent
                                </button>
                                <button
                                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${formData.residencyType === 'Own'
                                        ? 'bg-[#84D34C] text-white shadow-md'
                                        : 'bg-white text-gray-500'
                                        }`}
                                    onClick={() => handleChange('residencyType', 'Own')}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 ${formData.residencyType === 'Own' ? 'border-white bg-transparent' : 'border-gray-400'}`} >
                                        {formData.residencyType === 'Own' && <div className="w-full h-full bg-white rounded-full scale-50" />}
                                    </div>
                                    Own
                                </button>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Move in Date *</label>
                                <div className="relative">
                                    <DatePicker
                                        value={formData.moveInDate}
                                        onChange={(date: Date | undefined) => {
                                            handleChange('moveInDate', date);
                                            if (!touched.moveInDate) {
                                                handleBlur('moveInDate', date);
                                            }
                                        }}
                                        placeholder="DD/MM/YYYY"
                                        className={getInputClassWithError('moveInDate')}
                                        popoverClassName="z-[60]"
                                    />
                                </div>
                                {touched.moveInDate && errors.moveInDate && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.moveInDate}</p>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>Move Out Date {formData.residencyType === 'Rent' && '*'}</label>
                                <div className="relative">
                                    {formData.residencyType === 'Rent' ? (
                                        <DatePicker
                                            value={formData.moveOutDate}
                                            onChange={(date: Date | undefined) => {
                                                handleChange('moveOutDate', date);
                                                if (!touched.moveOutDate) {
                                                    handleBlur('moveOutDate', date);
                                                }
                                            }}
                                            placeholder="DD/MM/YYYY"
                                            className={getInputClassWithError('moveOutDate')}
                                            popoverClassName="z-[60]"
                                            disabled={false}
                                        />
                                    ) : (
                                        <div className={cn("w-full text-left rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-400 outline-none shadow-sm flex items-center justify-between cursor-not-allowed", getInputClassWithError('moveOutDate'))}>
                                            <span>DD/MM/YYYY</span>
                                            <CalendarIcon className="w-4 h-4 text-gray-400 ml-2" />
                                        </div>
                                    )}
                                </div>
                                {touched.moveOutDate && errors.moveOutDate && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.moveOutDate}</p>
                                )}
                            </div>
                        </div>

                        {/* Different Fields Section */}
                        {formData.residencyType === 'Rent' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div>
                                    <label className={labelClasses}>Landlord Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        className={getInputClassWithError('landlordName')}
                                        value={formData.landlordName}
                                        onChange={(e) => handleChange('landlordName', e.target.value)}
                                        onBlur={() => handleBlur('landlordName')}
                                    />
                                    {touched.landlordName && errors.landlordName && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.landlordName}</p>
                                    )}
                                </div>
                                <div>
                                    <label className={labelClasses}>Landlord Phone *</label>
                                    <div className={`flex bg-white rounded-lg transition-all ${touched.landlordPhone && errors.landlordPhone
                                        ? 'border-red-500 border-2'
                                        : 'focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C]'
                                        }`}>
                                        {/* Phone Code Selector */}
                                        <div className="relative" ref={landlordPhoneCodeRef}>
                                            <button
                                                type="button"
                                                onClick={() => setIsLandlordPhoneCodeOpen(!isLandlordPhoneCodeOpen)}
                                                className={`flex items-center gap-1 p-4 border-r rounded-l-lg focus:outline-none text-sm min-w-[100px] hover:bg-gray-50 transition-colors ${touched.landlordPhone && errors.landlordPhone
                                                    ? 'border-red-500'
                                                    : 'border-gray-200'
                                                    }`}
                                            >
                                                <span className="text-sm font-medium">
                                                    {selectedLandlordPhoneCode ? (
                                                        <span className="flex items-center gap-1">
                                                            <span>{selectedLandlordPhoneCode.flag}</span>
                                                            <span className="hidden sm:inline">{selectedLandlordPhoneCode.phonecode}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-500">Code</span>
                                                    )}
                                                </span>
                                                <ChevronDown size={16} className={`text-gray-500 transition-transform ${isLandlordPhoneCodeOpen ? 'rotate-180' : ''}`} />
                                            </button>

                                            {/* Dropdown */}
                                            {isLandlordPhoneCodeOpen && (
                                                <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-[100] max-h-80 overflow-hidden flex flex-col">
                                                    {/* Search Input */}
                                                    <div className="p-2 border-b border-gray-200">
                                                        <div className="relative">
                                                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                            <input
                                                                type="text"
                                                                placeholder="Search country or code..."
                                                                value={landlordPhoneCodeSearch}
                                                                onChange={(e) => setLandlordPhoneCodeSearch(e.target.value)}
                                                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-sm"
                                                                autoFocus
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Options List */}
                                                    <div className="overflow-y-auto max-h-64">
                                                        {filteredLandlordPhoneCodes.length > 0 ? (
                                                            filteredLandlordPhoneCodes.map((code) => (
                                                                <button
                                                                    key={code.value}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        handleChange('landlordPhoneCountryCode', code.value);
                                                                        setIsLandlordPhoneCodeOpen(false);
                                                                        setLandlordPhoneCodeSearch('');
                                                                    }}
                                                                    className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${formData.landlordPhoneCountryCode === code.value ? 'bg-[#3A6D6C]/10' : ''
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
                                            className={`flex-1 min-w-0 p-4 rounded-r-lg focus:outline-none text-sm placeholder-gray-400 bg-white border-0 ${touched.landlordPhone && errors.landlordPhone ? 'text-red-500' : 'text-gray-700'
                                                }`}
                                            value={formData.landlordPhone}
                                            onChange={(e) => handleChange('landlordPhone', e.target.value)}
                                            onBlur={() => handleBlur('landlordPhone')}
                                        />
                                    </div>
                                    {touched.landlordPhone && errors.landlordPhone && (
                                        <p className="text-red-500 text-xs mt-1 ml-1">{errors.landlordPhone}</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                {/* Own specific - maybe Mortgage or just generic 'Reason for selling' logic if applicable */}
                                {/* For now, leaving empty or relying on generic 'Please Explain' */}
                            </div>
                        )}

                        {/* Please Explain */}
                        <div>
                            <label className={labelClasses}>Please Explain</label>
                            <textarea
                                placeholder="Enter additional details"
                                className={`${getInputClassWithError('reason')} h-32 resize-none pt-4`}
                                value={formData.reason}
                                onChange={(e) => handleChange('reason', e.target.value)}
                                onBlur={() => handleBlur('reason')}
                            />
                            {touched.reason && errors.reason && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.reason}</p>
                            )}
                        </div>

                        {/* Add Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                disabled={!isFormValid()}
                                className={`px-10 py-3 rounded-xl font-medium transition-colors shadow-lg ${isFormValid()
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
        </div>
    );
};

export default AddResidenceModal;
