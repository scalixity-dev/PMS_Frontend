import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import BaseModal from '@/components/common/modals/BaseModal';

export interface BackgroundQuestionEditItem {
    id: string;
    question: string;
    requiresExplanationOnYes?: boolean;
}

export interface BackgroundAnswerEditValue {
    questionId: string;
    answer: boolean;
    explanation?: string;
}

interface UserEditBackgroundQuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (answers: BackgroundAnswerEditValue[]) => void;
    questions: BackgroundQuestionEditItem[];
    initialAnswers: BackgroundAnswerEditValue[];
}

const UserEditBackgroundQuestionsModal: React.FC<UserEditBackgroundQuestionsModalProps> = ({
    isOpen,
    onClose,
    onSave,
    questions,
    initialAnswers,
}) => {
    const [answers, setAnswers] = useState<BackgroundAnswerEditValue[]>(initialAnswers);

    useEffect(() => {
        if (isOpen) {
            setAnswers(initialAnswers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    const getAnswer = (questionId: string) => answers.find((a) => a.questionId === questionId);

    const handleChange = (questionId: string, value: boolean) => {
        setAnswers((prev) => {
            const existing = prev.find((a) => a.questionId === questionId);
            if (existing) {
                return prev.map((a) => (a.questionId === questionId ? { ...a, answer: value } : a));
            }
            return [...prev, { questionId, answer: value }];
        });
    };

    const handleExplanationChange = (questionId: string, explanation: string) => {
        setAnswers((prev) => {
            const existing = prev.find((a) => a.questionId === questionId);
            if (existing) {
                return prev.map((a) => (a.questionId === questionId ? { ...a, explanation } : a));
            }
            return [...prev, { questionId, answer: false, explanation }];
        });
    };

    const handleSubmit = () => {
        onSave(answers);
        onClose();
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Additional Information"
            maxWidth="max-w-2xl"
            footerButtons={[
                {
                    label: 'Cancel',
                    onClick: onClose,
                    variant: 'ghost',
                },
                {
                    label: 'Save Changes',
                    onClick: handleSubmit,
                    variant: 'primary',
                    className: "bg-[#7ED957] hover:bg-[#6BC847] border-none text-white",
                    icon: <Check size={16} strokeWidth={3} />
                }
            ]}
        >
            <div className="space-y-6 py-4">
                {questions.map((q) => {
                    const current = getAnswer(q.id);
                    const answer = current?.answer ?? false;
                    return (
                        <div key={q.id} className="space-y-3 pb-4 border-b border-gray-100 last:border-0">
                            <div className="flex items-start justify-between gap-4">
                                <label className="text-sm font-medium text-gray-900 pt-1">{q.question}</label>
                                <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => handleChange(q.id, true)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${answer
                                            ? 'bg-red-500 text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        Yes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleChange(q.id, false)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!answer
                                            ? 'bg-[#7ED957] text-white shadow-sm'
                                            : 'text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        No
                                    </button>
                                </div>
                            </div>

                            {answer && q.requiresExplanationOnYes && (
                                <div className="animate-in fade-in slide-in-from-top-1 bg-gray-50 p-3 rounded-lg">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Please explain
                                    </label>
                                    <textarea
                                        value={current?.explanation || ''}
                                        onChange={(e) => handleExplanationChange(q.id, e.target.value)}
                                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947] min-h-[80px] resize-y"
                                        placeholder="Enter details..."
                                    />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </BaseModal>
    );
};

export default UserEditBackgroundQuestionsModal;
