import { create } from 'zustand';

interface CreatePropertyFormData {
  // General Info
  propertyName: string;
  propertyType: string;
  isManufactured: string;
  marketRent: string;
  beds: string;
  bathrooms: string;
  sizeSquareFt: string;
  yearBuilt: string;
  address: string;
  city: string;
  stateRegion: string;
  country: string;
  zip: string;
  // Basic Amenities
  parking: string;
  laundry: string;
  ac: string;
  // Extended Amenities
  extendedAmenities: string[];
  // Features
  features: string[];
  // Photos
// Define photo types
type PhotoUrl = string;
interface PhotoFile {
  file: File;
  previewUrl: string;
}
type Photo = PhotoUrl | PhotoFile;

interface CreatePropertyFormData {
  // General Info
  propertyName: string;
  // ... other fields ...
  // Photos
  coverPhoto: Photo | null;
  galleryPhotos: Photo[];
  youtubeUrl: string;
  youtubeUrl: string;
  // Marketing
  marketingDescription: string;
  // Ribbon
  ribbonType: string;
  ribbonTitle: string;
  ribbonColor: string;
}

interface CreatePropertyState {
  // Form data
  formData: CreatePropertyFormData;
  
  // Step management
  currentStep: number;
  
  // Property management
  propertyId: string | null;
  managerId: string | null;
  
  // Actions
  setFormData: (data: CreatePropertyFormData | ((prev: CreatePropertyFormData) => CreatePropertyFormData)) => void;
  updateFormData: (key: keyof CreatePropertyFormData, value: any) => void;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPropertyId: (id: string | null) => void;
  setManagerId: (id: string | null) => void;
  resetForm: () => void;
}

const initialFormData: CreatePropertyFormData = {
  // General Info
  propertyName: '',
  propertyType: '',
  isManufactured: '',
  marketRent: '',
  beds: '',
  bathrooms: '',
  sizeSquareFt: '',
  yearBuilt: '',
  address: '',
  city: '',
  stateRegion: '',
  country: '',
  zip: '',
  // Basic Amenities
  parking: '',
  laundry: '',
  ac: '',
  // Extended Amenities
  extendedAmenities: [],
  // Features
  features: [],
  // Photos
  coverPhoto: null,
  galleryPhotos: [],
  youtubeUrl: '',
  // Marketing
  marketingDescription: '',
  // Ribbon
  ribbonType: 'none',
  ribbonTitle: '',
  ribbonColor: '',
};

export const useCreatePropertyStore = create<CreatePropertyState>((set) => ({
  // Initial state
  formData: initialFormData,
  currentStep: 1,
  propertyId: null,
  managerId: null,

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
  prevStep: () => set((state) => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  // Property management
  setPropertyId: (id) => set({ propertyId: id }),
  setManagerId: (id) => set({ managerId: id }),

  // Reset form
  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 1,
      propertyId: null,
      managerId: null,
    }),
}));

