import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react'; // Added icons
import { useApplicationStore } from '../store/applicationStore';
import AddOccupantModal from '../components/AddOccupantModal';
import type { OccupantFormData } from '../components/AddOccupantModal';

interface OccupantsStepProps {
    onNext: () => void;
}

const OccupantsStep: React.FC<OccupantsStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();
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
        <div className="w-full max-w-5xl mx-auto">
            {/* Modal */}
            <AddOccupantModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                onSave={handleSaveOccupant}
            />

            <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-2">Additional occupants</h2>
            <p className="text-center text-gray-600 mb-8">
                Include any co-occupants who will be living with the main applicant, if applicable.
            </p>

            <div className="bg-[#F0F0F6] rounded-[1.5rem] p-4 sm:p-8 shadow-sm flex flex-col items-center justify-center gap-6 min-h-[300px]">

                {/* List of added occupants */}
                {formData.occupants && formData.occupants.length > 0 && (
                    <div className="w-full max-w-2xl mb-4 grid gap-4">
                        {formData.occupants.map((occ: OccupantFormData & { id: string }, index: number) => (
                            <div key={occ.id} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                        {occ.firstName?.[0]}{occ.lastName?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{occ.firstName} {occ.lastName}</p>
                                        <p className="text-sm text-gray-500">{occ.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        const newOccupants = [...formData.occupants];
                                        newOccupants.splice(index, 1);
                                        updateFormData('occupants', newOccupants);
                                    }}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button
                        onClick={handleAddClick}
                        className="bg-[#447D7C] text-white border border-white/20 px-6 py-3 rounded-full text-sm font-medium hover:bg-[#325c5b] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        Add an Occupant
                        <Plus className="w-4 h-4 rounded-full border border-white p-0.5" />
                    </button>

                    <button
                        onClick={onNext}
                        className="bg-[#447D7C] text-white border border-white/20 px-8 py-3 rounded-full text-sm font-medium hover:bg-[#325c5b] transition-colors w-full sm:w-auto"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OccupantsStep;
