import { useState, useEffect, useMemo } from 'react';
import { Country, State } from 'country-state-city';
import type { ICountry, IState } from 'country-state-city';
import type { RegistrationFormProps } from './signUpProps';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../../../../services/auth.service';

// Helper function to apply consistent styling to inputs/selects
const inputClasses = (hasValue: boolean = true) =>
  `w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm transition-all ${
    hasValue ? 'text-gray-900' : 'text-gray-400'
  } placeholder-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`;

const labelClasses = "block text-xs font-medium text-gray-700 mb-1";

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ formData, setFormData }) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
    } else {
      setStates([]);
    }
    setFormData({ ...formData, state: '', pincode: '' });
  }, [formData.country]);

  const phoneCountryCodes = useMemo(() => {
    return Country.getAllCountries().map(country => ({
      label: `${country.flag} ${country.phonecode.startsWith('+') ? '' : '+'}${country.phonecode}`,
      value: `${country.isoCode}|${country.phonecode}`
    })).sort((a, b) => a.label.localeCompare(b.label)); // Sort them alphabetically
  }, []);

  const handleRegistration = async () => {
    // Validate required fields
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

    setIsLoading(true);
    setError(null);

    try {
      // Extract phone country code and number
      const [phoneCountryCode, phoneNumber] = formData.phoneCountryCode 
        ? formData.phoneCountryCode.split('|')
        : [undefined, formData.phone];

      const response = await authService.register({
        email: formData.email!,
        password: formData.password!,
        fullName: formData.fullName!,
        phoneCountryCode: phoneCountryCode,
        phoneNumber: phoneNumber,
        country: formData.country,
        state: formData.state,
        pincode: formData.pincode,
        address: formData.address,
      });

      // Registration successful - redirect to email verification or success page
      // The JWT token is set as HTTP-only cookie by the backend
      navigate(`/auth/verify-email?userId=${response.id}&email=${encodeURIComponent(response.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-xl p-6 sm:p-8 md:p-10 bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl">
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Start your free 14-day trial</h1>
          <p className="text-sm sm:text-base text-gray-600">Enter your details to continue.</p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          <div>
            <label className={labelClasses}>Full Name</label>
            <input
              type="text"
              value={formData.fullName || ''}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Type full name"
              className={inputClasses()}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Phone Number</label>
              <div className="flex border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                <select 
                  className="pl-2 border-r w-20 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-white transition-all"
                  value={formData.phoneCountryCode || ''}
                  onChange={(e) => {
                    const [countryIso] = e.target.value.split('|');
                    setFormData({ ...formData, phoneCountryCode: e.target.value, country: countryIso })
                  }}
                >
                  <option value="" disabled>Code</option>
                  {phoneCountryCodes.map((code) => (
                  <option className='bg-teal-50 text-black' key={code.value} value={code.value}>{code.label}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Type your phone"
                  className="flex-1 px-4 py-3 rounded-md focus:outline-none text-sm placeholder-gray-400 border-0"
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Type email address"
                className={inputClasses()}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Country</label>
            <select
              value={formData.country || ''}
              onChange={(e) => setFormData({ ...formData, country: e.target.value, state: '', pincode: '' })}
              className={inputClasses(!!formData.country)}
            >
              <option value="" disabled>Select Country</option>
              {countries.map((country) => (
                <option className='bg-teal-50 text-black' key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>State</label>
              <select
                value={formData.state || ''}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className={inputClasses(!!formData.state)}
                disabled={!formData.country || states.length === 0} // Disable if no country selected or no states exist
              >
                <option value="" disabled>Select State</option>
                {states.map((state) => (
                  <option className='bg-teal-50 text-black' key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClasses}>Pincode</label>
              <input
                value={formData.pincode || ''}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className={inputClasses(!!formData.pincode)}
                disabled={!formData.state}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Address</label>
            <input
              type="text"
              value={formData.address || ''}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Ex: ABC Building, 1890 NY"
              className={inputClasses()}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Create Password</label>
              <input
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className={inputClasses()}
              />
            </div>

            <div>
              <label className={labelClasses}>Confirm Password</label>
              <input
                type="password"
                value={formData.confirmPassword || ''}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm Password"
                className={inputClasses()}
              />
            </div>
          </div>

          <p className="text-xs text-gray-600">
            Password must be at least 8 characters and contain 1 number, both upper & lowercase letters
          </p>

          <div className="flex items-start">
            <input
              type="checkbox"
              id="terms"
              checked={formData.agreedToTerms || false}
              onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
              className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500 transition-all"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
              I agree to the terms and conditions
            </label>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={handleRegistration}
              disabled={!formData.agreedToTerms || isLoading}
              className="py-3 px-12 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all font-semibold transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? 'Creating account...' : 'Start my free trial'}
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