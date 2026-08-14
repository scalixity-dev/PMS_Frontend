import { useState, useMemo } from 'react';
import type { RegistrationFormProps } from './signUpProps';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useSignUpStore } from '../store/signUpStore';
import { authService } from '../../../../../services/auth.service';
import { toFriendlyErrorMessage } from '../../../../../utils/errorMessage.utils';

// Helper function to apply consistent styling to inputs/selects
const inputClasses = () =>
  `w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all text-gray-900 placeholder-gray-400 bg-white`;

const labelClasses = "block text-xs font-medium text-gray-700 mb-1";

export const TenantRegistrationForm: React.FC<RegistrationFormProps> = () => {
  // Get state from Zustand store
  const { formData, updateFormData } = useSignUpStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    strength?: string;
    match?: string;
  }>({});
  // Reserved for errors that aren't about any one field (the create-account
  // API call itself failing) — rendered inline near the submit button.
  const [error, setError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Password must contain at least one symbol';
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
      formData.firstName &&
      formData.lastName &&
      formData.agreedToTerms &&
      formData.password === formData.confirmPassword &&
      !passwordErrors.strength
    );
  }, [formData.email, formData.password, formData.firstName, formData.lastName, formData.agreedToTerms, formData.confirmPassword, passwordErrors.strength]);

  // Handle registration
  const handleRegistration = async () => {
    // Prevent double submission
    if (isLoading) return;

    // Validate all fields. The submit button is already disabled until these
    // pass (see isFormValid), so this mostly guards against stale state, but
    // each failure still lands on its own field instead of a shared banner.
    const missingFirstName = !formData.firstName;
    const missingLastName = !formData.lastName;
    const missingEmail = !formData.email;
    setFirstNameError(missingFirstName ? 'First name is required' : null);
    setLastNameError(missingLastName ? 'Last name is required' : null);
    setEmailError(missingEmail ? 'Email is required' : null);
    if (missingFirstName || missingLastName || missingEmail || !formData.password) {
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setPasswordErrors(prev => ({ ...prev, match: 'Passwords do not match' }));
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
    if (formData.password.length < 8 || !passwordRegex.test(formData.password)) {
      setPasswordErrors(prev => ({ ...prev, strength: 'Password must be at least 8 characters and contain uppercase, lowercase, a number, and a symbol' }));
      return;
    }

    // Validate terms agreement
    if (!formData.agreedToTerms) {
      setTermsError('Please agree to the terms and conditions');
      return;
    }
    setTermsError(null);

    setError(null);
    setIsLoading(true);

    try {
      // Use tenant-specific registration endpoint
      const response = await authService.registerTenant({
        email: formData.email!,
        password: formData.password!,
        fullName: `${formData.firstName || ''} ${formData.lastName || ''}`.trim(),
      });

      // Registration already sent an OTP email - go straight to verification
      // instead of forcing the user to log in again with the password they just set.
      navigate(`/otp?userId=${response.id}&email=${encodeURIComponent(response.email)}&type=email&role=${response.role}`, {
        replace: true,
      });
    } catch (err) {
      setError(toFriendlyErrorMessage(err, 'We could not create your account. Please try again.'));
      setIsLoading(false);
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
          {/* First Name & Last Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>First Name *</label>
              <input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => {
                  updateFormData('firstName', e.target.value);
                  updateFormData('fullName', `${e.target.value} ${formData.lastName || ''}`.trim());
                  if (firstNameError) setFirstNameError(null);
                }}
                placeholder="Enter your first name"
                className={`${inputClasses()} ${firstNameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {firstNameError && <p className="text-xs text-red-600 mt-1">{firstNameError}</p>}
            </div>
            <div>
              <label className={labelClasses}>Last Name *</label>
              <input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => {
                  updateFormData('lastName', e.target.value);
                  updateFormData('fullName', `${formData.firstName || ''} ${e.target.value}`.trim());
                  if (lastNameError) setLastNameError(null);
                }}
                placeholder="Enter your last name"
                className={`${inputClasses()} ${lastNameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                required
              />
              {lastNameError && <p className="text-xs text-red-600 mt-1">{lastNameError}</p>}
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className={labelClasses}>Email Address</label>
            <input
              type="email"
              value={formData.email || ''}
              onChange={(e) => {
                updateFormData('email', e.target.value);
                if (emailError) setEmailError(null);
              }}
              placeholder="Enter your email address"
              className={`${inputClasses()} ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
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
            Password must be at least 8 characters and contain 1 number, 1 symbol, both upper & lowercase letters
          </p>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreedToTerms || false}
                onChange={(e) => {
                  updateFormData('agreedToTerms', e.target.checked);
                  if (termsError) setTermsError(null);
                }}
                className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition-all"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
                I agree to the terms and conditions
              </label>
            </div>
            {termsError && <p className="text-xs text-red-600 mt-1">{termsError}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-2 pt-2">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleRegistration}
              disabled={!isFormValid || isLoading}
              className="py-3 px-12 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
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
