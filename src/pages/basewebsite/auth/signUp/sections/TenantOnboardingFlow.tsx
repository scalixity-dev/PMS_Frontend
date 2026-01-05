import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, ChevronDown } from 'lucide-react';
import PrimaryActionButton from '../../../../../components/common/buttons/PrimaryActionButton';

// Custom Dropdown Component
interface CustomDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ label, value, options, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-left text-sm font-medium text-gray-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D7475] text-gray-700 transition-all flex items-center justify-between hover:border-gray-500"
      >
        <span>{value}</span>
        <ChevronDown
          size={20}
          className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 text-sm transition-all rounded-lg hover:bg-gray-50 ${
                  value === option ? 'text-[#3D7475] font-semibold bg-teal-50' : 'text-gray-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

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

const BED_OPTIONS = ['Any', '1', '2', '3', '4', '5+'];
const BATH_OPTIONS = ['Any', '1', '1.5', '2', '2.5', '3', '3.5', '4+'];

const STEPS = [
  { id: 1, name: 'Location' },
  { id: 2, name: 'Rental Type' },
  { id: 3, name: 'Complete' },
];

export const TenantOnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Location
  const [location, setLocation] = useState('');

  // Step 2: Rental Types
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Step 3: Criteria
  const [beds, setBeds] = useState<string>('Any');
  const [baths, setBaths] = useState<string>('Any');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [petsAllowed, setPetsAllowed] = useState<boolean>(false);

  const handleBack = () => {
    if (currentStep === 1) {
      navigate(-1);
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStep1Continue = () => {
    if (location.trim()) {
      localStorage.setItem('tenant_preferred_location', location);
      setCurrentStep(2);
    }
  };

  const handleStep2Continue = () => {
    if (selectedTypes.length > 0) {
      localStorage.setItem('tenant_rental_types', JSON.stringify(selectedTypes));
      setCurrentStep(3);
    }
  };

  const handleStep3Finish = () => {
    const criteria = { beds, baths, minPrice, maxPrice, petsAllowed };
    localStorage.setItem('tenant_rental_criteria', JSON.stringify(criteria));
    navigate('/userdashboard');
  };

  const handleToggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleMinPriceChange = (value: number) => {
    if (value <= maxPrice) setMinPrice(value);
  };

  const handleMaxPriceChange = (value: number) => {
    if (value >= minPrice) setMaxPrice(value);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        {/* Main Card */}
        <div className="bg-[#F5F5F5] rounded-xl shadow-[0px_3.9px_3.9px_0px_#00000040] border border-gray-100 p-8 md:p-8 relative overflow-hidden">
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
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 z-10 ${
                        isCompleted || isCurrent ? 'bg-[#4CAF50] text-white' : 'bg-gray-400 text-white'
                      }`}
                    >
                      {isCompleted ? <Check size={18} strokeWidth={3} /> : step.id}
                    </div>
                    <span
                      className={`text-sm font-medium text-center whitespace-nowrap transition-colors duration-300 ${
                        isCurrent ? 'text-gray-900' : 'text-gray-500'
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
                Enter the city to let us find you the perfect place
              </p>

              <div className="max-w-xl mx-auto mb-8">
                <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Start typing the address and then select from the..."
                  className="w-full px-4 py-3 bg-white border-2 border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3D7475] focus:border-transparent text-gray-700 placeholder:text-gray-400 transition-all"
                />
              </div>

              <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                  disabled={!location.trim()}
                  onClick={handleStep1Continue}
                  className={
                    !location.trim()
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
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border-2 ${
                      selectedTypes.includes(type)
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
                        onChange={(e) => handleMinPriceChange(Number(e.target.value))}
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
                        onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
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
                            left: `${(minPrice / 50000) * 100}%`,
                            right: `${100 - (maxPrice / 50000) * 100}%`,
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
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300  ${
                      petsAllowed ? 'bg-[#7BD747]' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${
                        petsAllowed ? 'translate-x-8' : 'translate-x-1'
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
                  className="bg-[#3D7475] hover:bg-[#2F5C5D] shadow-lg shadow-[#3D7475]/40"
                  text="Finish"
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

