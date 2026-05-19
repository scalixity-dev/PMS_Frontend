import React, { useEffect } from 'react';
import { useUserApplicationStore } from '../store/userApplicationStore';
import ApplicantForm from '../components/forms/ApplicantForm';
import { useGetCurrentUser } from '@/hooks/useAuthQueries';

interface ApplicantInfoStepProps {
    onNext: () => void;
}

const ApplicantInfoStep: React.FC<ApplicantInfoStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();
    const { data: currentUser } = useGetCurrentUser();

    const [profileFirstName, ...rest] = (currentUser?.fullName ?? '').split(' ');
    const profileLastName = rest.join(' ');

    useEffect(() => {
        if (!currentUser) return;

        const fieldsToFill: Array<[string, string | undefined | null]> = [
            ['firstName', profileFirstName],
            ['lastName', profileLastName],
            ['email', currentUser.email],
            ['phoneCountryCode', currentUser.phoneCountryCode],
            ['phoneNumber', currentUser.phoneNumber],
        ];

        for (const [key, value] of fieldsToFill) {
            if (value && !formData[key as keyof typeof formData]) {
                updateFormData(key as any, value);
            }
        }

        if (currentUser.dateOfBirth && !formData.dob) {
            updateFormData('dob', new Date(currentUser.dateOfBirth));
        }
    }, [currentUser, profileFirstName, profileLastName]);

    return (
        <ApplicantForm
            data={formData}
            onChange={updateFormData}
            onSubmit={onNext}
            title="Applicant Information"
            subTitle="Tell us about yourself and when you plan to move."
            disabledFields={{
                firstName: !!profileFirstName,
                lastName: !!profileLastName,
                email: !!currentUser?.email,
                phoneCountryCode: !!currentUser?.phoneCountryCode,
                phoneNumber: !!currentUser?.phoneNumber,
            }}
        />
    );
};

export default ApplicantInfoStep;
