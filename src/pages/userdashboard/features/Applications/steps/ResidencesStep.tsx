import React, { useState } from 'react';
import { Plus, Trash2, Home, AlertCircle } from 'lucide-react';
import { useUserApplicationStore } from '../store/userApplicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import UserAddResidenceModal, { type ResidenceFormData } from '../components/UserAddResidenceModal';

const ResidenceItem: React.FC<{ residence: ResidenceFormData & { id: string }; onDelete: () => void }> = ({ residence, onDelete }) => {
    const formatDate = (dateVal: any) => {
        if (!dateVal) return '-';
        if (typeof dateVal === 'string' && dateVal.includes('-')) {
            const [year, month, day] = dateVal.split('-').map(Number);
            return new Date(year, month - 1, day).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
        const date = new Date(dateVal);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[12px] bg-[#F3F4F6] flex items-center justify-center text-[#71717A] group-hover:bg-[#7ED957]/10 group-hover:text-[#7ED957] transition-colors">
                    <Home size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold text-[#1A1A1A] text-sm">{residence.address}</p>
                    <p className="text-[11px] text-[#ADADAD]">{residence.city}, {residence.state} • {residence.residencyType} • Moved in {formatDate(residence.moveInDate)}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden sm:flex flex-col items-end text-right mr-2">
                    <p className="text-[11px] font-bold text-[#1A1A1A]">₹{residence.rentAmount}/mo</p>
                    <p className="text-[9px] text-[#ADADAD]">Rent</p>
                </div>
                <button
                    onClick={onDelete}
                    className="text-gray-300 hover:text-red-500 transition-colors p-2"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

interface ResidencesStepProps {
    onNext: () => void;
}

const ResidencesStep: React.FC<ResidencesStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();
    const [isAdding, setIsAdding] = useState(false);

    const residences = formData.residences || [];

    const handleSaveResidence = (data: ResidenceFormData) => {
        const newResidence = {
            id: Math.random().toString(36).substr(2, 9),
            ...data
        };
        updateFormData('residences', [...residences, newResidence]);
        setIsAdding(false);
    };

    const handleDeleteResidence = (id: string) => {
        updateFormData('residences', residences.filter((r) => r.id !== id));
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Residential History</h2>
                <p className="text-gray-400 text-sm">Provide your previous living addresses.</p>
            </div>

            <div className="min-h-[250px] flex flex-col items-center">
                {residences.length === 0 && (
                    <div className="bg-[#7ED957]/10 border border-[#7ED957]/20 rounded-full py-3 px-6 mb-6 flex items-center gap-2 text-[#7ED957] text-sm font-medium">
                        <AlertCircle size={16} />
                        <span>A minimum of 1 record is required</span>
                    </div>
                )}

                <div className="w-full grid grid-cols-1 gap-4 mb-8">
                    {residences.map((res: any) => (
                        <ResidenceItem key={res.id} residence={res} onDelete={() => handleDeleteResidence(res.id)} />
                    ))}

                    {residences.length === 0 && (
                        <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl py-12 flex flex-col items-center justify-center text-[#ADADAD]">
                            <Home size={40} strokeWidth={1.5} className="mb-3" />
                            <p className="text-sm font-medium">No residential history added yet</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#7ED957] text-[#7ED957] font-bold text-sm uppercase hover:bg-[#7ED957]/5 transition-all"
                    >
                        <span>Add Address</span>
                        <Plus size={18} />
                    </button>

                    <PrimaryActionButton
                        onClick={onNext}
                        disabled={residences.length === 0}
                        text="Next"
                        className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all ${residences.length > 0
                            ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                            : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                            }`}
                    />
                </div>
            </div>

            <UserAddResidenceModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                onSave={handleSaveResidence}
            />
        </div>
    );
};

export default ResidencesStep;
