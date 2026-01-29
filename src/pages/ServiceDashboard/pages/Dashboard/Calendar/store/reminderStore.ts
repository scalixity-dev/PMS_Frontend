import { create } from 'zustand';

export interface ReminderFormData {
  title: string;
  details: string;
  date: Date | undefined;
  time: string;
  assignee: string;
  property: string;
  isRecurring: boolean;
  frequency: string;
  endDate: Date | undefined;
  type: 'reminder' | 'viewing' | 'meeting' | 'other';
  color?: string;
}

export interface ReminderState {
  // Form data
  formData: ReminderFormData;

  // Actions
  setFormData: (data: ReminderFormData | ((prev: ReminderFormData) => ReminderFormData)) => void;
  updateFormData: <K extends keyof ReminderFormData>(key: K, value: ReminderFormData[K]) => void;
  resetForm: () => void;
}

const initialFormData: ReminderFormData = {
  title: '',
  details: '',
  date: undefined,
  time: '',
  assignee: '',
  property: '',
  isRecurring: false,
  frequency: '',
  endDate: undefined,
  type: 'reminder',
  color: undefined,
};

export const useReminderStore = create<ReminderState>((set) => ({
  formData: initialFormData,

  setFormData: (data) =>
    set((state) => ({
      formData: typeof data === 'function' ? data(state.formData) : data,
    })),

  updateFormData: (key, value) =>
    set((state) => ({
      formData: { ...state.formData, [key]: value },
    })),

  resetForm: () =>
    set({
      formData: initialFormData,
    }),
}));

