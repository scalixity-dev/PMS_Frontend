import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import CurrencySelector from '@/components/ui/CurrencySelector';
import DatePicker from '@/components/ui/DatePicker';

interface ApplicantInfoData {
    dateOfBirth: Date | undefined;
    moveInDate: Date | undefined;
    bio: string;
    monthlyRent: number;
    householdIncome: number;
    currency: string;
}

interface EditApplicantInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ApplicantInfoData) => Promise<void>;
    initialData: Omit<ApplicantInfoData, 'currency'> & { currency?: string };
    isLoading?: boolean;
}

const EditApplicantInfoModal: React.FC<EditApplicantInfoModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<ApplicantInfoData>({
        ...initialData,
        currency: initialData.currency || 'GBP'
    });

    useEffect(() => {
        if (isOpen) {
            setFormData({
                ...initialData,
                dateOfBirth: initialData.dateOfBirth ? new Date(initialData.dateOfBirth) : undefined,
                moveInDate: initialData.moveInDate ? new Date(initialData.moveInDate) : undefined,
                currency: initialData.currency || 'GBP'
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSave(formData);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
            <div className="bg-[#EAEAEA] rounded-3xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 relative">

                {/* Header */}
                <div className="bg-[#3A6D6C] p-4 flex items-center justify-between text-white rounded-t-3xl">
                    <div className="w-8"></div>
                    <h2 className="text-lg font-medium">Edit Applicant Information</h2>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">

                    <div className="grid grid-cols-2 gap-4">
                        {/* Date of Birth */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Date of birth</label>
                            <div className="relative">
                                <DatePicker
                                    value={formData.dateOfBirth}
                                    onChange={(date) => setFormData({ ...formData, dateOfBirth: date })}
                                    placeholder="Select date"
                                    className="w-full pl-3 pr-4 py-2.5 bg-white rounded-lg outline-none text-gray-700 shadow-sm text-sm border-none focus:ring-1 focus:ring-[#3A6D6C]"
                                />
                            </div>
                        </div>

                        {/* Preferred Move-in */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Preferred move-in</label>
                            <div className="relative">
                                <DatePicker
                                    value={formData.moveInDate}
                                    onChange={(date) => setFormData({ ...formData, moveInDate: date })}
                                    placeholder="Select date"
                                    className="w-full pl-3 pr-4 py-2.5 bg-white rounded-lg outline-none text-gray-700 shadow-sm text-sm border-none focus:ring-1 focus:ring-[#3A6D6C]"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Monthly Rent */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Monthly Rent</label>
                            <div className="relative flex items-center bg-white rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-[#3A6D6C] border border-gray-100">
                                <CurrencySelector
                                    value={formData.currency}
                                    onChange={(code) => setFormData({ ...formData, currency: code })}
                                    className="bg-transparent border-none sm:min-w-[80px]"
                                />
                                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.monthlyRent}
                                    onChange={(e) => setFormData({ ...formData, monthlyRent: parseFloat(e.target.value) || 0 })}
                                    className="w-full pl-2 pr-4 py-2.5 bg-transparent outline-none text-gray-700 text-sm border-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        {/* Household Income */}
                        <div className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">Household Income</label>
                            <div className="relative flex items-center bg-white rounded-lg shadow-sm focus-within:ring-1 focus-within:ring-[#3A6D6C] border border-gray-100">
                                <CurrencySelector
                                    value={formData.currency}
                                    onChange={(code) => setFormData({ ...formData, currency: code })}
                                    className="bg-transparent border-none sm:min-w-[80px]"
                                />
                                <div className="h-6 w-px bg-gray-200 mx-1"></div>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.householdIncome}
                                    onChange={(e) => setFormData({ ...formData, householdIncome: parseFloat(e.target.value) || 0 })}
                                    className="w-full pl-2 pr-4 py-2.5 bg-transparent outline-none text-gray-700 text-sm border-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Short Bio */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">Short bio</label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full p-3 bg-white rounded-lg outline-none text-gray-700 shadow-sm text-sm border-none resize-none min-h-[100px] focus:ring-1 focus:ring-[#3A6D6C]"
                            placeholder="Enter short bio..."
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full px-8 py-3 rounded-lg text-sm font-bold transition-colors shadow-md bg-[#3A6D6C] text-white hover:bg-[#2c5251] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditApplicantInfoModal;
