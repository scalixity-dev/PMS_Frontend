/**
 * Common utility functions for printing and previewing documents
 * Centralized logic to avoid duplication across different document components
 */

/**
 * Print document content using an iframe
 * @param contentRef - React ref to the content element to print
 * @param options - Optional configuration for print styling
 */
export const handleDocumentPrint = (
    contentRef: React.RefObject<HTMLElement | null> | HTMLElement | null,
    options?: {
        title?: string;
        includeImages?: boolean;
        customStyles?: string;
    }
): void => {
    const printContent = contentRef && 'current' in contentRef ? contentRef.current : contentRef;

    if (!printContent) {
        console.warn('Print content not found');
        return;
    }

    // Create a hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
        console.error('Failed to access iframe document');
        document.body.removeChild(iframe);
        return;
    }

    const defaultStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap');
        body { 
            font-family: 'Outfit', sans-serif; 
            padding: 40px; 
            color: #374151;
        }
        .print-content { 
            max-width: 800px; 
            margin: 0 auto; 
            line-height: 1.6; 
        }
        h1, h2, h3 { color: #111827; }
        p { margin-bottom: 1em; }
        ${options?.includeImages !== false ? '.prose img { max-width: 100%; height: auto; }' : ''}
        .auto-fill-pill {
            background-color: #88D94C;
            border-radius: 9999px;
            padding: 4px 14px;
            margin: 0 4px;
            font-weight: 700;
            color: white;
            display: inline-flex;
            vertical-align: middle;
            -webkit-print-color-adjust: exact;
        }
    `;

    doc.write(`
        <html>
            <head>
                <title>${options?.title || 'Document Print'}</title>
                <style>
                    ${defaultStyles}
                    ${options?.customStyles || ''}
                </style>
            </head>
            <body>
                <div class="print-content prose">
                    ${printContent.innerHTML}
                </div>
            </body>
        </html>
    `);
    doc.close();

    // Wait for styles and fonts to load before printing
    setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        // Cleanup: remove the iframe after a short delay
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    }, 500);
};

/**
 * Preview modal component props interface
 */
export interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    contentRef: React.RefObject<HTMLElement> | null;
    title?: string;
    onPrint?: () => void;
}

/**
 * Hook to manage preview modal state
 */
export const usePreviewModal = () => {
    const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);

    const openPreview = () => setIsPreviewModalOpen(true);
    const closePreview = () => setIsPreviewModalOpen(false);

    return {
        isPreviewModalOpen,
        openPreview,
        closePreview,
        setIsPreviewModalOpen
    };
};

/**
 * Get HTML content for preview from a ref
 */
export const getPreviewContent = (contentRef: React.RefObject<HTMLElement> | null): string => {
    if (!contentRef?.current) {
        return '<p class="text-gray-400">No content available</p>';
    }
    return contentRef.current.innerHTML;
};

// Re-export React for the hook
import React from 'react';
