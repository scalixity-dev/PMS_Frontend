import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { formatPhoneNumber } from '@/utils/phone.utils';

interface AddTenantModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const AddTenantModal: React.FC<AddTenantModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: ''
    });

    const [showExitConfirmation, setShowExitConfirmation] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
        onClose();
    };

    const handleCloseAttempt = () => {
        setShowExitConfirmation(true);
    };

    const handleConfirmExit = () => {
        setShowExitConfirmation(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-in-from-right relative">
                {/* Header */}
                <div className="bg-[#3D7475] p-6 flex items-center justify-between">
                    <div className="bg-[#84CC16] text-white px-4 py-2 rounded-full flex items-center gap-2">
                        <span className="text-sm font-semibold">Add tenant</span>
                    </div>
                    <button onClick={handleCloseAttempt} className="text-white hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-6">

                    {/* First Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">First name*</label>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="First Name"
                            className={`w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all ${errors.firstName ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {errors.firstName && <p className="mt-1.5 ml-1 text-xs text-red-600">{errors.firstName}</p>}
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">Last name*</label>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Last Name"
                            className={`w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all ${errors.lastName ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {errors.lastName && <p className="mt-1.5 ml-1 text-xs text-red-600">{errors.lastName}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">Email*</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className={`w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {errors.email && <p className="mt-1.5 ml-1 text-xs text-red-600">{errors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">Phone*</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => {
                                const formatted = formatPhoneNumber(e.target.value);
                                setFormData(prev => ({ ...prev, phone: formatted }));
                                if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
                            }}
                            placeholder="111-111-1111"
                            className={`w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all ${errors.phone ? 'ring-2 ring-red-500' : ''}`}
                        />
                        {errors.phone && <p className="mt-1.5 ml-1 text-xs text-red-600">{errors.phone}</p>}
                    </div>

                    {/* Company Name */}
                    
                </div>

                {/* Footer */}
                <div className="p-6 pt-0 flex gap-4">
                    <button
                        onClick={handleCloseAttempt}
                        className="flex-1 bg-[#4B5563] text-white py-3 rounded-xl font-semibold hover:bg-[#374151] transition-colors shadow-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-[#3D7475] text-white py-3 rounded-xl font-semibold hover:bg-[#2c5556] transition-colors shadow-lg"
                    >
                        Create
                    </button>
                </div>

                {/* Exit Confirmation Overlay */}
                {showExitConfirmation && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl w-[90%] max-w-sm overflow-hidden shadow-2xl animate-slide-in-from-right">
                            <div className="bg-[#3D7475] p-4 flex items-center justify-between text-white">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle size={20} className="stroke-2" />
                                    <span className="font-semibold">You're about to leave</span>
                                </div>
                                <button onClick={() => setShowExitConfirmation(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-gray-700 mb-6">
                                    Are you sure you want to leave without saving ? You will lose any changes made.
                                </p>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setShowExitConfirmation(false)}
                                        className="flex-1 bg-[#4B5563] text-white py-2.5 rounded-lg font-semibold hover:bg-[#374151] transition-colors"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={handleConfirmExit}
                                        className="flex-1 bg-[#3D7475] text-white py-2.5 rounded-lg font-semibold hover:bg-[#2c5556] transition-colors"
                                    >
                                        Yes I'm Sure
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddTenantModal;
