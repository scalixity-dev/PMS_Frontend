import { useState } from 'react';
import { ChevronDown, ChevronUp, FileText } from 'lucide-react';
import type { Lease } from '../../../utils/types';

interface LeaseAgreementsNoticesProps {
    lease: Lease;
}

export const LeaseAgreementsNotices = ({ lease }: LeaseAgreementsNoticesProps) => {
    const [isExpanded, setIsExpanded] = useState(true);

    const attachments = lease.attachments || [];

    const handleDownload = (attachment: typeof attachments[0]) => {
        if (!attachment.url || attachment.url === '#') {
            console.warn('No valid URL for attachment:', attachment.name);
            // For mock data, we can simulate a download or show an alert
            alert(`File "${attachment.name}" is not available for download in this mock version.`);
            return;
        }

        // Create a temporary anchor element to trigger download
        const link = document.createElement('a');
        link.href = attachment.url;
        link.download = attachment.name;
        link.target = '_blank';

        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        console.log('Downloading:', attachment.name);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#F7F7F7] rounded-lg border border-[#E5E7EB] overflow-hidden shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
                {/* Header */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <FileText size={20} className="text-gray-600" />
                        <h3 className="text-base font-semibold text-[#1A1A1A]">
                            Attachments
                        </h3>
                        <span className="text-sm text-gray-500">({attachments.length} record{attachments.length !== 1 ? 's' : ''})</span>
                    </div>
                    {isExpanded ? (
                        <ChevronUp size={20} className="text-gray-600" />
                    ) : (
                        <ChevronDown size={20} className="text-gray-600" />
                    )}
                </button>

                {/* Content */}
                {isExpanded && (
                    <div className="border-t border-[#E5E7EB]">
                        {attachments.length > 0 ? (
                            <div className="divide-y divide-[#E5E7EB]">
                                {attachments.map((attachment) => (
                                    <button
                                        key={attachment.id}
                                        onClick={() => handleDownload(attachment)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                                                <FileText size={20} className="text-blue-600" />
                                            </div>
                                            <div className="flex flex-col items-start">
                                                <span className="text-sm font-medium text-[#1A1A1A]  transition-colors">
                                                    {attachment.name}
                                                </span>
                                                <span className="text-xs text-gray-500">
                                                    {attachment.size}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                No attachments available
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
