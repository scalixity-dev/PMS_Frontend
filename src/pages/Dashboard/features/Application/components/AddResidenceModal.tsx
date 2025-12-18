import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
// import CustomDropdown from './CustomDropdown'; // If needed for simplistic fields

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
    rentAmount?: string;
}

interface AddResidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ResidenceFormData) => void;
}

const AddResidenceModal: React.FC<AddResidenceModalProps> = ({ isOpen, onClose, onSave }) => {
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
        rentAmount: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

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
                rentAmount: ''
            });
            setErrors({});
            setTouched({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validateField = (key: string, value: any): string => {
        // Always required fields
        if (['address', 'city', 'state', 'zip', 'country', 'reason'].includes(key)) {
            if (!value || (typeof value === 'string' && value.trim() === '')) {
                const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
                return `${fieldName} is required`;
            }
        }

        // moveInDate is always required
        if (key === 'moveInDate' && !value) {
            return 'Move in date is required';
        }

        // moveOutDate is required when not current residence
        if (key === 'moveOutDate' && !formData.isCurrent && !value) {
            return 'Move out date is required for past residences';
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

        // Always required fields
        const requiredFields = ['address', 'city', 'state', 'zip', 'country', 'moveInDate', 'reason'];

        requiredFields.forEach(field => {
            const error = validateField(field, (formData as any)[field]);
            if (error) {
                newErrors[field] = error;
                isValid = false;
            }
        });

        // Conditional: moveOutDate when not current
        if (!formData.isCurrent) {
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

        // Special case: when isCurrent changes, revalidate moveOutDate
        if (key === 'isCurrent') {
            setErrors(prev => {
                const newErrors = { ...prev };
                if (value) {
                    // If setting to current, clear moveOutDate error
                    delete newErrors.moveOutDate;
                } else {
                    // If setting to not current, validate moveOutDate
                    const error = validateField('moveOutDate', formData.moveOutDate);
                    if (error) {
                        newErrors.moveOutDate = error;
                    }
                }
                return newErrors;
            });
        }

        // Special case: when residencyType changes, revalidate conditional fields
        if (key === 'residencyType') {
            setErrors(prev => {
                const newErrors = { ...prev };
                if (value === 'Rent') {
                    // Validate landlord fields
                    const landlordNameError = validateField('landlordName', formData.landlordName);
                    const landlordPhoneError = validateField('landlordPhone', formData.landlordPhone);
                    if (landlordNameError) newErrors.landlordName = landlordNameError;
                    if (landlordPhoneError) newErrors.landlordPhone = landlordPhoneError;
                } else {
                    // Clear landlord field errors when switching to Own
                    delete newErrors.landlordName;
                    delete newErrors.landlordPhone;
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
            city: true,
            state: true,
            zip: true,
            country: true,
            moveInDate: true,
            reason: true
        };

        if (!formData.isCurrent) {
            allTouched.moveOutDate = true;
        }

        if (formData.residencyType === 'Rent') {
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
        const requiredFields = ['address', 'city', 'state', 'zip', 'country', 'moveInDate', 'reason'];

        // Check always required fields
        const baseValid = requiredFields.every(field => {
            return !validateField(field, (formData as any)[field]);
        });

        // Check conditional moveOutDate
        if (!formData.isCurrent) {
            const moveOutValid = !validateField('moveOutDate', formData.moveOutDate);
            if (!moveOutValid) return false;
        }

        // Check conditional landlord fields
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
            <div className="bg-[#EAEAEA] rounded-[2rem] w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-6 flex items-center justify-between text-white">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ChevronLeft size={28} />
                    </button>
                    <h2 className="text-2xl font-medium">Add a new residence</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">

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
                        {/* Row 1: Address & City */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Address*</label>
                                {/* Using a simple input for now */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter address"
                                        className={getInputClassWithError('address')}
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        onBlur={() => handleBlur('address')}
                                    />
                                </div>
                                {touched.address && errors.address && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.address}</p>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>City *</label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    className={getInputClassWithError('city')}
                                    value={formData.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                    onBlur={() => handleBlur('city')}
                                />
                                {touched.city && errors.city && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>
                                )}
                            </div>
                        </div>

                        {/* Row 2: State, Zip, Country */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClasses}>State *</label>
                                <input
                                    type="text"
                                    placeholder="Enter state"
                                    className={getInputClassWithError('state')}
                                    value={formData.state}
                                    onChange={(e) => handleChange('state', e.target.value)}
                                    onBlur={() => handleBlur('state')}
                                />
                                {touched.state && errors.state && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.state}</p>
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
                            <div>
                                <label className={labelClasses}>Country*</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter country"
                                        className={getInputClassWithError('country')}
                                        value={formData.country}
                                        onChange={(e) => handleChange('country', e.target.value)}
                                        onBlur={() => handleBlur('country')}
                                    />
                                </div>
                                {touched.country && errors.country && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.country}</p>
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
                                    />
                                </div>
                                {touched.moveInDate && errors.moveInDate && (
                                    <p className="text-red-500 text-xs mt-1 ml-1">{errors.moveInDate}</p>
                                )}
                            </div>
                            <div>
                                <label className={labelClasses}>Move Out Date *</label>
                                <div className="relative">
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
                                        disabled={formData.isCurrent}
                                    />
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
                                    <input
                                        type="text"
                                        placeholder="Enter phone"
                                        className={getInputClassWithError('landlordPhone')}
                                        value={formData.landlordPhone}
                                        onChange={(e) => handleChange('landlordPhone', e.target.value)}
                                        onBlur={() => handleBlur('landlordPhone')}
                                    />
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
                            <label className={labelClasses}>Please Explain*</label>
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
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddResidenceModal;
