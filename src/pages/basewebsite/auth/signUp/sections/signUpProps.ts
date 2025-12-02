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
  formData?: RegisterFormData; // Optional - now using Zustand store
  setFormData?: (data: RegisterFormData) => void; // Optional - now using Zustand store
  onSubmit?: () => void; // Optional since component handles submission internally
  isOAuthSignup?: boolean; // Flag to indicate OAuth signup (hide email, password fields)
  userId?: string; // User ID for OAuth signups (to pass to pricing page)
}

export interface AccountType {
  id: string;
  title: string;
  subtitle: string;
  type: string;
}

export interface AccountTypeSelectionProps {
  onNext?: () => void; // Optional - can use Zustand store's nextStep
  formData?: FormData; // Optional - now using Zustand store
  setFormData?: (data: FormData) => void; // Optional - now using Zustand store
}

export interface EmailSignupProps {
  onNext?: () => void; // Optional - can use Zustand store's nextStep
  formData?: FormData; // Optional - now using Zustand store
  setFormData?: (data: FormData) => void; // Optional - now using Zustand store
}