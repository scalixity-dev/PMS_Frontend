import { create } from 'zustand';
import type { UserApplicationFormData } from './types';
export * from './types';

export interface UserApplicationState {
  // Form data
  formData: UserApplicationFormData;

  // Step management
  currentStep: number;

  // Internal state for Step 1 partial navigation
  isPropertySelected: boolean;

  // Actions
  setFormData: (data: UserApplicationFormData | ((prev: UserApplicationFormData) => UserApplicationFormData)) => void;
  updateFormData: <K extends keyof UserApplicationFormData>(key: K, value: UserApplicationFormData[K]) => void;
  setCurrentStep: (step: number) => void;
  setIsPropertySelected: (selected: boolean) => void;
  resetForm: () => void;
}

const initialFormData: UserApplicationFormData = {
  propertyId: '',
  unitId: '',
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  dob: undefined,
  shortBio: '',
  moveInDate: undefined,
  photo: null,
  occupants: [],
  pets: [],
  vehicles: [],
  residences: [],
  incomes: [],
  additionalResidenceInfo: '',
  additionalIncomeInfo: '',
  emergencyContacts: [],
  backgroundQuestions: {},
  backgroundExplanations: {},
  documents: []
};

export const useUserApplicationStore = create<UserApplicationState>((set) => ({
  formData: initialFormData,
  currentStep: 1,
  isPropertySelected: false,

  setFormData: (data) =>
    set((state) => ({
      formData: typeof data === 'function' ? data(state.formData) : data,
    })),

  updateFormData: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),

  setCurrentStep: (step) => set({ currentStep: step }),
  setIsPropertySelected: (selected) => set({ isPropertySelected: selected }),

  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 1,
      isPropertySelected: false,
    }),
}));

