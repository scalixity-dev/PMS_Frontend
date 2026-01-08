import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Plus, X } from 'lucide-react';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';
import TemplateEditor from '../components/TemplateEditor';
import { getTemplateHTML } from './utils/templateUtils';

// --- Constants & Types ---

const MOCK_TENANTS = ['Luxury Property', 'John Doe', 'Jane Smith', 'Bob Johnson'];
const MOCK_LEASES = ['Lease Agreement 001', 'Lease Agreement 002', 'Lease Agreement 003'];

const STEPS = [
    { num: 1, label: 'Lease' },
    { num: 2, label: 'Tenants' },
    { num: 3, label: 'Templates & Signature' }
] as const;

type StepNumber = typeof STEPS[number]['num'];

// --- Sub-components ---

interface StepHeaderProps {
    title: string;
    description: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({ title, description }) => (
    <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
    </div>
);

interface WizardDropdownProps {
    label: string;
    placeholder: string;
    options: string[];
    selectedValue?: string;
    selectedValues?: string[];
    onSelect: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    dropdownRef: React.RefObject<HTMLDivElement | null>;
    onNext: () => void;
    disabled?: boolean;
    multiple?: boolean;
}

const WizardDropdown: React.FC<WizardDropdownProps> = ({
    label,
    placeholder,
    options,
    selectedValue,
    selectedValues = [],
    onSelect,
    isOpen,
    setIsOpen,
    dropdownRef,
    onNext,
    disabled = false,
    multiple = false,
}) => (
    <div className="w-full max-w-md">
        <label className="block text-left text-sm font-semibold text-gray-700 mb-2">
            {label}
        </label>
        <div className="flex items-center gap-3">
            <div className="relative flex-1" ref={dropdownRef}>
                <button
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    disabled={disabled}
                    className={`w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white ${disabled ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'text-gray-500 hover:border-[#20CC95]'} transition-colors`}
                >
                    <span className="truncate">
                        {multiple
                            ? (selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder)
                            : (selectedValue || placeholder)
                        }
                    </span>
                    <ChevronDown
                        size={18}
                        className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                {isOpen && (
                    <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {options.map((option) => {
                            const isSelected = multiple ? selectedValues.includes(option) : selectedValue === option;
                            return (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onSelect(option);
                                        if (!multiple) setIsOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between ${isSelected ? 'bg-green-50 text-[#20CC95] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                    <span>{option}</span>
                                    {multiple && (
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-[#20CC95] border-[#20CC95]' : 'border-gray-300'}`}>
                                            {isSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
            <PrimaryActionButton
                onClick={onNext}
                disabled={multiple ? selectedValues.length === 0 : !selectedValue}
                text="Next"
                className="!bg-[#3D7475] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            />

        </div>
        {multiple && selectedValues.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
                {selectedValues.map((value) => (
                    <div
                        key={value}
                        className="flex items-center gap-2 bg-[#E0F2F1] text-[#2B5251] px-3 py-1.5 rounded-full text-sm font-medium border border-[#B2DFDB]"
                    >
                        <span>{value}</span>
                        <button
                            onClick={() => onSelect(value)}
                            className="hover:bg-[#B2DFDB] rounded-full p-0.5 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
);

interface LocationState {
    returnPath?: string;
    selectedProperty?: string;
}

// --- Main Component ---

const UseTemplateWizard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const { templateName, id } = useParams<{ templateName?: string; id?: string }>();

    const [currentStep, setCurrentStep] = useState<StepNumber>(1);
    const [selectedLease, setSelectedLease] = useState(id ? `Lease ${id}` : '');

    const [selectedTenants, setSelectedTenants] = useState<string[]>(id ? ['John Doe'] : []); // Mock pre-selection for lease context
    const [templates, setTemplates] = useState(['Template 1', 'Template 2', 'Template 3']);
    const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
    const [templateContents, setTemplateContents] = useState<string[]>(() => {
        const initialContent = templateName ? getTemplateHTML(decodeURIComponent(templateName)) : '<p>Start typing your notice here...</p>';
        return [initialContent, '', ''];
    });
    const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);
    const [isTenantsDropdownOpen, setIsTenantsDropdownOpen] = useState(false);

    const leaseDropdownRef = useRef<HTMLDivElement>(null);
    const tenantsDropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (leaseDropdownRef.current && !leaseDropdownRef.current.contains(event.target as Node)) {
                setIsLeaseDropdownOpen(false);
            }
            if (tenantsDropdownRef.current && !tenantsDropdownRef.current.contains(event.target as Node)) {
                setIsTenantsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as StepNumber);
        } else {
            navigate(-1);
        }
    };

    const handleAddTemplate = () => {
        const nextNum = templates.length + 1;
        const newTemplateName = `Template ${nextNum}`;
        setTemplates(prev => [...prev, newTemplateName]);
        setTemplateContents(prev => [...prev, '']);
        setActiveTemplateIndex(templates.length);
    };

    const handleDeleteTemplate = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (templates.length <= 1) return;

        setTemplates(prev => prev.filter((_, i) => i !== index));
        setTemplateContents(prev => prev.filter((_, i) => i !== index));

        if (activeTemplateIndex >= index && activeTemplateIndex > 0) {
            setActiveTemplateIndex(prev => prev - 1);
        } else if (activeTemplateIndex >= templates.length - 1) {
            setActiveTemplateIndex(Math.max(0, templates.length - 2));
        }
    };

    const handleSendToReview = () => {
        const returnPath = state?.returnPath || (id ? `/dashboard/portfolio/leases/${id}` : `/dashboard/documents/landlord-forms/template/${templateName}`);
        navigate(returnPath, {
            state: {
                showSuccessPopup: true,
                leaseName: selectedLease,
                propertyName: 'abc' // Placeholder property name
            }
        });
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="w-full flex flex-col items-center">
                        <StepHeader title="Lease" description="First, select the lease from the dropdown menu" />
                        <WizardDropdown
                            label="Lease"
                            placeholder="Search a Lease"
                            options={MOCK_LEASES}
                            selectedValue={selectedLease}
                            onSelect={setSelectedLease}
                            isOpen={isLeaseDropdownOpen}
                            setIsOpen={setIsLeaseDropdownOpen}
                            dropdownRef={leaseDropdownRef}
                            onNext={() => setCurrentStep(2)}
                            // Lock dropdown if lease ID is provided (context mode)
                            disabled={!!id}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="w-full flex flex-col items-center">
                        <StepHeader title="Tenants" description="Select the tenants for this lease" />
                        <WizardDropdown
                            label="Tenants"
                            placeholder="Search Tenants"
                            options={MOCK_TENANTS}
                            selectedValues={selectedTenants}
                            onSelect={(tenant) => {
                                setSelectedTenants(prev =>
                                    prev.includes(tenant)
                                        ? prev.filter(t => t !== tenant)
                                        : [...prev, tenant]
                                );
                            }}
                            isOpen={isTenantsDropdownOpen}
                            setIsOpen={setIsTenantsDropdownOpen}
                            dropdownRef={tenantsDropdownRef}
                            onNext={() => setCurrentStep(3)}
                            multiple={true}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="w-full">
                        <div className="mb-6 text-left">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">{templates[activeTemplateIndex]}</h1>

                            {/* Dark Teal Header Bar */}
                            <div className="bg-[#3A6D6C] rounded-xl md:rounded-full px-4 md:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between mb-8 overflow-x-auto">
                                <div className="flex items-center gap-2 md:gap-6 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                    {templates.map((template, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setActiveTemplateIndex(index)}
                                            className={`flex-shrink-0 flex items-center gap-2 font-bold transition-all whitespace-nowrap ${activeTemplateIndex === index
                                                ? 'bg-[#82D64D] text-white px-4 md:px-5 py-2 rounded-full shadow-sm'
                                                : 'text-[#CCE0DF] hover:text-white px-2'
                                                }`}
                                        >
                                            {activeTemplateIndex === index ? template : index + 1}
                                            {activeTemplateIndex === index && (
                                                <X
                                                    size={16}
                                                    className="hover:bg-black/20 rounded-full p-0.5 transition-colors"
                                                    onClick={(e) => handleDeleteTemplate(index, e)}
                                                />
                                            )}
                                        </button>
                                    ))}
                                    <button
                                        onClick={handleAddTemplate}
                                        className="text-[#CCE0DF] hover:text-white font-bold flex items-center gap-2 px-2 transition-all flex-shrink-0"
                                    >
                                        <Plus size={18} className="border-2 border-[#CCE0DF] rounded-full p-0.5" />
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Reusing TemplateEditor */}
                            <TemplateEditor
                                key={activeTemplateIndex}
                                initialEditorContent={templateContents[activeTemplateIndex]}
                                onEditorContentChange={(content) => {
                                    setTemplateContents(prev => {
                                        const next = [...prev];
                                        next[activeTemplateIndex] = content;
                                        return next;
                                    });
                                }}
                                showPreviewButton={true}
                                showSignatureSection={true}
                            />
                        </div>

                        {/* Final Action Buttons */}
                        <div className="flex flex-col-reverse md:flex-row items-center gap-4 mt-8 md:mt-10">
                            <PrimaryActionButton
                                onClick={() => navigate(-1)}
                                text="Save as Draft"
                                className="!bg-white !text-gray-700 !w-full md:!w-auto !px-10 !py-3.5 !font-bold shadow-[0px_4px_8px_0px_#00000030] hover:!bg-gray-50 transition-colors border border-gray-100"
                            />
                            <PrimaryActionButton
                                onClick={handleSendToReview}
                                text="Send to Review"
                                className="!bg-[#3A6D6C] !w-full md:!w-auto !px-10 !py-3.5 !font-bold shadow-[0px_4px_8px_0px_#00000030] hover:!bg-[#2d5650] transition-colors"
                            />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col h-full w-full bg-[var(--color-background)] px-2 md:px-6 overflow-y-auto">
            <div className="flex-1 flex items-start justify-center pt-4 md:pt-8 pb-10">
                <div className={`bg-[#DFE5E3] rounded-3xl shadow-lg w-full ${currentStep >= 3 ? 'max-w-5xl' : 'max-w-2xl'} min-h-[500px] p-4 md:p-12 transition-all duration-300`}>

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
                            <div className="absolute top-4 left-[16.66%] right-[16.66%] h-[3px] bg-gray-200 -translate-y-1/2 z-0">
                                <div
                                    className="h-full bg-[#20CC95] transition-all duration-300 ease-in-out"
                                    style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
                                />
                            </div>

                            {/* Steps */}
                            <div className="grid grid-cols-3 relative z-10">
                                {STEPS.map((step) => (
                                    <div key={step.num} className="flex flex-col items-center gap-2 md:gap-3">
                                        <div
                                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${currentStep >= step.num ? 'bg-[#20CC95] text-white' : 'bg-[#6B7280] text-white'
                                                }`}
                                        >
                                            {step.num}
                                        </div>
                                        <span className={`text-xs md:text-sm font-medium text-center ${currentStep === step.num ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {step.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex flex-col items-center justify-start w-full">
                        {renderStepContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UseTemplateWizard;
