import React from 'react';
import { useApplicationStore } from '../../../../Dashboard/features/Application/store/applicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';

interface Question {
    id: string;
    text: string;
}

const questions: Question[] = [
    { id: 'smoke', text: 'Do you or any occupants smoke?' },
    { id: 'military', text: 'Are any occupants members in the military?' },
    { id: 'crime', text: 'Have you ever been charged or convicted of a crime?' },
    { id: 'bankruptcy', text: 'Have you ever filed for bankruptcy?' },
    { id: 'refuseRent', text: 'Have you ever willfully refused to pay rent when it was due?' },
    { id: 'evicted', text: 'Have you ever been evicted or left a tenancy owing money?' },
];

interface BackgroundQuestionsStepProps {
    onNext: () => void;
}

const BackgroundQuestionsStep: React.FC<BackgroundQuestionsStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();
    const responses = formData.backgroundQuestions || {};
    const explanations = formData.backgroundExplanations || {};

    const handleToggle = (questionId: string, value: boolean) => {
        updateFormData('backgroundQuestions', {
            ...responses,
            [questionId]: value,
        });
    };

    const handleExplanationChange = (questionId: string, text: string) => {
        updateFormData('backgroundExplanations', {
            ...explanations,
            [questionId]: text,
        });
    };

    const questionsNeedingExplanation = ['crime', 'bankruptcy', 'refuseRent', 'evicted'];

    const isAllAnswered = questions.every(q => {
        const answered = responses[q.id] !== undefined && responses[q.id] !== null;
        if (!answered) return false;

        if (responses[q.id] === true && questionsNeedingExplanation.includes(q.id)) {
            return (explanations[q.id] || '').trim().length > 0;
        }

        return true;
    });

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Background questions</h2>
                <p className="text-gray-400 text-sm">Please answer the questions provided below.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3 mb-10">
                {questions.map((q) => {
                    const showExplanation = responses[q.id] === true && questionsNeedingExplanation.includes(q.id);

                    return (
                        <div
                            key={q.id}
                            className="bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all flex flex-col gap-4"
                        >
                            <div className="flex items-center justify-between">
                                <p className="text-[#1A1A1A] font-semibold text-sm max-w-[70%]">{q.text}</p>
                                <div className="flex items-center gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div
                                            onClick={() => handleToggle(q.id, true)}
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${responses[q.id] === true ? 'border-[#7ED957] bg-white' : 'border-[#E5E7EB] bg-white'}`}
                                        >
                                            {responses[q.id] === true && <div className="w-2.5 h-2.5 rounded-full bg-[#7ED957]" />}
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${responses[q.id] === true ? 'text-[#1A1A1A]' : 'text-[#ADADAD]'}`}>Yes</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <div
                                            onClick={() => handleToggle(q.id, false)}
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${responses[q.id] === false ? 'border-[#7ED957] bg-white' : 'border-[#E5E7EB] bg-white'}`}
                                        >
                                            {responses[q.id] === false && <div className="w-2.5 h-2.5 rounded-full bg-[#7ED957]" />}
                                        </div>
                                        <span className={`text-sm font-medium transition-colors ${responses[q.id] === false ? 'text-[#1A1A1A]' : 'text-[#ADADAD]'}`}>No</span>
                                    </label>
                                </div>
                            </div>

                            {showExplanation && (
                                <div className="bg-[#F9FAFB] p-4 rounded-xl border border-[#E5E7EB] space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                                        Please explain <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        placeholder="Type explain here"
                                        className="w-full bg-white border border-[#E5E7EB] rounded-[10px] p-3 text-sm font-medium outline-none focus:border-[#7ED957] focus:ring-1 focus:ring-[#7ED957]/20 transition-all min-h-[100px] resize-none"
                                        value={explanations[q.id] || ''}
                                        onChange={(e) => handleExplanationChange(q.id, e.target.value)}
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex justify-center">
                <PrimaryActionButton
                    onClick={onNext}
                    disabled={!isAllAnswered}
                    text="Next"
                    className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all ${isAllAnswered
                        ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                        : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                        }`}
                />
            </div>
        </div>
    );
};

export default BackgroundQuestionsStep;
