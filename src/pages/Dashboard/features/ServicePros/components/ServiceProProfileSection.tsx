import CustomTextBox from '../../../components/CustomTextBox'

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
}

const ServiceProProfileSection = ({ servicePro }: ServiceProProfileSectionProps) => {
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
                <div className="bg-[#F6F6F8] rounded-[2rem] p-12 flex flex-col justify-center items-center text-center">
                    <p className="text-gray-500 font-medium mb-1">No attachments</p>
                    <p className="text-xs text-gray-400">When you add attachments, they will appear here.</p>
                </div>
            </section>
        </div>
    )
}

export default ServiceProProfileSection
