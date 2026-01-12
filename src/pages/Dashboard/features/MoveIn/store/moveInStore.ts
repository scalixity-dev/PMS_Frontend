import { create } from 'zustand';

export interface RecurringRentData {
  enabled: boolean;
  amount: string;
  invoiceSchedule: string;
  startOn: Date | undefined;
  endOn: Date | undefined;
  isMonthToMonth: boolean;
  markPastPaid: boolean;
}

export interface DepositData {
  hasDeposit: boolean;
  category: string;
  amount: string;
  invoiceDate: Date | undefined;
}

export interface OneTimeLateFeeData {
  type: string; // 'fixed' | 'outstanding' | 'recurring'
  amount: string;
  gracePeriodDays: string;
  time: string;
}

export interface DailyLateFeeData {
  type: string; // 'fixed' | 'outstanding' | 'recurring'
  amount: string;
  maxMonthlyBalance: string;
  gracePeriod: string; // 'none' or number of days
  time: string;
}

export interface LateFeesData {
  enabled: boolean;
  scheduleType: 'one-time' | 'daily' | 'both' | null;
  oneTimeFee: OneTimeLateFeeData | null;
  dailyFee: DailyLateFeeData | null;
}

export interface MoveInFormData {
  // Basic info
  selectedScenario: { type: 'easy' | 'advanced' } | null;
  propertyId: string | null;
  unitId: string | null;
  tenantId: string | null;
  sharedTenantIds: string[];
  
  // Recurring rent
  recurringRent: RecurringRentData;
  
  // Deposit
  deposit: DepositData;
  
  // Late fees
  lateFees: LateFeesData;
}

interface MoveInState {
  formData: MoveInFormData;
  currentStep: number;
  
  // Actions
  setFormData: (data: Partial<MoveInFormData> | ((prev: MoveInFormData) => MoveInFormData)) => void;
  updateFormData: <K extends keyof MoveInFormData>(key: K, value: MoveInFormData[K]) => void;
  setCurrentStep: (step: number) => void;
  setSelectedScenario: (scenario: { type: 'easy' | 'advanced' } | null) => void;
  setPropertyId: (propertyId: string | null) => void;
  setUnitId: (unitId: string | null) => void;
  setTenantId: (tenantId: string | null) => void;
  setSharedTenantIds: (tenantIds: string[]) => void;
  setRecurringRent: (data: Partial<RecurringRentData>) => void;
  setDeposit: (data: Partial<DepositData>) => void;
  setLateFees: (data: Partial<LateFeesData>) => void;
  resetForm: () => void;
}

const initialFormData: MoveInFormData = {
  selectedScenario: null,
  propertyId: null,
  unitId: null,
  tenantId: null,
  sharedTenantIds: [],
  recurringRent: {
    enabled: false,
    amount: '',
    invoiceSchedule: 'Monthly',
    startOn: undefined,
    endOn: undefined,
    isMonthToMonth: false,
    markPastPaid: false,
  },
  deposit: {
    hasDeposit: false,
    category: 'Deposit',
    amount: '',
    invoiceDate: undefined,
  },
  lateFees: {
    enabled: false,
    scheduleType: null,
    oneTimeFee: null,
    dailyFee: null,
  },
};

export const useMoveInStore = create<MoveInState>((set) => ({
  formData: initialFormData,
  currentStep: 0,

  setFormData: (data) =>
    set((state) => ({
      formData: typeof data === 'function' ? data(state.formData) : { ...state.formData, ...data },
    })),

  updateFormData: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  setSelectedScenario: (scenario) =>
    set((state) => ({
      formData: { ...state.formData, selectedScenario: scenario },
    })),

  setPropertyId: (propertyId) =>
    set((state) => ({
      formData: { ...state.formData, propertyId },
    })),

  setUnitId: (unitId) =>
    set((state) => ({
      formData: { ...state.formData, unitId },
    })),

  setTenantId: (tenantId) =>
    set((state) => ({
      formData: { ...state.formData, tenantId },
    })),

  setSharedTenantIds: (tenantIds) =>
    set((state) => ({
      formData: { ...state.formData, sharedTenantIds: tenantIds },
    })),

  setRecurringRent: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        recurringRent: { ...state.formData.recurringRent, ...data },
      },
    })),

  setDeposit: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        deposit: { ...state.formData.deposit, ...data },
      },
    })),

  setLateFees: (data) =>
    set((state) => ({
      formData: {
        ...state.formData,
        lateFees: { ...state.formData.lateFees, ...data },
      },
    })),

  resetForm: () =>
    set({
      formData: initialFormData,
      currentStep: 0,
    }),
}));
