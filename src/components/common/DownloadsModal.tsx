import React from "react";
import { createPortal } from "react-dom";
import { ListPlus, FileText, Download, Loader2 } from "lucide-react";
import { useGetDownloads } from "../../hooks/useFilesQueries";

interface DownloadsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DownloadsModal: React.FC<DownloadsModalProps> = ({ isOpen, onClose }) => {
    const { data: downloads, isLoading } = useGetDownloads();

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 pt-5 pb-4 flex-shrink-0">
                    <h2 className="text-lg font-bold text-gray-900">Downloads</h2>
                </div>

                <div className="border-t border-gray-100 flex-shrink-0" />

                <div className="flex-1 overflow-y-auto min-h-[200px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center h-full">
                            <Loader2 className="animate-spin text-gray-400 mb-4" size={32} />
                            <p className="text-sm text-gray-500">Loading your downloads...</p>
                        </div>
                    ) : downloads && downloads.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                            {downloads.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
                                            <FileText size={20} className="text-green-600" />
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-medium text-gray-900 truncate" title={item.fileName}>
                                                {item.fileName}
                                            </span>
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                <span>{new Date(item.downloadedAt).toLocaleDateString()}</span>
                                                {item.sizeBytes ? (
                                                    <>
                                                        <span>•</span>
                                                        <span>{(item.sizeBytes / 1024 / 1024).toFixed(2)} MB</span>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                    <a
                                        href={item.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors flex-shrink-0 ml-2"
                                        title="Download again"
                                    >
                                        <Download size={18} />
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-6 py-12 text-center h-full">
                            <div className="mb-5 p-4 bg-gray-100 rounded-full">
                                <ListPlus size={40} className="text-[#566573]" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">No files downloaded yet</h3>
                            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                                There are no downloaded files. Once you export some files, they will appear here.
                            </p>
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-100 flex-shrink-0" />

                <div className="flex justify-end px-6 py-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-full bg-[#3A6D6C] text-white text-sm font-semibold hover:bg-[#2f5a59] transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default DownloadsModal;

