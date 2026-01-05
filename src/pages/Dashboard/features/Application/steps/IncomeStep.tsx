import React, { useState } from 'react';
import { Plus, Trash2, AlertTriangle, Wallet, Pencil } from 'lucide-react';
import { useApplicationStore } from '../store/applicationStore';
import AddIncomeModal, { type IncomeFormData } from '../components/AddIncomeModal';
import CustomTextBox from '../../../components/CustomTextBox';

interface IncomeStepProps {
    onNext: () => void;
}

const IncomeCard: React.FC<{ income: IncomeFormData & { id: string }; onDelete: () => void; onEdit: () => void }> = ({ income, onDelete, onEdit }) => {
    const formatDate = (dateVal: any) => {
        if (!dateVal) return '----';
        const date = new Date(dateVal);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    return (
        <div className="bg-[#F0F0F6] rounded-[2.5rem] overflow-hidden shadow-sm w-full font-sans mb-6 relative group">
            {/* Delete Button - Absolute positioned or in layout? 
                 The image doesn't show a delete button, but we need one. 
                 I'll place it top right or float it. 
                 Actually, let's put it top right inside the card. */}
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
                    {/* Current Badge */}
                    {income.currentEmployment && (
                        <div className="absolute top-4 right-4 bg-[#34D399] text-white text-xs font-medium px-3 py-1 rounded-full">
                            Current
                        </div>
                    )}

                    <Wallet className="w-12 h-12 text-[#3A6D6C]" strokeWidth={1.5} />
                </div>

                {/* Pills Row */}
                <div className="flex flex-wrap gap-4 justify-center w-full">
                    {/* Amount */}
                    <CustomTextBox
                        value={`₹ ${income.monthlyAmount}`}
                        className="bg-[#E3E8E3] px-6 py-2 rounded-full min-w-[120px] justify-center"
                        valueClassName="font-semibold text-black text-lg text-center w-full"
                    />

                    {/* Type */}
                    <CustomTextBox
                        value={income.incomeType}
                        className="bg-[#E3E8E3] px-6 py-2 rounded-full min-w-[120px] justify-center"
                        valueClassName="font-semibold text-black text-base text-center w-full"
                    />

                    {/* Office */}
                    <CustomTextBox
                        value={income.office}
                        className="bg-[#E3E8E3] px-6 py-2 rounded-full min-w-[120px] justify-center"
                        valueClassName="font-semibold text-black text-base text-center w-full"
                    />

                    {/* Company */}
                    <CustomTextBox
                        value={income.company}
                        className="bg-[#E3E8E3] px-6 py-2 rounded-full min-w-[120px] justify-center"
                        valueClassName="font-semibold text-black text-base text-center w-full"
                    />
                </div>
            </div>

            {/* Bottom Section - Teal */}
            <div className="bg-[#3A6D6C] p-4 rounded-b-[2rem]">
                <div className='bg-[#FFFFFF] p-4 flex flex-col gap-4 rounded-[2rem]'>
                    {/* Row 1: Address */}
                    <CustomTextBox
                        value={
                            <span className="text-black text-sm font-medium truncate w-full">
                                <span className="font-semibold">Office</span> - {income.address}
                            </span>
                        }
                        className="bg-[#E3E8E3] rounded-full px-8 py-3 w-full justify-start"
                        valueClassName="w-full"
                    />

                    {/* Row 2: Phone, Start, End */}
                    <CustomTextBox
                        value={
                            <div className="flex flex-wrap items-center justify-between gap-4 w-full text-black text-sm font-medium">
                                <div className="whitespace-nowrap">
                                    <span className="font-semibold">Work Phone</span> - {income.companyPhone}
                                </div>
                                <div className="hidden sm:block w-px h-4 bg-black"></div>
                                <div className="whitespace-nowrap">
                                    <span className="font-semibold">Start date</span> - {formatDate(income.startDate)}
                                </div>
                                <div className="hidden sm:block w-px h-4 bg-black"></div>
                                <div className="whitespace-nowrap">
                                    <span className="font-semibold">End date</span> - {income.currentEmployment ? '----' : formatDate(income.endDate)}
                                </div>
                            </div>
                        }
                        className="bg-[#E3E8E3] rounded-full px-8 py-3 w-full justify-start"
                        valueClassName="w-full"
                    />

                    {/* Row 3: Supervisor */}
                    <CustomTextBox
                        value={
                            <div className="flex flex-wrap items-center justify-between gap-4 w-full text-black text-sm font-medium">
                                <div className="whitespace-nowrap">
                                    <span className="font-semibold">Supervised by</span> - {income.supervisorName}
                                </div>
                                <div className="hidden sm:block w-px h-4 bg-black"></div>
                                <div className="whitespace-nowrap">
                                    <span className="font-semibold">Email</span> - {income.supervisorEmail}
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

const IncomeStep: React.FC<IncomeStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();
    const [isAdding, setIsAdding] = useState(false);

    const [editingIncomeIndex, setEditingIncomeIndex] = useState<number | null>(null);

    const handleAddClick = () => {
        setEditingIncomeIndex(null);
        setIsAdding(true);
    };

    const handleEditClick = (index: number) => {
        setEditingIncomeIndex(index);
        setIsAdding(true);
    };

    const handleSaveIncome = (data: IncomeFormData) => {
        if (editingIncomeIndex !== null) {
            // Edit existing
            const updatedIncomes = [...(formData.incomes || [])];
            updatedIncomes[editingIncomeIndex] = {
                ...updatedIncomes[editingIncomeIndex],
                ...data
            };
            updateFormData('incomes', updatedIncomes);
        } else {
            // Add new
            const income: IncomeFormData & { id: string } = {
                id: Math.random().toString(36).substr(2, 9),
                ...data
            };
            const updatedIncomes = [...(formData.incomes || []), income];
            updateFormData('incomes', updatedIncomes);
        }
        setIsAdding(false);
        setEditingIncomeIndex(null);
    };

    const handleDeleteIncome = (index: number) => {
        const newIncomes = [...(formData.incomes || [])];
        newIncomes.splice(index, 1);
        updateFormData('incomes', newIncomes);
    };

    const incomes = formData.incomes || [];

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            {/* Modal */}
            <AddIncomeModal
                isOpen={isAdding}
                onClose={() => {
                    setIsAdding(false);
                    setEditingIncomeIndex(null);
                }}
                onSave={handleSaveIncome}
                initialData={editingIncomeIndex !== null && incomes[editingIncomeIndex] ? incomes[editingIncomeIndex] : undefined}
            />

            <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-2">Income</h2>
            <p className="text-center text-gray-600 mb-8">
                Provide the information about the employment history and other income types below.
            </p>

            {/* Warning Banner - Only show if no incomes */}
            {incomes.length === 0 && (
                <div className="bg-[#D5E4D3] border border-[#A0B4B0] rounded-xl shadow-md p-2 mb-8 flex flex-col items-center justify-center gap-4 text-[#3A5B58] max-w-lg mx-auto w-full">
                    <AlertTriangle className="w-6 h-6" strokeWidth={1.5} />
                    <span className="font-medium text-md">A minimum of 1 record is required for this application.</span>
                </div>
            )}

            {/* Incomes List */}
            {incomes.length > 0 && (
                <div className="w-full max-w-3xl mb-8">
                    {incomes.map((inc: IncomeFormData & { id: string }, index: number) => (
                        <IncomeCard
                            key={inc.id}
                            income={inc}
                            onDelete={() => handleDeleteIncome(index)}
                            onEdit={() => handleEditClick(index)}
                        />
                    ))}
                </div>
            )}

            <div className="bg-[#F0F0F6] rounded-[2rem] p-4 sm:p-8 shadow-sm flex flex-col items-center justify-center gap-6 max-w-3xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-10 w-full sm:w-auto">
                    {incomes.length === 0 && (
                        <button
                            onClick={handleAddClick}
                            className="bg-[#3A6D6C] text-white border border-white/20 px-6 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            Add Income
                            <Plus className="w-4 h-4 rounded-full border border-white p-0.5" />
                        </button>
                    )}

                    <button
                        onClick={onNext}
                        disabled={incomes.length === 0}
                        className={`bg-[#3A6D6C] text-white border border-white/20 px-16 py-3 rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors w-full sm:w-auto ${incomes.length > 0 ? '' : 'opacity-50 cursor-not-allowed bg-gray-400 border-gray-400 hover:bg-gray-400'}`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IncomeStep;
