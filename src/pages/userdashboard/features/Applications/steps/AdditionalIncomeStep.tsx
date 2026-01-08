import React from 'react';
import { useApplicationStore } from '../../../../Dashboard/features/Application/store/applicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';

interface AdditionalIncomeStepProps {
    onNext: () => void;
}

const AdditionalIncomeStep: React.FC<AdditionalIncomeStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Additional Income Info</h2>
                <p className="text-gray-400 text-sm">Any extra details about your earnings?</p>
            </div>

            <div className="flex flex-col items-center">
                <div className="w-full bg-white rounded-2xl p-6 border border-[#E5E7EB] shadow-sm focus-within:border-[#7ED957] focus-within:ring-1 focus-within:ring-[#7ED957]/20 transition-all mb-8">
                    <textarea
                        placeholder="Type any additional Details here..."
                        className="w-full min-h-[250px] outline-none resize-none text-[#1A1A1A] placeholder:text-[#ADADAD] font-medium text-base"
                        value={formData.additionalIncomeInfo || ''}
                        onChange={(e) => updateFormData('additionalIncomeInfo', e.target.value)}
                    />
                </div>

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
    );
};

export default AdditionalIncomeStep;
