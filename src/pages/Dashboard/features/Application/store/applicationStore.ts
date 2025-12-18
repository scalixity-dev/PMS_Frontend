import { create } from 'zustand';

export interface ApplicationFormData {
  // Step 1: Property Selection
  propertyId: string;
  unitId: string;

  // Step 1: Applicant Info
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phoneNumber: string;  
  dob: Date | undefined;
  shortBio: string;
  moveInDate: Date | undefined;
  
  // Step 2: Occupants
  occupants: any[]; // Define clearer type later if needed
  pets: any[]; // Added pets
  photo: File | null; 
  vehicles: any[]; 
  residences: any[]; // Added residences
  additionalResidenceInfo: string;
}

export interface ApplicationState {
  // Form data
  formData: ApplicationFormData;

  // Step management
  currentStep: number;
  
  // Internal state for Step 1 partial navigation
  isPropertySelected: boolean;

  // Actions
  setFormData: (data: ApplicationFormData | ((prev: ApplicationFormData) => ApplicationFormData)) => void;
  updateFormData: (key: keyof ApplicationFormData, value: any) => void;
  setCurrentStep: (step: number) => void;
  setIsPropertySelected: (selected: boolean) => void;
  resetForm: () => void;
}

const initialFormData: ApplicationFormData = {
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
  additionalResidenceInfo: ''
};

export const useApplicationStore = create<ApplicationState>((set) => ({
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
