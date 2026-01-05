import { create } from 'zustand';

export interface TaskFormData {
  title: string;
  description: string;
  date: Date | undefined;
  time: string;
  assignee: string;
  property: string;
  isRecurring: boolean;
  frequency: string;
  endDate: Date | undefined;
  isAllDay: boolean;
}

export interface TaskState {
  // Form data
  formData: TaskFormData;

  // Actions
  setFormData: (data: TaskFormData | ((prev: TaskFormData) => TaskFormData)) => void;
  updateFormData: <K extends keyof TaskFormData>(key: K, value: TaskFormData[K]) => void;
  resetForm: () => void;
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  date: undefined,
  time: '',
  assignee: '',
  property: '',
  isRecurring: false,
  frequency: '',
  endDate: undefined,
  isAllDay: false,
};

export const useTaskStore = create<TaskState>((set) => ({
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

