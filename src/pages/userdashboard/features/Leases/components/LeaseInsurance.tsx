import { useState, useRef, useMemo } from 'react';
import { UploadCloud } from 'lucide-react';
import BaseModal from "@/components/common/modals/BaseModal";

interface InsuranceData {
    companyName: string;
    companyWebsite: string;
    policy: string;
    effectiveDate: string;
    expirationDate: string;
    details: string;
    fileName?: string | null;
}

const initialFormData: InsuranceData = {
    companyName: '',
    companyWebsite: '',
    policy: '',
    effectiveDate: '',
    expirationDate: '',
    details: ''
};

export const LeaseInsurance = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [insuranceData, setInsuranceData] = useState<InsuranceData | null>(null);
    const [formData, setFormData] = useState<InsuranceData>(initialFormData);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleOpenModal = () => {
        if (insuranceData) {
            // Pre-fill form with existing data when editing
            setFormData({
                companyName: insuranceData.companyName || '',
                companyWebsite: insuranceData.companyWebsite || '',
                policy: insuranceData.policy || '',
                effectiveDate: insuranceData.effectiveDate || '',
                expirationDate: insuranceData.expirationDate || '',
                details: insuranceData.details || '',
                fileName: insuranceData.fileName
            });
        } else {
            setFormData(initialFormData);
        }
        setIsModalOpen(true);
    };

    const handleUpdate = () => {
        const updatedData: InsuranceData = {
            ...formData,
            fileName: uploadedFile?.name || insuranceData?.fileName || null
        };
        setInsuranceData(updatedData);
        console.log('Insurance Data:', updatedData);
        console.log('Uploaded File:', uploadedFile);
        setIsModalOpen(false);

        // Reset form
        setFormData(initialFormData);
        setUploadedFile(null);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const footerButtons = useMemo(() => [
        {
            label: 'Cancel',
            onClick: () => setIsModalOpen(false),
            variant: 'secondary' as const,
        },
        {
            label: 'Update',
            onClick: handleUpdate,
            className: '!bg-[#7CD947] text-white hover:!bg-[#6BC53B] shadow-md',
        }
    ], [handleUpdate]);

    return (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!insuranceData ? (
                <div className="bg-[#F7F7F7] rounded-[1.25rem] p-5 flex items-center justify-between shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#F1F1F1] hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col gap-1.5">
                        <h3 className="text-[22px] font-medium text-[#1A1A1A]">Insurance</h3>
                        <p className="text-[#4B5563] text-[15px] font-medium leading-none">
                            Tenant Cloud partnered
                        </p>
                    </div>

                    <button
                        onClick={handleOpenModal}
                        className="text-[var(--dashboard-accent)] font-semibold text-base hover:opacity-80 transition-opacity pr-2"
                    >
                        Add own Insurance
                    </button>
                </div>
            ) : (
                <div className="bg-[#F7F7F7] rounded-[1.25rem] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#F1F1F1] hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start justify-between mb-4">
                        <h3 className="text-[22px] font-semibold text-[#1A1A1A]">Insurance Details</h3>
                        <button
                            onClick={handleOpenModal}
                            className="text-[var(--dashboard-accent)] font-semibold text-sm hover:opacity-80 transition-opacity"
                        >
                            Edit
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Company Name</span>
                            <span className="text-sm font-medium text-[#1A1A1A]">{insuranceData.companyName || '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Company Website</span>
                            <span className="text-sm font-medium text-[#1A1A1A]">{insuranceData.companyWebsite || '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Policy Number</span>
                            <span className="text-sm font-medium text-[#1A1A1A]">{insuranceData.policy || '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Effective Date</span>
                            <span className="text-sm font-medium text-[#1A1A1A]">{insuranceData.effectiveDate || '-'}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Expiration Date</span>
                            <span className="text-sm font-medium text-[#1A1A1A]">{insuranceData.expirationDate || '-'}</span>
                        </div>
                        {insuranceData.fileName && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Attachment</span>
                                <span className="text-sm font-medium text-[var(--dashboard-accent)]">{insuranceData.fileName}</span>
                            </div>
                        )}
                    </div>

                    {insuranceData.details && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <span className="text-xs font-semibold text-gray-500 uppercase block mb-2">Details</span>
                            <p className="text-sm text-gray-700 leading-relaxed">{insuranceData.details}</p>
                        </div>
                    )}
                </div>
            )}

            <BaseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Insurance"
                footerButtons={footerButtons}
                maxWidth="max-w-[700px]"
                titleSize="text-xl"
                headerBorder={true}
                footerBorder={false}
            >
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-[#1A1A1A]">Company name</label>
                            <input
                                type="text"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]/20 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-[#1A1A1A]">Company website</label>
                            <input
                                type="text"
                                name="companyWebsite"
                                value={formData.companyWebsite}
                                onChange={handleChange}
                                placeholder="Enter company website"
                                className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-[#1A1A1A]">Policy</label>
                            <input
                                type="text"
                                name="policy"
                                value={formData.policy}
                                onChange={handleChange}
                                placeholder="Enter policy number"
                                className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]/20 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-[#1A1A1A]">Effective Date</label>
                            <input
                                type="date"
                                name="effectiveDate"
                                value={formData.effectiveDate}
                                onChange={handleChange}
                                placeholder="DD/MM/YYYY"
                                className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]/20 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-[13px] font-medium text-[#1A1A1A]">Expiration Date</label>
                            <input
                                type="date"
                                name="expirationDate"
                                value={formData.expirationDate}
                                onChange={handleChange}
                                placeholder="DD/MM/YYYY"
                                className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]/20 transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-medium text-[#1A1A1A]">Details</label>
                        <textarea
                            name="details"
                            rows={3}
                            value={formData.details}
                            onChange={handleChange}
                            placeholder="Enter insurance details..."
                            className="w-full px-3 py-2.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--dashboard-accent)]/20 transition-all resize-none"
                        />
                    </div>

                    {/* Upload Section */}
                    <div className="w-full">
                        <input
                            type="file"
                            ref={fileInputRef}
                            id="insurance-file-upload"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="hidden"
                        />
                        <label
                            htmlFor="insurance-file-upload"
                            className="w-full h-24 bg-[#E9E9E9] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-[var(--dashboard-accent)] transition-all group"
                        >
                            <UploadCloud className="w-8 h-8 text-[var(--dashboard-accent)] group-hover:scale-110 transition-transform mb-2" />
                            {uploadedFile ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600 font-medium">{uploadedFile.name}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemoveFile();
                                        }}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="Remove file"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <span className="text-sm text-gray-400">Click to upload document</span>
                            )}
                        </label>
                    </div>
                </div>
            </BaseModal>
        </div>
    );
};
