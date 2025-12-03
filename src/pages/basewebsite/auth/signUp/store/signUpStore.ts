import { create } from 'zustand';
import type { RegisterFormData } from '../sections/signUpProps';

interface SignUpState {
  // Form data
  formData: RegisterFormData;
  
  // Step management
  currentStep: number;
  
  // Actions
  setFormData: (data: RegisterFormData | ((prev: RegisterFormData) => RegisterFormData)) => void;
  updateFormData: (key: keyof RegisterFormData, value: any) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  resetForm: () => void;
  
  // OAuth specific
  isOAuthSignup: boolean;
  userId?: string;
  setIsOAuthSignup: (isOAuth: boolean) => void;
  setUserId: (id?: string) => void;
}

const initialFormData: RegisterFormData = {
  accountType: undefined,
  email: undefined,
  fullName: undefined,
  phone: undefined,
  phoneCountryCode: undefined,
  country: undefined,
  state: undefined,
  pincode: undefined,
  address: undefined,
  password: undefined,
  confirmPassword: undefined,
  agreedToTerms: false,
};

export const useSignUpStore = create<SignUpState>((set) => ({
  // Initial state
  formData: initialFormData,
  currentStep: 1,
  isOAuthSignup: false,
  userId: undefined,

  // Set entire form data
  setFormData: (data) =>
    set((state) => ({
      formData: typeof data === 'function' ? data(state.formData) : data,
    })),

  // Update a specific field
  updateFormData: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),

  // Step management
  setCurrentStep: (step) => set({ currentStep: step }),
  nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

  // Reset form
  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 1,
      isOAuthSignup: false,
      userId: undefined,
    }),

  // OAuth management
  setIsOAuthSignup: (isOAuth) => set({ isOAuthSignup: isOAuth }),
  setUserId: (id) => set({ userId: id }),
}));

