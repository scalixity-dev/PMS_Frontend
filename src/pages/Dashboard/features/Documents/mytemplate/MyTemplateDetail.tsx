import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronLeft, Plus, X, UploadCloud } from 'lucide-react';
import DOMPurify from 'dompurify';
import ReviewSuccessModal from '../landlordforms/components/ReviewSuccessModal';
import DocumentPreviewModal from '../components/DocumentPreviewModal';
import { handleDocumentPrint } from '../utils/printPreviewUtils';
import UseTemplateModal from './components/UseTemplateModal';

interface MyLocationState {
    showSuccessPopup?: boolean;
    leaseName?: string;
    propertyName?: string;
}

const MyTemplateDetail: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const location = useLocation();
    const state = location.state as MyLocationState;
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

    const actionsDropdownRef = useRef<HTMLDivElement>(null);
    const documentContentRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Mock constants for the modal will be handled inside UseTemplateModal

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
        if (state?.showSuccessPopup) {
            setIsSuccessModalOpen(true);
            setSuccessData({
                leaseName: state.leaseName || 'Lease 9',
                propertyName: state.propertyName || 'abc'
            });
            // Clear location state to prevent modal from showing again on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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

    const sanitizedHtml = useMemo(
        () => (template?.content ? DOMPurify.sanitize(template.content) : ''),
        [template?.content]
    );

    const formatFileSize = (size: number): string => {
        return `${(size / 1024 / 1024).toFixed(2)} MB`;
    };

    const handlePrint = () => {
        setIsActionsDropdownOpen(false);
        setIsPreviewModalOpen(false);
        handleDocumentPrint(documentContentRef, { title: templateName });
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
            <div className="flex w-full overflow-x-auto pb-2 md:pb-0 mb-6 scrollbar-hide">
                <div className="inline-flex items-center px-4 py-2 bg-[#E0E8E7] rounded-full shadow-[inset_0_4px_2px_rgba(0,0,0,0.1)] whitespace-nowrap">
                    <span className="text-[#4ad1a6] text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard')}>
                        Dashboard
                    </span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-600 text-sm font-semibold cursor-pointer" onClick={() => navigate('/dashboard/documents/my-templates')}>
                        Documents Template
                    </span>
                    <span className="text-gray-500 text-sm mx-1">/</span>
                    <span className="text-gray-600 text-sm font-semibold max-w-[150px] md:max-w-xs truncate block">{templateName}</span>
                </div>
            </div>

            <div className="p-4 md:p-6 bg-[#E0E8E7] min-h-screen rounded-2xl md:rounded-[2rem]">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex flex-col">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-800 break-words">{templateName}</h1>
                        <p className="text-gray-500 font-medium text-sm mt-1">{templateSubtitle}</p>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <button
                            onClick={() => setIsUseTemplateModalOpen(true)}
                            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#3A6D6C] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#2d5650] transition-colors shadow-sm whitespace-nowrap"
                        >
                            Use Template
                            <Plus size={16} className="bg-white/20 rounded-full p-0.5" />
                        </button>
                        <div className="relative" ref={actionsDropdownRef}>
                            <button
                                onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                                className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2d5650] transition-colors shadow-sm flex items-center gap-2 whitespace-nowrap"
                            >
                                Actions
                                <ChevronDown
                                    size={16}
                                    className={`text-white transition-transform ${isActionsDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {isActionsDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
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
                <div className="bg-[#F0F2F5] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm mb-6 pb-20">
                    {/* Dark Teal Header Band */}
                    <div className="bg-[#3A6D6C] mx-3 md:mx-6 mt-4 md:mt-6 rounded-2xl md:rounded-[2rem] px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 relative">
                        <div className="relative w-full sm:w-auto">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full sm:w-auto bg-white text-[#3A6D6C] px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 min-w-[140px] justify-between shadow-sm"
                            >
                                <span className="truncate">Template</span>
                                <ChevronDown size={16} />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-full sm:w-64 bg-white rounded-lg shadow-lg border border-gray-100 z-10 max-h-60 overflow-y-auto custom-scrollbar">
                                    {allTemplates.map((t: any) => (
                                        <button
                                            key={t.id}
                                            onClick={() => {
                                                navigate(`/dashboard/documents/my-templates/${t.id}`);
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors border-b last:border-b-0 border-gray-50 line-clamp-1 ${t.id.toString() === id ? 'bg-gray-50 text-[#3A6D6C] font-semibold' : 'text-gray-700'
                                                }`}
                                        >
                                            {t.title}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            onClick={() => navigate(`/dashboard/documents/my-templates/${id}/edit`)}
                            className="w-full sm:w-auto bg-[#4CD9A4] text-white px-8 py-2 rounded-full text-sm font-medium hover:bg-[#42bd93] transition-colors shadow-sm whitespace-nowrap"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Content Placeholder */}
                    <div className="px-4 md:px-12 py-6 md:py-8 min-h-[300px]" ref={documentContentRef}>
                        {sanitizedHtml ? (
                            <div className="prose max-w-none text-sm md:text-base text-gray-800" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                        ) : (
                            <p className="text-gray-400 text-sm">| Type here</p>
                        )}
                    </div>
                </div>

                {/* Attachments Section */}
                <div className="bg-[#F0F2F5] rounded-2xl md:rounded-[2rem] p-4 md:p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
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

                    <div className="bg-white rounded-2xl md:rounded-[2rem] p-4 md:p-12 border border-gray-100 shadow-inner min-h-[160px]">
                        {attachments.length === 0 ? (
                            <div className="h-full flex items-center justify-center py-8">
                                <p className="text-gray-500 font-medium text-sm">No attachments yet</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                {attachments.map((file) => (
                                    <div
                                        key={`${file.name}-${file.size}`}
                                        className="flex items-center justify-between bg-white/50 px-3 md:px-4 py-2 rounded-xl border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="p-1.5 bg-[#3A6D6C]/10 rounded-lg flex-shrink-0">
                                                <UploadCloud size={16} className="text-[#3A6D6C]" />
                                            </div>
                                            <div className="flex flex-col overflow-hidden">
                                                <span className="text-sm font-semibold text-gray-700 truncate max-w-[200px] md:max-w-[300px]">
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
            <UseTemplateModal
                isOpen={isUseTemplateModalOpen}
                onClose={() => setIsUseTemplateModalOpen(false)}
                templateName={templateName}
                templateId={id}
            />

            <ReviewSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                leaseName={successData.leaseName}
                propertyName={successData.propertyName}
            />

            {/* Document Preview Modal */}
            <DocumentPreviewModal
                isOpen={isPreviewModalOpen}
                onClose={() => setIsPreviewModalOpen(false)}
                title={templateName}
                contentRef={documentContentRef}
                customPrintHandler={handlePrint}
            />
        </div>
    );
};

export default MyTemplateDetail;
