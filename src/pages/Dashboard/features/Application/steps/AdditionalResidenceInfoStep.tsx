import React from 'react';
import { useApplicationStore } from '../store/applicationStore';

interface AdditionalResidenceInfoStepProps {
    onNext: () => void;
}

const AdditionalResidenceInfoStep: React.FC<AdditionalResidenceInfoStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        updateFormData('additionalResidenceInfo', e.target.value);
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-2xl font-bold text-center text-[#2c3e50] mb-2">Additional residence history information</h2>
            <p className="text-center text-gray-600 mb-8 max-w-lg">
                Include any details from residential history that may be relevant for this application.
            </p>

            <div className="w-full bg-[#F0F0F6] rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[300px]">
                <textarea
                    placeholder="Type here..."
                    className="w-full h-full min-h-[250px] bg-[#F0F0F6] border-none outline-none resize-none text-gray-700 placeholder-gray-400 font-medium text-lg"
                    value={formData.additionalResidenceInfo || ''}
                    onChange={handleChange}
                />
            </div>

            <div className="mt-10">
                <button
                    onClick={onNext}
                    className="bg-[#3A6D6C] text-white px-8 sm:px-20 py-3 rounded-full text-lg font-medium hover:bg-[#2c5251] transition-colors shadow-lg w-full sm:w-auto"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default AdditionalResidenceInfoStep;
