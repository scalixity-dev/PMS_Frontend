import React, { useState } from 'react';
import { AccountTypeSelection } from './sections/AccountTypeSelection';
import { EmailSignup } from './sections/EmailSignup';
import { RegistrationForm } from './sections/RegistrationForm';

interface FormData {
  accountType?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  country?: string;
  city?: string;
  pincode?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  agreedToTerms?: boolean;
}

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
      <svg width="256" height="727" viewBox="0 0 276 927" fill="none" xmlns="http://www.w3.org/2000/svg" className='absolute'>
        <path d="M-98.1178 900.682C-388.05 1084.46 -127.113 236.911 -168.665 182.723C-210.217 128.535 -320.884 83.2018 -233.398 16.1166C-145.912 -50.9686 67.076 113.756 199.012 103.039C456.025 82.163 -10.6319 833.597 -98.1178 900.682Z" fill="#20CC95" fill-opacity="0.25"/>
      </svg>

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