import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGetBackgroundQuestions, useCreateBackgroundQuestion, useUpdateBackgroundQuestion, useDeleteBackgroundQuestion, useReorderBackgroundQuestions } from '../../../../hooks/useBackgroundQuestionQueries';
import { useTeamPermissions } from '../../../../context/TeamPermissionContext';

export default function BackgroundQuestions() {
    const { isTeamMember, canManage } = useTeamPermissions();
    const canEdit = !isTeamMember || canManage('settings');
    const { data: questions = [], isLoading } = useGetBackgroundQuestions();
    const createQuestion = useCreateBackgroundQuestion();
    const updateQuestion = useUpdateBackgroundQuestion();
    const deleteQuestion = useDeleteBackgroundQuestion();
    const reorderQuestions = useReorderBackgroundQuestions();
    const [newQuestionText, setNewQuestionText] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingText, setEditingText] = useState('');

    const handleAddQuestion = async () => {
        if (newQuestionText.trim()) {
            createQuestion.mutate(
                { question: newQuestionText, order: questions.length + 1 },
                {
                    onSuccess: () => {
                        setNewQuestionText('');
                    },
                }
            );
        }
    };

    const handleDeleteQuestion = (id: string) => {
        if (questions.length <= 1) return;
        deleteQuestion.mutate(id, {
            onSuccess: () => {
                const remaining = (questions as any[])
                    .filter((q: any) => q.id !== id)
                    .map((q: any, index: number) => ({ id: q.id, order: index }));
                reorderQuestions.mutate(remaining);
            },
        });
    };

    const handleUpdateQuestion = (id: string, text: string) => {
        updateQuestion.mutate({
            id,
            data: { question: text }
        }, {
            onSuccess: () => {
                setEditingId(null);
                setEditingText('');
            }
        });
    };

    const handleToggleFlagOnYes = (id: string, flagOnYes: boolean) => {
        updateQuestion.mutate({ id, data: { flagOnYes } });
    };

    const handleToggleRequiresExplanation = (id: string, requiresExplanationOnYes: boolean) => {
        updateQuestion.mutate({ id, data: { requiresExplanationOnYes } });
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Background Questions</h2>
                <p className="text-gray-600 text-sm mt-1 max-w-3xl">
                    Add mandatory Yes/No questions that applicants must answer during rental application.
                </p>
            </div>

            {isLoading ? (
                <div className="text-center py-8">Loading questions...</div>
            ) : (
                <>
                    <div className="space-y-6">
                        {questions.map((question: any, index: number) => (
                            <div key={question.id} className="bg-white rounded-md p-6 border border-gray-200 shadow-sm">
                                <div className="mb-4">
                                    <h3 className="text-lg font-medium text-gray-900">Question {index + 1}</h3>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-start">
                                    <input
                                        type="text"
                                        value={editingId === question.id ? editingText : question.question}
                                        readOnly={!canEdit}
                                        onChange={(e) => {
                                            if (canEdit && editingId === question.id) {
                                                setEditingText(e.target.value);
                                            }
                                        }}
                                        onBlur={() => {
                                            if (canEdit && editingId === question.id && editingText.trim()) {
                                                handleUpdateQuestion(question.id, editingText);
                                            }
                                        }}
                                        onFocus={() => {
                                            if (!canEdit) return;
                                            setEditingId(question.id);
                                            setEditingText(question.question);
                                        }}
                                        className={`w-full sm:flex-1 border border-gray-300 rounded-md px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#7CD947] ${!canEdit ? 'bg-gray-50 cursor-not-allowed' : ''}`}
                                        placeholder="Enter your question here"
                                    />

                                    {canEdit && !question.isProtected && <button
                                        onClick={() => handleDeleteQuestion(question.id)}
                                        disabled={questions.length <= 1}
                                        className={`flex items-center justify-center sm:justify-start gap-2 px-4 py-2.5 border border-red-200 rounded-md text-red-600 hover:bg-red-50 bg-white text-sm font-medium w-full sm:w-auto ${questions.length <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                    </button>}
                                </div>

                                <div className="mt-4 flex flex-col gap-2">
                                    <p className="text-gray-600 text-sm">Answer type: <span className="font-medium text-gray-900">Yes / No (fixed)</span></p>

                                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span>{question.isProtected ? 'This is a standard question and cannot be deleted' : 'This question is required by default'}</span>
                                    </div>

                                    {!question.isProtected && (
                                        <>
                                            <label className={`flex items-center gap-2 text-sm mt-1 ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!question.flagOnYes}
                                                    disabled={!canEdit}
                                                    onChange={(e) => handleToggleFlagOnYes(question.id, e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-red-500 focus:ring-red-400"
                                                />
                                                <span className="text-gray-700">Flag "Yes" as a concern on the application review (shows red instead of green)</span>
                                            </label>

                                            <label className={`flex items-center gap-2 text-sm ${canEdit ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!question.requiresExplanationOnYes}
                                                    disabled={!canEdit}
                                                    onChange={(e) => handleToggleRequiresExplanation(question.id, e.target.checked)}
                                                    className="h-4 w-4 rounded border-gray-300 text-[#7CD947] focus:ring-[#7CD947]"
                                                />
                                                <span className="text-gray-700">Require an explanation when the applicant answers "Yes"</span>
                                            </label>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {canEdit && <div className="mt-8 flex justify-center gap-3">
                        <input
                            type="text"
                            value={newQuestionText}
                            onChange={(e) => setNewQuestionText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddQuestion()}
                            placeholder="Enter new question"
                            className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-1 focus:ring-[#7CD947]"
                        />
                        <button
                            onClick={handleAddQuestion}
                            disabled={!newQuestionText.trim()}
                            className="flex items-center justify-center gap-2 text-[#7CD947] border border-[#7CD947] px-8 py-3 rounded-md hover:bg-[#7CD947] hover:text-white transition-colors font-medium bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="h-5 w-5" />
                            Add
                        </button>
                    </div>}
                </>
            )}
        </div>
    );
}
