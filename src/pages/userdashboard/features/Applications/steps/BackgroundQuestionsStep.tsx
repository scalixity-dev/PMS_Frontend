import React, { useEffect, useState } from 'react';
import { useUserApplicationStore } from '../store/userApplicationStore';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import { API_ENDPOINTS } from '@/config/api.config';
import BackgroundQuestionsAnswers, {
    type BackgroundQuestionItem,
} from '@/components/backgroundQuestions/BackgroundQuestionsAnswers';

interface BackgroundQuestionsStepProps {
    onNext: () => void;
}

const BackgroundQuestionsStep: React.FC<BackgroundQuestionsStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();
    const [questions, setQuestions] = useState<BackgroundQuestionItem[]>([]);
    const [loading, setLoading] = useState(true);
    const answers = formData.backgroundAnswers || [];

    // Fetch this property's manager's background questions (standard + custom
    // are both just rows now, returned together — standard first).
    useEffect(() => {
        const fetchQuestions = async () => {
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
                    setQuestions(
                        (data || []).map((q: any) => ({
                            id: q.id,
                            question: q.question,
                            requiresExplanationOnYes: q.requiresExplanationOnYes,
                            flagOnYes: q.flagOnYes,
                        }))
                    );
                } else {
                    setQuestions([]);
                }
            } catch (error) {
                console.error('Failed to fetch background questions:', error);
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [formData.propertyId]);

    const handleAnswerChange = (questionId: string, answer: boolean) => {
        const existingIndex = answers.findIndex((a) => a.questionId === questionId);
        const newAnswers = [...answers];
        if (existingIndex >= 0) {
            newAnswers[existingIndex] = { ...newAnswers[existingIndex], answer };
        } else {
            newAnswers.push({ questionId, answer });
        }
        updateFormData('backgroundAnswers', newAnswers);
    };

    const handleExplanationChange = (questionId: string, explanation: string) => {
        const existingIndex = answers.findIndex((a) => a.questionId === questionId);
        const newAnswers = [...answers];
        if (existingIndex >= 0) {
            newAnswers[existingIndex] = { ...newAnswers[existingIndex], explanation };
        } else {
            newAnswers.push({ questionId, answer: null, explanation });
        }
        updateFormData('backgroundAnswers', newAnswers);
    };

    const isAllAnswered = () => {
        return questions.every((q) => {
            const a = answers.find((x) => x.questionId === q.id);
            if (!a || a.answer === null || a.answer === undefined) return false;
            if (a.answer === true && q.requiresExplanationOnYes) {
                return (a.explanation || '').trim().length > 0;
            }
            return true;
        });
    };

    const [showErrors, setShowErrors] = useState(false);

    const handleNext = () => {
        if (isAllAnswered()) {
            onNext();
        } else {
            setShowErrors(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Background questions</h2>
                <p className="text-gray-400 text-sm">Please answer the questions provided below.</p>
                {showErrors && (
                    <p className="text-red-500 text-sm mt-2 animate-bounce font-semibold">
                        Please answer all questions before proceeding.
                    </p>
                )}
            </div>

            {loading ? (
                <div className="max-w-3xl mx-auto text-center py-10">
                    <p className="text-gray-400">Loading questions...</p>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto space-y-3 mb-10">
                    <BackgroundQuestionsAnswers
                        mode="edit"
                        questions={questions}
                        answers={answers}
                        onAnswerChange={handleAnswerChange}
                        onExplanationChange={handleExplanationChange}
                        showErrors={showErrors}
                    />
                </div>
            )}

            <div className="flex justify-center">
                <PrimaryActionButton
                    onClick={handleNext}
                    disabled={loading}
                    text="Next"
                    className={`px-16 py-3.5 rounded-full font-bold uppercase transition-all ${!loading
                        ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                        : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                        }`}
                />
            </div>
        </div>
    );
};

export default BackgroundQuestionsStep;
