import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, FileWarning, Lightbulb, Check } from 'lucide-react';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';
import TemplateEditor from '../components/TemplateEditor';
import { useCreateTemplate } from '../../../../../hooks/useDocumentsQueries';
import { useToast } from '../../../../../components/common/Toast';

/** Extract unique {{placeholder}} tokens from template content. */
function extractVariables(content: string) {
    const regex = /\{\{(\w+)\}\}/g;
    const seen = new Set<string>();
    const vars: { key: string; label: string; required: boolean; type: string }[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(content)) !== null) {
        const key = match[1];
        if (!seen.has(key)) {
            seen.add(key);
            const label = key
                .replace(/_/g, ' ')
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (c) => c.toUpperCase())
                .trim();
            vars.push({ key, label, required: true, type: 'text' });
        }
    }
    return vars;
}

const CreateTemplateWizard: React.FC = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const createTemplate = useCreateTemplate();

    const [currentStep, setCurrentStep] = useState(1);
    const [title, setTitle] = useState('');
    const [templateType, setTemplateType] = useState('');
    const [editorContent, setEditorContent] = useState('');

    const detectedVars = extractVariables(editorContent);

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const handleFinish = async () => {
        const variables = extractVariables(editorContent);
        try {
            await createTemplate.mutateAsync({
                title,
                category: 'CUSTOM',
                content: editorContent,
                variables,
            } as any);
            toast.success('Template created successfully');
            navigate('/dashboard/documents/my-templates');
        } catch (err: any) {
            toast.error(err?.message || 'Failed to create template');
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[var(--color-background)] px-2 md:px-6 overflow-y-auto">
            <div className="flex-1 flex items-start justify-center pt-4 md:pt-8 bg-transparent">
                <div className={`bg-[#DFE5E3] rounded-3xl shadow-lg w-full min-h-[500px] p-4 md:p-12 transition-all duration-300 ${currentStep === 3 ? 'max-w-7xl' : 'max-w-2xl'}`}>
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-[#20CC95] font-semibold text-sm mb-6 md:mb-12 hover:text-[#1db885] transition-colors"
                    >
                        <ChevronLeft size={18} />
                        BACK
                    </button>

                    {/* Step Indicators */}
                    <div className="w-full max-w-3xl mx-auto mb-8 md:mb-12">
                        <div className="relative">
                            {/* Connecting Line */}
                            <div className="absolute top-4 left-[16.666%] right-[16.666%] h-[3px] bg-gray-200 -translate-y-1/2 z-0">
                                <div
                                    className="h-full bg-[#20CC95] transition-all duration-300 ease-in-out"
                                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                                />
                            </div>

                            {/* Steps */}
                            <div className="grid grid-cols-3 relative z-10">
                                {[
                                    { num: 1, label: 'Type & Title' },
                                    { num: 2, label: 'Template Builder' },
                                    { num: 3, label: 'Attachments & Initials' }
                                ].map((step) => (
                                    <div key={step.num} className="flex flex-col items-center gap-2 md:gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${currentStep >= step.num
                                                ? 'bg-[#20CC95] text-white'
                                                : 'bg-[#6B7280] text-white'
                                                }`}
                                        >
                                            {step.num}
                                        </div>
                                        <span
                                            className={`text-xs md:text-sm font-medium text-center ${currentStep === step.num ? 'text-gray-900' : 'text-gray-500'
                                                }`}
                                        >
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex flex-col items-center justify-start w-full">
                        {currentStep === 1 && (
                            <div className="w-full flex flex-col items-center">
                                <div className="text-center mb-6 md:mb-8">
                                    <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#111827]">Template title</h2>
                                    <p className="text-sm text-[#374151]">
                                        Add the document template name.
                                    </p>
                                </div>

                                {/* Title Input */}
                                <div className="w-full max-w-md mb-8">
                                    <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
                                        Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Enter the title"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#20CC95] transition-colors"
                                    />
                                </div>

                                {/* Next Button */}
                                <div className="flex justify-center w-full">
                                    <PrimaryActionButton
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!title.trim()}
                                        text="Next"
                                        className="!bg-[#3D7475] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[200px]"
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="w-full flex flex-col items-center">
                                <div className="text-center mb-6 md:mb-8">
                                    <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#111827]">What is the template type?</h2>
                                    <p className="text-sm text-[#374151]">
                                        Select the type to display the template on the appropriate page.
                                    </p>
                                </div>

                                <div className="flex flex-row gap-4 sm:gap-8 mb-8 md:mb-12 w-full justify-center">
                                    {/* Tenant Agreement Card */}
                                    <button
                                        onClick={() => setTemplateType('agreement')}
                                        className={`relative flex-1 sm:flex-none w-full sm:w-48 h-auto sm:h-48 py-6 sm:py-0 rounded-2xl bg-white border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group hover:shadow-md ${templateType === 'agreement'
                                            ? 'border-[#20CC95] shadow-md'
                                            : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-lg ${templateType === 'agreement' ? 'bg-[#E0F7EF]' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                                            <FileText
                                                size={48}
                                                className={`transition-colors duration-300 ${templateType === 'agreement' ? 'text-[#20CC95]' : 'text-gray-400'}`}
                                            />
                                        </div>
                                        <span className={`font-semibold transition-colors duration-300 ${templateType === 'agreement' ? 'text-[#111827]' : 'text-gray-600'}`}>
                                            Tenant agreement
                                        </span>

                                        {/* Selection Indicator */}
                                        <div className={`absolute -bottom-3 -right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${templateType === 'agreement'
                                            ? 'bg-[#20CC95] border-[#20CC95]'
                                            : 'bg-white border-gray-200'
                                            }`}>
                                            {templateType === 'agreement' && <Check size={16} className="text-white" />}
                                        </div>
                                    </button>

                                    {/* Tenant Notice Card */}
                                    <button
                                        onClick={() => setTemplateType('notice')}
                                        className={`relative flex-1 sm:flex-none w-full sm:w-48 h-auto sm:h-48 py-6 sm:py-0 rounded-2xl bg-white border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group hover:shadow-md ${templateType === 'notice'
                                            ? 'border-[#20CC95] shadow-md'
                                            : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className={`p-4 rounded-lg ${templateType === 'notice' ? 'bg-[#E0F7EF]' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                                            <FileWarning
                                                size={48}
                                                className={`transition-colors duration-300 ${templateType === 'notice' ? 'text-[#20CC95]' : 'text-gray-400'}`}
                                            />
                                        </div>
                                        <span className={`font-semibold transition-colors duration-300 ${templateType === 'notice' ? 'text-[#111827]' : 'text-gray-600'}`}>
                                            Tenant notice
                                        </span>

                                        {/* Selection Indicator */}
                                        <div className={`absolute -bottom-3 -right-3 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${templateType === 'notice'
                                            ? 'bg-[#20CC95] border-[#20CC95]'
                                            : 'bg-white border-gray-200'
                                            }`}>
                                            {templateType === 'notice' && <Check size={16} className="text-white" />}
                                        </div>
                                    </button>
                                </div>

                                {/* Info Tip */}
                                <div className="flex items-start gap-3 w-full max-w-lg mb-8 p-4 border-t border-yellow-400/50">
                                    <div className="bg-yellow-100 p-1.5 rounded-full mt-0.5">
                                        <Lightbulb size={16} className="text-yellow-600" />
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed text-left">
                                        Notice template type displays on the "Notice" page. Lease Agreement displays on the "Move in" page.
                                    </p>
                                </div>

                                <div className="flex justify-center w-full">
                                    <PrimaryActionButton
                                        onClick={() => setCurrentStep(3)}
                                        disabled={!templateType}
                                        text="Next"
                                        className="!bg-[#3D7475] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[200px]"
                                    />
                                </div>
                            </div>
                        )}

                        {currentStep === 3 && (
                            <div className="w-full flex flex-col items-center">
                                <div className="text-center mb-6 md:mb-8">
                                    <h2 className="text-xl md:text-2xl font-bold mb-2 text-[#111827]">Attachments & Initials</h2>
                                    <p className="text-sm text-[#374151]">
                                        Configure attachments and signature requirements.
                                    </p>
                                </div>

                                <div className="w-full mb-8">
                                    <TemplateEditor onEditorContentChange={setEditorContent} />
                                </div>

                                {detectedVars.length > 0 && (
                                    <div className="w-full max-w-2xl mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                        <p className="text-xs font-semibold text-blue-700 mb-2">Detected placeholders ({detectedVars.length}):</p>
                                        <div className="flex flex-wrap gap-2">
                                            {detectedVars.map((v) => (
                                                <span key={v.key} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-mono">{`{{${v.key}}}`}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-center w-full">
                                    <PrimaryActionButton
                                        onClick={handleFinish}
                                        disabled={createTemplate.isPending}
                                        text={createTemplate.isPending ? 'Saving...' : 'Finish'}
                                        className="!bg-[#3D7475] min-w-[200px] disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTemplateWizard;
