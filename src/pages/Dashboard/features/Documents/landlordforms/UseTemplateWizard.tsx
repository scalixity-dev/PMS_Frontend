import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Plus, X } from 'lucide-react';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';
import TemplateEditor from '../components/TemplateEditor';
import { Dialog, Transition } from '@headlessui/react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import successAnimationUrl from '../../ListUnit/Success.lottie?url';
import { useGetAllLeases } from '../../../../../hooks/useLeaseQueries';
import { useGetAllTenants } from '../../../../../hooks/useTenantQueries';
import { useGetTemplates, useRenderTemplate } from '../../../../../hooks/useDocumentsQueries';
import type { DocumentTemplate } from '../../../../../services/documents.service';

// --- Constants & Types ---

const FALLBACK_TENANTS: string[] = [];
const FALLBACK_LEASES: string[] = [];

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
        <label className="block text-left text-sm font-semibold text-gray-700 mb-2">{label}</label>
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
                    <ChevronDown size={18} className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
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
                    <div key={value} className="flex items-center gap-2 bg-[#E0F2F1] text-[#2B5251] px-3 py-1.5 rounded-full text-sm font-medium border border-[#B2DFDB]">
                        <span>{value}</span>
                        <button onClick={() => onSelect(value)} className="hover:bg-[#B2DFDB] rounded-full p-0.5 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
        )}
    </div>
);

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, title, description }) => {
    return (
        <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog as="div" className="relative z-[300]" onClose={onClose}>
                <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />
                </Transition.Child>
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child as={React.Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                                <div className="bg-[#3A6D6C] p-3 flex justify-end">
                                    <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors focus:outline-none"><X size={20} /></button>
                                </div>
                                <div className="p-6 flex flex-col items-center text-center">
                                    <div className="w-40 h-40 mb-4">
                                        <DotLottieReact src={successAnimationUrl} loop autoplay style={{ width: '100%', height: '100%' }} />
                                    </div>
                                    <Dialog.Title as="h3" className="text-xl font-bold text-gray-900 mb-2">{title}</Dialog.Title>
                                    <p className="text-gray-600 font-medium mb-8">{description}</p>
                                    <button type="button" className="w-full max-w-[200px] justify-center rounded-lg bg-[#3A6D6C] px-4 py-2 text-sm font-medium text-white hover:bg-[#2c5251] focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] focus:ring-offset-2 transition-colors" onClick={onClose}>
                                        Done
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

interface LocationState {
    returnPath?: string;
    selectedProperty?: string;
    selectedLease?: string;
    selectedTenants?: string[];
    templateId?: string;
}

// --- Main Component ---

const UseTemplateWizard: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;
    const { templateName, id } = useParams<{ templateName?: string; id?: string }>();

    const isAgreement = location.pathname.includes('send-agreement');
    const docTypeLabel = isAgreement ? 'Agreements' : 'Notices';

    const [currentStep, setCurrentStep] = useState<StepNumber>(1);
    const [selectedLease, setSelectedLease] = useState(state?.selectedLease || (id ? `Lease ${id}` : ''));
    const [selectedLeaseId, setSelectedLeaseId] = useState<string | undefined>(id);
    const [templateValues, setTemplateValues] = useState<Record<string, string>>({});

    // Fetch leases, tenants
    const { data: leasesData = [] } = useGetAllLeases(undefined, undefined, true);
    const { data: tenantsData = [] } = useGetAllTenants(undefined, true);

    // Fetch LANDLORD_FORM templates for the selection view
    const { data: apiTemplates = [] } = useGetTemplates({ category: 'LANDLORD_FORM', includeSystem: true });

    const renderMutation = useRenderTemplate();

    const leaseLabelToId = useMemo(() => {
        const arr = Array.isArray(leasesData) ? leasesData : [];
        const map: Record<string, string> = {};
        arr.forEach((l: any) => {
            const propertyName = l.property?.propertyName || 'Property';
            const tenantName = l.tenant?.fullName || 'Tenant';
            const label = `${propertyName} - ${tenantName}`;
            if (l.id) map[label] = l.id;
        });
        return map;
    }, [leasesData]);

    const leaseOptions = useMemo(() => {
        const labels = Object.keys(leaseLabelToId);
        return labels.length > 0 ? labels : FALLBACK_LEASES;
    }, [leaseLabelToId]);

    const selectedLeaseObj = useMemo(() => {
        const arr = Array.isArray(leasesData) ? leasesData : [];
        return arr.find((l: any) => l.id === selectedLeaseId) ?? null;
    }, [leasesData, selectedLeaseId]);

    const buildPrefilledValues = (tmpl: DocumentTemplate): Record<string, string> => {
        if (!tmpl.variables) return {};
        const pre: Record<string, string> = {};
        for (const v of tmpl.variables) {
            // Always initialise the key so the form renders every variable
            pre[v.key] = '';
            switch (v.key) {
                case 'tenantName':
                    pre[v.key] = (selectedLeaseObj as any)?.tenant?.fullName ?? '';
                    break;
                case 'propertyAddress': {
                    const addr = (selectedLeaseObj as any)?.property?.address;
                    pre[v.key] = addr
                        ? [addr.streetAddress, addr.city, addr.stateRegion, addr.zipCode].filter(Boolean).join(', ')
                        : '';
                    break;
                }
                case 'monthlyRent':
                    pre[v.key] = (selectedLeaseObj as any)?.recurringRent?.amount ?? '';
                    break;
                case 'depositAmount':
                    pre[v.key] = (selectedLeaseObj as any)?.deposits?.[0]?.amount ?? '';
                    break;
                case 'startDate': {
                    const d = (selectedLeaseObj as any)?.startDate;
                    pre[v.key] = d ? d.slice(0, 10) : '';
                    break;
                }
                case 'endDate': {
                    const d = (selectedLeaseObj as any)?.endDate;
                    pre[v.key] = d ? d.slice(0, 10) : '';
                    break;
                }
            }
        }
        return pre;
    };

    const tenantOptions = useMemo(() => {
        const arr = Array.isArray(tenantsData) ? tenantsData : [];
        const mapped = arr.map((t: any) => {
            const name = [t.firstName, t.lastName].filter(Boolean).join(' ').trim() || t.user?.fullName || t.user?.email || '';
            return name;
        }).filter(Boolean);
        return mapped.length > 0 ? mapped : FALLBACK_TENANTS;
    }, [tenantsData]);

    // Resolve initial template content from API or passed id
    const initialTemplate: DocumentTemplate | undefined = useMemo(() =>
        apiTemplates.find((t: DocumentTemplate) => t.id === state?.templateId || (templateName && t.title === decodeURIComponent(templateName))),
        [apiTemplates, state?.templateId, templateName]
    );

    const [selectedTenants, setSelectedTenants] = useState<string[]>(
        state?.selectedTenants ? state.selectedTenants : (id ? [''] : [])
    );
    const [templates, setTemplates] = useState(['Template 1', 'Template 2', 'Template 3']);
    const [activeTemplateIndex, setActiveTemplateIndex] = useState(0);
    const [templateContents, setTemplateContents] = useState<string[]>(() => {
        return [initialTemplate?.content ?? '', '', ''];
    });
    const [activeTemplateId, setActiveTemplateId] = useState<string | undefined>(initialTemplate?.id ?? state?.templateId);
    const [isEditorMode, setIsEditorMode] = useState<boolean>(!!templateName || !!state?.templateId);

    const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);
    const [isTenantsDropdownOpen, setIsTenantsDropdownOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const leaseDropdownRef = useRef<HTMLDivElement>(null);
    const tenantsDropdownRef = useRef<HTMLDivElement>(null);

    // Update content + pre-fill values when initial template loads from API
    useEffect(() => {
        if (initialTemplate) {
            if (!templateContents[0]) {
                setTemplateContents(prev => {
                    const next = [...prev];
                    next[0] = initialTemplate.content;
                    return next;
                });
                if (initialTemplate.id) setActiveTemplateId(initialTemplate.id);
            }
            // Always refresh values when lease data or template changes
            setTemplateValues(buildPrefilledValues(initialTemplate));
        }
    }, [initialTemplate, selectedLeaseObj]);

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
        setTemplates(prev => [...prev, `Template ${nextNum}`]);
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

    const handleUseTemplate = (tmpl: DocumentTemplate) => {
        setTemplates([tmpl.title]);
        setTemplateContents([tmpl.content]);
        setActiveTemplateIndex(0);
        setActiveTemplateId(tmpl.id);
        setTemplateValues(buildPrefilledValues(tmpl));
        setIsEditorMode(true);
    };

    const handleCreateNewTemplate = () => {
        setTemplates(['New Template']);
        setTemplateContents(['<p>Start typing your notice...</p>']);
        setActiveTemplateIndex(0);
        setActiveTemplateId(undefined);
        setTemplateValues({});
        setIsEditorMode(true);
    };

    const handleSendToReview = async () => {
        if (activeTemplateId) {
            try {
                await renderMutation.mutateAsync({
                    id: activeTemplateId,
                    dto: {
                        values: templateValues,
                        leaseId: selectedLeaseId,
                        sendToTenant: true,
                    }
                });
            } catch {
                // non-blocking — show success either way
            }
        }
        setIsSuccessModalOpen(true);
    };

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false);
        const returnPath = state?.returnPath || (id ? `/dashboard/leasing/leases/${id}` : `/dashboard/documents/landlord-forms/template/${templateName}`);
        navigate(returnPath, {
            state: {
                showSuccessPopup: true,
                leaseName: selectedLease,
                propertyName: 'abc'
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
                            options={leaseOptions}
                            selectedValue={selectedLease}
                            onSelect={(label) => {
                                setSelectedLease(label);
                                setSelectedLeaseId(leaseLabelToId[label]);
                            }}
                            isOpen={isLeaseDropdownOpen}
                            setIsOpen={setIsLeaseDropdownOpen}
                            dropdownRef={leaseDropdownRef}
                            onNext={() => setCurrentStep(2)}
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
                            options={tenantOptions}
                            selectedValues={selectedTenants}
                            onSelect={(tenant) => {
                                setSelectedTenants(prev =>
                                    prev.includes(tenant) ? prev.filter(t => t !== tenant) : [...prev, tenant]
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
                        {!isEditorMode ? (
                            <div className="w-full max-w-4xl mx-auto">
                                <div className="text-left mb-8">
                                    <h1 className="text-2xl font-bold text-gray-800 mb-2">{docTypeLabel} Templates</h1>
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <p className="text-sm text-gray-600 max-w-2xl">
                                            Select a {isAgreement ? 'lease agreement' : 'notice'} template from the available options, or copy and paste your text using the "+ Create New Template" button
                                        </p>
                                        <PrimaryActionButton onClick={handleCreateNewTemplate} text="+ Create New Template" className="!bg-[#3D7475] whitespace-nowrap" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-100">
                                                <tr>
                                                    <th className="px-6 py-4 font-semibold">Template</th>
                                                    <th className="px-6 py-4 font-semibold">Category</th>
                                                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {apiTemplates.map((tmpl: DocumentTemplate) => (
                                                    <tr key={tmpl.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 font-medium text-gray-900">{tmpl.title}</td>
                                                        <td className="px-6 py-4 text-gray-600">{tmpl.category}</td>
                                                        <td className="px-6 py-4 text-right">
                                                            <button
                                                                onClick={() => handleUseTemplate(tmpl)}
                                                                className="text-[#20CC95] hover:text-[#1db885] font-semibold text-sm border border-[#20CC95] hover:bg-[#20CC95] hover:text-white px-4 py-1.5 rounded-full transition-all"
                                                            >
                                                                Use template
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="mb-6 text-left">
                                    <div className="flex items-center justify-between mb-4 md:mb-6">
                                        <h1 className="text-xl md:text-2xl font-bold text-gray-800">{templates[activeTemplateIndex]}</h1>
                                        <button onClick={() => setIsEditorMode(false)} className="text-sm text-[#20CC95] hover:text-[#1db885] underline">Change Template</button>
                                    </div>

                                    <div className="bg-[#3A6D6C] rounded-xl md:rounded-full px-4 md:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between mb-8 overflow-x-auto">
                                        <div className="flex items-center gap-2 md:gap-6 w-full overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                                            {templates.map((template, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setActiveTemplateIndex(index)}
                                                    className={`flex-shrink-0 flex items-center gap-2 font-bold transition-all whitespace-nowrap ${activeTemplateIndex === index ? 'bg-[#82D64D] text-white px-4 md:px-5 py-2 rounded-full shadow-sm' : 'text-[#CCE0DF] hover:text-white px-2'}`}
                                                >
                                                    {activeTemplateIndex === index ? template : index + 1}
                                                    {activeTemplateIndex === index && (
                                                        <X size={16} className="hover:bg-black/20 rounded-full p-0.5 transition-colors" onClick={(e) => handleDeleteTemplate(index, e)} />
                                                    )}
                                                </button>
                                            ))}
                                            <button onClick={handleAddTemplate} className="text-[#CCE0DF] hover:text-white font-bold flex items-center gap-2 px-2 transition-all flex-shrink-0">
                                                <Plus size={18} className="border-2 border-[#CCE0DF] rounded-full p-0.5" />
                                                Add
                                            </button>
                                        </div>
                                    </div>

                                    {/* Variable form — auto-filled where we have data, empty for missing ones */}
                                    {activeTemplateId && Object.keys(templateValues).length > 0 && (
                                        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
                                            <h3 className="text-sm font-semibold text-gray-700 mb-1">Fill in Document Variables</h3>
                                            <p className="text-xs text-gray-400 mb-4">Some fields are auto-filled from your lease. Fill in any remaining required fields.</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {(apiTemplates.find((t: DocumentTemplate) => t.id === activeTemplateId)?.variables ?? []).map((v) => (
                                                    <div key={v.key} className="flex flex-col gap-1">
                                                        <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                                            {v.label}
                                                            {v.required && <span className="text-red-500">*</span>}
                                                        </label>
                                                        <input
                                                            type={v.type === 'date' ? 'date' : v.type === 'number' ? 'number' : 'text'}
                                                            value={templateValues[v.key] ?? ''}
                                                            onChange={(e) => setTemplateValues(prev => ({ ...prev, [v.key]: e.target.value }))}
                                                            className="px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:outline-none focus:border-[#3A6D6C] focus:ring-1 focus:ring-[#3A6D6C]"
                                                            placeholder={v.label}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

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
                                        previewValues={templateValues}
                                    />
                                </div>

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
                            </>
                        )}
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
                    <button onClick={handleBack} className="flex items-center gap-2 text-[#20CC95] font-semibold text-sm mb-6 md:mb-12 hover:text-[#1db885] transition-colors">
                        <ChevronLeft size={18} />
                        BACK
                    </button>

                    <div className="w-full max-w-3xl mx-auto mb-8 md:mb-12">
                        <div className="relative">
                            <div className="absolute top-4 left-[16.66%] right-[16.66%] h-[3px] bg-gray-200 -translate-y-1/2 z-0">
                                <div className="h-full bg-[#20CC95] transition-all duration-300 ease-in-out" style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }} />
                            </div>
                            <div className="grid grid-cols-3 relative z-10">
                                {STEPS.map((step) => (
                                    <div key={step.num} className="flex flex-col items-center gap-2 md:gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-300 ${currentStep >= step.num ? 'bg-[#20CC95] text-white' : 'bg-[#6B7280] text-white'}`}>
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

                    <div className="flex flex-col items-center justify-start w-full">
                        {renderStepContent()}
                    </div>
                </div>
            </div>

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
                title="Well Done !"
                description={isAgreement ? 'Your lease agreement request has been sent successfully.' : 'Your notice has been sent successfully.'}
            />
        </div>
    );
};

export default UseTemplateWizard;
