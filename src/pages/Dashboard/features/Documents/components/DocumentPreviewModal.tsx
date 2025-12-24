import React from 'react';
import { X } from 'lucide-react';
import DOMPurify from 'dompurify';
import { handleDocumentPrint } from '../utils/printPreviewUtils';

interface DocumentPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    contentRef?: React.RefObject<HTMLDivElement | null> | null;
    htmlContent?: string;
    customPrintHandler?: () => void;
}

/**
 * Reusable Document Preview Modal Component
 * Used across different document pages for consistent preview experience
 */
const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
    isOpen,
    onClose,
    title,
    contentRef,
    htmlContent,
    customPrintHandler
}) => {
    if (!isOpen) return null;

    const handlePrint = () => {
        if (customPrintHandler) {
            customPrintHandler();
        } else if (contentRef) {
            handleDocumentPrint(contentRef, { title });
        }
    };

    // Determine what content to display
    const getPreviewContent = () => {
        if (htmlContent) {
            return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />;
        } else if (contentRef?.current) {
            return <div dangerouslySetInnerHTML={{ __html: contentRef.current.innerHTML }} />;
        }
        return <p className="text-gray-400">No content available</p>;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/40 animate-in fade-in duration-200 print:hidden">
            <div className="bg-white rounded-2xl w-full max-w-3xl h-[85vh] shadow-2xl mx-4 flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
                {/* Preview Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                    <h2 className="text-white text-lg font-semibold">Document Preview - {title}</h2>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/10 p-2 rounded-full transition-colors"
                    >
                        <X size={24} className="text-white" />
                    </button>
                </div>

                {/* Preview Content - Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    <div className="max-w-none mx-auto bg-white p-10 rounded-lg shadow-sm font-outfit">
                        {getPreviewContent()}
                    </div>
                </div>

                {/* Preview Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-2xl flex-shrink-0">
                    <button
                        onClick={onClose}
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
    );
};

export default DocumentPreviewModal;
