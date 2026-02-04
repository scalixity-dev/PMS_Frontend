import { create } from 'zustand';

export interface MaintenanceAdvancedState {
  category: string;
  subCategory: string;
  issue: string;
  subIssue: string;
  title: string;
  details: string;
  amount: string;
  files: File[];
}

export interface MaintenanceDateOption {
  id: string;
  date: Date | undefined;
  timeSlots: string[];
}

export interface MaintenanceTenantListItem {
  id: number;
  name: string;
  status: string;
  share: boolean;
  selected: boolean;
}

export interface MaintenancePropertyState {
  propertyId: string;
  linkEquipment: boolean;
  selectedEquipment: string;
  tenantAuthorization: boolean;
  dateOptions: MaintenanceDateOption[];
  tenantList: MaintenanceTenantListItem[];
  accessCode: string;
  petsInResidence: string;
  selectedPets: string[];
}

export interface MaintenanceMaterial {
  id: string;
  name: string;
  quantity: number;
}

export interface MaintenanceDueState {
  dateInitiated?: Date;
  dateDue?: Date;
  priority: string;
  materials: MaintenanceMaterial[];
}

interface MaintenanceRequestFormState {
  advanced: MaintenanceAdvancedState;
  property: MaintenancePropertyState;
  due: MaintenanceDueState;

  setAdvanced: (data: Partial<MaintenanceAdvancedState>) => void;
  setProperty: (data: Partial<MaintenancePropertyState>) => void;
  setDue: (data: Partial<MaintenanceDueState>) => void;
  reset: () => void;
}

const initialAdvanced: MaintenanceAdvancedState = {
  category: '',
  subCategory: '',
  issue: '',
  subIssue: '',
  title: '',
  details: '',
  amount: '',
  files: [],
};

const initialProperty: MaintenancePropertyState = {
  propertyId: '',
  linkEquipment: false,
  selectedEquipment: '',
  tenantAuthorization: false,
  dateOptions: [],
  tenantList: [],
  accessCode: '',
  petsInResidence: '',
  selectedPets: [],
};

const initialDue: MaintenanceDueState = {
  dateInitiated: undefined,
  dateDue: undefined,
  priority: '',
  materials: [],
};

export const useMaintenanceRequestFormStore = create<MaintenanceRequestFormState>((set) => ({
  advanced: initialAdvanced,
  property: initialProperty,
  due: initialDue,

  setAdvanced: (data) =>
    set((state) => ({
      advanced: { ...state.advanced, ...data },
    })),

  setProperty: (data) =>
    set((state) => ({
      property: { ...state.property, ...data },
    })),

  setDue: (data) =>
    set((state) => ({
      due: { ...state.due, ...data },
    })),

  reset: () =>
    set({
      advanced: initialAdvanced,
      property: initialProperty,
      due: initialDue,
    }),
}));

