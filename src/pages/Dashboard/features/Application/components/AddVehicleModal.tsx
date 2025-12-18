import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import CustomDropdown from '../../../components/CustomDropdown';

export interface VehicleFormData {
    type: string;
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
    registeredIn: string;
}

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: VehicleFormData) => void;
}

const typeOptions = [
    { value: 'Car', label: 'Car' },
    { value: 'Truck', label: 'Truck' },
    { value: 'Motorcycle', label: 'Motorcycle' },
    { value: 'Other', label: 'Other' }
];

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<VehicleFormData>({
        type: '',
        make: '',
        model: '',
        year: '',
        color: '',
        licensePlate: '',
        registeredIn: ''
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
                type: '',
                make: '',
                model: '',
                year: '',
                color: '',
                licensePlate: '',
                registeredIn: ''
            });
            setErrors({});
            setTouched({});
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const validateField = (key: keyof VehicleFormData, value: string): string => {
        // Check if required field is empty
        if (!value || value.trim() === '') {
            const fieldName = key.charAt(0).toUpperCase() + key.slice(1);
            // Handle camelCase field names
            const displayName = fieldName.replace(/([A-Z])/g, ' $1').trim();
            return `${displayName} is required`;
        }

        // Special validation for year
        if (key === 'year') {
            const yearNum = parseInt(value, 10);
            const currentYear = new Date().getFullYear();

            if (isNaN(yearNum)) {
                return 'Year must be a valid number';
            }
            if (yearNum < 1900 || yearNum > currentYear + 1) {
                return `Year must be between 1900 and ${currentYear + 1}`;
            }
        }

        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        // All fields are required
        const requiredFields: Array<keyof VehicleFormData> = [
            'type', 'make', 'model', 'year', 'color', 'licensePlate', 'registeredIn'
        ];

        requiredFields.forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (key: keyof VehicleFormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        // Clear error for this field when user starts typing/selecting
        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof VehicleFormData, currentValue?: any) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const value = currentValue !== undefined ? currentValue : formData[key];
        const error = validateField(key, value);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = async () => {
        // Mark all fields as touched
        const allTouched: Record<string, boolean> = {
            type: true,
            make: true,
            model: true,
            year: true,
            color: true,
            licensePlate: true,
            registeredIn: true
        };
        setTouched(allTouched);

        // Validate all fields
        if (!validateAllFields()) {
            // Don't submit if validation fails
            return;
        }

        try {
            // Call onSave - it might be async
            await Promise.resolve(onSave(formData));

            // Only close and reset after successful save
            onClose();
            setFormData({
                type: '',
                make: '',
                model: '',
                year: '',
                color: '',
                licensePlate: '',
                registeredIn: ''
            });
            setErrors({});
            setTouched({});
        } catch (error) {
            // If onSave throws an error, keep the modal open
            console.error('Error saving vehicle:', error);
            // You could set a general error message here if needed
        }
    };

    // Check if form is valid for button state
    const isFormValid = () => {
        const requiredFields: Array<keyof VehicleFormData> = [
            'type', 'make', 'model', 'year', 'color', 'licensePlate', 'registeredIn'
        ];

        return requiredFields.every(key => {
            return !validateField(key, formData[key]);
        });
    };

    const inputClasses = "w-full bg-white p-3 rounded-lg outline-none text-gray-700 placeholder-gray-400 shadow-sm";
    const getInputClassWithError = (fieldName: string) => {
        return `${inputClasses} ${touched[fieldName] && errors[fieldName] ? 'border-2 border-red-500' : 'border-none'}`;
    };
    const labelClasses = "block text-sm font-semibold text-[#2c3e50] mb-1 ml-1";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-3xl w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative overflow-visible">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-3xl">
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="text-xl font-medium">Add a new vehicle</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    {/* Row 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClasses}>Type *</label>
                            <CustomDropdown
                                value={formData.type}
                                onChange={(val) => {
                                    handleChange('type', val);
                                    if (!touched.type) {
                                        handleBlur('type', val);
                                    }
                                }}
                                options={typeOptions}
                                placeholder="Choose Type"
                                buttonClassName={getInputClassWithError('type')}
                                dropdownClassName="max-h-60"
                            />
                            {touched.type && errors.type && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.type}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelClasses}>Make *</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={getInputClassWithError('make')}
                                value={formData.make}
                                onChange={(e) => handleChange('make', e.target.value)}
                                onBlur={() => handleBlur('make')}
                            />
                            {touched.make && errors.make && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.make}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelClasses}>Model *</label>
                            <input
                                type="text"
                                placeholder="Type here"
                                className={getInputClassWithError('model')}
                                value={formData.model}
                                onChange={(e) => handleChange('model', e.target.value)}
                                onBlur={() => handleBlur('model')}
                            />
                            {touched.model && errors.model && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.model}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClasses}>Year *</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={getInputClassWithError('year')}
                                value={formData.year}
                                onChange={(e) => handleChange('year', e.target.value)}
                                onBlur={() => handleBlur('year')}
                            />
                            {touched.year && errors.year && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.year}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelClasses}>Color *</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={getInputClassWithError('color')}
                                value={formData.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                onBlur={() => handleBlur('color')}
                            />
                            {touched.color && errors.color && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.color}</p>
                            )}
                        </div>
                        <div>
                            <label className={labelClasses}>License Plate *</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={getInputClassWithError('licensePlate')}
                                value={formData.licensePlate}
                                onChange={(e) => handleChange('licensePlate', e.target.value)}
                                onBlur={() => handleBlur('licensePlate')}
                            />
                            {touched.licensePlate && errors.licensePlate && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.licensePlate}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className={labelClasses}>Registered in*</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={getInputClassWithError('registeredIn')}
                                value={formData.registeredIn}
                                onChange={(e) => handleChange('registeredIn', e.target.value)}
                                onBlur={() => handleBlur('registeredIn')}
                            />
                            {touched.registeredIn && errors.registeredIn && (
                                <p className="text-red-500 text-xs mt-1 ml-1">{errors.registeredIn}</p>
                            )}
                        </div>
                    </div>

                    {/* Add Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid()}
                            className={`px-8 py-3 rounded-xl text-sm font-medium transition-colors shadow-md ${isFormValid()
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

export default AddVehicleModal;
