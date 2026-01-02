import React, { useEffect } from 'react';
import { AccountTypeSelection } from './sections/AccountTypeSelection';
import { EmailSignup } from './sections/EmailSignup';
import { RegistrationForm } from './sections/RegistrationForm';
import { TenantRegistrationForm } from './sections/TenantRegistrationForm';
import { TenantOnboarding } from './sections/TenantOnboarding';
import { LeftIcon, RightCircle } from './sections/signUpBackgroundIcons';
import { useSignUpStore } from './store/signUpStore';

// Main Signup Component
const SignUpPage: React.FC = () => {
  const { currentStep, nextStep, resetForm, formData } = useSignUpStore();

  // Reset form when component mounts
  useEffect(() => {
    resetForm();
  }, [resetForm]);

  const handleNext = (): void => {
    nextStep();
  };

  return (
    <>
      <div>
        <LeftIcon />
        <RightCircle />
      </div>

      {currentStep === 1 && (
        <AccountTypeSelection
          onNext={handleNext}
        />
      )}
      {currentStep === 2 && (
        <EmailSignup
          onNext={handleNext}
        />
      )}
      {currentStep === 3 && (
        formData.accountType === 'renting' ? (
          <TenantRegistrationForm />
        ) : (
          <RegistrationForm />
        )
      )}
      {currentStep === 4 && formData.accountType === 'renting' && (
        <TenantOnboarding />
      )}
    </>
  );
};

export default SignUpPage;