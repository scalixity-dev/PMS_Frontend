import { useState, useEffect, useMemo } from 'react';
import { Country, State } from 'country-state-city';
import type { ICountry, IState } from 'country-state-city';
import type { RegistrationFormProps } from './signUpProps';
import { Link } from 'react-router-dom';

// Helper function to apply consistent styling to inputs/selects
const inputClasses = (hasValue: boolean = true) =>
  `w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#20CC95] text-sm ${
    hasValue ? 'text-gray-900' : 'text-gray-400'
  } placeholder-gray-400 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed`;

const labelClasses = "block text-xs font-medium text-gray-500 mb-1";

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ formData, setFormData, onSubmit }) => {
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);

  useEffect(() => {
    // Load all countries on component mount
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    // When formData.country changes, update the states list
    if (formData.country) {
      setStates(State.getStatesOfCountry(formData.country));
    } else {
      setStates([]); // Clear states if no country is selected
    }
    // Clear state and pincode selection when country changes
    setFormData({ ...formData, state: '', pincode: '' });
  }, [formData.country]);

  // Memoize phone codes to avoid recalculating on every render
  const phoneCountryCodes = useMemo(() => {
    return Country.getAllCountries().map(country => ({
      label: `${country.flag} ${country.phonecode.startsWith('+') ? '' : '+'}${country.phonecode}`,
      value: `${country.isoCode}|${country.phonecode}`
    })).sort((a, b) => a.label.localeCompare(b.label)); // Sort them alphabetically
  }, []);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-2">Start your free 14-day trial</h1>
        <p className="text-center text-gray-600 mb-8">Enter your details to continue.</p>

        <div className="space-y-6">
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
              <div className="flex border border-gray-300 rounded-md focus:outline-none">
                <select 
                  className="pl-2 border-r w-20 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#20CC95] text-sm bg-white"
                  value={formData.phoneCountryCode || ''}
                  onChange={(e) => {
                    const [countryIso] = e.target.value.split('|');
                    setFormData({ ...formData, phoneCountryCode: e.target.value, country: countryIso })
                  }}
                >
                  <option value="" disabled>Code</option>
                  {phoneCountryCodes.map((code) => (
                  <option className='bg-[#20CC95]/30 text-black' key={code.value} value={code.value}>{code.label}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Type your phone"
                  className="flex-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-[#20CC95] text-sm placeholder-gray-400"
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
                <option className='bg-[#20CC95]/30 text-black' key={country.isoCode} value={country.isoCode}>
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
                  <option className='bg-[#20CC95]/30 text-black' key={state.isoCode} value={state.isoCode}>
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
                disabled={!formData.state} // Logically, pincode depends on state/city
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
              className="mt-1 w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-[#20CC95]"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-gray-600 cursor-pointer">
              I agree to the terms and conditions
            </label>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={onSubmit}
              disabled={!formData.agreedToTerms}
              className="py-3 px-12 bg-teal-700 text-white rounded-md hover:bg-teal-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
            >
              Start my free trial
            </button>
          </div>
          <div className="mb-8 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-(--color-primary) hover:text-green-600 hover:underline">
                Sign In
              </Link>
          </div>
        </div>
      </div>
    </div>
  );
};