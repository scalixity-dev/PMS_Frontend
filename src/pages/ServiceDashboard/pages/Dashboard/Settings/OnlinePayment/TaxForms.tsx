import React, { useEffect, useState, useRef } from 'react';
import { Upload, Trash2, FileText, Download } from 'lucide-react';
import DeleteConfirmationModal from '../../../../../../components/common/modals/DeleteConfirmationModal';
import { serviceProviderService } from '../../../../../../services/service-provider.service';


interface TaxForm {
    id: string;
    fileName: string;
    status: 'Verified' | 'Pending' | 'Rejected';
    formType: string;
    taxYear: string;
    uploadDate: string;
    fileSize: string;
    fileUrl: string;
}

interface TaxFormMeta {
    status?: 'Verified' | 'Pending' | 'Rejected';
    formType?: string;
    taxYear?: string;
    uploadDate?: string;
    fileSize?: string;
}

const TaxForms = () => {
    const [taxForms, setTaxForms] = useState<TaxForm[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);

    const [isUploading, setIsUploading] = useState(false);

    // Modal State
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // Form State
    const [formType, setFormType] = useState('');
    const [taxYear, setTaxYear] = useState('2026');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const mapDocToTaxForm = (doc: any): TaxForm => {
        let meta: TaxFormMeta = {};
        try {
            meta = doc?.description ? JSON.parse(doc.description) : {};
        } catch {
            meta = {};
        }
        const fileName = (doc.fileUrl || '').split('/').pop() || 'TaxForm.pdf';
        const uploadDate = meta.uploadDate || new Date(doc.uploadedAt).toLocaleDateString('en-US');
        return {
            id: doc.id,
            fileName,
            status: meta.status || 'Pending',
            formType: meta.formType || 'Other',
            taxYear: meta.taxYear || new Date().getFullYear().toString(),
            uploadDate,
            fileSize: meta.fileSize || '-',
            fileUrl: doc.fileUrl,
        };
    };

    const fetchTaxForms = async () => {
        try {
            setIsLoading(true);
            setLoadError(null);
            const docs = await serviceProviderService.getMyDocuments('TAX_FORM');
            setTaxForms(docs.map(mapDocToTaxForm));
        } catch (err) {
            setLoadError(err instanceof Error ? err.message : 'Failed to load tax forms');
            setTaxForms([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTaxForms();
    }, []);

    // Handlers
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!formType || !taxYear || !selectedFile) {
            alert("Please fill in all fields and select a file.");
            return;
        }

        setIsUploading(true);
        try {
            // Upload file to backend so URL is persistent (not just metadata)
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('category', 'DOCUMENT');

            const apiBase = (import.meta as { env: { VITE_API_BASE_URL?: string } }).env?.VITE_API_BASE_URL || 'http://localhost:3000';
            const uploadRes = await fetch(`${apiBase}/upload/file`, {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            if (!uploadRes.ok) {
                const err = await uploadRes.json().catch(() => ({}));
                throw new Error(err?.message || `Upload failed: ${uploadRes.statusText}`);
            }
            const uploadData = await uploadRes.json();
            const url = uploadData?.url || uploadData?.fileUrl;

            await serviceProviderService.addMyDocument({
                documentType: 'TAX_FORM',
                fileUrl: url,
                description: JSON.stringify({
                    status: 'Pending',
                    formType,
                    taxYear,
                    uploadDate: new Date().toLocaleDateString('en-US'),
                    fileSize: `${(selectedFile.size / 1024).toFixed(0)} KB`,
                }),
            });
            await fetchTaxForms();

            // Reset
            setFormType('');
            setTaxYear('2026');
            setSelectedFile(null);
            setIsUploadModalOpen(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (itemToDelete) {
            serviceProviderService
                .deleteMyDocument(itemToDelete)
                .then(() => fetchTaxForms())
                .catch((err) => alert(err instanceof Error ? err.message : 'Delete failed'))
                .finally(() => {
                    setDeleteModalOpen(false);
                    setItemToDelete(null);
                });
        }
    };

    const handleDownload = (fileName: string, fileUrl: string) => {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6">
            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Tax Form"
                message="Are you sure you want to delete this tax form? This action cannot be undone."
            />

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Section */}
                <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                            <FileText className="text-gray-900" size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">Tax Forms</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Upload and manage your tax documentation</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsUploadModalOpen(true)}
                        className="flex items-center gap-2 bg-[#7CD947] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#6bc13d] transition-colors shadow-sm self-start sm:self-center">
                        <Upload size={18} strokeWidth={2.5} />
                        Upload Form
                    </button>
                </div>

                {/* List Section */}
                <div className="divide-y divide-gray-100">
                    {isLoading ? (
                        <div className="p-4 md:p-8 text-center text-gray-500 text-sm">Loading tax forms...</div>
                    ) : loadError ? (
                        <div className="p-4 md:p-8 text-center text-red-500 text-sm">{loadError}</div>
                    ) : taxForms.length === 0 ? (
                        <div className="p-4 md:p-8 text-center text-gray-500 text-sm">
                            No tax forms found. Click "Upload Form" to add one.
                        </div>
                    ) : (
                        taxForms.map((form) => (
                            <div key={form.id} className="p-4 md:p-6">
                                {/* Top Row: File Name, Badge, Actions */}
                                <div className="flex justify-between items-start mb-6 gap-4">
                                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                                        <div className="w-10 h-10 rounded-lg bg-[#F3F4F6] flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                                            <FileText className="text-[#44A445]" size={20} />
                                        </div>
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                            <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate max-w-full">{form.fileName}</h3>
                                            <span className={`self-start sm:self-auto text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide shrink-0 ${form.status === 'Verified' ? 'bg-[#E7F6E7] text-[#44A445]' :
                                                form.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                {form.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <button
                                            onClick={() => handleDownload(form.fileName, form.fileUrl)}
                                            className="text-[#44A445] hover:text-[#388e39] transition-colors p-1 rounded-md hover:bg-[#E7F6E7]"
                                        >
                                            <Download size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(form.id)}
                                            className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                {/* Details Grid */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-y-4 gap-x-4 sm:gap-x-8 pl-0 sm:pl-[52px]"> {/* Added padding to align with text start */}
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-900 mb-1">Form Type</p>
                                        <p className="text-xs text-gray-600 font-medium">{form.formType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-900 mb-1">Tax Year</p>
                                        <p className="text-xs text-gray-600 font-medium">{form.taxYear}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-900 mb-1">Upload Date</p>
                                        <p className="text-xs text-gray-600 font-medium">{form.uploadDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-semibold text-gray-900 mb-1">File Size</p>
                                        <p className="text-xs text-gray-600 font-medium">{form.fileSize}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Upload Modal */}
            {
                isUploadModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl">
                            <div className="p-4 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-8">Upload Tax Form</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {/* Form Type */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Form Type
                                        </label>
                                        <input
                                            type="text"
                                            value={formType}
                                            onChange={(e) => setFormType(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all placeholder:text-gray-400"
                                        />
                                    </div>

                                    {/* Tax Year */}
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-semibold text-gray-800">
                                            Tax Year
                                        </label>
                                        <input
                                            type="text"
                                            value={taxYear}
                                            onChange={(e) => setTaxYear(e.target.value)}
                                            className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947]/20 focus:border-[#7CD947] transition-all placeholder:text-gray-400"
                                        />
                                    </div>
                                </div>

                                {/* File Upload Area */}
                                <div className="mb-8">
                                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                                        Select File
                                    </label>
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-24 bg-[#EBEBEB] rounded-lg border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                                    >
                                        {selectedFile ? (
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <FileText size={20} />
                                                <span className="font-medium text-sm">{selectedFile.name}</span>
                                            </div>
                                        ) : (
                                            <span className="text-gray-500 text-sm">Click to select file</span>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleFileChange}
                                            accept=".pdf,.doc,.docx"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Accepted formats: PDF, DOC, DOCX (Max size: 10MB)</p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <button className="flex-1 bg-[#D0D5DD] hover:bg-[#C0C5CD] text-[#344054] font-semibold py-3 rounded-lg transition-colors shadow-sm" onClick={() => setIsUploadModalOpen(false)}>
                                        Cancel
                                    </button>
                                    <button className="flex-1 bg-[#7CD947] hover:bg-[#6AC13D] text-white font-semibold py-3 rounded-lg transition-colors shadow-sm" onClick={handleUpload}>
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default TaxForms;
