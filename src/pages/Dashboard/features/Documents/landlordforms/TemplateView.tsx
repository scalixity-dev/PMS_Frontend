import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronLeft, X, FileText } from 'lucide-react';
import ReviewSuccessModal from './components/ReviewSuccessModal';
import { getTemplateHTML } from './utils/templateUtils';

// Mock data for properties and tenants
const MOCK_PROPERTIES = ['Luxury Property', 'Downtown Apartment', 'Beach House', 'Mountain Villa'];
const MOCK_TENANTS = ['Luxury Property', 'John Doe', 'Jane Smith', 'Bob Johnson'];
const MOCK_LEASES = ['Lease 1', 'Lease 2', 'Lease 3', 'Lease 4'];

const TemplateView: React.FC = () => {
    const navigate = useNavigate();
    const { templateName } = useParams<{ templateName: string }>();

    const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);
    const [isUseTemplateModalOpen, setIsUseTemplateModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState('Luxury Property');
    const [selectedLease, setSelectedLease] = useState('Lease 1');
    const [selectedTenants, setSelectedTenants] = useState('Luxury Property');
    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
    const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);
    const [isTenantsDropdownOpen, setIsTenantsDropdownOpen] = useState(false);
    const propertyDropdownRef = useRef<HTMLDivElement>(null);
    const leaseDropdownRef = useRef<HTMLDivElement>(null);
    const tenantsDropdownRef = useRef<HTMLDivElement>(null);
    const documentContentRef = useRef<HTMLDivElement>(null);

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
            if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target as Node)) {
                setIsActionsDropdownOpen(false);
            }
            if (propertyDropdownRef.current && !propertyDropdownRef.current.contains(event.target as Node)) {
                setIsPropertyDropdownOpen(false);
            }
            if (leaseDropdownRef.current && !leaseDropdownRef.current.contains(event.target as Node)) {
                setIsLeaseDropdownOpen(false);
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
        if (isUseTemplateModalOpen || isPreviewModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isUseTemplateModalOpen, isPreviewModalOpen]);

    const handlePrint = () => {
        setIsActionsDropdownOpen(false);
        // Close preview modal if open
        setIsPreviewModalOpen(false);
        // Trigger browser print dialog directly
        setTimeout(() => {
            window.print();
        }, 100);
    };

    const handlePreview = () => {
        setIsActionsDropdownOpen(false);
        setIsPreviewModalOpen(true);
    };



    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10 print:max-w-none print:pb-0">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] print:hidden">
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

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem] print:bg-white print:p-0">
                {/* Header with Title and Buttons */}
                <div className="flex items-center gap-4 mb-6 print:hidden">
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
                                        onClick={handlePrint}
                                        className="w-full text-center px-4 py-3 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Print
                                    </button>
                                    <div className="border-t border-gray-200"></div>
                                    <button
                                        onClick={handlePreview}
                                        className="w-full text-center px-4 py-3 text-base text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Preview
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>



                {/* Content Area - Mock Document Preview */}
                <div className="bg-white rounded-2xl shadow-sm h-[calc(100vh-140px)] flex flex-col print:h-auto print:shadow-none print:rounded-none">
                    {/* Document Header - Fixed */}
                    <div className="flex items-center gap-3 px-8 pt-6 pb-4 border-b border-gray-200 flex-shrink-0 print:hidden">
                        <FileText className="w-6 h-6 text-[#3A6D6C]" />
                        <h2 className="text-xl font-semibold text-gray-800">{decodedTemplateName}</h2>
                    </div>

                    {/* Scrollable Document Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 print:overflow-visible print:px-0">
                        <div
                            ref={documentContentRef}
                            className="max-w-4xl mx-auto space-y-6 text-gray-700"
                            dangerouslySetInnerHTML={{ __html: getTemplateHTML(decodedTemplateName) }}
                        />
                    </div>
                </div>
            </div>

            {/* Use Template Modal */}
            {isUseTemplateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-800/50  animate-in fade-in duration-200 print:hidden">
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

                                {/* Lease Dropdown */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Lease<span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative" ref={leaseDropdownRef}>
                                        <button
                                            onClick={() => setIsLeaseDropdownOpen(!isLeaseDropdownOpen)}
                                            className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors"
                                        >
                                            <span>{selectedLease}</span>
                                            <ChevronDown
                                                size={18}
                                                className={`text-gray-500 transition-transform ${isLeaseDropdownOpen ? 'rotate-180' : ''}`}
                                            />
                                        </button>
                                        {isLeaseDropdownOpen && (
                                            <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {MOCK_LEASES.map((lease) => (
                                                    <button
                                                        key={lease}
                                                        onClick={() => {
                                                            setSelectedLease(lease);
                                                            setIsLeaseDropdownOpen(false);
                                                        }}
                                                        className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        {lease}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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

            {/* Preview Modal */}
            {isPreviewModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 animate-in fade-in duration-200 print:hidden">
                    <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] shadow-2xl mx-4 flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Preview Header */}
                        <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                            <h2 className="text-white text-lg font-semibold">Document Preview - {decodedTemplateName}</h2>
                            <button
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="hover:bg-white/10 p-2 rounded-full transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        {/* Preview Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                            <div className="max-w-4xl mx-auto bg-white p-12 rounded-lg shadow-sm">
                                {documentContentRef.current && (
                                    <div dangerouslySetInnerHTML={{ __html: documentContentRef.current.innerHTML }} />
                                )}
                            </div>
                        </div>

                        {/* Preview Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl flex-shrink-0">
                            <button
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                            >
                                Close
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-6 py-2.5 bg-[#3A6D6C] text-white rounded-lg hover:bg-[#2d5650] transition-colors font-medium"
                            >
                                Print Document
                            </button>
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

