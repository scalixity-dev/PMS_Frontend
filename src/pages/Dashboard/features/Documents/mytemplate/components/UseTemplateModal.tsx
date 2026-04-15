import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, ChevronDown } from 'lucide-react';
import { useGetAllProperties } from '../../../../../../hooks/usePropertyQueries';
import { useGetAllLeases } from '../../../../../../hooks/useLeaseQueries';
import { useGetAllTenants } from '../../../../../../hooks/useTenantQueries';
import { useRenderTemplate } from '../../../../../../hooks/useDocumentsQueries';

interface UseTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName: string;
    templateId?: string | number;
}

const UseTemplateModal: React.FC<UseTemplateModalProps> = ({ isOpen, onClose, templateName, templateId }) => {
    const navigate = useNavigate();
    const [selectedProperty, setSelectedProperty] = useState('');
    const [selectedLease, setSelectedLease] = useState('');
    const [selectedTenants, setSelectedTenants] = useState('');

    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
    const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);
    const [isTenantsDropdownOpen, setIsTenantsDropdownOpen] = useState(false);

    const propertyDropdownRef = useRef<HTMLDivElement>(null);
    const leaseDropdownRef = useRef<HTMLDivElement>(null);
    const tenantsDropdownRef = useRef<HTMLDivElement>(null);

    // Real data from API
    const { data: propertiesData = [] } = useGetAllProperties(true, isOpen);
    const { data: leasesData = [] } = useGetAllLeases(undefined, undefined, isOpen);
    const { data: tenantsData = [] } = useGetAllTenants(undefined, isOpen);
    const renderMutation = useRenderTemplate();

    const propertyOptions = useMemo(() => {
        const arr = Array.isArray(propertiesData) ? propertiesData : [];
        return arr.map((p: any) => p.propertyName).filter(Boolean) as string[];
    }, [propertiesData]);

    const leaseOptions = useMemo(() => {
        const arr = Array.isArray(leasesData) ? leasesData : [];
        return arr.map((l: any) => {
            const propertyName = l.property?.propertyName || 'Property';
            const tenantName = l.tenant?.fullName || 'Tenant';
            return `${propertyName} - ${tenantName}`;
        }).filter(Boolean) as string[];
    }, [leasesData]);

    const tenantOptions = useMemo(() => {
        const arr = Array.isArray(tenantsData) ? tenantsData : [];
        return arr.map((t: any) => {
            const name = [t.firstName, t.lastName].filter(Boolean).join(' ').trim() || t.user?.fullName || t.user?.email || '';
            return name;
        }).filter(Boolean) as string[];
    }, [tenantsData]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const handleUseTemplate = async () => {
        // Call renderTemplate if we have a string templateId
        if (templateId && typeof templateId === 'string') {
            try {
                await renderMutation.mutateAsync({
                    id: templateId,
                    dto: {
                        values: {
                            ...(selectedTenants ? { tenantName: selectedTenants } : {}),
                            ...(selectedProperty ? { propertyAddress: selectedProperty } : {}),
                        }
                    }
                });
            } catch {
                // non-blocking
            }
        }
        onClose();
        navigate(`/dashboard/documents/landlord-forms/use-template/${encodeURIComponent(templateName)}`, {
            state: {
                returnPath: `/dashboard/documents/my-templates/${templateId}`,
                templateId,
                selectedProperty,
                selectedLease,
                selectedTenants: [selectedTenants]
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-800/50 animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm md:max-w-2xl shadow-2xl overflow-visible animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="bg-[#3A6D6C] px-4 md:px-6 py-4 flex items-center justify-between rounded-t-2xl text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-sm md:text-base font-medium line-clamp-1">Select a property and lease</span>
                    </div>
                    <button onClick={onClose} className="hover:bg-white/10 p-1 rounded-full transition-colors shrink-0">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-700 text-sm mb-6">Select a property and a lease below and proceed to creating a lease agreement and requesting signature</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Property<span className="text-red-500">*</span></label>
                            <div className="relative" ref={propertyDropdownRef}>
                                <button onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors text-sm">
                                    <span className="truncate">{selectedProperty || 'Select property'}</span>
                                    <ChevronDown size={18} className={`text-gray-500 transition-transform shrink-0 ${isPropertyDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isPropertyDropdownOpen && (
                                    <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {propertyOptions.map((p) => (
                                            <button key={p} onClick={() => { setSelectedProperty(p); setIsPropertyDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">{p}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Lease<span className="text-red-500">*</span></label>
                            <div className="relative" ref={leaseDropdownRef}>
                                <button onClick={() => setIsLeaseDropdownOpen(!isLeaseDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors text-sm">
                                    <span className="truncate">{selectedLease || 'Select lease'}</span>
                                    <ChevronDown size={18} className={`text-gray-500 transition-transform shrink-0 ${isLeaseDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isLeaseDropdownOpen && (
                                    <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {leaseOptions.map((l) => (
                                            <button key={l} onClick={() => { setSelectedLease(l); setIsLeaseDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">{l}</button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Tenants<span className="text-red-500">*</span></label>
                        <div className="relative" ref={tenantsDropdownRef}>
                            <button onClick={() => setIsTenantsDropdownOpen(!isTenantsDropdownOpen)} className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors text-sm">
                                <span className="truncate">{selectedTenants || 'Select tenant'}</span>
                                <ChevronDown size={18} className={`text-gray-500 transition-transform shrink-0 ${isTenantsDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {isTenantsDropdownOpen && (
                                <div className="absolute z-[200] w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {tenantOptions.map((t) => (
                                        <button key={t} onClick={() => { setSelectedTenants(t); setIsTenantsDropdownOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">{t}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-center mt-auto md:mt-0">
                        <button
                            onClick={handleUseTemplate}
                            disabled={renderMutation.isPending}
                            className="w-full md:w-auto bg-[#3A6D6C] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2d5650] transition-colors shadow-md disabled:opacity-60"
                        >
                            {renderMutation.isPending ? 'Processing...' : 'Use Template'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UseTemplateModal;
