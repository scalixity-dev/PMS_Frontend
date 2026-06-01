import React, { useRef, useState } from 'react';
import { Upload, FileText, Trash2, AlertCircle, Loader2, Check, ShieldCheck } from 'lucide-react';
import BaseModal from '@/components/common/modals/BaseModal';
import { applicationService } from '@/services/application.service';

interface UserAddFileModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationId: string;
    onSuccess: () => void;
}

const ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

interface FileEntry {
    file: File;
    status: 'pending' | 'uploading' | 'done' | 'error';
    errorMsg?: string;
}

const UserAddFileModal: React.FC<UserAddFileModalProps> = ({ isOpen, onClose, applicationId, onSuccess }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [fileError, setFileError] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);

    const handleClose = () => {
        if (isUploading) return;
        setFiles([]);
        setFileError('');
        onClose();
    };

    const addFiles = (incoming: FileList | null) => {
        if (!incoming) return;
        setFileError('');
        const errors: string[] = [];
        const valid: FileEntry[] = [];

        Array.from(incoming).forEach(f => {
            if (!ALLOWED_TYPES.includes(f.type)) {
                errors.push(`${f.name}: Only PDF, DOC, DOCX, XLS, XLSX are allowed.`);
                return;
            }
            if (f.size > MAX_FILE_SIZE) {
                errors.push(`${f.name}: Exceeds 10MB limit.`);
                return;
            }
            valid.push({ file: f, status: 'pending' });
        });

        if (errors.length) setFileError(errors.join(' '));
        if (valid.length) setFiles(prev => [...prev, ...valid]);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        addFiles(e.target.files);
        if (e.target) e.target.value = '';
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setDragOver(false);
        addFiles(e.dataTransfer.files);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const updateStatus = (index: number, status: FileEntry['status'], errorMsg?: string) => {
        setFiles(prev => prev.map((f, i) => i === index ? { ...f, status, errorMsg } : f));
    };

    const handleUpload = async () => {
        const pending = files.filter(f => f.status === 'pending');
        if (!pending.length) return;

        setIsUploading(true);
        setFileError('');

        const uploadPromises = files.map(async (entry, index) => {
            if (entry.status !== 'pending') return;
            updateStatus(index, 'uploading');
            try {
                await applicationService.addAttachment(applicationId, entry.file);
                updateStatus(index, 'done');
            } catch (err: any) {
                updateStatus(index, 'error', err.message || 'Upload failed');
            }
        });

        await Promise.all(uploadPromises);
        setIsUploading(false);

        // If all done (none errored), close and refresh
        setFiles(prev => {
            const hasErrors = prev.some(f => f.status === 'error');
            if (!hasErrors) {
                onSuccess();
                onClose();
            }
            return prev;
        });
    };

    const pendingCount = files.filter(f => f.status === 'pending').length;
    const allDone = files.length > 0 && files.every(f => f.status === 'done');

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Add attachments"
            maxWidth="max-w-lg"
            footerButtons={[
                {
                    label: 'Cancel',
                    onClick: handleClose,
                    variant: 'ghost',
                    disabled: isUploading,
                },
                {
                    label: isUploading ? 'Uploading...' : `Upload${pendingCount > 0 ? ` (${pendingCount})` : ''}`,
                    onClick: handleUpload,
                    disabled: pendingCount === 0 || isUploading || allDone,
                    variant: 'primary',
                    className: 'bg-[#7ED957] hover:bg-[#6BC847] border-none text-white',
                    icon: isUploading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={3} />,
                }
            ]}
        >
            <div className="py-4 space-y-4">
                {/* Drop zone */}
                <div
                    className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group ${dragOver ? 'border-[#7ED957] bg-[#7ED957]/5' : 'border-[#E5E7EB] hover:border-[#7ED957] hover:bg-[#7ED957]/5 bg-gray-50/30'}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                >
                    <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-[#7ED957]" />
                    </div>
                    <p className="font-bold text-[#1A1A1A] text-sm mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-[#ADADAD]">PDF, DOC, DOCX, XLS or XLSX — up to 10MB each</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileChange}
                    />
                </div>

                {/* Error */}
                {fileError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-3">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-600">{fileError}</p>
                    </div>
                )}

                {/* File list */}
                {files.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[#1A1A1A]">Selected files</p>
                            <span className="bg-[#7ED957] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{files.length}</span>
                        </div>
                        {files.map((entry, idx) => (
                            <div key={idx} className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-[#E5E7EB] shadow-sm">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-9 h-9 bg-[#F3F4F6] rounded-xl flex items-center justify-center shrink-0">
                                        {entry.status === 'uploading' ? (
                                            <Loader2 className="w-4 h-4 text-[#7ED957] animate-spin" />
                                        ) : entry.status === 'done' ? (
                                            <Check className="w-4 h-4 text-[#7ED957]" />
                                        ) : entry.status === 'error' ? (
                                            <AlertCircle className="w-4 h-4 text-red-500" />
                                        ) : (
                                            <FileText className="w-4 h-4 text-[#7ED957]" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-[#1A1A1A] truncate max-w-[220px]">{entry.file.name}</p>
                                        <p className={`text-[11px] ${entry.status === 'error' ? 'text-red-500' : 'text-[#ADADAD]'}`}>
                                            {entry.status === 'uploading' ? 'Uploading...' :
                                             entry.status === 'done' ? 'Uploaded' :
                                             entry.status === 'error' ? (entry.errorMsg || 'Failed') :
                                             `${(entry.file.size / 1024 / 1024).toFixed(2)} MB`}
                                        </p>
                                    </div>
                                </div>
                                {entry.status !== 'uploading' && entry.status !== 'done' && (
                                    <button
                                        onClick={() => removeFile(idx)}
                                        className="p-1.5 text-gray-300 hover:text-red-500 transition-colors shrink-0"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex items-center justify-center gap-2 text-[#ADADAD] text-xs pt-1">
                    <ShieldCheck size={13} className="text-[#7ED957]" />
                    <span>Your data is encrypted and securely stored</span>
                </div>
            </div>
        </BaseModal>
    );
};

export default UserAddFileModal;
