import React, { useState } from 'react';
import { Plus, Trash2, Wallet, AlertCircle, Pencil } from 'lucide-react';
import { useUserApplicationStore } from '../store/userApplicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import AddIncomeModal, { type IncomeFormData } from '../../../../Dashboard/features/Application/components/AddIncomeModal';

const IncomeItem: React.FC<{ income: IncomeFormData & { id: string }; onDelete: () => void; onEdit: () => void }> = ({ income, onDelete, onEdit }) => {
    return (
        <div className="bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[12px] bg-[#F3F4F6] flex items-center justify-center text-[#71717A] group-hover:bg-[#7ED957]/10 group-hover:text-[#7ED957] transition-colors">
                    <Wallet size={20} strokeWidth={1.5} />
                </div>
                <div className="flex flex-col">
                    <p className="font-semibold text-[#1A1A1A] text-sm">{income.incomeType} • {income.company}</p>
                    <p className="text-[11px] text-[#ADADAD]">{income.office} • {income.currentEmployment ? 'Current' : 'Previous'}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end text-right mr-4">
                    <p className="text-[11px] font-bold text-[#1A1A1A]">₹{income.monthlyAmount}/mo</p>
                    <p className="text-[9px] text-[#ADADAD]">Salary</p>
                </div>
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

interface IncomeStepProps {
    onNext: () => void;
}

const IncomeStep: React.FC<IncomeStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();
    const [isAdding, setIsAdding] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const incomes = formData.incomes || [];

    const handleSaveIncome = (data: IncomeFormData) => {
        if (editingIndex !== null) {
            const updated = [...incomes];
            updated[editingIndex] = { ...updated[editingIndex], ...data };
            updateFormData('incomes', updated);
        } else {
            const income = { id: Math.random().toString(36).substr(2, 9), ...data };
            updateFormData('incomes', [...incomes, income]);
        }
        setIsAdding(false);
        setEditingIndex(null);
    };

    const handleDeleteIncome = (index: number) => {
        const updated = [...incomes];
        updated.splice(index, 1);
        updateFormData('incomes', updated);
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Income Information</h2>
                <p className="text-gray-400 text-sm">Details about your current and past employment.</p>
            </div>

            <div className="min-h-[250px] flex flex-col items-center">
                {incomes.length === 0 && (
                    <div className="bg-[#7ED957]/10 border border-[#7ED957]/20 rounded-full py-3 px-6 mb-6 flex items-center gap-2 text-[#7ED957] text-sm font-medium">
                        <AlertCircle size={16} />
                        <span>A minimum of 1 income record is required</span>
                    </div>
                )}

                <div className="w-full grid grid-cols-1 gap-4 mb-8">
                    {incomes.map((inc: any, index: number) => (
                        <IncomeItem
                            key={inc.id}
                            income={inc}
                            onDelete={() => handleDeleteIncome(index)}
                            onEdit={() => { setEditingIndex(index); setIsAdding(true); }}
                        />
                    ))}

                    {incomes.length === 0 && (
                        <div className="border-2 border-dashed border-[#E5E7EB] rounded-2xl py-12 flex flex-col items-center justify-center text-[#ADADAD]">
                            <Wallet size={40} strokeWidth={1.5} className="mb-3" />
                            <p className="text-sm font-medium">No income records added yet</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={() => { setEditingIndex(null); setIsAdding(true); }}
                        className="flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-[#7ED957] text-[#7ED957] font-bold text-sm uppercase hover:bg-[#7ED957]/5 transition-all"
                    >
                        <span>Add Income</span>
                        <Plus size={18} />
                    </button>

                    <PrimaryActionButton
                        onClick={onNext}
                        disabled={incomes.length === 0}
                        text="Next"
                        className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all ${incomes.length > 0
                                ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                                : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                            }`}
                    />
                </div>
            </div>

            <AddIncomeModal
                isOpen={isAdding}
                onClose={() => { setIsAdding(false); setEditingIndex(null); }}
                onSave={handleSaveIncome}
                initialData={editingIndex !== null ? incomes[editingIndex] : undefined}
            />
        </div>
    );
};

export default IncomeStep;
