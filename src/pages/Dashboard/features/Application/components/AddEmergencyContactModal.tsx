import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import type { EmergencyContactFormData } from '../store/applicationStore';

interface AddEmergencyContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: EmergencyContactFormData) => void;
    initialData?: EmergencyContactFormData;
}

const AddEmergencyContactModal: React.FC<AddEmergencyContactModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<EmergencyContactFormData>({
        fullName: '',
        relationship: '',
        email: '',
        phoneNumber: '',
        details: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            if (initialData) {
                setFormData(initialData);
            } else {
                setFormData({
                    fullName: '',
                    relationship: '',
                    email: '',
                    phoneNumber: '',
                    details: ''
                });
            }
        } else {
            document.body.style.overflow = 'unset';
            setErrors({});
            setTouched({});
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, initialData]);


    if (!isOpen) return null;

    const validateField = (key: keyof EmergencyContactFormData, value: any): string => {
        switch (key) {
            case 'fullName':
                if (!value || value.trim() === '') return 'Full Name is required';
                break;
            case 'relationship':
                if (!value || value.trim() === '') return 'Relationship is required';
                break;
            case 'email':
                if (!value || value.trim() === '') return 'Email is required';
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email';
                break;
            case 'phoneNumber':
                if (!value || value.trim() === '') return 'Phone Number is required';
                break;
            case 'details':
                if (!value || value.trim() === '') return 'Details are required';
                break;
        }
        return '';
    };

    const validateAllFields = (): boolean => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        (Object.keys(formData) as Array<keyof EmergencyContactFormData>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (key: keyof EmergencyContactFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));

        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof EmergencyContactFormData) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const error = validateField(key, formData[key]);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const handleSubmit = () => {
        const allTouched = (Object.keys(formData) as Array<keyof EmergencyContactFormData>).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {} as Record<string, boolean>);
        setTouched(allTouched);

        if (validateAllFields()) {
            onSave(formData);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-xl w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative max-h-[90vh] flex flex-col font-sans">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-xl shrink-0">
                    <div className="flex items-center gap-2">
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-lg font-medium">{initialData ? 'Edit emergency contact' : 'Add emergency contact'}</h2>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-1 bg-[#EAEAEA]">

                    {/* Form Grid */}
                    <div className="flex flex-col gap-6 mb-6">

                        {/* Row 1: Name, Email, Phone */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Contact Name*</label>
                                <input
                                    type="text"
                                    placeholder="Type here"
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.fullName && errors.fullName ? 'border-2 border-red-500' : ''}`}
                                    value={formData.fullName}
                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                    onBlur={() => handleBlur('fullName')}
                                />
                                {touched.fullName && errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Contact Email *</label>
                                <input
                                    type="email"
                                    placeholder="Type here"
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.email && errors.email ? 'border-2 border-red-500' : ''}`}
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                />
                                {touched.email && errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            {/* Phone Number */}
                            <div>
                                <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Contact Number *</label>
                                <input
                                    type="tel"
                                    placeholder="Type here"
                                    className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.phoneNumber && errors.phoneNumber ? 'border-2 border-red-500' : ''}`}
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleChange('phoneNumber', e.target.value)}
                                    onBlur={() => handleBlur('phoneNumber')}
                                />
                                {touched.phoneNumber && errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
                            </div>
                        </div>

                        {/* Row 2: Relationship */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Relationship to applicant *</label>
                            <input
                                type="text"
                                placeholder="Type Here"
                                className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm ${touched.relationship && errors.relationship ? 'border-2 border-red-500' : ''}`}
                                value={formData.relationship}
                                onChange={(e) => handleChange('relationship', e.target.value)}
                                onBlur={() => handleBlur('relationship')}
                            />
                            {touched.relationship && errors.relationship && <p className="text-red-500 text-xs mt-1">{errors.relationship}</p>}
                        </div>

                        {/* Row 3: Details */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2c3e50] mb-2">Details *</label>
                            <textarea
                                placeholder="Type Here"
                                className={`w-full bg-white p-4 rounded-xl outline-none text-gray-700 placeholder-gray-500 shadow-sm text-sm min-h-[150px] resize-none ${touched.details && errors.details ? 'border-2 border-red-500' : ''}`}
                                value={formData.details}
                                onChange={(e) => handleChange('details', e.target.value)}
                                onBlur={() => handleBlur('details')}
                            />
                            {touched.details && errors.details && <p className="text-red-500 text-xs mt-1">{errors.details}</p>}
                        </div>

                    </div>

                    {/* Add Button */}
                    <div>
                        <button
                            onClick={handleSubmit}
                            className="bg-[#3A6D6C] text-white px-12 py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                        >
                            {initialData ? 'Save' : 'Add'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AddEmergencyContactModal;
