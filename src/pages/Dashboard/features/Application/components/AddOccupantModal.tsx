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

    if (!isOpen) return null;

    const handleChange = (key: keyof OccupantFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
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
                            className="w-full bg-white p-2.5 rounded-xl border-none outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm"
                            value={formData.firstName}
                            onChange={(e) => handleChange('firstName', e.target.value)}
                        />
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Last Name*</label>
                        <input
                            type="text"
                            placeholder="Enter Last Name"
                            className="w-full bg-white p-2.5 rounded-xl border-none outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm"
                            value={formData.lastName}
                            onChange={(e) => handleChange('lastName', e.target.value)}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Email*</label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="w-full bg-white p-2.5 rounded-xl border-none outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Phone Number*</label>
                        <div className="relative">
                            <input
                                type="tel"
                                placeholder="Enter Phone Number"
                                className="w-full bg-white p-2.5 rounded-xl border-none outline-none text-gray-700 placeholder-gray-400 shadow-sm appearance-none text-sm"
                                value={formData.phoneNumber}
                                onChange={(e) => handleChange('phoneNumber', e.target.value)}
                            />
                            {/* Removed dropdown arrow icon */}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Date of birth*</label>
                        <div className="relative">
                            <DatePicker
                                value={formData.dob}
                                onChange={(date) => handleChange('dob', date)}
                                placeholder="DD/MM/YYYY"
                                className="w-full bg-white p-2.5 rounded-xl border-none outline-none text-gray-700 shadow-sm text-sm"
                                popoverClassName="bottom-full mb-2"
                            />
                        </div>
                    </div>

                    {/* Relationship */}
                    <div>
                        <label className="block text-xs font-semibold text-[#2c3e50] mb-1 ml-1">Relationship*</label>
                        <div className="relative">
                            <CustomDropdown
                                value={formData.relationship}
                                onChange={(val) => handleChange('relationship', val)}
                                options={relationshipOptions}
                                placeholder="Select Relationship"
                                buttonClassName="w-full bg-white p-2.5 rounded-xl border-none outline-none text-gray-700 placeholder-gray-400 shadow-sm text-sm"
                                dropdownClassName="max-h-80 bottom-full mb-2"
                            />
                        </div>
                    </div>

                    {/* Add Button */}
                    <div className="pt-2">
                        <button
                            onClick={handleSubmit}
                            className="bg-[#3A6D6C] text-white px-8 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2c5251] transition-colors shadow-md"
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
