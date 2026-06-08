import React from "react";
import { createPortal } from "react-dom";
import { ListPlus } from "lucide-react";

interface DownloadsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DownloadsModal: React.FC<DownloadsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-6 pt-5 pb-4">
                    <h2 className="text-lg font-bold text-gray-900">Downloads</h2>
                </div>

                <div className="border-t border-gray-100" />

                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="mb-5 p-4 bg-gray-100 rounded-full">
                        <ListPlus size={40} className="text-[#566573]" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No files downloaded yet</h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                        There are no downloaded files. Once you export some files, they will appear here.
                    </p>
                </div>

                <div className="flex justify-end px-6 pb-5">
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
