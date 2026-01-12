import React, { useRef, useState } from 'react';
import { useUserApplicationStore, type FileMetadata } from '../store/userApplicationStore';
import { Upload, FileText, Trash2, ShieldCheck, AlertCircle, Loader2, Check } from 'lucide-react';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';
import { API_ENDPOINTS } from '@/config/api.config';

interface DocumentsStepProps {
    onNext: () => void;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({ onNext }) => {
    const { formData, setFormData } = useUserApplicationStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileError, setFileError] = useState<string>('');
    const [uploadingFiles, setUploadingFiles] = useState<Map<number, boolean>>(new Map());
    const [uploadedUrls, setUploadedUrls] = useState<Map<number, string>>(new Map());

    const ALLOWED_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp'
    ];
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

    const uploadFileToBackend = async (file: File, index: number): Promise<string> => {
        setUploadingFiles(prev => new Map(prev).set(index, true));
        
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('file', file);
            formDataToSend.append('category', 'DOCUMENT');
            if (formData.propertyId) {
                formDataToSend.append('propertyId', formData.propertyId);
            }

            const response = await fetch(API_ENDPOINTS.UPLOAD.FILE, {
                method: 'POST',
                credentials: 'include',
                body: formDataToSend,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Failed to upload file' }));
                throw new Error(errorData.message || 'Failed to upload file');
            }

            const data = await response.json();
            const fileUrl = data.url;
            
            setUploadedUrls(prev => new Map(prev).set(index, fileUrl));
            return fileUrl;
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        } finally {
            setUploadingFiles(prev => {
                const newMap = new Map(prev);
                newMap.delete(index);
                return newMap;
            });
        }
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        setFileError('');

        if (files && files.length > 0) {
            const newFiles: File[] = [];
            const newMetadata: FileMetadata[] = [];
            const errors: string[] = [];

            Array.from(files).forEach(file => {
                // Validate file type
                if (!ALLOWED_TYPES.includes(file.type)) {
                    errors.push(`${file.name}: Invalid file type. Only PDF, DOC, DOCX, and images are allowed.`);
                    return;
                }

                // Validate file size
                if (file.size > MAX_FILE_SIZE) {
                    errors.push(`${file.name}: File size exceeds 10MB limit.`);
                    return;
                }

                newFiles.push(file);
                newMetadata.push({
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified
                });
            });

            if (errors.length > 0) {
                setFileError(errors.join(' '));
            }

            if (newFiles.length > 0) {
                const existingFiles = formData.documentFiles || [];
                const existingDocs = formData.documents || [];
                const existingUrls = formData.documentUrls || [];
                const startIndex = existingDocs.length;
                
                // Add files to store first
                setFormData({
                    ...formData,
                    documents: [...existingDocs, ...newMetadata],
                    documentFiles: [...existingFiles, ...newFiles],
                    documentUrls: [...existingUrls, ...new Array(newFiles.length).fill('')] // Placeholder for URLs
                });

                // Upload files to backend asynchronously
                newFiles.forEach(async (file, relativeIndex) => {
                    const absoluteIndex = startIndex + relativeIndex;
                    try {
                        const url = await uploadFileToBackend(file, absoluteIndex);
                        // Update the URL in formData
                        setFormData(prev => {
                            const urls = [...(prev.documentUrls || [])];
                            urls[absoluteIndex] = url;
                            return { ...prev, documentUrls: urls };
                        });
                    } catch (error) {
                        console.error(`Failed to upload ${file.name}:`, error);
                        setFileError(prev => prev ? `${prev}. Failed to upload ${file.name}.` : `Failed to upload ${file.name}.`);
                    }
                });
            }
        }
        if (event.target) event.target.value = '';
    };

    const removeDocument = (index: number) => {
        const updatedDocs = formData.documents.filter((_, i) => i !== index);
        const updatedFiles = (formData.documentFiles || []).filter((_, i) => i !== index);
        const updatedUrls = (formData.documentUrls || []).filter((_, i) => i !== index);
        
        setFormData({
            ...formData,
            documents: updatedDocs,
            documentFiles: updatedFiles,
            documentUrls: updatedUrls
        });
        
        // Clean up upload state
        setUploadedUrls(prev => {
            const newMap = new Map(prev);
            newMap.delete(index);
            return newMap;
        });
        setUploadingFiles(prev => {
            const newMap = new Map(prev);
            newMap.delete(index);
            return newMap;
        });
        setFileError('');
    };


    return (
        <div className="w-full">
            <div className="text-center mb-8">
                <h2 className="text-xl font-medium text-[#1A1A1A] mb-1">Upload Documents</h2>
                <p className="text-gray-400 text-sm">Please provide any supporting documents for your application.</p>
            </div>

            <div className="flex flex-col items-center">
                {/* Upload Area */}
                <div
                    className="w-full border-2 border-dashed border-[#E5E7EB] rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:border-[#7ED957] hover:bg-[#7ED957]/5 transition-all cursor-pointer mb-8 bg-gray-50/30 group"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6 text-[#7ED957]" />
                    </div>
                    <h3 className="font-bold text-[#1A1A1A] mb-1">Click to upload documents</h3>
                    <p className="text-xs text-[#ADADAD]">PDF, DOC, DOCX or Images up to 10MB each</p>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx,image/*"
                        onChange={handleFileUpload}
                    />
                </div>

                {/* Error Message */}
                {fileError && (
                    <div className="w-full mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-red-800 mb-1">Upload Error</p>
                            <p className="text-xs text-red-600">{fileError}</p>
                        </div>
                    </div>
                )}

                {/* File List */}
                {formData.documents.length > 0 && (
                    <div className="w-full mb-8 space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-sm font-semibold text-[#1A1A1A]">Attached Documents</h3>
                            <span className="bg-[#7ED957] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{formData.documents.length}</span>
                        </div>
                        {formData.documents.map((file, index) => {
                            const isUploading = uploadingFiles.get(index);
                            const uploadedUrl = uploadedUrls.get(index);
                            
                            return (
                                <div key={index} className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center transition-colors">
                                            {isUploading ? (
                                                <Loader2 className="w-5 h-5 text-[#7ED957] animate-spin" />
                                            ) : uploadedUrl ? (
                                                <Check className="w-5 h-5 text-[#7ED957]" />
                                            ) : (
                                                <FileText className="w-5 h-5 text-[#7ED957]" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-[#1A1A1A] truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                                            <p className="text-[11px] text-[#ADADAD]">
                                                {isUploading ? 'Uploading...' : uploadedUrl ? 'Uploaded' : 'Pending upload'} • {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            if (!isUploading) {
                                                removeDocument(index);
                                                setUploadedUrls(prev => {
                                                    const newMap = new Map(prev);
                                                    newMap.delete(index);
                                                    return newMap;
                                                });
                                            }
                                        }}
                                        disabled={isUploading}
                                        className={`p-2 transition-colors ${isUploading ? 'text-gray-300 cursor-not-allowed' : 'text-gray-300 hover:text-red-500'}`}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-[#ADADAD] text-xs mb-2">
                        <ShieldCheck size={14} className="text-[#7ED957]" />
                        <span>Your data is encrypted and securely stored</span>
                    </div>
                    <PrimaryActionButton
                        onClick={onNext}
                        disabled={uploadingFiles.size > 0}
                        text={uploadingFiles.size > 0 ? `Uploading ${uploadingFiles.size} file(s)...` : "Submit Application"}
                        className={`px-20 py-4 rounded-full font-bold uppercase tracking-wider transition-all ${uploadingFiles.size === 0
                            ? 'bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 text-white'
                            : 'bg-[#F3F4F6] text-black hover:bg-[#F3F4F6] cursor-not-allowed border-none shadow-none'
                            }`}
                    />
                </div>
            </div>
        </div>
    );
};

export default DocumentsStep;
