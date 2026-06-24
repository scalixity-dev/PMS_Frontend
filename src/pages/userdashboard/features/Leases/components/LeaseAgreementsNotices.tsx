import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText, X, Eye } from 'lucide-react';
import type { Lease } from '../../../utils/types';
import type { RenderedDocument } from '../../../../../services/documents.service';
import { useToast } from '../../../../../components/common/Toast';

interface LeaseAgreementsNoticesProps {
    lease: Lease;
    renderedDocuments?: RenderedDocument[];
}

export const LeaseAgreementsNotices = ({ lease, renderedDocuments = [] }: LeaseAgreementsNoticesProps) => {
    const toast = useToast();
    const [isAttachmentsExpanded, setIsAttachmentsExpanded] = useState(true);
    const [isDocumentsExpanded, setIsDocumentsExpanded] = useState(true);
    const [previewDoc, setPreviewDoc] = useState<RenderedDocument | null>(null);

    const attachments = lease.attachments || [];

    const handleDownload = (attachment: typeof attachments[0]) => {
        if (!attachment.url || attachment.url === '#') {
            toast.error(`File "${attachment.name}" is not available for download.`);
            return;
        }
        const link = document.createElement('a');
        link.href = attachment.url;
        link.download = attachment.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-4">
            {/* File Attachments */}
            <div className="bg-[#F7F7F7] rounded-lg border border-[#E5E7EB] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <button
                    onClick={() => setIsAttachmentsExpanded(!isAttachmentsExpanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-gray-600" />
                        <h3 className="text-base font-semibold text-[#1A1A1A]">Attachments</h3>
                        <span className="text-sm text-gray-500">({attachments.length} record{attachments.length !== 1 ? 's' : ''})</span>
                    </div>
                    {isAttachmentsExpanded ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
                </button>

                {isAttachmentsExpanded && (
                    <div className="border-t border-[#E5E7EB]">
                        {attachments.length > 0 ? (
                            <div className="divide-y divide-[#E5E7EB]">
                                {attachments.map((attachment) => (
                                    <div
                                        key={attachment.id}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                <FileText size={20} className="text-blue-600" />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm font-medium text-[#1A1A1A] truncate max-w-[200px] sm:max-w-none">{attachment.name}</span>
                                                <span className="text-xs text-gray-500">{attachment.size}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {attachment.url && attachment.url !== '#' && (
                                                <button
                                                    onClick={() => window.open(attachment.url, '_blank')}
                                                    className="flex items-center gap-1.5 text-sm text-[#3A6D6C] hover:text-[#2a5251] font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-blue-50"
                                                    title="View Attachment"
                                                >
                                                    <Eye size={16} />
                                                    View
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">No attachments available</div>
                        )}
                    </div>
                )}
            </div>

            {/* Rendered Documents (sent by property manager) */}
            <div className="bg-[#F7F7F7] rounded-lg border border-[#E5E7EB] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                <button
                    onClick={() => setIsDocumentsExpanded(!isDocumentsExpanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-gray-600" />
                        <h3 className="text-base font-semibold text-[#1A1A1A]">Documents & Notices</h3>
                        <span className="text-sm text-gray-500">({renderedDocuments.length} record{renderedDocuments.length !== 1 ? 's' : ''})</span>
                    </div>
                    {isDocumentsExpanded ? <ChevronUp size={20} className="text-gray-600" /> : <ChevronDown size={20} className="text-gray-600" />}
                </button>

                {isDocumentsExpanded && (
                    <div className="border-t border-[#E5E7EB]">
                        {renderedDocuments.length > 0 ? (
                            <div className="divide-y divide-[#E5E7EB]">
                                {renderedDocuments.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <FileText size={20} className="text-green-600" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-[#1A1A1A]">{doc.title}</span>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(doc.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setPreviewDoc(doc)}
                                            className="flex items-center gap-1.5 text-sm text-[#3A6D6C] hover:text-[#2a5251] font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50"
                                        >
                                            <Eye size={16} />
                                            View
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">No documents available</div>
                        )}
                    </div>
                )}
            </div>

            {/* Document Preview Modal */}
            {previewDoc && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-[#1A1A1A]">{previewDoc.title}</h2>
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div
                            className="overflow-y-auto p-6 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: previewDoc.content }}
                        />
                        <div className="p-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setPreviewDoc(null)}
                                className="px-4 py-2 rounded-lg bg-[#3A6D6C] text-white text-sm font-medium hover:bg-[#2a5251] transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
