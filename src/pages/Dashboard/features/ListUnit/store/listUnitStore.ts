import { create } from 'zustand';

export interface ListUnitFormData {
  // Step 1
  property: string;
  unit: string;
  bedrooms: string;
  bathrooms: string;
  size: string;
  // Step 2 - Leasing Details
  rent: string;
  deposit: string;
  refundable: string;
  leaseDuration: string;
  minLeaseDuration: string;
  maxLeaseDuration: string;
  availableDate: string;
  monthToMonth: boolean;
  description: string;
  // Step 2 - Pet Policy
  petsAllowed: boolean | null;
  pets: string[];
  petDeposit: string;
  petRent: string;
  petDescription: string;
  // Step 3 - Application Settings
  receiveApplicationsOnline: boolean | null;
  applicationFee: boolean | null;
  applicationFeeAmount: string;
  // Listing Contact
  contactName: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  displayPhonePublicly: boolean;
  // Legacy fields (not used but kept for compatibility)
  amenities: any[];
  publish: boolean;
  parking: string;
  laundry: string;
  ac: string;
}

interface ListUnitState {
  // Form data
  formData: ListUnitFormData;
  
  // Step management
  currentStep: number;
  leasingStep: number; // 1: Details, 2: Pets Policy, 3: Pet Details
  applicationStep: number; // 1: Online Apps, 2: Application Fee, 3: Fee Details, 4: Listing Contact
  
  // UI state
  showCreateProperty: boolean;
  showSuccessModal: boolean;
  
  // Data state
  leasingId: string | null;
  isSubmitting: boolean;
  error: string | null;
  
  // Actions
  setFormData: (data: ListUnitFormData | ((prev: ListUnitFormData) => ListUnitFormData)) => void;
  updateFormData: (key: keyof ListUnitFormData, value: any) => void;
  setCurrentStep: (step: number) => void;
  setLeasingStep: (step: number) => void;
  setApplicationStep: (step: number) => void;
  setShowCreateProperty: (show: boolean) => void;
  setShowSuccessModal: (show: boolean) => void;
  setLeasingId: (id: string | null) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

const initialFormData: ListUnitFormData = {
  // Step 1
  property: '',
  unit: '',
  bedrooms: '',
  bathrooms: '',
  size: '',
  // Step 2 - Leasing Details
  rent: '',
  deposit: '',
  refundable: '',
  leaseDuration: '',
  minLeaseDuration: '',
  maxLeaseDuration: '',
  availableDate: '',
  monthToMonth: false,
  description: '',
  // Step 2 - Pet Policy
  petsAllowed: null,
  pets: [],
  petDeposit: '',
  petRent: '',
  petDescription: '',
  // Step 3 - Application Settings
  receiveApplicationsOnline: null,
  applicationFee: null,
  applicationFeeAmount: '',
  // Listing Contact
  contactName: '',
  countryCode: '+91',
  phoneNumber: '',
  email: '',
  displayPhonePublicly: false,
  // Legacy fields
  amenities: [],
  publish: false,
  parking: '',
  laundry: '',
  ac: '',
};

export const useListUnitStore = create<ListUnitState>((set) => ({
  // Initial state
  formData: initialFormData,
  currentStep: 1,
  leasingStep: 1,
  applicationStep: 1,
  showCreateProperty: false,
  showSuccessModal: false,
  leasingId: null,
  isSubmitting: false,
  error: null,

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
  setLeasingStep: (step) => set({ leasingStep: step }),
  setApplicationStep: (step) => set({ applicationStep: step }),

  // UI state
  setShowCreateProperty: (show) => set({ showCreateProperty: show }),
  setShowSuccessModal: (show) => set({ showSuccessModal: show }),

  // Data state
  setLeasingId: (id) => set({ leasingId: id }),
  setIsSubmitting: (isSubmitting) => set({ isSubmitting }),
  setError: (error) => set({ error }),

  // Reset form
  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 1,
      leasingStep: 1,
      applicationStep: 1,
      showCreateProperty: false,
      showSuccessModal: false,
      leasingId: null,
      isSubmitting: false,
      error: null,
    }),
}));

