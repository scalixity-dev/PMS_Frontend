import CustomTextBox from '@/pages/Dashboard/components/CustomTextBox'
import React from 'react'

const TenantProfileSection = ({ tenant }: { tenant: any }) => {
    const SectionTitle = ({ title }: { title: string }) => (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    );
  return (
    <div className="space-y-8">
        {/* Personal Information */}
        <section>
            <SectionTitle title="Personal information" />
            <div className="bg-[#F6F6F8] rounded-[2rem] p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <CustomTextBox label="First name" value={tenant.personalInfo.firstName} />
                <CustomTextBox label="Email" value={tenant.personalInfo.email} />
                <CustomTextBox label="Company name" value={tenant.personalInfo.companyName} />
                <CustomTextBox label="Middle name" value={tenant.personalInfo.middleName} />
                <CustomTextBox label="Additional email 1" value={tenant.personalInfo.additionalEmail} />
                <CustomTextBox label="Date of birth" value={tenant.personalInfo.dateOfBirth} />
                <CustomTextBox label="Last name" value={tenant.personalInfo.lastName} />
                <CustomTextBox label="Phone" value={tenant.personalInfo.phone} />
                <CustomTextBox label="Company name" value={tenant.personalInfo.companyName2} />
                <CustomTextBox label="Additional Phone" value={tenant.personalInfo.additionalPhone} />
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

        {/* Attachments */}
        <section>
            <SectionTitle title="Attachments" />
            <div className="bg-[#F6F6F8] rounded-[2rem] p-12 flex justify-center items-center">
                <p className="text-gray-500 font-medium">No attachments yet</p>
            </div>
        </section>
    </div>
  )
}

export default TenantProfileSection