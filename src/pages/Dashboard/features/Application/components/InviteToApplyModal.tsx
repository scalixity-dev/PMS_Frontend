import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface InviteToApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (email: string) => void;
}

const InviteToApplyModal: React.FC<InviteToApplyModalProps> = ({ isOpen, onClose, onSend }) => {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Prevent background scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setEmail('');
            setErrors({});
            setTouched({});
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const validateEmail = (emailValue: string): string => {
        if (!emailValue || emailValue.trim() === '') {
            return 'Email is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailValue)) {
            return 'Please enter a valid email address';
        }
        return '';
    };

    const handleBlur = () => {
        setTouched({ email: true });
        const error = validateEmail(email);
        setErrors({ email: error });
    };

    const handleChange = (value: string) => {
        setEmail(value);
        if (touched.email) {
            const error = validateEmail(value);
            setErrors({ email: error });
        }
    };

    const handleSubmit = () => {
        setTouched({ email: true });
        const error = validateEmail(email);
        if (error) {
            setErrors({ email: error });
            return;
        }

        onSend(email);
        setEmail('');
        setErrors({});
        setTouched({});
    };

    const isFormValid = !validateEmail(email);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-3xl w-full max-w-md shadow-2xl animate-slide-in-from-right relative">
                {/* Header */}
                <div className="bg-[#3A6D6C] p-6 flex items-center justify-between text-white rounded-t-3xl">
                    <h2 className="text-xl font-medium">Invite to apply</h2>
                    <button 
                        onClick={onClose} 
                        className="hover:bg-white/10 p-1 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-[#2c3e50] mb-2">
                            Email address *
                        </label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                            value={email}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={handleBlur}
                            className={`w-full bg-white p-3 rounded-xl outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm ${
                                touched.email && errors.email ? 'border-2 border-red-500' : 'border-none'
                            }`}
                        />
                        {touched.email && errors.email && (
                            <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-8 pt-0 flex gap-4 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-400 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!isFormValid}
                        className={`px-6 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            isFormValid
                                ? 'bg-[#3A6D6C] text-white hover:bg-[#2c5251] cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Send invitation
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InviteToApplyModal;

