export interface FormData {
  accountType?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  country?: string;
  city?: string;
  pincode?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  agreedToTerms?: boolean;
}

export interface RegisterFormData {
  accountType?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  phoneCountryCode?: string;
  country?: string;
  state?: string;
  pincode?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  agreedToTerms?: boolean;
}

export interface RegistrationFormProps {
  formData: RegisterFormData;
  setFormData: (data: RegisterFormData) => void;
  onSubmit?: () => void; // Optional since component handles submission internally
}

export interface AccountType {
  id: string;
  title: string;
  subtitle: string;
  type: string;
}

export interface AccountTypeSelectionProps {
  onNext: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
}

export interface EmailSignupProps {
  onNext: () => void;
  formData: FormData;
  setFormData: (data: FormData) => void;
}