import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, FileText, FileWarning, Lightbulb, Check } from 'lucide-react';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';
import TemplateEditor from '../components/TemplateEditor';

const CreateTemplateWizard: React.FC = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [title, setTitle] = useState('');
    const [templateType, setTemplateType] = useState('');
    const [editorContent, setEditorContent] = useState('');

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            navigate(-1);
        }
    };

    const handleFinish = () => {
        // Create new template object
        const newTemplate = {
            id: Date.now(),
            title: title,
            subtitle: templateType === 'agreement' ? 'Tenants Agreements' : 'Tenants Notice',
            content: editorContent
        };

        // Get existing templates
        const saved = localStorage.getItem('myTemplates');
        const templates = saved ? JSON.parse(saved) : [];

        // Add new template and save
        const updatedTemplates = [...templates, newTemplate];
        localStorage.setItem('myTemplates', JSON.stringify(updatedTemplates));

        // Navigate back to list
        navigate('/documents/my-templates');
    };

    return (
        <div className="flex flex-col h-full w-full bg-[var(--color-background)] px-6 overflow-y-auto">
            <div className="flex-1 flex items-start justify-center pt-8">
                <div className={`bg-[#DFE5E3] rounded-3xl shadow-lg w-full min-h-[500px] p-12 transition-all duration-300 ${currentStep === 3 ? 'max-w-7xl' : 'max-w-2xl'}`}>
                    {/* Back Button */}
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-2 text-[#20CC95] font-semibold text-sm mb-12 hover:text-[#1db885] transition-colors"
                    >
                        <ChevronLeft size={18} />
                        BACK
                    </button>

                    {/* Step Indicators */}
                    <div className="w-full max-w-3xl mx-auto mb-12">
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
                                    <div key={step.num} className="flex flex-col items-center gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${currentStep >= step.num
                                                ? 'bg-[#20CC95] text-white'
                                                : 'bg-[#6B7280] text-white'
                                                }`}
                                        >
                                            {step.num}
                                        </div>
                                        <span
                                            className={`text-sm font-medium text-center ${currentStep === step.num ? 'text-gray-900' : 'text-gray-500'
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
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2 text-[#111827]">Template title</h2>
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
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2 text-[#111827]">What is the template type?</h2>
                                    <p className="text-sm text-[#374151]">
                                        Select the type to display the template on the appropriate page.
                                    </p>
                                </div>

                                <div className="flex gap-8 mb-12">
                                    {/* Tenant Agreement Card */}
                                    <button
                                        onClick={() => setTemplateType('agreement')}
                                        className={`relative w-48 h-48 rounded-2xl bg-white border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group hover:shadow-md ${templateType === 'agreement'
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
                                        className={`relative w-48 h-48 rounded-2xl bg-white border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group hover:shadow-md ${templateType === 'notice'
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
                                    <p className="text-sm text-gray-600 leading-relaxed">
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
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold mb-2 text-[#111827]">Attachments & Initials</h2>
                                    <p className="text-sm text-[#374151]">
                                        Configure attachments and signature requirements.
                                    </p>
                                </div>

                                <div className="w-full mb-8">
                                    <TemplateEditor onEditorContentChange={setEditorContent} />
                                </div>

                                <div className="flex justify-center w-full">
                                    <PrimaryActionButton
                                        onClick={handleFinish}
                                        text="Finish"
                                        className="!bg-[#3D7475] min-w-[200px]"
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
