import React from 'react';
import { useUserApplicationStore } from '../store/userApplicationStore';
import ApplicantForm from '../components/forms/ApplicantForm';

interface ApplicantInfoStepProps {
    onNext: () => void;
}

const ApplicantInfoStep: React.FC<ApplicantInfoStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useUserApplicationStore();

    return (
        <ApplicantForm
            data={formData}
            onChange={updateFormData}
            onSubmit={onNext}
            title="Applicant Information"
            subTitle="Tell us about yourself and when you plan to move."
        />
    );
};

export default ApplicantInfoStep;
