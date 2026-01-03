import React, { useRef } from 'react';
import { useApplicationStore, type FileMetadata } from '../store/applicationStore';
import { Upload, FileText, Trash2 } from 'lucide-react';

interface DocumentsStepProps {
    onNext: () => void;
}

const DocumentsStep: React.FC<DocumentsStepProps> = ({ onNext }) => {
    const { formData, setFormData } = useApplicationStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const newFiles = Array.from(files);

            // Convert Files to FileMetadata for serialization
            const newMetadata: FileMetadata[] = newFiles.map(file => ({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            }));

            // Update both metadata and runtime File objects
            const existingFiles = formData.documentFiles || [];
            setFormData({
                ...formData,
                documents: [...formData.documents, ...newMetadata],
                documentFiles: [...existingFiles, ...newFiles]
            });
        }
        // Reset input
        if (event.target) {
            event.target.value = '';
        }
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
        <div className="bg-white p-4 sm:p-8 rounded-xl shadow-sm max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold text-[#2c3e50] mb-2">Documents</h2>
            <p className="text-gray-500 mb-8">Please upload any relevant documents (ID, Pay stubs, etc.). Supported formats: PDF, DOC, DOCX, Images.</p>

            {/* Upload Area */}
            <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-[#3A6D6C] transition-colors cursor-pointer bg-gray-50/50"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                    <Upload className="w-6 h-6 text-[#3A6D6C]" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">Click to upload documents</h3>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX or Images</p>
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
                <div className="mt-8 space-y-3">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">Attached Documents ({formData.documents.length})</h3>
                    {formData.documents.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm">
                                    <FileText className="w-5 h-5 text-[#3A6D6C]" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-md">{file.name}</p>
                                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            </div>
                            <button
                                onClick={() => removeDocument(index)}
                                className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-center mt-8">
                <button
                    onClick={onNext}
                    className="px-8 sm:px-12 py-3 bg-[#3A6D6C] text-white rounded-xl font-bold hover:bg-[#2c5251] transition-colors shadow-lg shadow-[#3A6D6C]/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    Submit Application
                </button>
            </div>
        </div>
    );
};

export default DocumentsStep;
