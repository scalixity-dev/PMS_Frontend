import React, { useState, useEffect } from 'react';
import BaseModal from '@/components/common/modals/BaseModal';
import ApplicantForm, { type FormData } from './forms/ApplicantForm';

interface UserEditApplicantInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Partial<FormData>;
    onSave: (data: FormData) => void;
}

const UserEditApplicantInfoModal: React.FC<UserEditApplicantInfoModalProps> = ({
    isOpen,
    onClose,
    initialData,
    onSave
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
        if (isOpen && initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                // Ensure dates are Date objects if they are strings (though interface says Date | undefined, safety check)
                dob: initialData.dob ? new Date(initialData.dob) : undefined,
                moveInDate: initialData.moveInDate ? new Date(initialData.moveInDate) : undefined
            }));
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        onSave(formData);
        onClose();
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
