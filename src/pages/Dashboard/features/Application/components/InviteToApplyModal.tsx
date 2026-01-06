import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, Check } from 'lucide-react';
import { useGetAllProperties } from '@/hooks/usePropertyQueries';

interface InviteToApplyModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSend: (email: string, propertyId: string) => void;
}

const InviteToApplyModal: React.FC<InviteToApplyModalProps> = ({ isOpen, onClose, onSend }) => {
    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);

    // Fetch properties
    const { data: properties = [], isLoading } = useGetAllProperties(true, false);

    // Filter out properties that can be selected (e.g., must have units or be single family)
    // For now, listing all active properties
    const activeProperties = properties;

    const selectedProperty = activeProperties.find(p => p.id === selectedPropertyId);

    // Email validation regex (RFC 5322 simplified)
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSend = () => {
        // Clear previous errors
        setEmailError('');

        // Validate required fields
        if (!selectedPropertyId) {
            return;
        }

        if (!email.trim()) {
            setEmailError('Email address is required');
            return;
        }

        // Validate email format
        if (!validateEmail(email.trim())) {
            setEmailError('Please enter a valid email address');
            return;
        }

        // All validation passed, send invitation
        onSend(email.trim(), selectedPropertyId);

        // Reset form only after successful validation
        setEmail('');
        setEmailError('');
        setSelectedPropertyId('');
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between">
                    <h2 className="text-white text-lg font-medium">Invite applicants to apply online</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 sm:p-8 space-y-6">
                    {/* Select Property */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Select property*</label>
                        <div className="relative">
                            <button
                                onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                                className="w-full flex items-center justify-between px-4 py-3 bg-[#7BD747] text-white rounded-lg hover:bg-[#6bc13d] transition-colors focus:outline-none"
                            >
                                <span className="font-medium truncate">
                                    {selectedProperty ? selectedProperty.propertyName : 'Listed Property'}
                                </span>
                                <ChevronDown size={20} className={`transition-transform ${isPropertyDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isPropertyDropdownOpen && (
                                <div className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {isLoading ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">Loading properties...</div>
                                    ) : activeProperties.length === 0 ? (
                                        <div className="p-4 text-center text-gray-500 text-sm">No properties found</div>
                                    ) : (
                                        activeProperties.map(property => (
                                            <button
                                                key={property.id}
                                                onClick={() => {
                                                    setSelectedPropertyId(property.id);
                                                    setIsPropertyDropdownOpen(false);
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left"
                                            >
                                                <span className="text-gray-700 text-sm font-medium truncate">{property.propertyName}</span>
                                                {selectedPropertyId === property.id && (
                                                    <Check size={16} className="text-[#7BD747]" />
                                                )}
                                            </button>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Add Applicants */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Add applicants*</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                if (emailError) setEmailError(''); // Clear error on change
                            }}
                            placeholder="Enter applicant's emails"
                            className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all font-medium ${emailError
                                ? 'bg-red-50 text-red-900 placeholder:text-red-400 border-2 border-red-500 focus:ring-red-500/50'
                                : 'bg-[#7BD747] text-white placeholder:text-white/80 focus:ring-[#7BD747]/50'
                                }`}
                        />
                        {emailError && (
                            <p className="text-sm text-red-600 font-medium">{emailError}</p>
                        )}
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-[#4A5568] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2d3748] transition-colors shadow-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSend}
                        className="flex-1 bg-[#3A6D6C] text-white py-3 rounded-lg text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-sm"
                    >
                        Send invitation
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default InviteToApplyModal;
