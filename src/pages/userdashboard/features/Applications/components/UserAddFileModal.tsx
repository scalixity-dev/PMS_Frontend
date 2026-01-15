import React, { useRef, useState } from 'react';
import { Upload, X, FileText, Check } from 'lucide-react';
import BaseModal from '@/components/common/modals/BaseModal';

export interface FileFormData {
    file: File | null;
    name: string;
    type: string;
}

interface UserAddFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: FileFormData) => void;
}

const UserAddFileModal: React.FC<UserAddFileModalProps> = ({ isOpen, onClose, onSave }) => {
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            // Check file size (e.g. 5MB limit)
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            if (droppedFile.size > 5 * 1024 * 1024) {
                setError('File size must be less than 5MB');
                setFile(null);
                return;
            }
            setFile(droppedFile);
            setError('');
        }
    };

    const handleSave = () => {
        if (file) {
            onSave({
                file,
                name: file.name,
                type: file.type || 'Unknown'
            });
            onClose();
            setFile(null);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={() => {
                onClose();
                setFile(null);
                setError('');
            }}
            title="Add attachment"
            maxWidth="max-w-lg"
            footerButtons={[
                {
                    label: 'Cancel',
                    onClick: () => {
                        onClose();
                        setFile(null);
                        setError('');
                    },
                    variant: 'ghost',
                },
                {
                    label: 'Upload',
                    onClick: handleSave,
                    disabled: !file,
                    variant: 'primary',
                    className: "bg-[#7ED957] hover:bg-[#6BC847] border-none text-white",
                    icon: <Check size={16} strokeWidth={3} />
                }
            ]}
        >
            <div className="py-4 space-y-4">
                {!file ? (
                    <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#7ED957] hover:bg-gray-50'
                            }`}
                        onClick={() => fileInputRef.current?.click()}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                        }}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <div className="flex flex-col items-center gap-3">
                            <div className="p-3 bg-gray-100 rounded-full">
                                <Upload size={24} className="text-gray-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or PDF (max. 5MB)</p>
                            </div>
                        </div>
                        {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                    </div>
                ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white rounded-lg border border-gray-200">
                                <FileText size={20} className="text-[#7ED957]" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setFile(null)}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                )}
            </div>
        </BaseModal>
    );
};

export default UserAddFileModal;
