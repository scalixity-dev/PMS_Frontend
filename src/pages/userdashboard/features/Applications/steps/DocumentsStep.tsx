import React, { useRef } from 'react';
import { useUserApplicationStore, type FileMetadata } from '../store/userApplicationStore';
import { Upload, FileText, Trash2, ShieldCheck } from 'lucide-react';
import PrimaryActionButton from '@/components/common/buttons/PrimaryActionButton';

interface DocumentsStepProps {
    onNext: () => void;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({ onNext }) => {
    const { formData, setFormData } = useUserApplicationStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);
            const newMetadata: FileMetadata[] = newFiles.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            }));

            const existingFiles = formData.documentFiles || [];
            setFormData({
                ...formData,
                documents: [...formData.documents, ...newMetadata],
                documentFiles: [...existingFiles, ...newFiles]
            });
        }
        if (event.target) event.target.value = '';
    };

    const removeDocument = (index: number) => {
        const updatedDocs = formData.documents.filter((_, i) => i !== index);
        const updatedFiles = (formData.documentFiles || []).filter((_, i) => i !== index);
        setFormData({
            ...formData,
            documents: updatedDocs,
            documentFiles: updatedFiles
        });
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

                {/* File List */}
                {formData.documents.length > 0 && (
                    <div className="w-full mb-8 space-y-3">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-sm font-semibold text-[#1A1A1A]">Attached Documents</h3>
                            <span className="bg-[#7ED957] text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{formData.documents.length}</span>
                        </div>
                        {formData.documents.map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-white px-5 py-4 rounded-2xl border border-[#E5E7EB] shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-[#F3F4F6] rounded-xl flex items-center justify-center transition-colors">
                                        <FileText className="w-5 h-5 text-[#7ED957]" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#1A1A1A] truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                                        <p className="text-[11px] text-[#ADADAD]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeDocument(index); }}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="flex items-center gap-2 text-[#ADADAD] text-xs mb-2">
                        <ShieldCheck size={14} className="text-[#7ED957]" />
                        <span>Your data is encrypted and securely stored</span>
                    </div>
                    <PrimaryActionButton
                        onClick={onNext}
                        text="Submit Application"
                        className={`px-20 py-4 rounded-full font-bold uppercase tracking-wider transition-all ${true
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
