import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import BaseModal from '@/components/common/modals/BaseModal';

export interface BackgroundQuestionsData {
    evicted: boolean;
    refuseRent: boolean;
    crime: boolean;
    bankruptcy: boolean;
    smoke: boolean;
    military: boolean;
    explanations: Record<string, string>;
}

interface UserEditBackgroundQuestionsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: BackgroundQuestionsData) => void;
    initialData?: BackgroundQuestionsData;
}

const questions = [
    { key: 'evicted', label: 'Have you ever been evicted from a rental residence?' },
    { key: 'refuseRent', label: 'Have you ever refused to pay rent?' },
    { key: 'crime', label: 'Have you ever been convicted of a crime?' },
    { key: 'bankruptcy', label: 'Have you ever declared bankruptcy?' },
    { key: 'smoke', label: 'Do you smoke?' },
    { key: 'military', label: 'Are you in the military?' },
];

const UserEditBackgroundQuestionsModal: React.FC<UserEditBackgroundQuestionsModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData
}) => {
    const [formData, setFormData] = useState<BackgroundQuestionsData>({
        evicted: false,
        refuseRent: false,
        crime: false,
        bankruptcy: false,
        smoke: false,
        military: false,
        explanations: {}
    });

    useEffect(() => {
        if (isOpen && initialData) {
            setFormData(initialData);
        }
    }, [isOpen, initialData]);

    const handleChange = (key: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleExplanationChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            explanations: {
                ...prev.explanations,
                [key]: value
            }
        }));
    };

    const handleSubmit = () => {
        onSave(formData);
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
                {questions.map((q) => (
                    <div key={q.key} className="space-y-3 pb-4 border-b border-gray-100 last:border-0">
                        <div className="flex items-start justify-between gap-4">
                            <label className="text-sm font-medium text-gray-900 pt-1">{q.label}</label>
                            <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
                                <button
                                    type="button"
                                    onClick={() => handleChange(q.key, true)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${(formData as any)[q.key]
                                        ? 'bg-red-500 text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    Yes
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleChange(q.key, false)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${!(formData as any)[q.key]
                                        ? 'bg-[#7ED957] text-white shadow-sm'
                                        : 'text-gray-500 hover:text-gray-900'
                                        }`}
                                >
                                    No
                                </button>
                            </div>
                        </div>

                        {(formData as any)[q.key] && (
                            <div className="animate-in fade-in slide-in-from-top-1 bg-gray-50 p-3 rounded-lg">
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Please explain
                                </label>
                                <textarea
                                    value={formData.explanations[q.key] || ''}
                                    onChange={(e) => handleExplanationChange(q.key, e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947] min-h-[80px] resize-y"
                                    placeholder="Enter details..."
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </BaseModal>
    );
};

export default UserEditBackgroundQuestionsModal;
