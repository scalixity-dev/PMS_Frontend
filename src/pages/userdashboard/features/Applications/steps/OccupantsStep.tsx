import React, { useState } from 'react';
import { Plus, Trash2, User } from 'lucide-react';
import { useUserApplicationStore } from '../store/userApplicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import UserAddOccupantModal, { type OccupantFormData } from '../components/UserAddOccupantModal';

// I'll reuse the logic but restyle the container
interface OccupantsStepProps {
    onNext: () => void;
}

const OccupantsStep: React.FC<OccupantsStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();
    const [isAdding, setIsAdding] = useState(false);

    const handleAddClick = () => {
        setIsAdding(true);
    };

    const handleSaveOccupant = (data: OccupantFormData) => {
        const occupant: OccupantFormData & { id: string } = {
            id: Math.random().toString(36).substr(2, 9),
            ...data
        };
        const updatedOccupants = [...(formData.occupants || []), occupant];
        updateFormData('occupants', updatedOccupants);
        setIsAdding(false);
    };

    return (
        <div className="w-full">
            <UserAddOccupantModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                onSave={handleSaveOccupant}
            />

            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Additional Occupants</h2>
                <p className="text-gray-400 text-sm">Include anyone who will be living with you.</p>
            </div>

            <div className="min-h-[250px] flex flex-col items-center">
                {/* List of added occupants */}
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {formData.occupants?.map((occ, index) => (
                        <div key={occ.id} className="bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#71717A] group-hover:bg-[#7ED957]/10 group-hover:text-[#7ED957] transition-colors font-bold text-sm">
                                    {occ.firstName?.[0]}{occ.lastName?.[0]}
                                </div>
                                <div className="flex flex-col">
                                    <p className="font-semibold text-[#1A1A1A] text-sm">{occ.firstName} {occ.lastName}</p>
                                    <p className="text-[11px] text-[#ADADAD]">{occ.relationship} • {occ.email}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    const newOccupants = [...formData.occupants];
                                    newOccupants.splice(index, 1);
                                    updateFormData('occupants', newOccupants);
                                }}
                                className="text-gray-300 hover:text-red-500 transition-colors p-2"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    {/* Add Empty State / Add Card */}
                    {(!formData.occupants || formData.occupants.length === 0) && (
                        <div className="col-span-full border-2 border-dashed border-[#E5E7EB] rounded-2xl py-12 flex flex-col items-center justify-center text-[#ADADAD]">
                            <User size={40} strokeWidth={1.5} className="mb-3" />
                            <p className="text-sm font-medium">No occupants added yet</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleAddClick}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#7ED957] text-[#7ED957] font-bold text-sm uppercase hover:bg-[#7ED957]/5 transition-all"
                    >
                        <span>Add Occupant</span>
                        <Plus size={18} />
                    </button>

                    <PrimaryActionButton
                        onClick={onNext}
                        text="Next"
                        className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all ${true // It's never disabled currently, but keeping pattern
                            ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                            : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                            }`}
                    />
                </div>
            </div>
        </div>
    );
};

export default OccupantsStep;
