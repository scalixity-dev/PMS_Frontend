import CustomTextBox from '../../../components/CustomTextBox'
import { FileText, Download, ExternalLink, Loader2 } from 'lucide-react';

interface ServiceProProfileSectionProps {
    servicePro: {
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
            companyWebsite: string;
            category: string;
            fax: string;
        };
        forwardingAddress: string;
    };
    documents: Array<{
        id: string;
        documentType: string;
        fileUrl: string;
        description?: string | null;
        uploadedAt: string;
    }>;
    isLoadingDocuments: boolean;
}

const ServiceProProfileSection = ({ servicePro, documents, isLoadingDocuments }: ServiceProProfileSectionProps) => {
    const SectionTitle = ({ title }: { title: string }) => (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    );
    return (
        <div className="space-y-8">
            {/* Personal Information */}
            <section>
                <SectionTitle title="Personal information" />
                <div className="bg-[#F6F6F8] rounded-[2rem] p-6 grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6">
                    <CustomTextBox label="First name" value={servicePro.personalInfo.firstName} />
                    <CustomTextBox label="Email" value={servicePro.personalInfo.email} />
                    <CustomTextBox label="Company name" value={servicePro.personalInfo.companyName} />

                    <CustomTextBox label="Middle name" value={servicePro.personalInfo.middleName} />
                    <CustomTextBox label="Additional email 1" value={servicePro.personalInfo.additionalEmail} />
                    <CustomTextBox label="Company website" value={servicePro.personalInfo.companyWebsite} />

                    <CustomTextBox label="Last name" value={servicePro.personalInfo.lastName} />
                    <CustomTextBox label="Phone" value={servicePro.personalInfo.phone} />
                    <CustomTextBox label="Fax" value={servicePro.personalInfo.fax} />

                    <CustomTextBox label="" value="" className="invisible" /> {/* Spacer if needed or just let it flow */}
                    <CustomTextBox label="Additional phone 1" value={servicePro.personalInfo.additionalPhone} />
                    <CustomTextBox label="" value="" className="invisible" />

                    <div className="col-span-1 md:col-span-3">
                        <CustomTextBox label="Service Pro Category" value={servicePro.personalInfo.category} />
                    </div>
                </div>
            </section>

            {/* Forwarding Address */}
            <section>
                <SectionTitle title="Forwarding address" />
                <div className="bg-[#F6F6F8] rounded-[2rem] p-6">
                    <CustomTextBox label="Property address" value={servicePro.forwardingAddress} />
                </div>
            </section>

            {/* Attachments */}
            <section>
                <SectionTitle title="Attachments" />
                <div className="bg-[#F6F6F8] rounded-[2rem] p-6">
                    {isLoadingDocuments ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 animate-spin text-[#3A6D6C]" />
                        </div>
                    ) : documents.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {documents.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="bg-white rounded-xl p-4 border border-gray-200 hover:border-[#3A6D6C] transition-colors shadow-sm"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="bg-[#3A6D6C]/10 p-2 rounded-lg flex-shrink-0">
                                            <FileText className="w-5 h-5 text-[#3A6D6C]" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate mb-1">
                                                {doc.documentType}
                                            </h4>
                                            {doc.description && (
                                                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                                                    {doc.description}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-400 mb-3">
                                                {new Date(doc.uploadedAt).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2">
                                                <a
                                                    href={doc.fileUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-xs text-[#3A6D6C] hover:text-[#2c5251] font-medium transition-colors"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    View
                                                </a>
                                                <a
                                                    href={doc.fileUrl}
                                                    download
                                                    className="flex items-center gap-1 text-xs text-gray-600 hover:text-gray-800 font-medium transition-colors"
                                                >
                                                    <Download className="w-3 h-3" />
                                                    Download
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-[#F6F6F8] rounded-[2rem] p-12 flex flex-col justify-center items-center text-center">
                            <p className="text-gray-500 font-medium mb-1">No attachments</p>
                            <p className="text-xs text-gray-400">When you add attachments, they will appear here.</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default ServiceProProfileSection
