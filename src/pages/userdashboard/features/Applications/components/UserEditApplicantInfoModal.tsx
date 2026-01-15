import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/common/modals/BaseModal';
import ApplicantForm, { type FormData } from './forms/ApplicantForm';

interface UserEditApplicantInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicationId: string;
    onUpdate: () => void;
}

const UserEditApplicantInfoModal: React.FC<UserEditApplicantInfoModalProps> = ({
    isOpen,
    onClose,
    applicationId,
    onUpdate
}) => {
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        phoneCountryCode: '',
        dob: undefined,
        shortBio: '',
        moveInDate: undefined,
        photo: null
    });

    useEffect(() => {
        if (isOpen && applicationId) {
            const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
            const foundApp = localApps.find((app: any) => String(app.id) === applicationId);

            if (foundApp && foundApp.formData) {
                const data = foundApp.formData;
                setFormData({
                    firstName: data.firstName || '',
                    middleName: data.middleName || '',
                    lastName: data.lastName || '',
                    email: data.email || '',
                    phoneNumber: data.phoneNumber || '',
                    phoneCountryCode: data.phoneCountryCode || 'IN|+91',
                    dob: data.dob ? new Date(data.dob) : undefined,
                    shortBio: data.shortBio || '',
                    moveInDate: data.moveInDate ? new Date(data.moveInDate) : undefined,
                    photo: data.photo || null
                });
            }
        }
    }, [isOpen, applicationId]);

    const handleSave = async () => {
        // Update localStorage
        const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
        const appIndex = localApps.findIndex((app: any) => String(app.id) === applicationId);

        if (appIndex !== -1) {
            const updatedApp = { ...localApps[appIndex] };

            let photoToSave = typeof formData.photo === 'string' ? formData.photo : updatedApp.formData.photo;

            // If it's a new file, convert to base64
            if (formData.photo && typeof formData.photo !== 'string') {
                try {
                    const toBase64 = (file: File | Blob): Promise<string> => new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.readAsDataURL(file);
                        reader.onload = () => resolve(reader.result as string);
                        reader.onerror = error => reject(error);
                    });
                    photoToSave = await toBase64(formData.photo as any);
                } catch (e) {
                    console.error("Failed to convert photo to base64", e);
                }
            }

            updatedApp.formData = {
                ...updatedApp.formData,
                ...formData,
                // Serialize dates as ISO strings
                dob: formData.dob ? formData.dob.toISOString() : undefined,
                moveInDate: formData.moveInDate ? formData.moveInDate.toISOString() : undefined,
                photo: photoToSave
            };

            // Update top-level fields for convenience/display in list
            updatedApp.name = [formData.firstName, formData.lastName].filter(Boolean).join(' ');
            updatedApp.phone = formData.phoneNumber;

            localApps[appIndex] = updatedApp;
            localStorage.setItem('user_applications', JSON.stringify(localApps));

            onUpdate();
            onClose();
        }
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Applicant Information"
            maxWidth="max-w-4xl"
            footerButtons={[]} // ApplicantForm provides the save button
        >
            <div className="py-4">
                <ApplicantForm
                    data={formData}
                    onChange={(key, value) => setFormData(prev => ({ ...prev, [key]: value }))}
                    onSubmit={handleSave}
                    title=""
                    subTitle=""
                    submitLabel="Save Changes"
                />
            </div>
        </BaseModal>
    );
};

export default UserEditApplicantInfoModal;
