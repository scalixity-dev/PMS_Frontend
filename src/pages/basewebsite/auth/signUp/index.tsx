import React, { useEffect, useState } from 'react';
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
  // Set when the visitor was bounced here from a Google login with no account.
  const [noAccountEmail, setNoAccountEmail] = useState<string | null>(null);

  // Reset form when component mounts
  useEffect(() => {
    resetForm();

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const email = searchParams.get('email');
      const role = searchParams.get('role');
      const propertyId = searchParams.get('propertyId');

      // Arrived from "Continue with Google" on the login screen with no
      // account. Nothing was created - the backend deliberately refuses to,
      // since no account type was chosen there - so explain why they are here
      // and pre-fill the address they already proved they own.
      if (searchParams.get('noAccount') === 'true') {
        setNoAccountEmail(email ?? '');
        if (email) updateFormData('email', email);
      }

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

      {noAccountEmail !== null && (
        <div
          role="status"
          aria-live="polite"
          className="mx-auto mt-6 flex max-w-xl items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
        >
          <span
            aria-hidden="true"
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-slate-900">
              No account yet for this Google address
            </p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600">
              {noAccountEmail ? (
                <>
                  We could not find an account for{' '}
                  <span className="font-medium text-slate-900">{noAccountEmail}</span>.{' '}
                </>
              ) : (
                <>We could not find an account for that Google address. </>
              )}
              Choose how you will use SmartTenantAI below to finish signing up.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setNoAccountEmail(null)}
            aria-label="Dismiss"
            className="-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

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