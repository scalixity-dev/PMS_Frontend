import { useState, useRef, useMemo, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react';
import { UploadCloud, X, FileText } from 'lucide-react';
import { format } from 'date-fns';
import BaseModal from "@/components/common/modals/BaseModal";
import DatePicker from "@/components/ui/DatePicker";

interface InsuranceData {
    companyName: string;
    companyWebsite: string;
    policy: string;
    effectiveDate: Date | undefined;
    expirationDate: Date | undefined;
    details: string;
    fileName?: string | null;
    fileData?: string | null; // base64 encoded file
    fileType?: string | null; // mime type
}

const initialFormData: InsuranceData = {
    companyName: '',
    companyWebsite: '',
    policy: '',
    effectiveDate: undefined,
    expirationDate: undefined,
    details: '',
    fileName: null,
    fileData: null,
    fileType: null
};

export interface LeaseInsuranceRef {
    openModal: () => void;
}

const STORAGE_KEY = 'lease_insurance_data';

export const LeaseInsurance = forwardRef<LeaseInsuranceRef>((_props, ref) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [insuranceData, setInsuranceData] = useState<InsuranceData | null>(null);
    const [formData, setFormData] = useState<InsuranceData>(initialFormData);
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load insurance data from localStorage on mount
    useEffect(() => {
        try {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                const parsed = JSON.parse(savedData);
                // Convert date strings back to Date objects
                if (parsed.effectiveDate) {
                    parsed.effectiveDate = new Date(parsed.effectiveDate);
                }
                if (parsed.expirationDate) {
                    parsed.expirationDate = new Date(parsed.expirationDate);
                }
                setInsuranceData(parsed);
            }
        } catch (error) {
            console.error('Error loading insurance data from localStorage:', error);
        }
    }, []);

    // Save insurance data to localStorage whenever it changes
    useEffect(() => {
        if (insuranceData) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(insuranceData));
            } catch (error) {
                console.error('Error saving insurance data to localStorage:', error);
            }
        }
    }, [insuranceData]);

    // Expose openModal method to parent via ref
    useImperativeHandle(ref, () => ({
        openModal: () => handleOpenModal()
    }));

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleOpenModal = useCallback(() => {
        if (insuranceData) {
            // Pre-fill form with existing data when editing
            setFormData({
                companyName: insuranceData.companyName || '',
                companyWebsite: insuranceData.companyWebsite || '',
                policy: insuranceData.policy || '',
                effectiveDate: insuranceData.effectiveDate || undefined,
                expirationDate: insuranceData.expirationDate || undefined,
                details: insuranceData.details || '',
                fileName: insuranceData.fileName
            });
            setUploadedFile(null);
        } else {
            setFormData(initialFormData);
            setUploadedFile(null);
        }
        setIsModalOpen(true);
    }, [insuranceData]);

    const handleUpdate = useCallback(() => {
        // Create updated data object with all current form values
        const updatedData: InsuranceData = {
            companyName: formData.companyName,
            companyWebsite: formData.companyWebsite,
            policy: formData.policy,
            effectiveDate: formData.effectiveDate,
            expirationDate: formData.expirationDate,
            details: formData.details,
            fileName: formData.fileName,
            fileData: formData.fileData,
            fileType: formData.fileType
        };
        
        // Save to state - this persists the data
        setInsuranceData(updatedData);
        console.log('Insurance Data Saved:', updatedData);
        
        // Close modal
        setIsModalOpen(false);

        // Reset form (doesn't affect saved insuranceData)
        setFormData(initialFormData);
        setUploadedFile(null);
    }, [formData]);

    const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadedFile(file);

        // Convert to base64 for persistence
        const reader = new FileReader();
        reader.onload = () => {
            setFormData(prev => ({
                ...prev,
                fileName: file.name,
                fileData: reader.result as string,
                fileType: file.type
            }));
        };
        reader.readAsDataURL(file);
    }, []);

    const handleRemoveFile = useCallback(() => {
        setUploadedFile(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    // Helper to check if file is an image
    const isImageFile = useCallback((fileName: string) => {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        return imageExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
    }, []);

    // Get file preview URL (uses base64 data, no memory leak)
    const getFilePreviewUrl = useCallback(() => {
        if (formData.fileData) {
            return formData.fileData;
        }
        return null;
    }, [formData.fileData]);

    // Date validation
    const isDateInvalid = useMemo(() => {
        return !!(
            formData.effectiveDate &&
            formData.expirationDate &&
            formData.expirationDate < formData.effectiveDate
        );
    }, [formData.effectiveDate, formData.expirationDate]);

    const handleClose = useCallback(() => {
        // Reset to saved data or initial form
        setFormData(insuranceData || initialFormData);
        setUploadedFile(null);
        setIsModalOpen(false);
    }, [insuranceData]);

    const footerButtons = useMemo(() => [
        {
            label: 'Cancel',
            onClick: handleClose,
            variant: 'secondary' as const,
        },
        {
            label: 'Update',
            onClick: handleUpdate,
            className: '!bg-[#7CD947] text-white hover:!bg-[#6BC53B] shadow-md',
            disabled: isDateInvalid
        }
    ], [handleUpdate, handleClose, isDateInvalid]);

    return (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!insuranceData ? (
                <div className="bg-[#F7F7F7] rounded-[1.25rem] p-5 flex items-center justify-between shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#F1F1F1] hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col gap-1.5">
                        <h3 className="text-[22px] font-medium text-[#1A1A1A]">Insurance</h3>
                        <p className="text-[#4B5563] text-[15px] font-medium leading-none">
                            Smart Tenant AI
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
                <div className="bg-[#F7F7F7] rounded-[1.25rem] p-6 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] border border-[#F1F1F1]  transition-all duration-300">
                    <div className="flex items-start justify-between px-6 py-3 -mx-6 -mt-6 mb-4 border-b border-[#E5E7EB]">
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
                            <span className="text-sm font-medium text-[#1A1A1A]">
                                {insuranceData.effectiveDate ? format(insuranceData.effectiveDate, 'MMM dd, yyyy') : '-'}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-500 uppercase">Expiration Date</span>
                            <span className="text-sm font-medium text-[#1A1A1A]">
                                {insuranceData.expirationDate ? format(insuranceData.expirationDate, 'MMM dd, yyyy') : '-'}
                            </span>
                        </div>
                        {insuranceData.fileName && (
                            <div className="flex flex-col gap-1">
                                <span className="text-xs font-semibold text-gray-500 uppercase">Attachment</span>
                                {isImageFile(insuranceData.fileName) && insuranceData.fileData ? (
                                    <button
                                        onClick={() => setSelectedImage(insuranceData.fileData || null)}
                                        className="text-sm font-medium text-[var(--dashboard-accent)] hover:underline text-left flex items-center gap-2"
                                    >
                                        <FileText size={16} />
                                        {insuranceData.fileName}
                                    </button>
                                ) : (
                                    <span className="text-sm font-medium text-[var(--dashboard-accent)] flex items-center gap-2">
                                        <FileText size={16} />
                                        {insuranceData.fileName}
                                    </span>
                                )}
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
                onClose={handleClose}
                title="Insurance"
                footerButtons={footerButtons}
                maxWidth="max-w-[700px]"
                titleSize="text-xl"
                headerBorder={true}
                footerBorder={false}
                padding="px-6 py-6 !overflow-visible"
            >
                <div className="flex flex-col gap-4 overflow-visible">
                    <div className="grid grid-cols-2 gap-6 overflow-visible">
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

                    <div className="grid grid-cols-3 gap-4 overflow-visible">
                        <div className="flex flex-col gap-2 overflow-visible">
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
                        <div className="flex flex-col gap-2 overflow-visible">
                            <label className="text-[13px] font-medium text-[#1A1A1A]">Effective Date</label>
                            <DatePicker
                                value={formData.effectiveDate}
                                onChange={(date) => setFormData(prev => ({ ...prev, effectiveDate: date }))}
                                placeholder="Select effective date"
                                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-sm focus:ring-2 focus:ring-[var(--dashboard-accent)]/20"
                            />
                        </div>
                        <div className="flex flex-col gap-2 overflow-visible">
                            <label className="text-[13px] font-medium text-[#1A1A1A]">Expiration Date</label>
                            <DatePicker
                                value={formData.expirationDate}
                                onChange={(date) => setFormData(prev => ({ ...prev, expirationDate: date }))}
                                placeholder="Select expiration date"
                                className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-md text-sm focus:ring-2 focus:ring-[var(--dashboard-accent)]/20"
                            />
                        </div>
                    </div>

                    {/* Date Validation Error */}
                    {isDateInvalid && (
                        <div className="col-span-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                            ⚠️ Expiration date must be after effective date
                        </div>
                    )}

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
                    <div className="w-full space-y-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            id="insurance-file-upload"
                            onChange={handleFileUpload}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            className="hidden"
                        />
                        
                        {/* Preview if file is uploaded */}
                        {(uploadedFile || formData.fileName) && (
                            <div className="bg-white rounded-lg border border-gray-200 p-3">
                                {uploadedFile && isImageFile(uploadedFile.name) ? (
                                    <div className="flex items-center gap-3">
                                        <div 
                                            className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                                            onClick={() => {
                                                const url = getFilePreviewUrl();
                                                if (url) setSelectedImage(url);
                                            }}
                                        >
                                            <img
                                                src={getFilePreviewUrl() || ''}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{uploadedFile.name}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleRemoveFile();
                                                setFormData(prev => ({ ...prev, fileName: null }));
                                            }}
                                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                                            title="Remove file"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                                            <FileText size={24} className="text-gray-500" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">
                                                {uploadedFile?.name || formData.fileName}
                                            </p>
                                            <p className="text-xs text-gray-500">Document attached</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                handleRemoveFile();
                                                setFormData(prev => ({ ...prev, fileName: null }));
                                            }}
                                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                                            title="Remove file"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Upload Button */}
                        <label
                            htmlFor="insurance-file-upload"
                            className="w-full h-24 bg-[#E9E9E9] rounded-xl flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:border-[var(--dashboard-accent)] transition-all group"
                            aria-label={uploadedFile || formData.fileName ? 'Click to change insurance document' : 'Click to upload insurance document'}
                        >
                            <UploadCloud className="w-8 h-8 text-[var(--dashboard-accent)] group-hover:scale-110 transition-transform mb-2" />
                            <span className="text-sm text-gray-400">
                                {uploadedFile || formData.fileName ? 'Click to change document' : 'Click to upload document'}
                            </span>
                        </label>
                    </div>
                </div>
            </BaseModal>

            {/* Image Preview Modal */}
            {selectedImage && (
                <div 
                    className="fixed inset-0 bg-black/75 z-[10000] flex items-center justify-center p-28"
                    onClick={() => setSelectedImage(null)}
                >
                    <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute -top-8 -right-12 bg-white rounded-full p-3 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl z-50"
                            aria-label="Close"
                        >
                            <X size={24} className="text-gray-700" strokeWidth={2.5} />
                        </button>
                        
                        {/* Image */}
                        <img 
                            src={selectedImage} 
                            alt="Insurance document preview" 
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                </div>
            )}
        </div>
    );
});

LeaseInsurance.displayName = 'LeaseInsurance';
