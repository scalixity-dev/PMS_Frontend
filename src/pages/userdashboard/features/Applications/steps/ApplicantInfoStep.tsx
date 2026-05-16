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

    useEffect(() => {
        if (!currentUser) return;

        const [firstName, ...rest] = (currentUser.fullName ?? '').split(' ');
        const lastName = rest.join(' ');

        const fieldsToFill: Array<[string, string | undefined | null]> = [
            ['firstName', firstName],
            ['lastName', lastName],
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
    }, [currentUser]);

    return (
        <ApplicantForm
            data={formData}
            onChange={updateFormData}
            onSubmit={onNext}
            title="Applicant Information"
            subTitle="Tell us about yourself and when you plan to move."
            disabledFields={{
                firstName: true,
                lastName: true,
                email: true,
                phoneCountryCode: true,
                phoneNumber: true,
            }}
        />
    );
};

export default ApplicantInfoStep;
