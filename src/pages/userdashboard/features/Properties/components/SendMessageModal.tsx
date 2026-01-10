import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/common/modals/BaseModal';
import { Send } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimationUrl from '../../../../Dashboard/features/ListUnit/Success.lottie?url';
import { useAuthStore } from '../../Profile/store/authStore';

interface SendMessageModalProps {
    isOpen: boolean;
    onClose: () => void;
    propertyTitle?: string;
    landlordName?: string;
}

interface MessageFormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    message: string;
}

const SendMessageModal: React.FC<SendMessageModalProps> = ({ isOpen, onClose, propertyTitle, landlordName }) => {
    const { userInfo } = useAuthStore();
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState<MessageFormData>({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        message: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (isOpen) {
            setShowSuccess(false);
            setFormData({
                firstName: userInfo?.firstName || '',
                lastName: userInfo?.lastName || '',
                phone: userInfo?.phone || '',
                email: userInfo?.email || '',
                message: ''
            });
        } else {
            setFormData({
                firstName: '',
                lastName: '',
                phone: '',
                email: '',
                message: ''
            });
            setErrors({});
            setTouched({});
        }
    }, [isOpen, userInfo]);

    const validateField = (key: string, value: string): string => {
        if (!value.trim()) {
            return key === 'message' ? 'Message is required' : 'This field is required';
        }
        if (key === 'email') {
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter valid email';
        }
        return '';
    };

    const handleChange = (key: keyof MessageFormData, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
        if (touched[key]) {
            const error = validateField(key, value);
            setErrors(prev => ({ ...prev, [key]: error }));
        }
    };

    const handleBlur = (key: keyof MessageFormData) => {
        setTouched(prev => ({ ...prev, [key]: true }));
        const error = validateField(key, formData[key]);
        setErrors(prev => ({ ...prev, [key]: error }));
    };

    const isFormValid = () => {
        const check = (key: keyof MessageFormData) => !validateField(key, formData[key]);
        return Object.keys(formData).every(k => check(k as keyof MessageFormData));
    };

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;
        (Object.keys(formData) as Array<keyof MessageFormData>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) {
                newErrors[key] = error;
                isValid = false;
            }
        });
        setErrors(newErrors);
        setTouched({
            firstName: true,
            lastName: true,
            phone: true,
            email: true,
            message: true
        });

        if (isValid) {
            console.log('Sending message:', formData);
            // In a real app, this would be an API call
            setShowSuccess(true);
        }
    };

    const inputClasses = "w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]";
    const labelClasses = "block text-xs font-semibold text-gray-700 mb-1";
    const errorClasses = "text-red-500 text-xs mt-1";

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={showSuccess ? "" : "Send a message"}
            maxWidth="max-w-xl"
            footerButtons={showSuccess ? [] : [
                { label: 'Cancel', onClick: onClose, variant: 'ghost' },
                {
                    label: 'Send a message',
                    onClick: handleSubmit,
                    disabled: !isFormValid(),
                    variant: 'primary',
                    className: "bg-[#7ED957] hover:bg-[#6BC847] border-none text-white",
                    icon: <Send size={16} />
                }
            ]}
        >
            <div className="space-y-4 py-2">
                {showSuccess ? (
                    <div className="flex flex-col items-center py-4 text-center">
                        <div className="w-48 h-48 -mt-4">
                            <DotLottieReact
                                src={successAnimationUrl}
                                loop
                                autoplay
                                style={{ width: '100%', height: '100%' }}
                            />
                        </div>
                        <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2 -mt-4">Well Done!</h3>
                        <p className="text-gray-600 text-sm max-w-sm">
                            Message is sent to <span className="font-semibold text-gray-900">{landlordName || 'Landlord'}</span> for <span className="font-semibold text-gray-900">{propertyTitle || 'this property'}</span>.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-8 px-8 py-2.5 bg-[#7ED957] hover:bg-[#6BC847] text-white rounded-lg font-semibold transition-colors shadow-lg shadow-[#7ED957]/20"
                        >
                            Back to Details
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 text-sm">
                            Complete the required information and send the message.
                        </p>

                        {propertyTitle && (
                            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <p className="text-xs text-gray-500 uppercase font-semibold">Property</p>
                                <p className="text-sm font-medium text-gray-800">{propertyTitle}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>First name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter first name"
                                    className={`${inputClasses} ${touched.firstName && errors.firstName ? 'border-red-500' : ''}`}
                                    value={formData.firstName}
                                    onChange={(e) => handleChange('firstName', e.target.value)}
                                    onBlur={() => handleBlur('firstName')}
                                />
                                {touched.firstName && errors.firstName && <p className={errorClasses}>{errors.firstName}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Last name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Enter last name"
                                    className={`${inputClasses} ${touched.lastName && errors.lastName ? 'border-red-500' : ''}`}
                                    value={formData.lastName}
                                    onChange={(e) => handleChange('lastName', e.target.value)}
                                    onBlur={() => handleBlur('lastName')}
                                />
                                {touched.lastName && errors.lastName && <p className={errorClasses}>{errors.lastName}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses}>Phone number <span className="text-red-500">*</span></label>
                                <input
                                    type="tel"
                                    placeholder=""
                                    className={`${inputClasses} ${touched.phone && errors.phone ? 'border-red-500' : ''}`}
                                    value={formData.phone}
                                    onChange={(e) => {
                                        // Allow only numbers and common phone characters
                                        const val = e.target.value.replace(/[^\d\s\-\+\(\)]/g, '');
                                        handleChange('phone', val);
                                    }}
                                    onBlur={() => handleBlur('phone')}
                                />
                                {touched.phone && errors.phone && <p className={errorClasses}>{errors.phone}</p>}
                            </div>
                            <div>
                                <label className={labelClasses}>Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    placeholder="Enter email"
                                    className={`${inputClasses} ${touched.email && errors.email ? 'border-red-500' : ''}`}
                                    value={formData.email}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    onBlur={() => handleBlur('email')}
                                />
                                {touched.email && errors.email && <p className={errorClasses}>{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label className={labelClasses}>Message <span className="text-red-500">*</span></label>
                            <textarea
                                placeholder="Anything else?"
                                rows={4}
                                className={`${inputClasses} resize-none ${touched.message && errors.message ? 'border-red-500' : ''}`}
                                value={formData.message}
                                onChange={(e) => handleChange('message', e.target.value.slice(0, 1000))}
                                onBlur={() => handleBlur('message')}
                            />
                            <div className="flex justify-between mt-1">
                                <div className="flex-1">
                                    {touched.message && errors.message && <p className={errorClasses}>{errors.message}</p>}
                                </div>
                                <span className="text-xs text-gray-400">Character limit: {formData.message.length} / 1000</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </BaseModal>
    );
};

export default SendMessageModal;
