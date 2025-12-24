import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Plus, X, UploadCloud } from 'lucide-react';
import ReviewSuccessModal from '../landlordforms/components/ReviewSuccessModal';

const MyTemplateDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation() as any;
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAttachmentModalOpen, setIsAttachmentModalOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [attachments, setAttachments] = useState<{ name: string; size: number; type: string }[]>([]);
    const [tempAttachments, setTempAttachments] = useState<{ name: string; size: number; type: string }[]>([]);

    const [isUseTemplateModalOpen, setIsUseTemplateModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [successData, setSuccessData] = useState({ leaseName: '', propertyName: '' });

    const [selectedProperty, setSelectedProperty] = useState('Luxury Property');
    const [selectedLease, setSelectedLease] = useState('Lease 1');
    const [selectedTenants, setSelectedTenants] = useState('Luxury Property');

    const [isPropertyDropdownOpen, setIsPropertyDropdownOpen] = useState(false);
    const [isLeaseDropdownOpen, setIsLeaseDropdownOpen] = useState(false);
    const [isTenantsDropdownOpen, setIsTenantsDropdownOpen] = useState(false);

    const propertyDropdownRef = useRef<HTMLDivElement>(null);
    const leaseDropdownRef = useRef<HTMLDivElement>(null);
    const tenantsDropdownRef = useRef<HTMLDivElement>(null);
    const actionsDropdownRef = useRef<HTMLDivElement>(null);
    const documentContentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock constants for the modal
    const MOCK_PROPERTIES = ['Luxury Property', 'Downtown Apartment', 'Beach House', 'Mountain Villa'];
    const MOCK_TENANTS = ['Luxury Property', 'John Doe', 'Jane Smith', 'Bob Johnson'];
    const MOCK_LEASES = ['Lease 1', 'Lease 2', 'Lease 3', 'Lease 4'];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedFiles([...selectedFiles, ...Array.from(e.target.files)]);
        }
    };

    const removeFile = (index: number) => {
        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    };

    const removeTempAttachment = (index: number) => {
        setTempAttachments(tempAttachments.filter((_, i) => i !== index));
    };

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const [template, setTemplate] = useState<{ id: number; title: string; subtitle: string; content?: string } | null>(null);

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
            if (actionsDropdownRef.current && !actionsDropdownRef.current.contains(event.target as Node)) {
                setIsActionsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!id) {
            setTemplate(null);
            setAttachments([]);
            return;
        }

        const saved = localStorage.getItem('myTemplates');
        let found = null;
        if (saved) {
            const templates = JSON.parse(saved);
            found = templates.find((t: any) => t.id.toString() === id);
        }

        // Fallback for demo if not found in local storage
        if (!found && id === '1') {
            found = { id: 1, title: 'Best Deals', subtitle: 'Tenants Agreements' };
        }

        setTemplate(found || null);

        // Load saved attachments metadata
        const attachmentKey = `template_attachments_${id}`;
        const savedAttachments = localStorage.getItem(attachmentKey);
        if (savedAttachments) {
            try {
                const parsed = JSON.parse(savedAttachments) as { name: string; size: number; type: string }[];
                setAttachments(parsed);
            } catch {
                setAttachments([]);
            }
        } else {
            setAttachments([]);
        }
    }, [id]);

    const templateName = template?.title || "Template Detail";
    const templateSubtitle = template?.subtitle || "Tenants Agreements";

    const allTemplates = (() => {
        const saved = localStorage.getItem('myTemplates');
        if (saved) {
            return JSON.parse(saved);
        }
        // Fallback mocks same as MyTemplates.tsx
        return [
            { id: 1, title: 'Best Deals', subtitle: 'Tenants Agreements' },
            { id: 2, title: 'Title', subtitle: 'Tenants Agreements' },
            { id: 3, title: 'Title', subtitle: 'Tenants Agreements' },
        ];
    })();

    const sanitizeHtml = (html: string): string => {
        if (typeof window === 'undefined' || typeof document === 'undefined') {
            return html;
        }

        const container = document.createElement('div');
        container.innerHTML = html;

        // Remove potentially dangerous elements
        const blockedSelectors = ['script', 'iframe', 'object', 'embed', 'link[rel="import"]'];
        container.querySelectorAll(blockedSelectors.join(',')).forEach((el) => el.remove());

        // Remove inline event handlers and javascript: URLs
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT);
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        let current = walker.currentNode as HTMLElement | null;
        while (current) {
            const attributes = Array.from(current.attributes);
            attributes.forEach((attr) => {
                const name = attr.name.toLowerCase();
                const value = attr.value.trim().toLowerCase();

                if (name.startsWith('on')) {
                    current?.removeAttribute(attr.name);
                }

                if ((name === 'href' || name === 'src') && value.startsWith('javascript:')) {
                    current?.removeAttribute(attr.name);
                }
            });

            const next = walker.nextNode();
            current = next as HTMLElement | null;
        }

        return container.innerHTML;
    };

    const sanitizedContent = useMemo(
        () => (template?.content ? sanitizeHtml(template.content) : ''),
        [template?.content]
    );

    const formatFileSize = (size: number): string => {
        return `${(size / 1024 / 1024).toFixed(2)} MB`;
    };

    const handlePrint = () => {
        setIsActionsDropdownOpen(false);
        setIsPreviewModalOpen(false);
        setTimeout(() => {
            window.print();
        }, 100);
    };

    const handlePreview = () => {
        setIsActionsDropdownOpen(false);
        setIsPreviewModalOpen(true);
    };

    const handleAttachmentsUpdate = () => {
        if (!id) {
            setIsAttachmentModalOpen(false);
            return;
        }

        const attachmentKey = `template_attachments_${id}`;
        const newMapped = selectedFiles.map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
        }));

        const finalAttachments = [...tempAttachments, ...newMapped];
        setAttachments(finalAttachments);
        localStorage.setItem(attachmentKey, JSON.stringify(finalAttachments));
        setIsAttachmentModalOpen(false);
    };

    return (
        <div className="max-w-7xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb */}
            <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full mb-6 shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)]">
                <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>
                    Dashboard
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => navigate('/documents/my-templates')}>
                    Documents Template
                </span>
                <span className="text-gray-500 text-sm mx-1">/</span>
                <span className="text-gray-600 text-sm font-semibold">{templateName}</span>
            </div>

            <div className="p-6 bg-[#E0E8E7] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex items-center gap-6 mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-bold text-gray-800">{templateName}</h1>
                        <p className="text-gray-500 font-medium text-sm mt-1">{templateSubtitle}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsUseTemplateModalOpen(true)}
                            className="flex items-center gap-2 bg-[#3A6D6C] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2d5650] transition-colors shadow-sm"
                        >
                            Use Template
                            <Plus size={16} className="bg-white/20 rounded-full p-0.5" />
                        </button>
                        <div className="relative" ref={actionsDropdownRef}>
                            <button
                                onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                                className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2d5650] transition-colors shadow-sm flex items-center gap-2"
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
                                        className="w-full text-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Print
                                    </button>
                                    <div className="border-t border-gray-200"></div>
                                    <button
                                        onClick={handlePreview}
                                        className="w-full text-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Preview
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="bg-[#F0F2F5] rounded-[2rem] overflow-hidden shadow-sm mb-6 pb-20">
                    {/* Dark Teal Header Band */}
                    <div className="bg-[#3A6D6C] mx-6 mt-6 rounded-[2rem] px-6 py-4 flex items-center justify-center gap-4 relative">
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="bg-white text-[#3A6D6C] px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 min-w-[140px] justify-between shadow-sm"
                            >
                                Template
                                <ChevronDown size={16} />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-10 max-h-60 overflow-y-auto custom-scrollbar">
                                    {allTemplates.map((t: any) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                navigate(`/documents/my-templates/${t.id}`);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-50 ${t.id.toString() === id ? 'bg-gray-50 text-[#3A6D6C] font-semibold' : 'text-gray-700'
                                                }`}
                                        >
                                            {t.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate(`/documents/my-templates/${id}/edit`)}
                            className="bg-[#4CD9A4] text-white px-8 py-2 rounded-full text-sm font-medium hover:bg-[#42bd93] transition-colors shadow-sm"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Content Placeholder */}
                    <div className="px-12 py-8 min-h-[300px]" ref={documentContentRef}>
                        {sanitizedContent ? (
                            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                        ) : (
                            <p className="text-gray-400 text-sm">| Type here</p>
                        )}
                    </div>
                </div>

                {/* Attachments Section */}
                <div className="bg-[#F0F2F5] rounded-[2rem] p-6 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-bold text-gray-800">Attachments</h2>
                            <ChevronDown size={16} className="text-gray-800" />
                        </div>

                        <button
                            onClick={() => {
                                setTempAttachments([...attachments]);
                                setSelectedFiles([]);
                                setIsAttachmentModalOpen(true);
                            }}
                            className="bg-[#4CD9A4] text-white px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#42bd93] transition-colors shadow-sm"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-inner min-h-[160px]">
                        {attachments.length === 0 ? (
                            <div className="h-full flex items-center justify-center">
                                <p className="text-gray-500 font-medium text-sm">No attachments yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {attachments.map((file) => (
                                    <div
                                        key={`${file.name}-${file.size}`}
                                        className="flex items-center justify-between bg-white/50 px-4 py-2 rounded-xl border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="p-1.5 bg-[#3A6D6C]/10 rounded-lg">
                                                <UploadCloud size={16} className="text-[#3A6D6C]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-700 truncate max-w-[300px]">
                                                    {file.name}
                                                </span>
                                                <span className="text-[10px] text-gray-400">
                                                    {formatFileSize(file.size)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Attachments Edit Modal */}
            {isAttachmentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 ">
                    <div className="bg-[#E0E8E7] w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                        {/* Header */}
                        <div className="bg-[#3A6D6C] px-8 py-5 flex items-center justify-between text-white">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setIsAttachmentModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                    <ChevronLeft size={24} />
                                </button>
                                <h2 className="text-xl font-bold">Attachments</h2>
                            </div>
                            <button onClick={() => setIsAttachmentModalOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-10 flex flex-col items-center">
                            <p className="text-[#000000] text-center font-bold text-xl mb-8 max-w-[500px] leading-snug">
                                You can attach the related attachments that are specific to this template.
                            </p>

                            {/* Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                multiple
                            />

                            {/* Upload Area */}
                            <div
                                onClick={handleUploadClick}
                                className="w-full bg-white rounded-[2rem] p-16 mb-6 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-[0px_4px_10px_rgba(0,0,0,0.05)] border-2 border-dashed border-gray-100 hover:border-[#3A6D6C]/30 transition-all"
                            >
                                {/* Checkerboard Pattern simulating the image */}
                                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #000 75%), linear-gradient(-45deg, transparent 75%, #000 75%)', backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0' }}></div>

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    <UploadCloud size={64} className="text-gray-600 mb-4" strokeWidth={1.5} />
                                    <p className="text-gray-500 font-medium text-lg">store documents and templates</p>
                                    <p className="text-gray-400 text-sm mt-2">Click to browse or drag and drop</p>
                                </div>
                            </div>

                            {/* Attachments Preview (Existing + New) */}
                            {(tempAttachments.length > 0 || selectedFiles.length > 0) && (
                                <div className="w-full mb-8 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {/* Existing Attachments */}
                                    {tempAttachments.map((file, index) => (
                                        <div key={`existing-${index}`} className="flex items-center justify-between bg-white/50 px-4 py-2 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-[#3A6D6C]/10 rounded-lg">
                                                    <UploadCloud size={16} className="text-[#3A6D6C]" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-700 truncate max-w-[300px]">{file.name}</span>
                                                    <span className="text-[10px] text-gray-400">{formatFileSize(file.size)}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeTempAttachment(index); }}
                                                className="p-1 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* New Selected Files */}
                                    {selectedFiles.map((file, index) => (
                                        <div key={`new-${index}`} className="flex items-center justify-between bg-white/50 px-4 py-2 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-1.5 bg-[#3A6D6C]/10 rounded-lg">
                                                    <UploadCloud size={16} className="text-[#3A6D6C]" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-700 truncate max-w-[300px]">{file.name}</span>
                                                    <span className="text-[10px] text-gray-400">{formatFileSize(file.size)}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeFile(index); }}
                                                className="p-1 hover:text-red-500 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Footer/Action */}
                            <div className="w-full flex justify-start">
                                <button
                                    onClick={handleAttachmentsUpdate}
                                    className="bg-[#3A6D6C] text-white px-12 py-3.5 rounded-2xl font-bold text-lg hover:bg-[#2d5650] transition-all shadow-[0_4px_12px_rgba(58,109,108,0.4)]"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Use Template Modal */}
            {isUseTemplateModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-800/50  animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-visible mx-4 animate-in zoom-in-95 duration-200">
                        {/* Header - Dark Teal */}
                        <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between rounded-t-2xl text-white">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setIsUseTemplateModalOpen(false)}
                                    className="hover:bg-white/10 p-1 rounded-full transition-colors"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <span className="text-base font-medium">
                                    Add Select a property and lease to proceed with this template
                                </span>
                            </div>
                            <button
                                onClick={() => setIsUseTemplateModalOpen(false)}
                                className="hover:bg-white/10 p-1 rounded-full transition-colors"
                            >
                                <X size={24} />
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
                                        setIsUseTemplateModalOpen(false);
                                        navigate(`/documents/landlord-forms/use-template/${encodeURIComponent(templateName)}`, {
                                            state: {
                                                returnPath: `/documents/my-templates/${id}`,
                                                selectedProperty
                                            }
                                        });
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

            {/* Document Preview Modal */}
            {isPreviewModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 animate-in fade-in duration-200 print:hidden">
                    <div className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] shadow-2xl mx-4 flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                        {/* Preview Header */}
                        <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                            <h2 className="text-white text-lg font-semibold">Document Preview - {templateName}</h2>
                            <button
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="hover:bg-white/10 p-2 rounded-full transition-colors"
                            >
                                <X size={24} className="text-white" />
                            </button>
                        </div>

                        {/* Preview Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                            <div className="max-w-4xl mx-auto bg-white p-12 rounded-lg shadow-sm font-outfit">
                                {documentContentRef.current && (
                                    <div dangerouslySetInnerHTML={{ __html: documentContentRef.current.innerHTML }} />
                                )}
                            </div>
                        </div>

                        {/* Preview Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl flex-shrink-0">
                            <button
                                onClick={() => setIsPreviewModalOpen(false)}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm"
                            >
                                Close
                            </button>
                            <button
                                onClick={handlePrint}
                                className="px-6 py-2.5 bg-[#3A6D6C] text-white rounded-lg hover:bg-[#2d5650] transition-colors font-medium text-sm"
                            >
                                Print Document
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyTemplateDetail;
