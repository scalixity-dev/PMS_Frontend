import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronLeft, X } from 'lucide-react';
import ReviewSuccessModal from './components/ReviewSuccessModal';

// Mock data for templates - in real app, this would come from API
const MOCK_TEMPLATES = [
    '24-Hour Notice to Enter',
    'Basic Residential Lease Agreement',
    'Inspection Checklist Addendum',
    'Lead-Based Paint Disclosure',
    'Lease Agreement',
    'Notice of Rent Increase',
    'Pet Addendum to Rental Agreement',
    'Rules Addendum'
];

// Mock data for properties and tenants
const MOCK_PROPERTIES = ['Luxury Property', 'Downtown Apartment', 'Beach House', 'Mountain Villa'];
const MOCK_TENANTS = ['Luxury Property', 'John Doe', 'Jane Smith', 'Bob Johnson'];

const TemplateView: React.FC = () => {
    const navigate = useNavigate();
    const { templateName } = useParams<{ templateName: string }>();
    const [selectedTemplate, setSelectedTemplate] = useState(templateName || '24-Hour Notice to Enter');
    const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
    const templateDropdownRef = useRef<HTMLDivElement>(null);
    const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);
    const [isUseTemplateModalOpen, setIsUseTemplateModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState('Luxury Property');
    const [selectedLease, setSelectedLease] = useState('');
    const [selectedTenants, setSelectedTenants] = useState('Luxury Property');
    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
    const [isTenantsDropdownOpen, setIsTenantsDropdownOpen] = useState(false);
    const propertyDropdownRef = useRef<HTMLDivElement>(null);
    const tenantsDropdownRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successData, setSuccessData] = useState({ leaseName: '', propertyName: '' });

    useEffect(() => {
        if (location.state?.showSuccessPopup) {
            setIsSuccessModalOpen(true);
            setSuccessData({
                leaseName: location.state.leaseName || 'Lease 9',
                propertyName: location.state.propertyName || 'abc'
            });
            // Clear location state to prevent modal from showing again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    // Decode template name from URL
    const decodedTemplateName = templateName ? decodeURIComponent(templateName) : '24-Hour Notice to Enter';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (templateDropdownRef.current && !templateDropdownRef.current.contains(event.target as Node)) {
                setIsTemplateDropdownOpen(false);
            }
            if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target as Node)) {
                setIsActionsDropdownOpen(false);
            }
            if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(event.target as Node)) {
                setIsPropertyDropdownOpen(false);
            }
            if (tenantsDropdownRef.current && !tenantsDropdownRef.current.contains(event.target as Node)) {
                setIsTenantsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isUseTemplateModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isUseTemplateModalOpen]);

    const handleTemplateSelect = (template: string) => {
        setSelectedTemplate(template);
        setIsTemplateDropdownOpen(false);
        // Navigate to the new template view
        navigate(`/documents/landlord-forms/template/${encodeURIComponent(template)}`);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span
                    className="text-[#4ad1a6] text-sm font-semibold cursor-pointer"
                    onClick={() => navigate('/documents/landlord-forms')}
                >
                    Landlord forms
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{decodedTemplateName}</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Header with Title and Buttons */}
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)} className="p-1 hover:text-gray-600 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-800" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{decodedTemplateName}</h1>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsUseTemplateModalOpen(true)}
                            className="bg-[#3A6D6C] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d5650] transition-colors"
                        >
                            Use Template
                        </button>
                        <div className="relative" ref={actionsDropdownRef}>
                            <button
                                onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                                className="bg-[#3A6D6C] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d5650] transition-colors flex items-center gap-2"
                            >
                                Actions
                                <ChevronDown
                                    size={16}
                                    className={`text-white transition-transform ${isActionsDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {isActionsDropdownOpen && (
                                <div className="absolute left-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                                    <button
                                        onClick={() => {
                                            // Handle print action
                                            setIsActionsDropdownOpen(false);
                                        }}
                                        className="w-full text-center px-4 py-3 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Print
                                    </button>
                                    <div className="border-t border-gray-200"></div>
                                    <button
                                        onClick={() => {
                                            // Handle preview action
                                            setIsActionsDropdownOpen(false);
                                        }}
                                        className="w-full text-center px-4 py-3 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Preview
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Dark Teal Bar with Template Dropdown */}
                <div className="bg-[#3A6D6C] rounded-full px-4 py-3 flex items-center justify-center mb-6">
                    <div className="relative" ref={templateDropdownRef}>
                        <button
                            onClick={() => setIsTemplateDropdownOpen(!isTemplateDropdownOpen)}
                            className="flex items-center gap-2 bg-white text-[#3A6D6C] px-4 py-2 rounded-full font-medium hover:bg-gray-50 transition-colors"
                        >
                            <span>Template</span>
                            <ChevronDown
                                size={18}
                                className={`text-[#3A6D6C] transition-transform ${isTemplateDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {isTemplateDropdownOpen && (
                            <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto scrollbar-hide">
                                {MOCK_TEMPLATES.map((template) => (
                                    <button
                                        key={template}
                                        onClick={() => handleTemplateSelect(template)}
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${selectedTemplate === template
                                            ? 'bg-gray-50 text-[#3A6D6C] font-semibold'
                                            : 'text-gray-700'
                                            } ${template === MOCK_TEMPLATES[0] ? 'rounded-t-lg' : ''} ${template === MOCK_TEMPLATES[MOCK_TEMPLATES.length - 1] ? 'rounded-b-lg' : ''
                                            }`}
                                    >
                                        {template}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-sm min-h-[600px]">
                    {/* Template content will be displayed here */}
                </div>
            </div>

            {/* Use Template Modal */}
            {isUseTemplateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-800/50  animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-visible mx-4 animate-in zoom-in-95 duration-200">
                        {/* Header - Dark Teal */}
                        <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsUseTemplateModalOpen(false)}
                                    className="hover:bg-white/10 p-1 rounded-full transition-colors"
                                >
                                    <ChevronLeft size={24} className="text-white" />
                                </button>
                                <span className="text-white text-base font-medium">
                                    Add Select a property and lease to proceed with this template
                                </span>
                            </div>
                            <button
                                onClick={() => setIsUseTemplateModalOpen(false)}
                                className="hover:bg-white/10 p-1 rounded-full transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        {/* Content Area - White */}
                        <div className="p-8 overflow-visible">
                            <p className="text-gray-700 text-sm mb-6">
                                Select a property and a lease below and proceed to creating a lease agreement and requesting signature
                            </p>

                            {/* Row 1: Property and Lease */}
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {/* Property Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Property<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative" ref={propertyDropdownRef}>
                                        <button
                                            onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                                            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors"
                                        >
                                            <span>{selectedProperty}</span>
                                            <ChevronDown
                                                size={18}
                                                className={`text-gray-500 transition-transform ${isPropertyDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {isPropertyDropdownOpen && (
                                            <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {MOCK_PROPERTIES.map((property) => (
                                                    <button
                                                        key={property}
                                                        onClick={() => {
                                                            setSelectedProperty(property);
                                                            setIsPropertyDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        {property}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Lease Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Lease<span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedLease}
                                        onChange={(e) => setSelectedLease(e.target.value)}
                                        placeholder="Type here"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* Row 2: Tenants Dropdown */}
                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Tenants<span className="text-red-500">*</span>
                                </label>
                                <div className="relative" ref={tenantsDropdownRef}>
                                    <button
                                        onClick={() => setIsTenantsDropdownOpen(!isTenantsDropdownOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors"
                                    >
                                        <span>{selectedTenants}</span>
                                        <ChevronDown
                                            size={18}
                                            className={`text-gray-500 transition-transform ${isTenantsDropdownOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    {isTenantsDropdownOpen && (
                                        <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {MOCK_TENANTS.map((tenant) => (
                                                <button
                                                    key={tenant}
                                                    onClick={() => {
                                                        setSelectedTenants(tenant);
                                                        setIsTenantsDropdownOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                >
                                                    {tenant}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Use Template Button */}
                            <div className="flex justify-center">
                                <button
                                    onClick={() => {
                                        // Close modal and navigate to wizard page
                                        setIsUseTemplateModalOpen(false);
                                        navigate(`/documents/landlord-forms/use-template/${encodeURIComponent(decodedTemplateName)}`);
                                    }}
                                    className="bg-[#3A6D6C] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2d5650] transition-colors"
                                >
                                    Use Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ReviewSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                leaseName={successData.leaseName}
                propertyName={successData.propertyName}
            />
        </div>
    );
};

export default TemplateView;

