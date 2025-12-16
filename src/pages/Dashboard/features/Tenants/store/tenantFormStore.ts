import { create } from 'zustand';

export interface TenantFormData {
  personalInfo: {
    firstName: string;
    middleName: string;
    lastName: string;
    companyName: string;
    dateOfBirth: string;
    email: string;
    phone: string;
    age: string;
  };
  forwardingAddress: {
    address: string;
    unit: string;
    city: string;
    stateRegion: string;
    zip: string;
    country: string;
  };
  emergencyContacts: Array<{
    id: number;
    name: string;
    email: string;
    phone: string;
    details: string;
  }>;
  pets: Array<{
    id: number;
    type: string;
    name: string;
    weight: string;
    breed: string;
  }>;
  vehicles: Array<{
    id: number;
    type: string;
    make: string;
    model: string;
    year: string;
    color: string;
    licensePlate: string;
    registeredIn: string;
  }>;
}

interface TenantFormState {
  // Form data
  formData: TenantFormData;
  
  // File state
  profilePhoto: string | null;
  profilePhotoFile: File | null;
  documents: File[];
  
  // Section visibility
  sections: {
    forwardingAddress: boolean;
    emergencyContacts: boolean;
    pets: boolean;
    vehicles: boolean;
  };
  
  // Errors
  errors: Record<string, string>;
  submitError: string | null;
  
  // Actions
  setFormData: (data: TenantFormData | ((prev: TenantFormData) => TenantFormData)) => void;
  updatePersonalInfo: (key: string, value: string) => void;
  updateForwardingAddress: (key: string, value: string) => void;
  updateEmergencyContact: (id: number, field: string, value: string) => void;
  addEmergencyContact: () => void;
  removeEmergencyContact: (id: number) => void;
  updatePet: (id: number, field: string, value: string) => void;
  addPet: () => void;
  removePet: (id: number) => void;
  updateVehicle: (id: number, field: string, value: string) => void;
  addVehicle: () => void;
  removeVehicle: (id: number) => void;
  setProfilePhoto: (photo: string | null, file?: File | null) => void;
  setDocuments: (documents: File[]) => void;
  addDocument: (file: File) => void;
  removeDocument: (index: number) => void;
  toggleSection: (section: keyof TenantFormState['sections'], value: boolean) => void;
  setErrors: (errors: Record<string, string>) => void;
  setSubmitError: (error: string | null) => void;
  resetForm: () => void;
}

const initialFormData: TenantFormData = {
  personalInfo: {
    firstName: '',
    middleName: '',
    lastName: '',
    companyName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    age: '',
  },
  forwardingAddress: {
    address: '',
    unit: '',
    city: '',
    stateRegion: '',
    zip: '',
    country: '',
  },
  emergencyContacts: [
    { id: 1, name: '', email: '', phone: '', details: '' }
  ],
  pets: [
    { id: 1, type: '', name: '', weight: '', breed: '' }
  ],
  vehicles: [
    { id: 1, type: '', make: '', model: '', year: '', color: '', licensePlate: '', registeredIn: '' }
  ],
};

export const useTenantFormStore = create<TenantFormState>((set) => ({
  // Initial state
  formData: initialFormData,
  profilePhoto: null,
  profilePhotoFile: null,
  documents: [],
  sections: {
    forwardingAddress: false,
    emergencyContacts: false,
    pets: false,
    vehicles: false,
  },
  errors: {},
  submitError: null,

  // Set entire form data
  setFormData: (data) =>
    set((state) => ({
      formData: typeof data === 'function' ? data(state.formData) : data,
    })),

  // Update personal info
  updatePersonalInfo: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        personalInfo: { ...state.formData.personalInfo, [key]: value },
      },
    })),

  // Update forwarding address
  updateForwardingAddress: (key, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        forwardingAddress: { ...state.formData.forwardingAddress, [key]: value },
      },
    })),

  // Emergency contacts
  updateEmergencyContact: (id, field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        emergencyContacts: state.formData.emergencyContacts.map((contact) =>
          contact.id === id ? { ...contact, [field]: value } : contact
        ),
      },
    })),
  addEmergencyContact: () =>
    set((state) => {
      const newId = Math.max(0, ...state.formData.emergencyContacts.map((c) => c.id)) + 1;
      return {
        formData: {
          ...state.formData,
          emergencyContacts: [
            ...state.formData.emergencyContacts,
            { id: newId, name: '', email: '', phone: '', details: '' },
          ],
        },
      };
    }),
  removeEmergencyContact: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        emergencyContacts: state.formData.emergencyContacts.filter((c) => c.id !== id),
      },
    })),

  // Pets
  updatePet: (id, field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        pets: state.formData.pets.map((pet) =>
          pet.id === id ? { ...pet, [field]: value } : pet
        ),
      },
    })),
  addPet: () =>
    set((state) => {
      const newId = Math.max(0, ...state.formData.pets.map((p) => p.id)) + 1;
      return {
        formData: {
          ...state.formData,
          pets: [...state.formData.pets, { id: newId, type: '', name: '', weight: '', breed: '' }],
        },
      };
    }),
  removePet: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        pets: state.formData.pets.filter((p) => p.id !== id),
      },
    })),

  // Vehicles
  updateVehicle: (id, field, value) =>
    set((state) => ({
      formData: {
        ...state.formData,
        vehicles: state.formData.vehicles.map((vehicle) =>
          vehicle.id === id ? { ...vehicle, [field]: value } : vehicle
        ),
      },
    })),
  addVehicle: () =>
    set((state) => {
      const newId = Math.max(0, ...state.formData.vehicles.map((v) => v.id)) + 1;
      return {
        formData: {
          ...state.formData,
          vehicles: [
            ...state.formData.vehicles,
            { id: newId, type: '', make: '', model: '', year: '', color: '', licensePlate: '', registeredIn: '' },
          ],
        },
      };
    }),
  removeVehicle: (id) =>
    set((state) => ({
      formData: {
        ...state.formData,
        vehicles: state.formData.vehicles.filter((v) => v.id !== id),
      },
    })),

  // File management
  setProfilePhoto: (photo, file = null) =>
    set({ profilePhoto: photo, profilePhotoFile: file }),
  setDocuments: (documents) => set({ documents }),
  addDocument: (file) =>
    set((state) => ({ documents: [...state.documents, file] })),
  removeDocument: (index) =>
    set((state) => ({
      documents: state.documents.filter((_, i) => i !== index),
    })),

  // Section management
  toggleSection: (section, value) =>
    set((state) => ({
      sections: { ...state.sections, [section]: value },
    })),

  // Error management
  setErrors: (errors) => set({ errors }),
  setSubmitError: (error) => set({ submitError: error }),

  // Reset form
  resetForm: () =>
    set({
      formData: initialFormData,
      profilePhoto: null,
      profilePhotoFile: null,
      documents: [],
      sections: {
        forwardingAddress: false,
        emergencyContacts: false,
        pets: false,
        vehicles: false,
      },
      errors: {},
      submitError: null,
    }),
}));

