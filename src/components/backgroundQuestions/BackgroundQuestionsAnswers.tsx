import React from 'react';

export interface BackgroundQuestionItem {
    id: string;
    question: string;
    requiresExplanationOnYes?: boolean;
    flagOnYes?: boolean;
}

export interface BackgroundAnswerValue {
    questionId: string;
    answer: boolean | null;
    explanation?: string;
}

interface EditModeProps {
    mode: 'edit';
    questions: BackgroundQuestionItem[];
    answers: BackgroundAnswerValue[];
    onAnswerChange: (questionId: string, answer: boolean) => void;
    onExplanationChange: (questionId: string, explanation: string) => void;
    showErrors?: boolean;
    readOnly?: boolean;
}

interface ReviewModeProps {
    mode: 'review';
    questions: BackgroundQuestionItem[];
    answers: BackgroundAnswerValue[];
}

type BackgroundQuestionsAnswersProps = EditModeProps | ReviewModeProps;

const getAnswer = (answers: BackgroundAnswerValue[], questionId: string): boolean | null => {
    const found = answers.find((a) => a.questionId === questionId);
    return found ? found.answer : null;
};

const getExplanation = (answers: BackgroundAnswerValue[], questionId: string): string => {
    const found = answers.find((a) => a.questionId === questionId);
    return found?.explanation || '';
};

/**
 * Single rendering source for background-question answers, used in both the
 * applicant fill-out flow and the manager/tenant review screens. Standard and
 * custom questions render identically here — the only per-question difference
 * (whether an explanation is collected, whether "Yes" is flagged red) comes
 * from each question's own `requiresExplanationOnYes` / `flagOnYes` metadata.
 */
const BackgroundQuestionsAnswers: React.FC<BackgroundQuestionsAnswersProps> = (props) => {
    const { questions } = props;

    if (props.mode === 'review') {
        const { answers } = props;
        return (
            <>
                {questions.map((q) => {
                    const answer = getAnswer(answers, q.id);
                    const explanation = getExplanation(answers, q.id);
                    if (answer === null) return null;
                    const isFlagged = answer === true && q.flagOnYes;
                    return (
                        <div key={q.id} className="space-y-2">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <p className="text-[#1A1A1A] font-semibold text-sm sm:max-w-[60%] md:max-w-[70%]">
                                    {q.question}
                                </p>
                                <span
                                    className={`${isFlagged ? 'bg-red-500' : answer ? 'bg-[#8FE165]' : 'bg-gray-400'} text-white px-6 py-1 rounded-full !text-sm font-bold w-fit`}
                                >
                                    {answer ? 'Yes' : 'No'}
                                </span>
                            </div>
                            {answer && explanation && (
                                <div className="bg-white/50 p-3 rounded-xl border border-gray-100 ml-4 mb-2">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Explanation</p>
                                    <p className="text-sm text-gray-700 italic">"{explanation}"</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </>
        );
    }

    const { answers, onAnswerChange, onExplanationChange, showErrors, readOnly } = props;

    return (
        <>
            {questions.map((q) => {
                const answer = getAnswer(answers, q.id);
                const explanation = getExplanation(answers, q.id);
                const isAnswered = answer !== null;
                const showExplanation = answer === true && !!q.requiresExplanationOnYes;
                const needsExplanation = showExplanation && !explanation.trim();

                return (
                    <div
                        key={q.id}
                        className={`bg-white px-5 py-4 rounded-2xl border transition-all flex flex-col gap-4 ${showErrors && (!isAnswered || needsExplanation) ? 'border-red-300 bg-red-50/30' : 'border-[#E5E7EB] hover:shadow-md'}`}
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <p className="text-[#1A1A1A] font-semibold text-sm sm:max-w-[60%] md:max-w-[70%]">
                                {q.question}
                                {showErrors && !isAnswered && <span className="text-red-500 ml-1">*</span>}
                            </p>
                            <div className="flex items-center gap-6 sm:justify-end">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div
                                        onClick={() => !readOnly && onAnswerChange(q.id, true)}
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answer === true ? 'border-[#7ED957] bg-white' : 'border-[#E5E7EB] bg-white'}`}
                                    >
                                        {answer === true && <div className="w-2.5 h-2.5 rounded-full bg-[#7ED957]" />}
                                    </div>
                                    <span className={`text-sm font-medium transition-colors ${answer === true ? 'text-[#1A1A1A]' : 'text-[#ADADAD]'}`}>Yes</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <div
                                        onClick={() => !readOnly && onAnswerChange(q.id, false)}
                                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${answer === false ? 'border-[#7ED957] bg-white' : 'border-[#E5E7EB] bg-white'}`}
                                    >
                                        {answer === false && <div className="w-2.5 h-2.5 rounded-full bg-[#7ED957]" />}
                                    </div>
                                    <span className={`text-sm font-medium transition-colors ${answer === false ? 'text-[#1A1A1A]' : 'text-[#ADADAD]'}`}>No</span>
                                </label>
                            </div>
                        </div>

                        {showExplanation && (
                            <div className={`bg-white p-4 rounded-xl border space-y-2 animate-in fade-in slide-in-from-top-2 duration-300 ${showErrors && needsExplanation ? 'border-red-300' : 'border-[#E5E7EB]'}`}>
                                <label className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                                    Please explain <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    placeholder="Type explain here"
                                    disabled={readOnly}
                                    className={`w-full bg-white border rounded-[10px] p-3 text-sm font-medium outline-none focus:border-[#7ED957] focus:ring-1 focus:ring-[#7ED957]/20 transition-all min-h-[100px] resize-none ${showErrors && needsExplanation ? 'border-red-300 ring-1 ring-red-100' : 'border-[#E5E7EB]'}`}
                                    value={explanation}
                                    onChange={(e) => onExplanationChange(q.id, e.target.value)}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </>
    );
};

export default BackgroundQuestionsAnswers;
