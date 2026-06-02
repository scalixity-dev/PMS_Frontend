import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronLeft, X, FileText } from 'lucide-react';
import DOMPurify from 'dompurify';
import ReviewSuccessModal from './components/ReviewSuccessModal';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import Breadcrumb from '../../../../../components/ui/Breadcrumb';
import { handleDocumentPrint } from '../utils/printPreviewUtils';
import { useGetTemplates } from '../../../../../hooks/useDocumentsQueries';
import type { DocumentTemplate } from '../../../../../services/documents.service';
import { useGetAllProperties } from '../../../../../hooks/usePropertyQueries';
import { useGetAllLeases } from '../../../../../hooks/useLeaseQueries';
import { useGetAllTenants } from '../../../../../hooks/useTenantQueries';

interface TemplateLocationState {
    showSuccessPopup?: boolean;
    leaseName?: string;
    propertyName?: string;
    templateId?: string;
}

const TemplateView: React.FC = () => {
    const navigate = useNavigate();
    const { templateName } = useParams<{ templateName: string }>();

    const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);
    const [isUseTemplateModalOpen, setIsUseTemplateModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedLease, setSelectedLease] = useState('');
    const [selectedTenants, setSelectedTenants] = useState('');
    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
    const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);
    const [isTenantsDropdownOpen, setIsTenantsDropdownOpen] = useState(false);
    const propertyDropdownRef = useRef<HTMLDivElement>(null);
    const leaseDropdownRef = useRef<HTMLDivElement>(null);
    const tenantsDropdownRef = useRef<HTMLDivElement>(null);
    const documentContentRef = useRef<HTMLDivElement>(null);

    const location = useLocation();
    const state = location.state as TemplateLocationState;
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successData, setSuccessData] = useState({ leaseName: '', propertyName: '' });

    const decodedTemplateName = templateName ? decodeURIComponent(templateName) : '';

    // Fetch templates to find this one by title or passed id
    const { data: templates = [] } = useGetTemplates({ category: 'LANDLORD_FORM', includeSystem: true });
    const template: DocumentTemplate | undefined = templates.find(
        (t: DocumentTemplate) => t.id === state?.templateId || t.title === decodedTemplateName
    );

    // Real data for dropdowns
    const { data: propertiesData = [] } = useGetAllProperties(true, false);
    const { data: leasesData = [] } = useGetAllLeases(undefined, undefined, true);
    const { data: tenantsData = [] } = useGetAllTenants(undefined, true);

    const propertyOptions: string[] = (Array.isArray(propertiesData) ? propertiesData : [])
        .map((p: any) => p.propertyName).filter(Boolean);
        
    const leaseOptions = useMemo(() => {
        let arr = Array.isArray(leasesData) ? leasesData : [];
        if (selectedProperty) {
            arr = arr.filter((l: any) => l.property?.propertyName === selectedProperty);
        }
        return arr.map((l: any) => `${l.property?.propertyName || 'Property'} - ${l.tenant?.fullName || 'Tenant'}`).filter(Boolean);
    }, [leasesData, selectedProperty]);

    const tenantOptions = useMemo(() => {
        const arr = Array.isArray(tenantsData) ? tenantsData : [];
        let filtered = arr;
        if (selectedLease) {
            const lease = (Array.isArray(leasesData) ? leasesData : []).find((l: any) => {
                const propertyName = l.property?.propertyName || 'Property';
                const tenantName = l.tenant?.fullName || 'Tenant';
                return `${propertyName} - ${tenantName}` === selectedLease;
            });
            if (lease && lease.tenantId) {
                filtered = arr.filter((t: any) => t.id === lease.tenantId || t.userId === lease.tenantId);
            }
        }
        return filtered.map((t: any) => {
            const name = [t.firstName, t.lastName].filter(Boolean).join(' ').trim() || t.user?.fullName || t.user?.email || '';
            return name;
        }).filter(Boolean);
    }, [tenantsData, selectedLease, leasesData]);

    useEffect(() => {
        if (state?.showSuccessPopup) {
            setIsSuccessModalOpen(true);
            setSuccessData({
                leaseName: state.leaseName || '',
                propertyName: state.propertyName || ''
            });
            window.history.replaceState({}, document.title);
        }
    }, [state]);

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
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isUseTemplateModalOpen || isPreviewModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isUseTemplateModalOpen, isPreviewModalOpen]);

    const handlePrint = () => {
        setIsActionsDropdownOpen(false);
        setIsPreviewModalOpen(false);
        handleDocumentPrint(documentContentRef, { title: decodedTemplateName });
    };

    const handlePreview = () => {
        setIsActionsDropdownOpen(false);
        setIsPreviewModalOpen(true);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10 print:max-w-none print:pb-0">
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 print:hidden scrollbar-hide">
                <Breadcrumb items={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Landlord forms', path: '/dashboard/documents/landlord-forms' }, { label: decodedTemplateName }]} />
            </div>

            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-2xl md:rounded-[2rem] print:bg-white print:p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button onClick={() => navigate(-1)} className="p-1 hover:text-gray-600 transition-colors flex-shrink-0">
                            <ChevronLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 break-words line-clamp-2">{decodedTemplateName}</h1>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setIsUseTemplateModalOpen(true)}
                            className="flex-1 md:flex-none bg-[#3A6D6C] text-white px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d5650] transition-colors whitespace-nowrap"
                        >
                            Use Template
                        </button>
                        <div className="relative" ref={actionsDropdownRef}>
                            <button
                                onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                                className="bg-[#3A6D6C] text-white px-4 md:px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#2d5650] transition-colors flex items-center gap-2 whitespace-nowrap"
                            >
                                Actions
                                <ChevronDown size={16} className={`text-white transition-transform ${isActionsDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isActionsDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                                    <button onClick={handlePrint} className="w-full text-center px-4 py-3 text-base text-gray-700 hover:bg-gray-50 transition-colors">Print</button>
                                    <div className="border-t border-gray-200"></div>
                                    <button onClick={handlePreview} className="w-full text-center px-4 py-3 text-base text-gray-700 hover:bg-gray-50 transition-colors">Preview</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm h-[calc(100vh-200px)] md:h-[calc(100vh-140px)] flex flex-col print:h-auto print:shadow-none print:rounded-none">
                    <div className="flex items-center gap-3 px-4 md:px-8 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-gray-200 flex-shrink-0 print:hidden">
                        <FileText className="w-5 h-5 md:w-6 md:h-6 text-[#3A6D6C]" />
                        <h2 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-1">{decodedTemplateName}</h2>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4 md:py-6 print:overflow-visible print:px-0">
                        <div
                            ref={documentContentRef}
                            className="max-w-4xl mx-auto space-y-6 text-gray-700 text-sm md:text-base"
                            dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(template?.content ?? '<p>Loading template...</p>')
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Use Template Modal */}
            {isUseTemplateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-gray-800/50 animate-in fade-in duration-200 print:hidden">
                    <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-2xl shadow-2xl overflow-visible mx-0 md:mx-4 animate-in slide-in-from-bottom-10 md:zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                        <div className="bg-[#3A6D6C] px-4 md:px-6 py-4 flex items-center justify-between rounded-t-2xl sticky top-0 z-10">
                            <div className="flex items-center gap-2 md:gap-3">
                                <button onClick={() => setIsUseTemplateModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                    <ChevronLeft size={24} className="text-white" />
                                </button>
                                <span className="text-white text-sm md:text-base font-medium line-clamp-1">Select a property and lease</span>
                            </div>
                            <button onClick={() => setIsUseTemplateModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        <div className="p-4 md:p-8 overflow-visible pb-safe">
                            <p className="text-gray-700 text-sm mb-6">Select a property and a lease below and proceed to creating a lease agreement and requesting signature</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Property<span className="text-red-500">*</span></label>
                                    <div className="relative" ref={propertyDropdownRef}>
                                        <button onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors">
                                            <span className="truncate">{selectedProperty || 'Select property'}</span>
                                            <ChevronDown size={18} className={`text-gray-500 flex-shrink-0 transition-transform ${isPropertyDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isPropertyDropdownOpen && (
                                            <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {propertyOptions.map((p) => (
                                                    <button key={p} onClick={() => { 
                                                        setSelectedProperty(p); 
                                                        setIsPropertyDropdownOpen(false); 
                                                        setSelectedLease(''); 
                                                        setSelectedTenants(''); 
                                                    }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors truncate">{p}</button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Lease<span className="text-red-500">*</span></label>
                                    <div className="relative" ref={leaseDropdownRef}>
                                        <button onClick={() => setIsLeaseDropdownOpen(!isLeaseDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors">
                                            <span className="truncate">{selectedLease || 'Select lease'}</span>
                                            <ChevronDown size={18} className={`text-gray-500 flex-shrink-0 transition-transform ${isLeaseDropdownOpen ? 'rotate-180' : ''}`} />
                                        </button>
                                        {isLeaseDropdownOpen && (
                                            <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {leaseOptions.map((l) => (
                                                    <button key={l} onClick={() => { 
                                                        setSelectedLease(l); 
                                                        setIsLeaseDropdownOpen(false); 
                                                        setSelectedTenants(''); 
                                                    }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors truncate">{l}</button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tenants<span className="text-red-500">*</span></label>
                                <div className="relative" ref={tenantsDropdownRef}>
                                    <button onClick={() => setIsTenantsDropdownOpen(!isTenantsDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors">
                                        <span className="truncate">{selectedTenants || 'Select tenant'}</span>
                                        <ChevronDown size={18} className={`text-gray-500 flex-shrink-0 transition-transform ${isTenantsDropdownOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    {isTenantsDropdownOpen && (
                                        <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                            {tenantOptions.map((t) => (
                                                <button key={t} onClick={() => { setSelectedTenants(t); setIsTenantsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors truncate">{t}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <button
                                    disabled={!selectedProperty || !selectedLease || !selectedTenants}
                                    onClick={() => {
                                        setIsUseTemplateModalOpen(false);
                                        navigate(`/dashboard/documents/landlord-forms/use-template/${encodeURIComponent(decodedTemplateName)}`, {
                                            state: {
                                                templateId: template?.id,
                                                selectedProperty,
                                                selectedLease,
                                                selectedTenants: [selectedTenants]
                                            }
                                        });
                                    }}
                                    className={`w-full md:w-auto bg-[#3A6D6C] text-white px-8 py-3 rounded-lg text-sm font-medium transition-colors ${
                                        !selectedProperty || !selectedLease || !selectedTenants
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'hover:bg-[#2d5650]'
                                    }`}
                                >
                                    Use Template
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <DocumentPreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                title={decodedTemplateName}
                contentRef={documentContentRef}
                customPrintHandler={handlePrint}
            />

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
