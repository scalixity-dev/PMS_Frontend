import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, X, ChevronDown } from 'lucide-react';

interface UseTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName: string;
    templateId?: string | number;
}

const UseTemplateModal: React.FC<UseTemplateModalProps> = ({ isOpen, onClose, templateName, templateId }) => {
    const navigate = useNavigate();
    const [selectedProperty, setSelectedProperty] = useState('Luxury Property');
    const [selectedLease, setSelectedLease] = useState('Lease 1');
    const [selectedTenants, setSelectedTenants] = useState('Luxury Property');

    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
    const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);
    const [isTenantsDropdownOpen, setIsTenantsDropdownOpen] = useState(false);

    const propertyDropdownRef = useRef<HTMLDivElement>(null);
    const leaseDropdownRef = useRef<HTMLDivElement>(null);
    const tenantsDropdownRef = useRef<HTMLDivElement>(null);

    // Mock constants
    const MOCK_PROPERTIES = ['Luxury Property', 'Downtown Apartment', 'Beach House', 'Mountain Villa'];
    const MOCK_TENANTS = ['Luxury Property', 'John Doe', 'Jane Smith', 'Bob Johnson'];
    const MOCK_LEASES = ['Lease 1', 'Lease 2', 'Lease 3', 'Lease 4'];

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

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleUseTemplate = () => {
        onClose();
        navigate(`/dashboard/documents/landlord-forms/use-template/${encodeURIComponent(templateName)}`, {
            state: {
                returnPath: `/dashboard/documents/my-templates/${templateId}`,
                selectedProperty,
                selectedLease
            }
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-800/50 animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm md:max-w-2xl shadow-2xl overflow-visible animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                {/* Header - Dark Teal */}
                <div className="bg-[#3A6D6C] px-4 md:px-6 py-4 flex items-center justify-between rounded-t-2xl text-white shrink-0">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onClose}
                            className="hover:bg-white/10 p-1 rounded-full transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-sm md:text-base font-medium line-clamp-1">
                            Add Select a property and lease
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/10 p-1 rounded-full transition-colors shrink-0"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content Area - White */}
                <div className="p-4 md:p-8 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-700 text-sm mb-6">
                        Select a property and a lease below and proceed to creating a lease agreement and requesting signature
                    </p>

                    {/* Row 1: Property and Lease */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Property Dropdown */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Property<span className="text-red-500">*</span>
                            </label>
                            <div className="relative" ref={propertyDropdownRef}>
                                <button
                                    onClick={() => setIsPropertyDropdownOpen(!isPropertyDropdownOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors text-sm"
                                >
                                    <span className="truncate">{selectedProperty}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-gray-500 transition-transform shrink-0 ${isPropertyDropdownOpen ? 'rotate-180' : ''}`}
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
                                    className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors text-sm"
                                >
                                    <span className="truncate">{selectedLease}</span>
                                    <ChevronDown
                                        size={18}
                                        className={`text-gray-500 transition-transform shrink-0 ${isLeaseDropdownOpen ? 'rotate-180' : ''}`}
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
                                className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-[#3A6D6C] transition-colors text-sm"
                            >
                                <span className="truncate">{selectedTenants}</span>
                                <ChevronDown
                                    size={18}
                                    className={`text-gray-500 transition-transform shrink-0 ${isTenantsDropdownOpen ? 'rotate-180' : ''}`}
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
                    <div className="flex justify-center mt-auto md:mt-0">
                        <button
                            onClick={handleUseTemplate}
                            className="w-full md:w-auto bg-[#3A6D6C] text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-[#2d5650] transition-colors shadow-md"
                        >
                            Use Template
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UseTemplateModal;
