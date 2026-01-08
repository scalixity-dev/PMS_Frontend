import React, { useState } from 'react';
import { Plus, Trash2, Users, AlertCircle, Pencil } from 'lucide-react';
import { useUserApplicationStore, type EmergencyContactFormData } from '../store/userApplicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import AddEmergencyContactModal from '../../../../Dashboard/features/Application/components/AddEmergencyContactModal';

const ContactItem: React.FC<{ contact: EmergencyContactFormData & { id: string }; onDelete: () => void; onEdit: () => void }> = ({ contact, onDelete, onEdit }) => {
    return (
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[12px] bg-[#F3F4F6] flex items-center justify-center text-[#71717A] group-hover:bg-[#7ED957]/10 group-hover:text-[#7ED957] transition-colors">
                    <Users size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold text-[#1A1A1A] text-sm">{contact.fullName}</p>
                    <p className="text-[11px] text-[#ADADAD]">{contact.relationship} • {contact.phoneNumber}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onEdit}
                    className="text-gray-300 hover:text-[#7ED957] transition-colors p-2"
                >
                    <Pencil size={16} />
                </button>
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

interface EmergencyContactStepProps {
    onNext: () => void;
}

const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const contacts = formData.emergencyContacts || [];

    const handleSaveContact = (data: EmergencyContactFormData) => {
        if (editingIndex !== null) {
            const updated = [...contacts];
            updated[editingIndex] = { ...updated[editingIndex], ...data };
            updateFormData('emergencyContacts', updated);
        } else {
            const contact = { id: Math.random().toString(36).substr(2, 9), ...data };
            updateFormData('emergencyContacts', [...contacts, contact]);
        }
        setIsAdding(false);
        setEditingIndex(null);
    };

    const handleDeleteContact = (index: number) => {
        const updated = [...contacts];
        updated.splice(index, 1);
        updateFormData('emergencyContacts', updated);
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Emergency Contact</h2>
                <p className="text-gray-400 text-sm">Who should we contact in case of an emergency?</p>
            </div>

            <div className="min-h-[250px] flex flex-col items-center">
                {contacts.length === 0 && (
                    <div className="bg-[#7ED957]/10 border border-[#7ED957]/20 rounded-full py-3 px-6 mb-6 flex items-center gap-2 text-[#7ED957] text-sm font-medium">
                        <AlertCircle size={16} />
                        <span>A minimum of 1 contact is required</span>
                    </div>
                )}

                <div className="w-full grid grid-cols-1 gap-4 mb-8">
                    {contacts.map((contact: any, index: number) => (
                        <ContactItem
                            key={contact.id}
                            contact={contact}
                            onDelete={() => handleDeleteContact(index)}
                            onEdit={() => { setEditingIndex(index); setIsAdding(true); }}
                        />
                    ))}

                    {contacts.length === 0 && (
                        <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl py-12 flex flex-col items-center justify-center text-[#ADADAD]">
                            <Users size={40} strokeWidth={1.5} className="mb-3" />
                            <p className="text-sm font-medium">No emergency contacts added yet</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => { setEditingIndex(null); setIsAdding(true); }}
                        disabled={contacts.length >= 2}
                        className={`flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#7ED957] text-[#7ED957] font-bold text-sm uppercase transition-all ${contacts.length >= 2 ? 'opacity-40 cursor-not-allowed border-gray-300 text-gray-400' : 'hover:bg-[#7ED957]/5'}`}
                    >
                        <span>Add Contact</span>
                        <Plus size={18} />
                    </button>

                    <PrimaryActionButton
                        onClick={onNext}
                        disabled={contacts.length === 0}
                        text="Next"
                        className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all ${contacts.length > 0
                                ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                                : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                            }`}
                    />
                </div>
            </div>

            <AddEmergencyContactModal
                isOpen={isAdding}
                onClose={() => { setIsAdding(false); setEditingIndex(null); }}
                onSave={handleSaveContact}
                initialData={editingIndex !== null ? contacts[editingIndex] : undefined}
            />
        </div>
    );
};

export default EmergencyContactStep;
