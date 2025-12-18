import React from 'react';
import { useApplicationStore } from '../store/applicationStore';
import ApplicantForm from '../components/ApplicantForm';

interface ApplicantInfoStepProps {
    onNext: () => void;
}

const ApplicantInfoStep: React.FC<ApplicantInfoStepProps> = ({ onNext }) => {
    const { formData, updateFormData } = useApplicationStore();

    return (
        <ApplicantForm
            data={formData}
            onChange={updateFormData}
            onSubmit={onNext}
            title="Applicant information"
            subTitle="Provide applicant's contact information and specify the preferred move-in date."
        />
    );
};

export default ApplicantInfoStep;
