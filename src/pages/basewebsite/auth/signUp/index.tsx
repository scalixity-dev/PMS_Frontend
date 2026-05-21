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
  const { currentStep, nextStep, resetForm, formData, updateFormData, setCurrentStep } = useSignUpStore();

  // Reset form when component mounts
  useEffect(() => {
    resetForm();

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const email = searchParams.get('email');
      const role = searchParams.get('role');
      const propertyId = searchParams.get('propertyId');

      if (email || role || propertyId) {
        if (propertyId) {
          sessionStorage.setItem('redirect_property_id', propertyId);
        }
        if (role === 'tenant') {
          updateFormData('accountType', 'renting');
          if (email) {
            updateFormData('email', email);
          }
          // Direct to step 3 (TenantRegistrationForm)
          setCurrentStep(3);
        } else if (email) {
          updateFormData('email', email);
          // Direct to step 2 (EmailSignup)
          setCurrentStep(2);
        }
      }
    } catch (e) {
      console.error('Error parsing signup query parameters:', e);
    }
  }, [resetForm, updateFormData, setCurrentStep]);

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