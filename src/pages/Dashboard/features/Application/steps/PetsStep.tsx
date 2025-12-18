import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import AddPetModal, { type PetFormData } from '../components/AddPetModal';
import { useApplicationStore } from '../store/applicationStore';

interface PetsStepProps {
    onNext: () => void;
}

const PetItem: React.FC<{ pet: PetFormData & { id: string }; onDelete: () => void }> = ({ pet, onDelete }) => {
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (pet.photo instanceof File) {
            const url = URL.createObjectURL(pet.photo);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        } else {
            setImageUrl(null);
        }
    }, [pet.photo]);

    return (
        <div className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={pet.name}
                        className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <span className="text-xs">No img</span>
                    </div>
                )}
                <div>
                    <p className="font-bold text-gray-900">{pet.name}</p>
                    <p className="text-sm text-gray-500">{pet.type} • {pet.breed}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">{pet.weight}</span>
                <button
                    onClick={onDelete}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
};

const PetsStep: React.FC<PetsStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();
    const [isAdding, setIsAdding] = useState(false);

    const handleSavePet = (data: PetFormData) => {
        const newPet = {
            id: Math.random().toString(36).substr(2, 9),
            ...data
        };
        const currentPets = formData.pets || [];
        updateFormData('pets', [...currentPets, newPet]);
    };

    const handleDeletePet = (id: string) => {
        const currentPets = formData.pets || [];
        const updatedPets = currentPets.filter((p) => p.id !== id);
        updateFormData('pets', updatedPets);
    };

    const pets = formData.pets || [];

    return (
        <div className="w-full max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-2">Pets</h2>
            <p className="text-center text-gray-600 mb-8">
                Provide the information about your pets below if you have any.
            </p>

            <div className="bg-[#F0F0F6] rounded-full p-8 shadow-sm flex flex-col items-center justify-center gap-6 max-w-3xl mx-auto">

                {/* List of Pets */}
                {pets.length > 0 && (
                    <div className="w-full max-w-2xl grid gap-4">
                        {pets.map((pet: PetFormData & { id: string }) => (
                            <PetItem
                                key={pet.id}
                                pet={pet}
                                onDelete={() => handleDeletePet(pet.id)}
                            />
                        ))}
                    </div>
                )}

                <div className="flex gap-10">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#3A6D6C] text-white border border-white/20 px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                    >
                        Add a Pet
                        <Plus className="w-4 h-4 rounded-full border border-white p-0.5" />
                    </button>

                    <button
                        onClick={onNext}
                        className="bg-[#3A6D6C] text-white border border-white/20 px-16 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>

            <AddPetModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                onSave={handleSavePet}
            />
        </div>
    );
};

export default PetsStep;
