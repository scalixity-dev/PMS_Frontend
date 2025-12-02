import React, { useEffect } from 'react';
import { AccountTypeSelection } from './sections/AccountTypeSelection';
import { EmailSignup } from './sections/EmailSignup';
import { RegistrationForm } from './sections/RegistrationForm';
import { LeftIcon, RightCircle } from './sections/signUpBackgroundIcons';
import { useSignUpStore } from './store/signUpStore';

// Main Signup Component
const SignUpPage: React.FC = () => {
  const { currentStep, nextStep, resetForm } = useSignUpStore();

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
        <RegistrationForm />
      )}
    </>
  );
};

export default SignUpPage;