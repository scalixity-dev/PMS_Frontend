import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import DatePicker from '@/components/ui/DatePicker';
// import CustomDropdown from './CustomDropdown'; // If needed for simplistic fields

export interface ResidenceFormData {
    isCurrent: boolean;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    residencyType: 'Rent' | 'Own';
    moveInDate: Date | undefined;
    moveOutDate: Date | undefined;
    reason: string;
    // Rent specific
    landlordName?: string;
    landlordPhone?: string;
    rentAmount?: string;
}

interface AddResidenceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ResidenceFormData) => void;
}

const AddResidenceModal: React.FC<AddResidenceModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState<ResidenceFormData>({
        isCurrent: true, // Default to true as per screenshot (green switch)
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        residencyType: 'Rent',
        moveInDate: undefined,
        moveOutDate: undefined,
        reason: '',
        landlordName: '',
        landlordPhone: '',
        rentAmount: ''
    });

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

    if (!isOpen) return null;

    const handleChange = (key: keyof ResidenceFormData, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = () => {
        onSave(formData);
        onClose();
        setFormData({
            isCurrent: true,
            address: '',
            city: '',
            state: '',
            zip: '',
            country: '',
            residencyType: 'Rent',
            moveInDate: undefined,
            moveOutDate: undefined,
            reason: '',
            landlordName: '',
            landlordPhone: '',
            rentAmount: ''
        });
    };

    const inputClasses = "w-full bg-white p-4 rounded-lg border-none outline-none text-gray-700 placeholder-gray-400 font-medium";
    const labelClasses = "block text-sm font-bold text-[#2c3e50] mb-2";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
            <div className="bg-[#EAEAEA] rounded-[2rem] w-full max-w-4xl shadow-2xl animate-slide-in-from-right relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-6 flex items-center justify-between text-white">
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <ChevronLeft size={28} />
                    </button>
                    <h2 className="text-2xl font-medium">Add a new residence</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={28} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">

                    {/* Current Residence Switch */}
                    <div className="flex items-center gap-4 mb-8">
                        <span className="text-xl font-medium text-[#2c3e50]">Current residence ?</span>
                        <div
                            className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-colors ${formData.isCurrent ? 'bg-[#84D34C]' : 'bg-gray-300'}`}
                            onClick={() => handleChange('isCurrent', !formData.isCurrent)}
                        >
                            <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${formData.isCurrent ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Row 1: Address & City */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Address*</label>
                                {/* Using a simple input for now */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter address"
                                        className={inputClasses}
                                        value={formData.address}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>City *</label>
                                <input
                                    type="text"
                                    placeholder="Enter city"
                                    className={inputClasses}
                                    value={formData.city}
                                    onChange={(e) => handleChange('city', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Row 2: State, Zip, Country */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className={labelClasses}>State *</label>
                                <input
                                    type="text"
                                    placeholder="Enter state"
                                    className={inputClasses}
                                    value={formData.state}
                                    onChange={(e) => handleChange('state', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Zip *</label>
                                <input
                                    type="text"
                                    placeholder="Enter zip code"
                                    className={inputClasses}
                                    value={formData.zip}
                                    onChange={(e) => handleChange('zip', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className={labelClasses}>Country*</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Enter country"
                                        className={inputClasses}
                                        value={formData.country}
                                        onChange={(e) => handleChange('country', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rent / Own Toggle */}
                        <div className="flex items-center gap-4 py-2">
                            <div className="flex bg-transparent gap-4">
                                <button
                                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${formData.residencyType === 'Rent'
                                        ? 'bg-[#84D34C] text-white shadow-md'
                                        : 'bg-white text-gray-500'
                                        }`}
                                    onClick={() => handleChange('residencyType', 'Rent')}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 ${formData.residencyType === 'Rent' ? 'border-white bg-transparent' : 'border-gray-400'}`} >
                                        {formData.residencyType === 'Rent' && <div className="w-full h-full bg-white rounded-full scale-50" />}
                                    </div>
                                    Rent
                                </button>
                                <button
                                    className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all ${formData.residencyType === 'Own'
                                        ? 'bg-[#84D34C] text-white shadow-md'
                                        : 'bg-white text-gray-500'
                                        }`}
                                    onClick={() => handleChange('residencyType', 'Own')}
                                >
                                    <div className={`w-4 h-4 rounded-full border-2 ${formData.residencyType === 'Own' ? 'border-white bg-transparent' : 'border-gray-400'}`} >
                                        {formData.residencyType === 'Own' && <div className="w-full h-full bg-white rounded-full scale-50" />}
                                    </div>
                                    Own
                                </button>
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClasses}>Move in Date *</label>
                                <div className="relative">
                                    <DatePicker
                                        value={formData.moveInDate}
                                        onChange={(date: Date | undefined) => handleChange('moveInDate', date)}
                                        placeholder="DD/MM/YYYY"
                                        className={inputClasses}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className={labelClasses}>Move Out Date *</label>
                                <div className="relative">
                                    <DatePicker
                                        value={formData.moveOutDate}
                                        onChange={(date: Date | undefined) => handleChange('moveOutDate', date)}
                                        placeholder="DD/MM/YYYY"
                                        className={inputClasses}
                                        disabled={formData.isCurrent}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Different Fields Section */}
                        {formData.residencyType === 'Rent' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div>
                                    <label className={labelClasses}>Landlord Name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter name"
                                        className={inputClasses}
                                        value={formData.landlordName}
                                        onChange={(e) => handleChange('landlordName', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className={labelClasses}>Landlord Phone *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter phone"
                                        className={inputClasses}
                                        value={formData.landlordPhone}
                                        onChange={(e) => handleChange('landlordPhone', e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-top-4 duration-300">
                                {/* Own specific - maybe Mortgage or just generic 'Reason for selling' logic if applicable */}
                                {/* For now, leaving empty or relying on generic 'Please Explain' */}
                            </div>
                        )}

                        {/* Please Explain */}
                        <div>
                            <label className={labelClasses}>Please Explain*</label>
                            <textarea
                                placeholder="Enter additional details"
                                className={`${inputClasses} h-32 resize-none pt-4`}
                                value={formData.reason}
                                onChange={(e) => handleChange('reason', e.target.value)}
                            />
                        </div>

                        {/* Add Button */}
                        <div className="pt-4">
                            <button
                                onClick={handleSubmit}
                                className="bg-[#3A6D6C] text-white px-10 py-3 rounded-xl font-medium hover:bg-[#2c5251] transition-colors shadow-lg"
                            >
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddResidenceModal;
