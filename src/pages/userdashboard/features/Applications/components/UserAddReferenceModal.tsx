import React, { useState, useEffect } from 'react';
import { Check, Mail, Phone, User } from 'lucide-react';
import BaseModal from '@/components/common/modals/BaseModal';

export interface ReferenceFormData {
    fullName: string;
    relationship: string;
    email: string;
    phoneNumber: string;
    phoneCountryCode: string;
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
        phoneCountryCode: 'IN|+91'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        } else if (!isOpen) {
            setFormData({
                fullName: '',
                relationship: '',
                email: '',
                phoneNumber: '',
                phoneCountryCode: 'IN|+91'
            });
            setErrors({});
            setTouched({});
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
                if (!value.trim()) return 'Phone Number is required';
                break;
        }
        return '';
    };

    const isFormValid = () => {
        const requiredFields: Array<keyof ReferenceFormData> = ['fullName', 'relationship', 'phoneNumber'];
        let isValid = requiredFields.every(key => !validateField(key, formData[key]));
        if (formData.email && validateField('email', formData.email)) isValid = false;
        return isValid;
    };

    const handleChange = (key: keyof ReferenceFormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof ReferenceFormData) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const error = validateField(key, formData[key]);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        const allTouched = (Object.keys(formData) as Array<keyof ReferenceFormData>).reduce((acc, key) => {
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
                    disabled: !isFormValid(),
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
                        <div className="relative">
                            <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="tel"
                                placeholder="Enter phone number"
                                className={`${inputClasses} pl-9 ${touched.phoneNumber && errors.phoneNumber ? 'border-red-500' : ''}`}
                                value={formData.phoneNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
                                    handleChange('phoneNumber', value);
                                }}
                                onBlur={() => handleBlur('phoneNumber')}
                            />
                        </div>
                        {touched.phoneNumber && errors.phoneNumber && <p className={errorClasses}>{errors.phoneNumber}</p>}
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
