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
  loadExistingLease: (lease: any) => void; // Load existing lease data into form
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

  loadExistingLease: (lease: any) =>
    set(() => {
      // Map backend lease data to MoveIn form data
      const scheduleMap: Record<string, string> = {
        'DAILY': 'Daily',
        'WEEKLY': 'Weekly',
        'EVERY_TWO_WEEKS': 'Every two weeks',
        'EVERY_FOUR_WEEKS': 'Every four weeks',
        'MONTHLY': 'Monthly',
        'EVERY_TWO_MONTHS': 'Every two months',
        'QUARTERLY': 'Quarterly',
        'YEARLY': 'Yearly',
      };

      const feeTypeMap: Record<string, string> = {
        'FIXED': 'fixed',
        'OUTSTANDING': 'outstanding',
        'RECURRING': 'recurring',
      };

      const scheduleTypeMap: Record<string, string> = {
        'ONE_TIME': 'one-time',
        'DAILY': 'daily',
        'BOTH': 'both',
      };

      const formData: MoveInFormData = {
        selectedScenario: { type: 'easy' }, // Default to easy for existing leases
        propertyId: lease.propertyId || null,
        unitId: lease.unitId || null,
        tenantId: lease.tenantId || null,
        sharedTenantIds: lease.sharedTenants?.map((st: any) => st.tenantId) || [],
        recurringRent: lease.recurringRent
          ? {
              enabled: lease.recurringRent.enabled,
              amount: lease.recurringRent.amount || '',
              invoiceSchedule: scheduleMap[lease.recurringRent.invoiceSchedule] || 'Monthly',
              startOn: lease.recurringRent.startOn ? new Date(lease.recurringRent.startOn) : undefined,
              endOn: lease.recurringRent.endOn ? new Date(lease.recurringRent.endOn) : undefined,
              isMonthToMonth: lease.recurringRent.isMonthToMonth || false,
              markPastPaid: lease.recurringRent.markPastPaid || false,
            }
          : initialFormData.recurringRent,
        deposit: lease.deposits && lease.deposits.length > 0
          ? {
              hasDeposit: true,
              category: lease.deposits[0].category || 'Deposit',
              amount: lease.deposits[0].amount || '',
              invoiceDate: lease.deposits[0].invoiceDate ? new Date(lease.deposits[0].invoiceDate) : undefined,
            }
          : initialFormData.deposit,
        lateFees: lease.lateFees && lease.lateFees.enabled
          ? {
              enabled: true,
              scheduleType: (() => {
                if (!lease.lateFees.scheduleType) return null;
                const mapped = scheduleTypeMap[lease.lateFees.scheduleType];
                return (mapped === 'one-time' || mapped === 'daily' || mapped === 'both') ? mapped : null;
              })(),
              oneTimeFee: lease.lateFees.oneTimeFeeType
                ? {
                    type: feeTypeMap[lease.lateFees.oneTimeFeeType] || 'fixed',
                    amount: lease.lateFees.oneTimeFeeAmount || '',
                    gracePeriodDays: lease.lateFees.oneTimeGracePeriodDays?.toString() || '',
                    time: lease.lateFees.oneTimeFeeTime || '',
                  }
                : null,
              dailyFee: lease.lateFees.dailyFeeType
                ? {
                    type: feeTypeMap[lease.lateFees.dailyFeeType] || 'fixed',
                    amount: lease.lateFees.dailyFeeAmount || '',
                    maxMonthlyBalance: lease.lateFees.dailyMaxMonthlyBalance || '',
                    gracePeriod: lease.lateFees.dailyGracePeriod || 'none',
                    time: lease.lateFees.dailyFeeTime || '',
                  }
                : null,
            }
          : initialFormData.lateFees,
      };

      // Determine which step to start from based on what's missing
      let startStep = 0;
      if (!formData.propertyId || !formData.tenantId) {
        startStep = !formData.propertyId ? 1 : 2;
      } else if (!formData.recurringRent?.enabled) {
        startStep = 4; // Recurring Rent
      } else if (!formData.recurringRent?.startOn) {
        startStep = 5; // Recurring Rent Settings
      } else if (!formData.deposit?.hasDeposit) {
        startStep = 6; // Deposit
      } else if (!formData.deposit?.invoiceDate) {
        startStep = 7; // Deposit Settings
      } else if (!formData.lateFees?.enabled) {
        startStep = 8; // Late Fees
      } else if (!formData.lateFees?.scheduleType) {
        startStep = 9; // Late Fees Type
      } else {
        startStep = 10; // Late Fees Details
      }

      return {
        formData,
        currentStep: startStep,
      };
    }),
}));
