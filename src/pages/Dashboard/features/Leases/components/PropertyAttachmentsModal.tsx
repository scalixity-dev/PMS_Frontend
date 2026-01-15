import React from 'react';
import { createPortal } from 'react-dom';
import { X, UploadCloud } from 'lucide-react';

interface PropertyAttachmentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (files: { shared: File[], private: File[] }) => void;
}

const PropertyAttachmentsModal: React.FC<PropertyAttachmentsModalProps> = ({ isOpen, onClose, onUpdate }) => {
    const [sharedFiles, setSharedFiles] = React.useState<File[]>([]);
    const [privateFiles, setPrivateFiles] = React.useState<File[]>([]);

    // Reset files when modal opens/closes
    React.useEffect(() => {
        if (!isOpen) {
            setSharedFiles([]);
            setPrivateFiles([]);
        }
    }, [isOpen]);

    // Prevent background scrolling
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleUploadClick = (inputId: string) => {
        const input = document.getElementById(inputId) as HTMLInputElement;
        if (input) input.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'shared' | 'private') => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            if (type === 'shared') {
                setSharedFiles(prev => [...prev, ...newFiles]);
            } else {
                setPrivateFiles(prev => [...prev, ...newFiles]);
            }
            // Reset input so same file can be selected again if needed
            e.target.value = '';
        }
    };

    const removeFile = (index: number, type: 'shared' | 'private') => {
        if (type === 'shared') {
            setSharedFiles(prev => prev.filter((_, i) => i !== index));
        } else {
            setPrivateFiles(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleUpdate = () => {
        onUpdate({ shared: sharedFiles, private: privateFiles });
        onClose();
    };

    const hasFiles = sharedFiles.length > 0 || privateFiles.length > 0;

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#dfe5e3] rounded-[1.5rem] w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-[#3A6D6C] px-6 py-4 flex items-center justify-between shrink-0">
                    <h2 className="text-white text-lg font-medium">Attachments</h2>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Here you can upload any additional files to share with the tenant (Shared attachments) or files that are visible only to you (Private attachments).
                    </p>

                    {/* Shared Attachments */}
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg border border-gray-100 flex items-center justify-between shadow-sm">
                            <span className="font-bold text-[#2c3e50] text-sm md:text-base">Shared attachments</span>
                            <button
                                onClick={() => handleUploadClick('shared-upload')}
                                className="flex items-center gap-2 text-[#3A6D6C] hover:text-[#2c5251] transition-colors font-bold text-sm"
                            >
                                <UploadCloud className="w-5 h-5" />
                                Upload file
                            </button>
                            <input
                                id="shared-upload"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'shared')}
                            />
                        </div>
                        {/* File List */}
                        {sharedFiles.length > 0 && (
                            <div className="space-y-2 pl-2">
                                {sharedFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/50 p-2 rounded-lg text-sm text-gray-700">
                                        <span className="truncate max-w-[80%]">{file.name}</span>
                                        <button onClick={() => removeFile(index, 'shared')} className="text-red-500 hover:text-red-700 p-1">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Private Attachments */}
                    <div className="space-y-3">
                        <div className="bg-white p-4 rounded-lg border border-gray-100 flex items-center justify-between shadow-sm">
                            <span className="font-bold text-[#2c3e50] text-sm md:text-base">Private attachments</span>
                            <button
                                onClick={() => handleUploadClick('private-upload')}
                                className="flex items-center gap-2 text-[#3A6D6C] hover:text-[#2c5251] transition-colors font-bold text-sm"
                            >
                                <UploadCloud className="w-5 h-5" />
                                Upload file
                            </button>
                            <input
                                id="private-upload"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'private')}
                            />
                        </div>
                        {/* File List */}
                        {privateFiles.length > 0 && (
                            <div className="space-y-2 pl-2">
                                {privateFiles.map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-white/50 p-2 rounded-lg text-sm text-gray-700">
                                        <span className="truncate max-w-[80%]">{file.name}</span>
                                        <button onClick={() => removeFile(index, 'private')} className="text-red-500 hover:text-red-700 p-1">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer - Inside Scrollable Area just like AddInsuranceModal if desired, or kept sticky. 
                       AddInsuranceModal has it inside. I will move it inside.
                    */}
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 pt-4 shrink-0">
                        <button // Cancel Button
                            onClick={onClose}
                            className="w-full sm:flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm order-2 sm:order-1"
                        >
                            Cancel
                        </button>
                        <button // Update Button
                            onClick={handleUpdate}
                            disabled={!hasFiles}
                            className={`w-full sm:flex-1 py-3 rounded-lg text-sm font-medium transition-colors shadow-sm order-1 sm:order-2 ${hasFiles
                                ? 'bg-[#3A6D6C] text-white hover:bg-[#2c5251]'
                                : 'bg-[#dfe6e9] text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default PropertyAttachmentsModal;
