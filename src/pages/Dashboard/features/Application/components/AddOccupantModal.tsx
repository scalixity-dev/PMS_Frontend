import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
import CustomDropdown from '../../../components/CustomDropdown';

export interface OccupantFormData {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dob: Date | undefined;
    relationship: string;
}

interface AddOccupantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: OccupantFormData) => void;
}

const relationshipOptions = [
    { value: 'Spouse', label: 'Spouse' },
    { value: 'Child', label: 'Child' },
    { value: 'Parent', label: 'Parent' },
    { value: 'Sibling', label: 'Sibling' },
    { value: 'Friend', label: 'Friend' },
    { value: 'Other', label: 'Other' }
];

const AddOccupantModal: React.FC<AddOccupantModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<OccupantFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        dob: undefined,
        relationship: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

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
        if (!isOpen) {
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phoneNumber: '',
                dob: undefined,
                relationship: ''
            });
            setErrors({});
            setTouched({});
        }
    }, [isOpen]);

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
                // Basic email format validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    return 'Please enter a valid email address';
                }
                break;
            case 'phoneNumber':
                if (!value || value.trim() === '') {
                    return 'Phone number is required';
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
                    <h2 className="text-lg font-medium">Add a new co-occupant</h2>
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
                        <div className="relative">
                            <input
                                type="tel"
                                placeholder="Enter Phone Number"
                                className={`w-full bg-white p-2.5 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm appearance-none text-sm ${touched.phoneNumber && errors.phoneNumber ? 'border-2 border-red-500' : 'border-none'
                                    }`}
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                onBlur={() => handleBlur('phoneNumber')}
                            />
                            {/* Removed dropdown arrow icon */}
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
                            Add
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddOccupantModal;
