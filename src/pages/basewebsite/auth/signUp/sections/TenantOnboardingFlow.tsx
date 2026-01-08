import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';
import CustomDropdown from '../../../../Dashboard/components/CustomDropdown';
import { API_ENDPOINTS } from '../../../../../config/api.config';
import { authService } from '../../../../../services/auth.service';

const RENTAL_TYPES = [
  'Room',
  'Apartment',
  'Multiplex',
  'Single-Family',
  'Townhouse',
  'Condo',
  'Commercial',
  'Storage',
  'Parking Space',
  'Suite',
  'Mobile Home',
  'Villa',
  'University Apartment',
  'Residence Hall',
];

const BED_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' },
];

const BATH_OPTIONS = [
  { value: 'Any', label: 'Any' },
  { value: '1', label: '1' },
  { value: '1.5', label: '1.5' },
  { value: '2', label: '2' },
  { value: '2.5', label: '2.5' },
  { value: '3', label: '3' },
  { value: '3.5', label: '3.5' },
  { value: '4+', label: '4+' },
];

const STEPS = [
  { id: 1, name: 'Location' },
  { id: 2, name: 'Rental Type' },
  { id: 3, name: 'Complete' },
];

export const TenantOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Location data
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // Step 1: Location
  const [country, setCountry] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [city, setCity] = useState('');

  // Step 2: Rental Types
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Step 3: Criteria
  const [beds, setBeds] = useState<string>('Any');
  const [baths, setBaths] = useState<string>('Any');
  const [minPrice, setMinPrice] = useState<number | string>(0);
  const [maxPrice, setMaxPrice] = useState<number | string>(10000);
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);

  // Get authenticated user ID on mount
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user && user.userId) {
          setUserId(user.userId);
        } else {
          // Not authenticated, redirect to login
          navigate('/login', { replace: true });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        // Not authenticated, redirect to login
        navigate('/login', { replace: true });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserId();
  }, [navigate]);

  // Load all countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (country) {
      const countryStates = State.getStatesOfCountry(country);
      setStates(countryStates);
      // Reset state and city when country changes
      if (stateRegion) {
        setStateRegion('');
      }
      if (city) {
        setCity('');
      }
    } else {
      setStates([]);
    }
  }, [country]);

  // Load cities when state changes
  useEffect(() => {
    if (country && stateRegion) {
      const stateCities = City.getCitiesOfState(country, stateRegion);
      setCities(stateCities);
      // Reset city when state changes
      if (city) {
        setCity('');
      }
    } else {
      setCities([]);
    }
  }, [country, stateRegion]);

  // Convert countries to dropdown options
  const countryOptions = useMemo(() => {
    return countries.map(country => ({
      value: country.isoCode,
      label: country.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [countries]);

  // Convert states to dropdown options
  const stateOptions = useMemo(() => {
    return states.map(state => ({
      value: state.isoCode,
      label: state.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [states]);

  // Convert cities to dropdown options
  const cityOptions = useMemo(() => {
    return cities.map(city => ({
      value: city.name,
      label: city.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [cities]);

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(-1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStep1Continue = () => {
    if (country && stateRegion && city) {
      setCurrentStep(2);
    }
  };

  const handleStep2Continue = () => {
    if (selectedTypes.length > 0) {
      localStorage.setItem('tenant_rental_types', JSON.stringify(selectedTypes));
      setCurrentStep(3);
    }
  };

  const handleStep3Finish = async () => {
    if (!userId) {
      console.error('User ID not found');
      // Try to get user ID from authenticated user
      try {
        const user = await authService.getCurrentUser();
        if (user && user.userId) {
          setUserId(user.userId);
        } else {
          navigate('/login', { replace: true });
          return;
        }
      } catch (error) {
        console.error('Error getting user ID:', error);
        navigate('/login', { replace: true });
        return;
      }
    }

    // Validate required fields before proceeding
    if (!country || !stateRegion || !city) {
      console.error('Location fields are required');
      alert('Please complete all location fields');
      return;
    }

    if (!selectedTypes || selectedTypes.length === 0) {
      console.error('At least one rental type is required');
      alert('Please select at least one rental type');
      return;
    }

    setIsSaving(true);
    try {
      // Prepare preferences data matching the backend DTO structure exactly
      const preferences = {
        location: {
          country: country.trim(),
          state: stateRegion.trim(),
          city: city.trim(),
        },
        rentalTypes: selectedTypes.filter(type => type && type.trim().length > 0), // Ensure no empty strings
        criteria: {
          beds: beds === 'Any' || !beds ? null : beds,
          baths: baths === 'Any' || !baths ? null : baths,
          minPrice: Number(minPrice) > 0 ? Number(minPrice) : undefined,
          maxPrice: Number(maxPrice) > 0 ? Number(maxPrice) : undefined,
          petsAllowed: petsAllowed || false,
        },
      };

      // Validate preferences structure
      if (!preferences.location.country || !preferences.location.state || !preferences.location.city) {
        throw new Error('Invalid location data');
      }

      if (!preferences.rentalTypes || preferences.rentalTypes.length === 0) {
        throw new Error('At least one rental type is required');
      }

      console.log('Saving preferences:', preferences);

      // Save to localStorage as backup
      localStorage.setItem('tenant_preferred_location', JSON.stringify(preferences.location));
      localStorage.setItem('tenant_rental_types', JSON.stringify(preferences.rentalTypes));
      localStorage.setItem('tenant_rental_criteria', JSON.stringify(preferences.criteria));

      // Save to backend API
      try {
        const response = await fetch(API_ENDPOINTS.TENANT.SAVE_PREFERENCES, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies for JWT
          body: JSON.stringify(preferences),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Failed to save preferences' }));
          console.error('Failed to save preferences:', {
            status: response.status,
            statusText: response.statusText,
            error: errorData,
          });

          // Show user-friendly error message
          if (response.status === 401) {
            alert('Please log in again to save your preferences');
          } else if (response.status === 403) {
            alert('Only tenants can save preferences');
          } else {
            alert(`Failed to save preferences: ${errorData.message || 'Unknown error'}`);
          }

          // Still navigate even if save fails (preferences saved to localStorage)
          navigate('/userdashboard');
          return;
        }

        const result = await response.json();
        console.log('Preferences saved successfully:', result);

        // Verify the response
        if (result.success && result.preferences) {
          console.log('Preferences confirmed in database:', result.preferences);
        }
      } catch (error) {
        console.error('Error saving preferences to backend:', error);
        alert('Failed to save preferences to server. Your preferences have been saved locally.');
        // Still navigate even if save fails
      }

      navigate('/userdashboard');
    } catch (error) {
      console.error('Error preparing preferences:', error);
      alert(error instanceof Error ? error.message : 'An error occurred while saving preferences');
      setIsSaving(false);
      // Don't navigate if there's a validation error
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleMinPriceChange = (value: number | string) => {
    if (value === '') {
      setMinPrice('');
      return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setMinPrice(numValue);
      // If min exceeds max, push max up to match min
      if (maxPrice !== '' && numValue > Number(maxPrice)) {
        setMaxPrice(numValue);
      }
    }
  };

  const handleMaxPriceChange = (value: number | string) => {
    if (value === '') {
      setMaxPrice('');
      return;
    }
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      setMaxPrice(numValue);
      // If max is less than min, push min down to match max
      if (minPrice !== '' && numValue < Number(minPrice)) {
        setMinPrice(numValue);
      }
    }
  };

  const handleInputBlur = () => {
    // Ensure values are within bounds and valid on blur
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || 0;

    if (min > max) {
      setMinPrice(max);
      setMaxPrice(min);
    } else {
      setMinPrice(min);
      setMaxPrice(max);
    }
  };

  // Show loading state while fetching user ID
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#3D7475]"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if no userId (will redirect to login)
  if (!userId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <div className="bg-[#F5F5F5] rounded-xl shadow-[0px_3.9px_3.9px_0px_#00000040] border border-gray-100 p-8 md:p-8 mb-20 relative">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-1 text-[#3D7475] font-bold text-sm mb-6 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft size={18} />
            BACK
          </button>

          {/* Stepper */}
          <div
            className="max-w-3xl mx-auto mb-12 px-2 py-3 bg-[#F0F0F6] rounded-3xl relative"
            style={{
              boxShadow: '0px -1.27px 5.09px 0px #E4E3E4 inset, 0px 1.79px 3.58px 0px #17151540',
            }}
          >
            <div className="flex justify-between items-center relative z-10">
              {STEPS.map((step, index) => {
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                const progressWidth = currentStep > step.id ? '100%' : '0%';

                return (
                  <div key={step.id} className="flex flex-col items-center gap-1 flex-1 relative">
                    {/* Connection Line */}
                    {index < STEPS.length - 1 && (
                      <div className="absolute left-1/2 w-full top-[11px] h-[2px] bg-gray-300">
                        <div
                          className="h-full bg-[#4CAF50] transition-all duration-500 ease-in-out"
                          style={{ width: progressWidth }}
                        />
                      </div>
                    )}
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 z-10 ${isCompleted || isCurrent ? 'bg-[#4CAF50] text-white' : 'bg-gray-400 text-white'
                        }`}
                    >
                      {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
                    </div>
                    <span
                      className={`text-sm font-medium text-center whitespace-nowrap transition-colors duration-300 ${isCurrent ? 'text-gray-900' : 'text-gray-500'
                        }`}
                    >
                      {step.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step 1: Location */}
          {currentStep === 1 && (
            <div className="text-center">
              <h1 className="text-xl font-medium text-[#1A1A1A] mb-2">
                Where do you want to live?
              </h1>
              <p className="text-gray-400 text-md font-normal mb-8">
                Select your preferred location to find the perfect place
              </p>

              <div className="max-w-xl mx-auto mb-8 space-y-4">
                {/* Country */}
                <div>
                  <CustomDropdown
                    label="Country"
                    value={country}
                    onChange={setCountry}
                    options={countryOptions}
                    placeholder="Select country"
                    required
                    searchable={true}
                    buttonClassName="bg-white border-2 border-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#3D7475]"
                    maxHeight="max-h-32"
                  />
                </div>

                {/* State/Region */}
                <div>
                  <CustomDropdown
                    label="State / Region"
                    value={stateRegion}
                    onChange={setStateRegion}
                    options={stateOptions}
                    placeholder={country ? "Select state" : "Select country first"}
                    required
                    disabled={!country || stateOptions.length === 0}
                    searchable={true}
                    buttonClassName="bg-white border-2 border-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#3D7475]"
                    maxHeight="max-h-32"
                  />
                </div>

                {/* City */}
                <div>
                  <CustomDropdown
                    label="City"
                    value={city}
                    onChange={setCity}
                    options={cityOptions}
                    placeholder={stateRegion ? "Select city" : country ? "Select state first" : "Select country first"}
                    required
                    disabled={!stateRegion || cityOptions.length === 0}
                    searchable={true}
                    buttonClassName="bg-white border-2 border-gray-400 px-4 py-3 rounded-lg focus:ring-2 focus:ring-[#3D7475]"
                    maxHeight="max-h-32"
                  />
                </div>
              </div>

              <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                  disabled={!country || !stateRegion || !city}
                  onClick={handleStep1Continue}
                  className={
                    !country || !stateRegion || !city
                      ? 'bg-gray-100! text-gray-400! cursor-not-allowed uppercase shadow-none'
                      : 'bg-[#3D7475] hover:bg-[#2F5C5D] shadow-lg shadow-[#3D7475]/40'
                  }
                  text="Continue"
                />
              </div>
            </div>
          )}

          {/* Step 2: Rental Types */}
          {currentStep === 2 && (
            <div className="text-center">
              <h1 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                What type of rental are you looking for?
              </h1>
              <p className="text-gray-400 text-sm font-normal mb-10 max-w-2xl mx-auto">
                Select one or multiple types of rental units you are looking for. You can change it
                anytime later.
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-3xl mx-auto px-4">
                {RENTAL_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleToggleType(type)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${selectedTypes.includes(type)
                      ? 'bg-[#7BD747] border-[#7BD747] text-white shadow-sm'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                  disabled={selectedTypes.length === 0}
                  onClick={handleStep2Continue}
                  className={
                    selectedTypes.length === 0
                      ? 'bg-gray-100! text-gray-400! cursor-not-allowed uppercase shadow-none'
                      : 'bg-[#3D7475] hover:bg-[#2F5C5D] shadow-lg shadow-[#3D7475]/40'
                  }
                  text="Continue"
                />
              </div>
            </div>
          )}

          {/* Step 3: Criteria */}
          {currentStep === 3 && (
            <div className="text-center">
              <h1 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                Specify the rental criteria
              </h1>
              <p className="text-gray-400 text-base font-normal mb-8">
                Enter the city to let us find you the perfect place
              </p>

              <div className="max-w-xl mx-auto space-y-4">
                {/* Beds and Baths */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Beds Dropdown */}
                  <CustomDropdown
                    label="Beds"
                    value={beds}
                    options={BED_OPTIONS}
                    onChange={setBeds}
                  />

                  {/* Baths Dropdown */}
                  <CustomDropdown
                    label="Baths"
                    value={baths}
                    options={BATH_OPTIONS}
                    onChange={setBaths}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <div className="flex gap-4 items-center mb-4">
                    <div>
                      <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                        Min:
                      </label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => handleMinPriceChange(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        onBlur={handleInputBlur}
                        className="w-32 px-4 py-2 bg-white border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BD747] focus:border-transparent text-[#7BD747] text-xl font-semibold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                        Max:
                      </label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => handleMaxPriceChange(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        onBlur={handleInputBlur}
                        className="w-32 px-4 py-2 bg-white border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7BD747] focus:border-transparent text-[#7BD747] text-xl font-semibold transition-all"
                      />
                    </div>
                  </div>

                  {/* Range Slider */}
                  <div className="relative pt-1">
                    <div className="flex items-center">
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="500"
                        value={minPrice}
                        onChange={(e) => handleMinPriceChange(Number(e.target.value))}
                        className="absolute w-full h-2 bg-transparent appearance-none z-20"
                        style={{ pointerEvents: 'auto' }}
                      />
                      <input
                        type="range"
                        min="0"
                        max="50000"
                        step="500"
                        value={maxPrice}
                        onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
                        className="absolute w-full h-2 bg-transparent appearance-none z-20"
                        style={{ pointerEvents: 'auto' }}
                      />
                      <div className="w-full h-2 bg-gray-300 rounded-full relative">
                        <div
                          className="absolute h-2 bg-[#7BD747] rounded-full"
                          style={{
                            left: `${Math.min(100, Math.max(0, (Number(minPrice) / 50000) * 100))}%`,
                            right: `${Math.min(100, Math.max(0, 100 - (Number(maxPrice) / 50000) * 100))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pets Allowed Toggle */}
                <div className="flex items-center justify-start gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setPetsAllowed(!petsAllowed)}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300  ${petsAllowed ? 'bg-[#7BD747]' : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${petsAllowed ? 'translate-x-8' : 'translate-x-1'
                        }`}
                    />
                  </button>
                  <label
                    className="text-base font-medium text-gray-700 cursor-pointer select-none"
                    onClick={() => setPetsAllowed(!petsAllowed)}
                  >
                    Pets Allowed
                  </label>
                </div>
              </div>

              <div className="mt-10 mb-2 flex justify-center">
                <PrimaryActionButton
                  onClick={handleStep3Finish}
                  disabled={isSaving}
                  className="bg-[#3D7475] hover:bg-[#2F5C5D] shadow-lg shadow-[#3D7475]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                  text={isSaving ? 'Saving...' : 'Finish'}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chat Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-[#004D40] rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="white"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
          />
        </svg>
      </button>

      <style>
        {`
          input[type="range"]::-webkit-slider-thumb {
            appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            border: 2px solid #7BD747;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          input[type="range"]::-moz-range-thumb {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            border: 2px solid #7BD747;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
        `}
      </style>
    </div>
  );
};

