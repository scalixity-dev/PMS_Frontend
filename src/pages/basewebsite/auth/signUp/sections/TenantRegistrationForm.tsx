import { useState, useMemo } from 'react';
import type { RegistrationFormProps } from './signUpProps';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useSignUpStore } from '../store/signUpStore';
import { useRegister } from '../../../../../hooks/useAuthQueries';

// Helper function to apply consistent styling to inputs/selects
const inputClasses = () =>
  `w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all text-gray-900 placeholder-gray-400 bg-white`;

const labelClasses = "block text-xs font-medium text-gray-700 mb-1";

export const TenantRegistrationForm: React.FC<RegistrationFormProps> = () => {
  // Get state from Zustand store
  const { formData, updateFormData, nextStep } = useSignUpStore();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    strength?: string;
    match?: string;
  }>({});
  const [error, setError] = useState<string | null>(null);

  // React Query hooks
  const registerMutation = useRegister();

  // Validate password strength
  const validatePasswordStrength = (password: string): string | undefined => {
    if (!password) return undefined;

    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }

    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }

    if (!/\d/.test(password)) {
      return 'Password must contain at least one number';
    }

    return undefined;
  };

  // Validate password match
  const validatePasswordMatch = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return undefined;

    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }

    return undefined;
  };

  // Handle password change
  const handlePasswordChange = (value: string) => {
    updateFormData('password', value);
    const strengthError = validatePasswordStrength(value);
    const matchError = formData.confirmPassword
      ? validatePasswordMatch(value, formData.confirmPassword)
      : undefined;

    setPasswordErrors({
      strength: strengthError,
      match: matchError,
    });
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (value: string) => {
    updateFormData('confirmPassword', value);
    const matchError = validatePasswordMatch(formData.password || '', value);

    setPasswordErrors(prev => ({
      ...prev,
      match: matchError,
    }));
  };

  // Compute form validity
  const isFormValid = useMemo(() => {
    return !!(
      formData.email &&
      formData.password &&
      formData.fullName &&
      formData.agreedToTerms &&
      formData.password === formData.confirmPassword &&
      !passwordErrors.strength
    );
  }, [formData.email, formData.password, formData.fullName, formData.agreedToTerms, formData.confirmPassword, passwordErrors.strength]);

  // Handle registration
  const handleRegistration = async () => {
    // Validate all fields
    if (!formData.email || !formData.password || !formData.fullName) {
      setError('Please fill in all required fields');
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (formData.password.length < 8 || !passwordRegex.test(formData.password)) {
      setError('Password must be at least 8 characters and contain uppercase, lowercase, and a number');
      return;
    }

    // Validate terms agreement
    if (!formData.agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setError(null);

    try {
      await registerMutation.mutateAsync({
        email: formData.email!,
        password: formData.password!,
        fullName: formData.fullName!,
      });

      // Registration successful - go to onboarding step
      nextStep();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-xl p-6 sm:p-8 md:p-10 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl">
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Create your tenant account
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Enter your details to get started with your free account.
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className={labelClasses}>Full Name</label>
            <input
              type="text"
              value={formData.fullName || ''}
              onChange={(e) => updateFormData('fullName', e.target.value)}
              placeholder="Enter your full name"
              className={inputClasses()}
            />
          </div>

          {/* Email Address */}
          <div>
            <label className={labelClasses}>Email Address</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="Enter your email address"
              className={inputClasses()}
            />
          </div>

          {/* Password Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Create Password */}
            <div>
              <label className={labelClasses}>Create Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  placeholder="Enter your password"
                  className={`${inputClasses()} ${passwordErrors.strength ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.strength && (
                <p className="text-xs text-red-600 mt-1">{passwordErrors.strength}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClasses}>Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword || ''}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  placeholder="Confirm Password"
                  className={`${inputClasses()} ${passwordErrors.match ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordErrors.match && (
                <p className="text-xs text-red-600 mt-1">{passwordErrors.match}</p>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-600">
            Password must be at least 8 characters and contain 1 number, both upper & lowercase letters
          </p>

          {/* Terms and Conditions */}
          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreedToTerms || false}
              onChange={(e) => updateFormData('agreedToTerms', e.target.checked)}
              className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition-all"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
              I agree to the terms and conditions
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              onClick={handleRegistration}
              disabled={!isFormValid || registerMutation.isPending}
              className="py-3 px-12 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="mb-8 text-center text-sm sm:text-base text-gray-600 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
