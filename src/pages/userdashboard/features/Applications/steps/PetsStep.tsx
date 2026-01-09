import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Dog } from 'lucide-react';
import { useUserApplicationStore } from '../store/userApplicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import UserAddPetModal, { type PetFormData } from '../components/UserAddPetModal';

const PetItem: React.FC<{ pet: PetFormData & { id: string }; onDelete: () => void }> = ({ pet, onDelete }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    useEffect(() => {
        if (pet.photo instanceof File) {
            const url = URL.createObjectURL(pet.photo);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [pet.photo]);

    return (
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#F3F4F6] overflow-hidden flex items-center justify-center text-[#ADADAD] group-hover:bg-[#7ED957]/10 transition-colors">
                    {imageUrl ? (
                        <img src={imageUrl} alt={pet.name} className="w-full h-full object-cover" />
                    ) : (
                        <Dog size={20} strokeWidth={1.5} />
                    )}
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold text-[#1A1A1A] text-sm">{pet.name}</p>
                    <p className="text-[11px] text-[#ADADAD]">{pet.type} • {pet.breed} • {pet.weight} lbs</p>
                </div>
            </div>
            <button
                onClick={onDelete}
                className="text-gray-300 hover:text-red-500 transition-colors p-2"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
};

interface PetsStepProps {
    onNext: () => void;
}

const PetsStep: React.FC<PetsStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();
    const [isAdding, setIsAdding] = useState(false);

    const handleSavePet = (data: PetFormData) => {
        const newPet = {
            id: Math.random().toString(36).substr(2, 9),
            ...data
        };
        const currentPets = formData.pets || [];
        updateFormData('pets', [...currentPets, newPet]);
        setIsAdding(false);
    };

    const handleDeletePet = (id: string) => {
        const currentPets = formData.pets || [];
        updateFormData('pets', currentPets.filter((p) => p.id !== id));
    };

    const pets = formData.pets || [];

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Pets</h2>
                <p className="text-gray-400 text-sm">Provide information about your furry friends.</p>
            </div>

            <div className="min-h-[250px] flex flex-col items-center">
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {pets.map((pet) => (
                        <PetItem key={pet.id} pet={pet} onDelete={() => handleDeletePet(pet.id)} />
                    ))}

                    {pets.length === 0 && (
                        <div className="col-span-full border-2 border-dashed border-[#E5E7EB] rounded-2xl py-12 flex flex-col items-center justify-center text-[#ADADAD]">
                            <Dog size={40} strokeWidth={1.5} className="mb-3" />
                            <p className="text-sm font-medium">No pets added yet</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#7ED957] text-[#7ED957] font-bold text-sm uppercase hover:bg-[#7ED957]/5 transition-all"
                    >
                        <span>Add Pet</span>
                        <Plus size={18} />
                    </button>

                    <PrimaryActionButton
                        onClick={onNext}
                        text="Next"
                        className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all ${true
                            ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                            : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                            }`}
                    />
                </div>
            </div>

            <UserAddPetModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                onSave={handleSavePet}
            />
        </div>
    );
};

export default PetsStep;
