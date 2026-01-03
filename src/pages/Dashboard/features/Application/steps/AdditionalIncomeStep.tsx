import React, { useState } from 'react';
import { useApplicationStore } from '../store/applicationStore';

interface AdditionalIncomeStepProps {
    onNext: () => void;
}

const AdditionalIncomeStep: React.FC<AdditionalIncomeStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();
    const [info, setInfo] = useState(formData.additionalIncomeInfo || '');

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setInfo(value);
        updateFormData('additionalIncomeInfo', value);
    };

    return (
        <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">Additional income history information</h2>
                <p className="text-gray-600 max-w-lg mx-auto">
                    Include any details from income history that may be relevant for this application.
                </p>
            </div>

            <div className="w-full max-w-3xl bg-[#F0F2F5] rounded-3xl p-6 shadow-inner min-h-[300px] mb-8 relative shadow-md">
                <textarea
                    value={info}
                    onChange={handleChange}
                    placeholder="Type Details here.."
                    className="w-full h-full bg-transparent border-none outline-none resize-none text-gray-700 placeholder-gray-400 min-h-[250px]"
                />
            </div>

            <div className="mt-4">
                <button
                    onClick={onNext}
                    className="bg-[#3A6D6C] text-white border border-white/20 px-6 sm:px-12 py-3 rounded-lg text-md font-medium hover:bg-[#2c5251] transition-colors shadow-sm w-full sm:w-auto"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default AdditionalIncomeStep;
