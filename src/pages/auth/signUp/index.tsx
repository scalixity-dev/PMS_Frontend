import React, { useState } from 'react';
import { AccountTypeSelection } from './sections/AccountTypeSelection';
import { EmailSignup } from './sections/EmailSignup';
import { RegistrationForm } from './sections/RegistrationForm';
import type { FormData } from './sections/signUpProps';
import { LeftIcon, RightCircle } from './sections/signUpBackgroundIcons';

// Main Signup Component
const SignUpPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({});

  const handleNext = (): void => {
    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = (): void => {
    //on final submit
  };

  return (
    <>
      <LeftIcon />
      <RightCircle />

      {currentStep === 1 && (
        <AccountTypeSelection
          onNext={handleNext}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {currentStep === 2 && (
        <EmailSignup
          onNext={handleNext}
          formData={formData}
          setFormData={setFormData}
        />
      )}
      {currentStep === 3 && (
        <RegistrationForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default SignUpPage;