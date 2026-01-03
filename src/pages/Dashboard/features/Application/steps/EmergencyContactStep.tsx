import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Users, Pencil } from 'lucide-react';
import { useApplicationStore, type EmergencyContactFormData } from '../store/applicationStore';
import AddEmergencyContactModal from '../components/AddEmergencyContactModal';
import CustomTextBox from '../../../components/CustomTextBox';

interface EmergencyContactStepProps {
    onNext: () => void;
}

const EmergencyContactCard: React.FC<{ contact: EmergencyContactFormData & { id: string }; onDelete: () => void; onEdit: () => void }> = ({ contact, onDelete, onEdit }) => {
    return (
        <div className="bg-[#F0F0F6] rounded-[2.5rem] overflow-hidden shadow-sm w-full font-sans mb-6 relative group">
            {/* Action Buttons Pill */}
            <div className="absolute top-6 right-6 flex items-center bg-[#E3EBDE] backdrop-blur-md rounded-full px-2 py-1.5 shadow-sm border border-white/40 z-10 gap-2">
                <button
                    onClick={onEdit}
                    className="p-1.5 text-gray-500 hover:text-[#3A6D6C] hover:bg-white/60 rounded-full transition-all"
                    title="Edit"
                >
                    <Pencil size={16} strokeWidth={2} />
                </button>
                <div className="w-px h-4 bg-gray-400/50"></div>
                <button
                    onClick={onDelete}
                    className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-white/60 rounded-full transition-all"
                    title="Delete"
                >
                    <Trash2 size={16} strokeWidth={2} />
                </button>
            </div>

            {/* Top Section - Grayish */}
            <div className="p-4 sm:p-8 sm:pb-10 flex flex-col items-center gap-6 sm:gap-8">

                {/* Icon Box */}
                <div className="bg-[#DDE5E3] w-48 h-32 rounded-3xl flex items-center justify-center relative">
                    <Users className="w-12 h-12 text-[#3A6D6C]" strokeWidth={1.5} />
                </div>

                {/* Info */}
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-xl font-bold text-black">{contact.fullName}</h3>
                    <div className="bg-[#E3E8E3] px-4 py-1.5 rounded-full">
                        <span className="text-black font-medium">{contact.relationship}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Section - Teal */}
            <div className="bg-[#3A6D6C] p-4 rounded-b-[2rem]">
                <div className='bg-[#FFFFFF] p-4 flex flex-col gap-4 rounded-[2rem]'>
                    {/* Row 1: Contact Details */}
                    <CustomTextBox
                        value={
                            <div className="flex flex-wrap items-center justify-between gap-4 w-full text-black text-sm font-medium">
                                <div className="whitespace-nowrap">
                                    <span className="font-semibold">Phone</span> - {contact.phoneNumber}
                                </div>
                                <div className="hidden sm:block w-px h-4 bg-black"></div>
                                <div className="whitespace-nowrap">
                                    <span className="font-semibold">Email</span> - {contact.email}
                                </div>
                            </div>
                        }
                        className="bg-[#E3E8E3] rounded-full px-8 py-3 w-full justify-start"
                        valueClassName="w-full"
                    />
                </div>
            </div>
        </div>
    );
};

const EmergencyContactStep: React.FC<EmergencyContactStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();
    const [isAdding, setIsAdding] = useState(false);
    const [editingContactIndex, setEditingContactIndex] = useState<number | null>(null);

    const handleAddClick = () => {
        setEditingContactIndex(null);
        setIsAdding(true);
    };

    const handleEditClick = (index: number) => {
        setEditingContactIndex(index);
        setIsAdding(true);
    };

    const handleSaveContact = (data: EmergencyContactFormData) => {
        if (editingContactIndex !== null) {
            // Edit existing
            const updatedContacts = [...(formData.emergencyContacts || [])];
            updatedContacts[editingContactIndex] = {
                ...updatedContacts[editingContactIndex],
                ...data
            };
            updateFormData('emergencyContacts', updatedContacts);
        } else {
            // Add new
            const contact: EmergencyContactFormData & { id: string } = {
                id: Math.random().toString(36).substr(2, 9),
                ...data
            };
            const updatedContacts = [...(formData.emergencyContacts || []), contact];
            updateFormData('emergencyContacts', updatedContacts);
        }
        setIsAdding(false);
        setEditingContactIndex(null);
    };

    const handleDeleteContact = (index: number) => {
        const newContacts = [...(formData.emergencyContacts || [])];
        newContacts.splice(index, 1);
        updateFormData('emergencyContacts', newContacts);
    };

    const contacts = formData.emergencyContacts || [];

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            {/* Modal */}
            <AddEmergencyContactModal
                isOpen={isAdding}
                onClose={() => {
                    setIsAdding(false);
                    setEditingContactIndex(null);
                }}
                onSave={handleSaveContact}
                initialData={editingContactIndex !== null && contacts[editingContactIndex] ? contacts[editingContactIndex] : undefined}
            />

            <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-2">Emergency contact</h2>
            <p className="text-center text-gray-600 mb-8">
                Provide the information about the emergency contacts.
            </p>

            {/* Warning Banner - Only show if no contacts */}
            {contacts.length === 0 && (
                <div className="bg-[#D5E4D3] border border-[#A0B4B0] rounded-xl shadow-md p-2 mb-8 flex flex-col items-center justify-center gap-4 text-[#3A5B58] max-w-lg mx-auto w-full">
                    <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
                    <span className="font-medium text-md">A minimum of 1 record is required for this application.</span>
                </div>
            )}

            {/* Contacts List */}
            {contacts.length > 0 && (
                <div className="w-full max-w-3xl mb-8">
                    {contacts.map((contact, index) => (
                        <EmergencyContactCard
                            key={contact.id}
                            contact={contact}
                            onDelete={() => handleDeleteContact(index)}
                            onEdit={() => handleEditClick(index)}
                        />
                    ))}
                </div>
            )}

            <div className="bg-[#F0F0F6] rounded-[2rem] p-4 sm:p-8 shadow-sm flex flex-col items-center justify-center gap-6 max-w-3xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full sm:w-auto">
                    <button
                        onClick={handleAddClick}
                        disabled={contacts.length >= 2}
                        className={`bg-[#3A6D6C] text-white border border-white/20 px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto ${contacts.length >= 2 ? 'opacity-50 cursor-not-allowed bg-gray-400 border-gray-400 hover:bg-gray-400' : ''}`}
                    >
                        Add emergency Contact
                        <Plus className="w-4 h-4 rounded-full border border-white p-0.5" />
                    </button>

                    <button
                        onClick={onNext}
                        disabled={contacts.length === 0}
                        className={`bg-[#3A6D6C] text-white border border-white/20 px-16 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors w-full sm:w-auto ${contacts.length > 0 ? '' : 'opacity-50 cursor-not-allowed bg-gray-400 border-gray-400 hover:bg-gray-400'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EmergencyContactStep;
