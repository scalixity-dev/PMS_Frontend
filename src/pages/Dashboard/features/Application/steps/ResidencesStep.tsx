import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { useApplicationStore } from '../store/applicationStore';
import AddResidenceModal, { type ResidenceFormData } from '../components/AddResidenceModal';
import CustomTextBox from '../../../components/CustomTextBox';

interface ResidencesStepProps {
    onNext: () => void;
}


const ResidenceItem: React.FC<{ residence: ResidenceFormData & { id: string }; onDelete: () => void }> = ({ residence, onDelete }) => {
    // Helper to format date if it's a date object or string
    const formatDate = (dateVal: any) => {
        if (!dateVal) return '-';
        const date = new Date(dateVal);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="bg-[#F0F0F6] rounded-3xl overflow-hidden shadow-sm w-full font-sans border border-gray-100">
            {/* Top Section - Address & Details */}
            <div className="p-6 pb-8 flex flex-col gap-6 items-center">

                {/* Address Pill */}
                <CustomTextBox
                    value={`${residence.address}, ${residence.city}, ${residence.state} ${residence.zip}`}
                    className="w-full bg-opacity-100 py-3 rounded-full justify-center"
                    valueClassName="text-sm font-semibold text-[#2c3e50] text-center w-full"
                />

                {/* Details Pills Row */}
                <div className="flex flex-wrap gap-4 justify-center">
                    {residence.rentAmount && (
                        <CustomTextBox
                            value={`₹ ${residence.rentAmount}`}
                            className="bg-opacity-100 rounded-full min-w-[80px] justify-center"
                            valueClassName="text-sm font-semibold text-[#2c3e50] text-center w-full"
                        />
                    )}
                    <CustomTextBox
                        value={residence.residencyType || 'Rent'}
                        className="bg-opacity-100 rounded-full min-w-[80px] justify-center"
                        valueClassName="text-sm font-semibold text-[#2c3e50] text-center w-full"
                    />
                    {/* Edit Button */}
                    <button className="focus:outline-none">
                        <CustomTextBox
                            value="Edit"
                            className="bg-opacity-100 rounded-full min-w-[80px] justify-center cursor-pointer hover:bg-opacity-80 transition-all"
                            valueClassName="text-sm font-semibold text-[#2c3e50] text-center w-full"
                        />
                    </button>
                    {/* Delete Button */}
                    <button onClick={onDelete} className="focus:outline-none">
                        <CustomTextBox
                            value={<Trash2 size={16} className="text-red-500" /> as any}
                            className="bg-opacity-100 rounded-full px-4 justify-center cursor-pointer hover:bg-opacity-80 transition-all"
                            valueClassName="flex justify-center w-full"
                        />
                    </button>
                </div>
            </div>

            {/* Bottom Section - Teal Info */}
            <div className="bg-[#3A6D6C] p-6 px-10 flex items-center justify-center gap-10">
                <div className="bg-white rounded-[2rem] px-12 py-4 flex flex-col items-center justify-center min-w-[140px]">
                    <span className="text-xs font-bold text-[#2c3e50] mb-1">Move in date</span>
                    <span className="text-sm font-semibold text-[#2c3e50]">{formatDate(residence.moveInDate)}</span>
                </div>

                <div className="bg-white rounded-[2rem] px-12 py-4 flex flex-col items-center justify-center min-w-[140px]">
                    <span className="text-xs font-bold text-[#2c3e50] mb-1">Landlord</span>
                    <span className="text-sm font-semibold text-[#2c3e50]">{residence.landlordPhone || '-'}</span>
                </div>
            </div>
        </div>
    );
};

const ResidencesStep: React.FC<ResidencesStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();
    const [isAdding, setIsAdding] = useState(false);

    const residences = formData.residences || [];

    const handleSaveResidence = (data: ResidenceFormData) => {
        const newResidence = {
            id: Math.random().toString(36).substr(2, 9),
            ...data
        };
        updateFormData('residences', [...residences, newResidence]);
    };

    const handleDeleteResidence = (id: string) => {
        const updatedResidences = residences.filter((r) => r.id !== id);
        updateFormData('residences', updatedResidences);
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-2">Residential history</h2>
            <p className="text-center text-gray-600 mb-8">
                Provide information about the residential history below.
            </p>

            {/* Warning Banner - Only show if no residences */}
            {residences.length === 0 && (
                <div className="bg-[#FFFBE6] border border-[#FFE58F] rounded-full p-4 mb-8 flex items-center justify-center gap-3 text-[#FA8C16] max-w-lg mx-auto w-full">
                    <AlertTriangle className="w-5 h-5 fill-[#FA8C16] text-[#FFFBE6]" />
                    <span className="font-medium">A minimum of 1 record is required for this application.</span>
                </div>
            )}

            {/* List of Residences */}
            {residences.length > 0 && (
                <div className="w-full max-w-3xl grid gap-6 mb-8">
                    {residences.map((res: ResidenceFormData & { id: string }) => (
                        <ResidenceItem
                            key={res.id}
                            residence={res}
                            onDelete={() => handleDeleteResidence(res.id)}
                        />
                    ))}
                </div>
            )}

            {/* Button Container - Reverted to 'Before' Style (Grey Box) */}
            <div className="bg-[#F0F0F6] rounded-full p-8 shadow-sm flex flex-col items-center justify-center gap-6 max-w-3xl mx-auto w-full mt-8">
                <div className="flex gap-10">
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-[#3A6D6C] text-white border border-white/20 px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-2"
                    >
                        Add a Residence
                        <Plus className="w-4 h-4 rounded-full border border-white p-0.5" />
                    </button>

                    <button
                        onClick={onNext}
                        disabled={residences.length === 0}
                        className={`bg-[#3A6D6C] text-white border border-white/20 px-16 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors ${residences.length > 0 ? '' : 'opacity-50 cursor-not-allowed bg-gray-400 border-gray-400 hover:bg-gray-400'}`}
                    >
                        Next
                    </button>
                </div>
            </div>

            <AddResidenceModal
                isOpen={isAdding}
                onClose={() => setIsAdding(false)}
                onSave={handleSaveResidence}
            />
        </div>
    );
};

export default ResidencesStep;
