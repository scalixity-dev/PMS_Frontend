import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import CustomDropdown from '../../../../Dashboard/components/CustomDropdown';
import BaseModal from '@/components/common/modals/BaseModal';

export interface VehicleFormData {
    type: string;
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
    registeredIn: string;
}

interface UserAddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: VehicleFormData) => void;
    initialData?: VehicleFormData;
}

const typeOptions = [
    { value: 'Car', label: 'Car' },
    { value: 'Truck', label: 'Truck' },
    { value: 'Motorcycle', label: 'Motorcycle' },
    { value: 'Other', label: 'Other' }
];

const UserAddVehicleModal: React.FC<UserAddVehicleModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
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

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (!isOpen) {
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
    }, [isOpen, initialData]);

    const validateField = (key: keyof VehicleFormData, value: string): string => {
        if (!value || value.trim() === '') {
            const displayNames: Record<string, string> = {
                type: 'Type',
                make: 'Company name',
                model: 'Model',
                year: 'Year',
                color: 'Color',
                licensePlate: 'License Plate',
                registeredIn: 'Registered In'
            };
            const displayName = displayNames[key] || key;
            return `${displayName} is required`;
        }

        if (key === 'year') {
            const yearNum = parseInt(value, 10);
            const currentYear = new Date().getFullYear();
            if (isNaN(yearNum)) return 'Year must be a number';
            if (yearNum < 1900 || yearNum > currentYear + 1) return `Enter a valid year`;
        }

        if (key === 'licensePlate') {
            if (value && value.trim().length < 2) return 'At least 2 characters';
        }

        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
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

    const isFormValid = () => {
        const requiredFields: Array<keyof VehicleFormData> = [
            'type', 'make', 'model', 'year', 'color', 'licensePlate', 'registeredIn'
        ];
        return requiredFields.every(key => !validateField(key, formData[key]));
    };

    const handleChange = (key: keyof VehicleFormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
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

    const handleSubmit = () => {
        const requiredFields: Array<keyof VehicleFormData> = [
            'type', 'make', 'model', 'year', 'color', 'licensePlate', 'registeredIn'
        ];
        const allTouched = requiredFields.reduce((acc, key) => {
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
            title={initialData ? 'Edit vehicle' : 'Add a new vehicle'}
            maxWidth="max-w-3xl"
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
            <div className="space-y-6 py-2">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className={labelClasses}>Type</label>
                        <CustomDropdown
                            value={formData.type}
                            onChange={(val: string) => {
                                handleChange('type', val);
                                if (!touched.type) handleBlur('type', val);
                            }}
                            options={typeOptions}
                            placeholder="Choose Type"
                            buttonClassName={`${inputClasses} ${touched.type && errors.type ? 'border-red-500' : ''}`}
                        />
                        {touched.type && errors.type && <p className={errorClasses}>{errors.type}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Company name</label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className={`${inputClasses} ${touched.make && errors.make ? 'border-red-500' : ''}`}
                            value={formData.make}
                            onChange={(e) => handleChange('make', e.target.value)}
                            onBlur={() => handleBlur('make')}
                        />
                        {touched.make && errors.make && <p className={errorClasses}>{errors.make}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Model</label>
                        <input
                            type="text"
                            placeholder="Type here"
                            className={`${inputClasses} ${touched.model && errors.model ? 'border-red-500' : ''}`}
                            value={formData.model}
                            onChange={(e) => handleChange('model', e.target.value)}
                            onBlur={() => handleBlur('model')}
                        />
                        {touched.model && errors.model && <p className={errorClasses}>{errors.model}</p>}
                    </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className={labelClasses}>Year</label>
                        <input
                            type="text"
                            placeholder="Type Here"
                            className={`${inputClasses} ${touched.year && errors.year ? 'border-red-500' : ''}`}
                            value={formData.year}
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                handleChange('year', value);
                            }}
                            onBlur={() => handleBlur('year')}
                        />
                        {touched.year && errors.year && <p className={errorClasses}>{errors.year}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>Color</label>
                        <input
                            type="text"
                            placeholder="Type Here"
                            className={`${inputClasses} ${touched.color && errors.color ? 'border-red-500' : ''}`}
                            value={formData.color}
                            onChange={(e) => handleChange('color', e.target.value)}
                            onBlur={() => handleBlur('color')}
                        />
                        {touched.color && errors.color && <p className={errorClasses}>{errors.color}</p>}
                    </div>
                    <div>
                        <label className={labelClasses}>License Plate</label>
                        <input
                            type="text"
                            placeholder="Type Here"
                            className={`${inputClasses} ${touched.licensePlate && errors.licensePlate ? 'border-red-500' : ''}`}
                            value={formData.licensePlate}
                            onChange={(e) => {
                                const upperValue = e.target.value.toUpperCase();
                                handleChange('licensePlate', upperValue);
                            }}
                            onBlur={() => handleBlur('licensePlate')}
                        />
                        {touched.licensePlate && errors.licensePlate && <p className={errorClasses}>{errors.licensePlate}</p>}
                    </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className={labelClasses}>Registered in</label>
                        <input
                            type="text"
                            placeholder="Type Here"
                            className={`${inputClasses} ${touched.registeredIn && errors.registeredIn ? 'border-red-500' : ''}`}
                            value={formData.registeredIn}
                            onChange={(e) => handleChange('registeredIn', e.target.value)}
                            onBlur={() => handleBlur('registeredIn')}
                        />
                        {touched.registeredIn && errors.registeredIn && <p className={errorClasses}>{errors.registeredIn}</p>}
                    </div>
                    {/* Empty columns to maintain grid structure if needed, or just let it end */}
                </div>
            </div>
        </BaseModal>
    );
};

export default UserAddVehicleModal;
