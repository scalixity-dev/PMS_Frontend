import React, { useEffect, useState } from 'react';
import { useUserApplicationStore } from '../store/userApplicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import { API_ENDPOINTS } from '@/config/api.config';

interface StandardQuestion {
    id: string;
    text: string;
}

const standardQuestions: StandardQuestion[] = [
    { id: 'smoke', text: 'Do you or any occupants smoke?' },
    { id: 'military', text: 'Are any occupants members in the military?' },
    { id: 'crime', text: 'Have you ever been charged or convicted of a crime?' },
    { id: 'bankruptcy', text: 'Have you ever filed for bankruptcy?' },
    { id: 'refuseRent', text: 'Have you ever willfully refused to pay rent when it was due?' },
    { id: 'evicted', text: 'Have you ever been evicted or left a tenancy owing money?' },
];

interface CustomQuestion {
    id: string;
    question: string;
    order: number;
}

interface BackgroundQuestionsStepProps {
    onNext: () => void;
}

const BackgroundQuestionsStep: React.FC<BackgroundQuestionsStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();
    const [customQuestions, setCustomQuestions] = useState<CustomQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const responses = formData.backgroundQuestions || {};
    const explanations = formData.backgroundExplanations || {};
    const customAnswers = formData.customBackgroundAnswers || [];

    // Fetch custom background questions from backend
    useEffect(() => {
        const fetchCustomQuestions = async () => {
            if (!formData.propertyId) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    API_ENDPOINTS.APPLICATION.GET_BACKGROUND_QUESTIONS(formData.propertyId),
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setCustomQuestions(data || []);
                } else {
                    // If no questions found or error, just continue with standard questions
                    setCustomQuestions([]);
                }
            } catch (error) {
                console.error('Failed to fetch custom background questions:', error);
                setCustomQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomQuestions();
    }, [formData.propertyId]);

    const handleToggle = (questionId: string, value: boolean) => {
        updateFormData('backgroundQuestions', {
            ...responses,
            [questionId]: value,
        });
    };

    const handleCustomToggle = (questionId: string, value: boolean) => {
        const existingIndex = customAnswers.findIndex(a => a.questionId === questionId);
        const newAnswers = [...customAnswers];
        
        if (existingIndex >= 0) {
            newAnswers[existingIndex] = { questionId, answer: value };
        } else {
            newAnswers.push({ questionId, answer: value });
        }
        
        updateFormData('customBackgroundAnswers', newAnswers);
    };

    const handleExplanationChange = (questionId: string, text: string) => {
        updateFormData('backgroundExplanations', {
            ...explanations,
            [questionId]: text,
        });
    };

    const questionsNeedingExplanation = ['crime', 'bankruptcy', 'refuseRent', 'evicted'];

    const getCustomAnswer = (questionId: string): boolean | null => {
        const answer = customAnswers.find(a => a.questionId === questionId);
        return answer ? answer.answer : null;
    };

    const isAllAnswered = () => {
        // Check standard questions
        const standardAnswered = standardQuestions.every(q => {
            const answered = responses[q.id] !== undefined && responses[q.id] !== null;
            if (!answered) return false;

            if (responses[q.id] === true && questionsNeedingExplanation.includes(q.id)) {
                return (explanations[q.id] || '').trim().length > 0;
            }

            return true;
        });

        // Check custom questions
        const customAnswered = customQuestions.every(q => {
            const answer = getCustomAnswer(q.id);
            return answer !== null;
        });

        return standardAnswered && customAnswered;
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Background questions</h2>
                <p className="text-gray-400 text-sm">Please answer the questions provided below.</p>
            </div>

            {loading ? (
                <div className="max-w-3xl mx-auto text-center py-10">
                    <p className="text-gray-400">Loading questions...</p>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-3 mb-10">
                    {/* Standard Questions */}
                    {standardQuestions.map((q) => {
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

                    {/* Custom Questions */}
                    {customQuestions.length > 0 && (
                        <>
                            {customQuestions.map((q) => {
                                const answer = getCustomAnswer(q.id);
                                return (
                                    <div
                                        key={q.id}
                                        className="bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-[#1A1A1A] font-semibold text-sm max-w-[70%]">{q.question}</p>
                                            <div className="flex items-center gap-6">
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <div
                                                        onClick={() => handleCustomToggle(q.id, true)}
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answer === true ? 'border-[#7ED957] bg-white' : 'border-[#E5E7EB] bg-white'}`}
                                                    >
                                                        {answer === true && <div className="w-2.5 h-2.5 rounded-full bg-[#7ED957]" />}
                                                    </div>
                                                    <span className={`text-sm font-medium transition-colors ${answer === true ? 'text-[#1A1A1A]' : 'text-[#ADADAD]'}`}>Yes</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer group">
                                                    <div
                                                        onClick={() => handleCustomToggle(q.id, false)}
                                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answer === false ? 'border-[#7ED957] bg-white' : 'border-[#E5E7EB] bg-white'}`}
                                                    >
                                                        {answer === false && <div className="w-2.5 h-2.5 rounded-full bg-[#7ED957]" />}
                                                    </div>
                                                    <span className={`text-sm font-medium transition-colors ${answer === false ? 'text-[#1A1A1A]' : 'text-[#ADADAD]'}`}>No</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </>
                    )}
                </div>
            )}

            <div className="flex justify-center">
                <PrimaryActionButton
                    onClick={onNext}
                    disabled={loading || !isAllAnswered()}
                    text="Next"
                    className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all ${isAllAnswered() && !loading
                        ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                        : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                        }`}
                />
            </div>
        </div>
    );
};

export default BackgroundQuestionsStep;
