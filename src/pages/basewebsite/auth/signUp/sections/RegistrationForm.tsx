import { useState, useEffect, useMemo, useRef } from 'react';
import { Country, State } from 'country-state-city';
import type { ICountry, IState } from 'country-state-city';
import type { RegistrationFormProps } from './signUpProps';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Search, ChevronDown } from 'lucide-react';
import { useSignUpStore } from '../store/signUpStore';
import { useRegister, useUpdateProfile, useGetCurrentUser } from '../../../../../hooks/useAuthQueries';
import { authService } from '../../../../../services/auth.service';
import { formatPhoneNumber, extractDialCode, toPhoneDigits, isValidPhoneNumber } from '@/utils/phone.utils';
import { isValidPincode } from '@/utils/pincode.utils';
import { API_ENDPOINTS } from '../../../../../config/api.config';
import { toFriendlyErrorMessage } from '../../../../../utils/errorMessage.utils';

// Helper function to apply consistent styling to inputs/selects
const inputClasses = (hasValue: boolean = true) =>
  `w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all ${hasValue ? 'text-gray-900' : 'text-gray-400'
  } placeholder-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`;

const labelClasses = "block text-xs font-medium text-gray-700 mb-1";

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ isOAuthSignup: propIsOAuthSignup, userId: propUserId }) => {
  // Get state from Zustand store
  const {
    formData,
    updateFormData,
    isOAuthSignup: storeIsOAuthSignup,
    userId: storeUserId,
    setIsOAuthSignup,
    setUserId
  } = useSignUpStore();

  // Use props if provided, otherwise use store values
  const isOAuthSignup = propIsOAuthSignup ?? storeIsOAuthSignup;
  const userId = propUserId ?? storeUserId;

  // Update store if props are provided
  useEffect(() => {
    if (propIsOAuthSignup !== undefined) {
      setIsOAuthSignup(propIsOAuthSignup);
    }
    if (propUserId !== undefined) {
      setUserId(propUserId);
    }
  }, [propIsOAuthSignup, propUserId, setIsOAuthSignup, setUserId]);

  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState<{
    strength?: string;
    match?: string;
  }>({});
  const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
  const [phoneCodeSearch, setPhoneCodeSearch] = useState('');
  // Reserved for errors that aren't about any one field (e.g. the account
  // update/creation call itself failing) — rendered inline near the submit
  // button rather than a generic banner.
  const [error, setError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [countryError, setCountryError] = useState<string | null>(null);
  const [stateError, setStateError] = useState<string | null>(null);
  const [pincodeError, setPincodeError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);
  const phoneCodeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // React Query hooks
  const registerMutation = useRegister();
  const updateProfileMutation = useUpdateProfile();
  const { data: currentUser, refetch: refetchCurrentUser } = useGetCurrentUser(false); // Disabled by default

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
    } else {
      setStates([]);
    }
    if (formData.country) {
      updateFormData('state', '');
      updateFormData('pincode', '');
    }
  }, [formData.country, updateFormData]);

  const phoneCountryCodes = useMemo(() => {
    return Country.getAllCountries().map(country => ({
      label: `${country.flag} ${country.phonecode.startsWith('+') ? '' : '+'}${country.phonecode}`,
      value: `${country.isoCode}|${country.phonecode}`,
      name: country.name,
      phonecode: country.phonecode.startsWith('+') ? country.phonecode : `+${country.phonecode}`,
      flag: country.flag,
      isoCode: country.isoCode,
    })).sort((a, b) => a.name.localeCompare(b.name)); // Sort by country name
  }, []);

  // Filter phone codes based on search
  const filteredPhoneCodes = useMemo(() => {
    if (!phoneCodeSearch) return phoneCountryCodes;
    const searchLower = phoneCodeSearch.toLowerCase();
    return phoneCountryCodes.filter(code =>
      code.name.toLowerCase().includes(searchLower) ||
      code.phonecode.includes(searchLower) ||
      code.isoCode.toLowerCase().includes(searchLower)
    );
  }, [phoneCodeSearch, phoneCountryCodes]);

  // Get selected phone code display
  const selectedPhoneCode = useMemo(() => {
    if (!formData.phoneCountryCode) return null;
    return phoneCountryCodes.find(code => code.value === formData.phoneCountryCode);
  }, [formData.phoneCountryCode, phoneCountryCodes]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (phoneCodeRef.current && !phoneCodeRef.current.contains(event.target as Node)) {
        setIsPhoneCodeOpen(false);
        setPhoneCodeSearch('');
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // Note: Form validation is handled in handleRegistration function
  // For OAuth signup, only terms agreement is required
  // For regular signup, all fields including password are validated in handleRegistration

  // Compute form validity based on OAuth vs regular signup
  const isFormValid = useMemo(() => {
    if (isOAuthSignup) {
      // OAuth signup: only terms agreement is required
      return formData.agreedToTerms || false;
    } else {
      // Regular signup: validate all required fields
      return !!(
        formData.email &&
        formData.password &&
        formData.firstName &&
        formData.lastName &&
        formData.agreedToTerms &&
        formData.password === formData.confirmPassword &&
        !passwordErrors.strength
      );
    }
  }, [isOAuthSignup, formData.email, formData.password, formData.firstName, formData.lastName, formData.agreedToTerms, formData.confirmPassword, passwordErrors.strength]);

  // Some countries have no states in the dataset, so a missing state is only a
  // problem when there was something to pick.
  const countryHasStates = states.length > 0;

  // Phone is optional, but a half-typed number should not reach the API.
  // Shared by the on-blur inline error and the submit-time check below so the
  // two never drift out of sync.
  const getPhoneError = (rawPhone: string | null | undefined): string | null => {
    const digits = toPhoneDigits(rawPhone);
    if (!digits) return null;
    if (!formData.phoneCountryCode) {
      return 'Please select a country code for your phone number';
    }
    if (!isValidPhoneNumber(formData.phoneCountryCode, rawPhone)) {
      return 'Please enter a valid phone number for the selected country';
    }
    return null;
  };

  // One place that decides what is wrong with the address and phone block, so
  // each message lands under the field the user has to fix instead of a
  // single banner. These mirror the backend rules, which previously only
  // surfaced after a failed round trip.
  const validateProfileFields = (): boolean => {
    let isValid = true;

    if (!formData.country) {
      setCountryError('Please select your country');
      isValid = false;
    } else {
      setCountryError(null);
    }

    if (countryHasStates && !formData.state) {
      setStateError('Please select your state');
      isValid = false;
    } else {
      setStateError(null);
    }

    const pincode = (formData.pincode ?? '').trim();
    if (!pincode) {
      setPincodeError('Please enter your pincode');
      isValid = false;
    } else if (!isValidPincode(pincode)) {
      setPincodeError('Please enter a valid pincode');
      isValid = false;
    } else {
      setPincodeError(null);
    }

    const phoneErr = getPhoneError(formData.phone);
    setPhoneError(phoneErr);
    if (phoneErr) isValid = false;

    // Property managers don't collect an address at signup.
    if (formData.accountType !== 'manage' && (formData.address ?? '').length > 500) {
      setAddressError('Address is too long (maximum 500 characters)');
      isValid = false;
    } else {
      setAddressError(null);
    }

    return isValid;
  };

  // Handle registration
  const handleRegistration = async () => {
    if (isOAuthSignup) {
      // OAuth signup - update profile only
      // Validate terms agreement
      if (!formData.agreedToTerms) {
        setTermsError('Please agree to the terms and conditions');
        return;
      }
      setTermsError(null);

      if (!validateProfileFields()) return;

      setError(null);

      try {
        // The selector holds "IN|91", so the ISO half is not a dialling code
        // and the number lives in formData.phone, not in this value.
        const phoneCountryCode = extractDialCode(formData.phoneCountryCode);
        const phoneNumber = toPhoneDigits(formData.phone);

        await updateProfileMutation.mutateAsync({
          phoneCountryCode: phoneCountryCode,
          phoneNumber: phoneNumber,
          country: formData.country,
          state: formData.state,
          pincode: formData.pincode,
          // Property managers don't collect an address at signup.
          ...(formData.accountType !== 'manage' ? { address: formData.address } : {}),
        });

        // Profile update successful - get current user and redirect
        const userData = await refetchCurrentUser();
        const user = userData.data || currentUser;

        // Redirect based on account type
        if (formData.accountType === 'manage') {
          // Property managers go to pricing page to select a plan
          if (userId) {
            // Use provided userId
            navigate(`/onboarding/plan?userId=${userId}&email=${encodeURIComponent(user?.email || '')}&newAccount=true&oauth=true`, { replace: true });
          } else if (user) {
            // Fallback: get userId from current user
            navigate(`/onboarding/plan?userId=${user.userId}&email=${encodeURIComponent(user.email)}&newAccount=true&oauth=true`, { replace: true });
          }
        } else if (formData.accountType === 'renting') {
          // The browser is already authenticated at this point - the OAuth
          // callback sets the session cookie before this form even renders -
          // so navigating to /login would just have GuestRoute bounce
          // straight to /userdashboard without ever collecting rental
          // preferences (the login form, where that check normally happens,
          // never gets a chance to mount). Check directly instead, the same
          // way the email/password path does in otp/index.tsx and loginForm.tsx.
          try {
            const preferencesResponse = await fetch(API_ENDPOINTS.TENANT.GET_PREFERENCES, {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            });

            if (preferencesResponse.ok) {
              const preferences = await preferencesResponse.json();
              const hasPreferences = preferences && (
                (preferences.location && preferences.location.country && preferences.location.state && preferences.location.city) ||
                (preferences.rentalTypes && preferences.rentalTypes.length > 0)
              );
              navigate(hasPreferences ? '/userdashboard' : '/signup/tenant-onboarding-flow', { replace: true });
            } else {
              navigate('/signup/tenant-onboarding-flow', { replace: true });
            }
          } catch {
            navigate('/signup/tenant-onboarding-flow', { replace: true });
          }
        } else {
          // Service Pros have free accounts - redirect to dashboard or login
          navigate('/login', {
            state: {
              message: 'Account created successfully! Please log in to continue.',
              email: user?.email
            },
            replace: true
          });
        }
      } catch (err) {
        setError(toFriendlyErrorMessage(err, 'We could not update your profile. Please try again.'));
      }
      return;
    }

    // Regular email signup - validate all fields. The submit button is
    // already disabled until these pass (see isFormValid), so this mostly
    // guards against stale state, but each failure still lands on its field.
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

    if (!validateProfileFields()) return;

    setError(null);

    try {
      const accountType = formData.accountType;
      const combinedFullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();

      if (accountType === 'renting') {
        await authService.registerTenant({
          email: formData.email!,
          password: formData.password!,
          fullName: combinedFullName,
        });

        navigate('/login', {
          state: {
            message: 'Account created successfully! Please log in to continue.',
            email: formData.email,
          },
          replace: true,
        });
        return;
      }

      if (accountType === 'fix') {
        await authService.registerServicePro({
          email: formData.email!,
          password: formData.password!,
          fullName: combinedFullName,
        });

        navigate('/login', {
          state: {
            message: 'Account created successfully! Please log in to continue.',
            email: formData.email,
          },
          replace: true,
        });
        return;
      }

      // Default: property manager registration (manage)
      const phoneCountryCode = extractDialCode(formData.phoneCountryCode);
      const phoneNumber = toPhoneDigits(formData.phone);

      const response = await registerMutation.mutateAsync({
        email: formData.email!,
        password: formData.password!,
        fullName: combinedFullName,
        phoneCountryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        country: formData.country,
        state: formData.state,
        pincode: formData.pincode,
      });

      if (accountType === 'manage') {
        navigate(`/onboarding/plan?userId=${response.id}&email=${encodeURIComponent(formData.email!)}&newAccount=true`);
      } else {
        navigate('/login', {
          state: {
            message: 'Account created successfully! Please log in to continue.',
            email: formData.email,
          },
          replace: true,
        });
      }
    } catch (err) {
      setError(toFriendlyErrorMessage(err, 'We could not create your account. Please try again.'));
    }
  };

  // Get heading and subtitle based on account type
  const getHeadingAndSubtitle = () => {
    if (isOAuthSignup) {
      return {
        heading: 'Complete your profile',
        subtitle: 'Please provide a few more details to complete your registration.'
      };
    }
    
    switch (formData.accountType) {
      case 'manage':
        return {
          heading: 'Start your free 14-day trial',
          subtitle: 'Enter your details to continue.'
        };
      case 'renting':
        return {
          heading: 'Create your tenant account',
          subtitle: 'Enter your details to get started.'
        };
      case 'fix':
        return {
          heading: 'Create your service pro account',
          subtitle: 'Enter your details to get started.'
        };
      default:
        return {
          heading: 'Complete your registration',
          subtitle: 'Enter your details to continue.'
        };
    }
  };

  const { heading, subtitle } = getHeadingAndSubtitle();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-xl p-6 sm:p-8 md:p-10 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl">
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {heading}
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            {subtitle}
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {!isOAuthSignup && (
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
                  placeholder="Type first name"
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
                  placeholder="Type last name"
                  className={`${inputClasses()} ${lastNameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  required
                />
                {lastNameError && <p className="text-xs text-red-600 mt-1">{lastNameError}</p>}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Phone Number</label>
              <div className={`flex border rounded-md focus-within:ring-2 transition-all ${phoneError
                ? 'border-red-500 focus-within:ring-red-500 focus-within:border-red-500'
                : 'border-gray-300 focus-within:ring-teal-500 focus-within:border-teal-500'
                }`}>
                {/* Phone Code Selector */}
                <div className="relative" ref={phoneCodeRef}>
                  <button
                    type="button"
                    onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                    className="flex items-center gap-1 px-3 py-3 border-r border-gray-300 bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm min-w-[100px] hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {selectedPhoneCode ? (
                        <span className="flex items-center gap-1">
                          <span>{selectedPhoneCode.flag}</span>
                          <span className="hidden sm:inline">{selectedPhoneCode.phonecode}</span>
                        </span>
                      ) : (
                        <span className="text-gray-500">Code</span>
                      )}
                    </span>
                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isPhoneCodeOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {isPhoneCodeOpen && (
                    <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-80 overflow-hidden flex flex-col">
                      {/* Search Input */}
                      <div className=" border-b border-gray-200">
                        <div className="relative">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search country or code..."
                            value={phoneCodeSearch}
                            onChange={(e) => setPhoneCodeSearch(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                            autoFocus
                          />
                        </div>
                      </div>

                      {/* Options List */}
                      <div className="overflow-y-auto max-h-64">
                        {filteredPhoneCodes.length > 0 ? (
                          filteredPhoneCodes.map((code) => (
                            <button
                              key={code.value}
                              type="button"
                              onClick={() => {
                                // Only the dialling code. This used to also set
                                // the address country, and changing the code
                                // after filling the address silently wiped the
                                // state and pincode via the country effect.
                                updateFormData('phoneCountryCode', code.value);
                                setIsPhoneCodeOpen(false);
                                setPhoneCodeSearch('');
                              }}
                              className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-teal-50 transition-colors text-left ${formData.phoneCountryCode === code.value ? 'bg-teal-50' : ''
                                }`}
                            >
                              <span className="text-xl">{code.flag}</span>
                              <span className="flex-1 text-sm font-medium text-gray-900">{code.name}</span>
                              <span className="text-sm text-gray-600">{code.phonecode}</span>
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-8 text-center text-sm text-gray-500">
                            No countries found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Phone Number Input */}
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => {
                    updateFormData('phone', formatPhoneNumber(e.target.value));
                    if (phoneError) setPhoneError(null);
                  }}
                  onBlur={() => setPhoneError(getPhoneError(formData.phone))}
                  placeholder="Type your phone"
                  className="flex-1 px-4 py-3 rounded-r-md focus:outline-none text-sm placeholder-gray-400 border-0"
                />
              </div>
              {phoneError && (
                <span className="block text-xs text-red-500 mt-1 ml-1">{phoneError}</span>
              )}
            </div>

            {!isOAuthSignup && (
              <div>
                <label className={labelClasses}>Email Address</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => {
                    updateFormData('email', e.target.value);
                    if (emailError) setEmailError(null);
                  }}
                  placeholder="Type email address"
                  className={`${inputClasses()} ${emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                />
                {emailError && <p className="text-xs text-red-600 mt-1">{emailError}</p>}
              </div>
            )}
          </div>

          <div>
            <label className={labelClasses}>Country</label>
            <select
              value={formData.country || ''}
              onChange={(e) => {
                updateFormData('country', e.target.value);
                updateFormData('state', '');
                updateFormData('pincode', '');
                if (countryError) setCountryError(null);
              }}
              className={`${inputClasses(!!formData.country)} ${countryError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            >
              <option value="" disabled>Select Country</option>
              {countries.map((country) => (
                <option className='bg-teal-50 text-black' key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
            {countryError && <p className="text-xs text-red-600 mt-1">{countryError}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>State</label>
              <select
                value={formData.state || ''}
                onChange={(e) => {
                  updateFormData('state', e.target.value);
                  if (stateError) setStateError(null);
                }}
                className={`${inputClasses(!!formData.state)} ${stateError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                disabled={!formData.country || states.length === 0} // Disable if no country selected or no states exist
              >
                <option value="" disabled>
                  {!formData.country
                    ? 'Select a country first'
                    : countryHasStates
                      ? 'Select State'
                      : 'No states for this country'}
                </option>
                {states.map((state) => (
                  <option className='bg-teal-50 text-black' key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
              {stateError && <p className="text-xs text-red-600 mt-1">{stateError}</p>}
            </div>

            <div>
              <label className={labelClasses}>Pincode</label>
              <input
                value={formData.pincode || ''}
                onChange={(e) => {
                  updateFormData('pincode', e.target.value);
                  if (pincodeError) setPincodeError(null);
                }}
                className={`${inputClasses(!!formData.pincode)} ${pincodeError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                placeholder={formData.country && !countryHasStates ? 'Ex: 12345' : undefined}
                // Countries with no states in the dataset leave the state
                // select disabled forever, which used to lock pincode too and
                // made the form impossible to complete there.
                disabled={!formData.country || (countryHasStates && !formData.state)}
              />
              {pincodeError && <p className="text-xs text-red-600 mt-1">{pincodeError}</p>}
            </div>
          </div>

          {formData.accountType !== 'manage' && (
            <div>
              <label className={labelClasses}>Address</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => {
                  updateFormData('address', e.target.value);
                  if (addressError) setAddressError(null);
                }}
                placeholder="Ex: ABC Building, 1890 NY"
                className={`${inputClasses()} ${addressError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
              />
              {addressError && <p className="text-xs text-red-600 mt-1">{addressError}</p>}
            </div>
          )}

          {!isOAuthSignup && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </>
          )}

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
                I agree to the{' '}
                {/* Opens in a new tab on purpose: the signup store is not
                    persisted, so navigating away would clear the form. Links
                    inside a label do not toggle the checkbox - the HTML spec
                    exempts interactive descendants from label activation. */}
                <Link
                  to="/terms-of-service"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  to="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 hover:text-teal-700 hover:underline font-medium"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>
            {termsError && <p className="text-xs text-red-600 mt-1">{termsError}</p>}
          </div>

          <div className="flex flex-col items-center gap-2 pt-2">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              onClick={handleRegistration}
              disabled={!isFormValid || registerMutation.isPending || updateProfileMutation.isPending}
              className="py-3 px-12 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {(registerMutation.isPending || updateProfileMutation.isPending)
                ? (isOAuthSignup ? 'Updating profile...' : 'Creating account...')
                : (isOAuthSignup
                    ? 'Complete registration'
                    : formData.accountType === 'manage'
                      ? 'Start my free trial'
                      : 'Create account')
              }
            </button>
          </div>
          <div className="text-center text-xs text-gray-500 px-4 pt-3">
            By creating an account, you agree to our{' '}
            <Link
              to="/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline font-medium"
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-600 hover:underline font-medium"
            >
              Privacy Policy
            </Link>.
          </div>
          <div className="mb-8 text-center text-sm sm:text-base text-gray-600 pt-4">
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