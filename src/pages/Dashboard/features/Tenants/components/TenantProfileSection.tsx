import { useState, useRef } from 'react';
import { Plus, Trash2, Download, Loader2, X } from 'lucide-react';
import CustomTextBox from '@/pages/Dashboard/components/CustomTextBox';
import { useGetTenantDocuments, useUploadTenantDocument, useDeleteTenantDocument } from '../../../../../hooks/useTenantQueries';

interface TenantProfileSectionProps {
    tenantId: string;
    tenant: {
        id: number;
        name: string;
        personalInfo: {
            firstName: string;
            middleName: string;
            lastName: string;
            email: string;
            additionalEmail: string;
            phone: string;
            additionalPhone: string;
            companyName: string;
            companyName2: string;
            dateOfBirth: string;
        };
        forwardingAddress: string;
        emergencyContacts: Array<{
            name: string;
            phone: string;
            relationship: string;
            email: string;
        }>;
        pets: Array<{
            name: string;
            breed: string;
            type: string;
            weight: string;
        }>;
        vehicles: Array<{
            type: string;
            year: string;
            make: string;
            color: string;
            registeredIn: string;
            license: string;
        }>;
    };
}

const TenantProfileSection = ({ tenantId, tenant }: TenantProfileSectionProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [documentType, setDocumentType] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { data: documents = [], isLoading: isLoadingDocuments } = useGetTenantDocuments(tenantId);
    const uploadDocumentMutation = useUploadTenantDocument();
    const deleteDocumentMutation = useDeleteTenantDocument();

    const SectionTitle = ({ title }: { title: string }) => (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    );

    const allowedFileTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const allowedFileExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx'];

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!allowedFileTypes.includes(file.type)) {
                alert(`Invalid file type. Please select one of the following: ${allowedFileExtensions.join(', ')}`);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
                setSelectedFile(null);
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUploadDocument = async () => {
        if (!selectedFile || !documentType) {
            alert('Please select a file and document type');
            return;
        }

        try {
            setIsUploading(true);
            await uploadDocumentMutation.mutateAsync({
                tenantId,
                file: selectedFile,
                documentType,
                description: description || undefined,
            });
            setIsUploadModalOpen(false);
            setSelectedFile(null);
            setDocumentType('');
            setDescription('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error('Failed to upload document:', error);
            alert(`Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteDocument = async (documentId: string) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocumentMutation.mutateAsync(documentId);
            } catch (error) {
                console.error('Failed to delete document:', error);
                alert(`Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`);
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };
  return (
    <div className="space-y-8">
        {/* Personal Information */}
        <section>
            <SectionTitle title="Personal information" />
            <div className="bg-[#F6F6F8] rounded-[2rem] p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomTextBox label="First name" value={tenant.personalInfo.firstName} />
                <CustomTextBox label="Email" value={tenant.personalInfo.email} />
                <CustomTextBox label="Middle name" value={tenant.personalInfo.middleName} />
                <CustomTextBox label="Additional email 1" value={tenant.personalInfo.additionalEmail} />
                <CustomTextBox label="Date of birth" value={tenant.personalInfo.dateOfBirth} />
                <CustomTextBox label="Last name" value={tenant.personalInfo.lastName} />
                <CustomTextBox label="Phone" value={tenant.personalInfo.phone} />
            </div>
        </section>

        {/* Forwarding Address */}
        <section>
            <SectionTitle title="Forwarding address" />
            <div className="bg-[#F6F6F8] rounded-[2rem] p-6">
                <CustomTextBox label="Property address" value={tenant.forwardingAddress} />
            </div>
        </section>

        {/* Emergency Contacts */}
        <section>
            <SectionTitle title="Emergency contacts" />
            <div className="bg-[#F6F6F8] rounded-[2rem] p-6">
                {tenant.emergencyContacts.map((contact: any, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomTextBox label="Name" value={contact.name} />
                        <CustomTextBox label="Phone" value={contact.phone} />
                        <CustomTextBox label="Relationship" value={contact.relationship} />
                        <div className="hidden md:block"></div> {/* Spacer */}
                        <CustomTextBox label="Email" value={contact.email} />
                    </div>
                ))}
            </div>
        </section>

        {/* Pets */}
        <section>
            <SectionTitle title="Pets" />
            <div className="bg-[#F6F6F8] rounded-[2rem] p-6">
                {tenant.pets.map((pet: any, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomTextBox label="Name" value={pet.name} />
                        <CustomTextBox label="Breed" value={pet.breed} />
                        <CustomTextBox label="Type" value={pet.type} />
                        <div className="hidden md:block"></div> {/* Spacer */}
                        <CustomTextBox label="Weight" value={pet.weight} />
                    </div>
                ))}
            </div>
        </section>

        {/* Vehicles */}
        <section>
            <SectionTitle title="Vehicles" />
            <div className="bg-[#F6F6F8] rounded-[2rem] p-6">
                {tenant.vehicles.map((vehicle: any, index: number) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CustomTextBox label="Type" value={vehicle.type} />
                        <CustomTextBox label="Year" value={vehicle.year} />
                        <CustomTextBox label="Make" value={vehicle.make} />
                        <CustomTextBox label="Color" value={vehicle.color} />
                        <CustomTextBox label="Registered in" value={vehicle.registeredIn} />
                        <CustomTextBox label="License" value={vehicle.license} />
                    </div>
                ))}
            </div>
        </section>

        {/* Documents */}
        <section>
            <div className="flex items-center justify-between mb-4">
                <SectionTitle title="Documents" />
                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#3A6D6C] text-white rounded-full text-sm font-medium hover:bg-[#2c5251] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Upload Document
                </button>
            </div>
            <div className="bg-[#F6F6F8] rounded-[2rem] p-6">
                {isLoadingDocuments ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-[#3A6D6C]" />
                        <span className="ml-2 text-gray-600">Loading documents...</span>
                    </div>
                ) : documents.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500 font-medium">No documents yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {documents.map((doc) => (
                            <div
                                key={doc.id}
                                className="bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#3A6D6C] rounded-lg flex items-center justify-center">
                                            <Download className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-800">{doc.documentType}</p>
                                            <p className="text-sm text-gray-500">
                                                Uploaded: {formatDate(doc.uploadedAt)}
                                            </p>
                                            {doc.description && (
                                                <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={doc.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-[#7BD747] text-white rounded-full text-xs font-medium hover:bg-[#6bc63a] transition-colors flex items-center gap-2"
                                    >
                                        <Download className="w-3.5 h-3.5" />
                                        Download
                                    </a>
                                    <button
                                        onClick={() => handleDeleteDocument(doc.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                        title="Delete document"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>

        {/* Upload Document Modal */}
        {isUploadModalOpen && (
            <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
                <div className="bg-[#E0E8E7] w-full max-w-xl rounded-[2.5rem] shadow-2xl">
                    {/* Modal Header */}
                    <div className="bg-[#3A6D6C] rounded-t-[2.5rem] px-6 py-5 flex justify-between items-center text-white">
                        <h2 className="text-xl font-semibold">Upload Document</h2>
                        <button
                            onClick={() => {
                                setIsUploadModalOpen(false);
                                setSelectedFile(null);
                                setDocumentType('');
                                setDescription('');
                                if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                }
                            }}
                            className="hover:bg-white/20 rounded-full p-1 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Modal Body */}
                    <div className="p-8 space-y-6">
                        <div className="space-y-3">
                            <label className="text-gray-900 font-bold ml-1">Document Type *</label>
                            <input
                                type="text"
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                                placeholder="e.g., ID Proof, Lease Agreement, etc."
                                className="w-full bg-white rounded-2xl p-4 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3A6D6C]"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-gray-900 font-bold ml-1">Description (Optional)</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add a description..."
                                rows={3}
                                className="w-full bg-white rounded-2xl p-4 border border-gray-200 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] resize-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-gray-900 font-bold ml-1">File *</label>
                            <div className="relative">
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    onChange={handleFileSelect}
                                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                                    className="hidden"
                                    id="document-file-input"
                                />
                                <label
                                    htmlFor="document-file-input"
                                    className="w-full bg-white rounded-2xl p-4 border-2 border-dashed border-gray-300 text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] cursor-pointer hover:border-[#3A6D6C] hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>{selectedFile ? selectedFile.name : 'Choose File'}</span>
                                </label>
                            </div>
                            {selectedFile && (
                                <div className="bg-[#E8F5E9] rounded-xl p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Download className="w-4 h-4 text-[#2E6819]" />
                                        <div>
                                            <p className="text-sm font-medium text-[#2E6819]">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-600">
                                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = '';
                                            }
                                        }}
                                        className="text-red-500 hover:text-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 ml-1">
                                Allowed formats: PDF, DOC, DOCX, XLS, XLSX
                            </p>
                        </div>

                        <div className="pt-2 flex gap-3">
                            <button
                                onClick={handleUploadDocument}
                                disabled={isUploading || !selectedFile || !documentType}
                                className="flex-1 bg-[#457B7A] text-white px-10 py-3 rounded-2xl font-bold text-lg shadow-[0_4px_10px_rgba(69,123,122,0.3)] hover:bg-[#386463] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    'Upload'
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setIsUploadModalOpen(false);
                                    setSelectedFile(null);
                                    setDocumentType('');
                                    setDescription('');
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = '';
                                    }
                                }}
                                className="px-6 py-3 bg-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:bg-gray-400 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default TenantProfileSection