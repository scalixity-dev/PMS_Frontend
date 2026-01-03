import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export const TenantOnboarding: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null);
  const [showLandlordConnect, setShowLandlordConnect] = useState(false);
  const [landlordEmail, setLandlordEmail] = useState('');
  const navigate = useNavigate();

  const handleSelection = (option: 'yes' | 'no') => {
    setSelectedOption(option);
    
    // Add a small delay for visual feedback before redirecting
    setTimeout(() => {
      if (option === 'yes') {
        // Navigate to the onboarding flow
        navigate('/signup/tenant-onboarding-flow');
      } else {
        // Show landlord connect form
        setShowLandlordConnect(true);
      }
    }, 300);
  };

  const handleLandlordNext = () => {
    if (landlordEmail.trim()) {
      // Save landlord email
      localStorage.setItem('tenant_landlord_email', landlordEmail);
      // TODO: Call API to send invite email to landlord
    }
    // Navigate to user dashboard
    navigate('/userdashboard');
  };

  const handleSkip = () => {
    // Skip and go directly to dashboard
    navigate('/userdashboard');
  };

  const handleBack = () => {
    // Go back to Yes/No selection
    setShowLandlordConnect(false);
    setSelectedOption(null);
  };

  return (
    <div className=" -m-2 min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center  relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-teal-100 rounded-full opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-600 rounded-full -translate-y-1/4 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-200 rounded-full opacity-30 translate-y-1/2 -translate-x-1/4"></div>

      {/* Main Content */}
      {!showLandlordConnect ? (
        <div className="relative z-10 w-full max-w-4xl mx-auto text-center px-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-[#0F2D46] mb-3">
            Are you looking for a new place?
          </h1>
          <p className="text-sm sm:text-base text-[#0F2D46] opacity-80 mb-12 sm:mb-16 max-w-lg mx-auto leading-relaxed">
            If you'd like to find a new long-term rental hit Yes. If you're happily moved-in just click No.
          </p>

        {/* Options */}
        <div className="flex flex-row items-center justify-center gap-10 sm:gap-20 ">
          {/* Yes Option */}
          <button
            onClick={() => handleSelection('yes')}
            className="group relative flex flex-col items-center cursor-pointer"
          >
            {/* Card Container with overlapping circle */}
            <div className="relative mb-6">
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 md:w-24 md:h-24 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                  selectedOption === 'yes'
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-200 bg-white group-hover:border-teal-300 group-hover:shadow-md'
                }`}
              >
                <span
                  className={`text-6xl sm:text-7xl font-bold transition-colors duration-300 ${
                    selectedOption === 'yes' ? 'text-teal-600' : 'text-[#D0DAE3]'
                  }`}
                  style={{ textShadow: '2px 2px 0px rgba(15, 45, 70, 0.05)' }}
                >
                  Y
                </span>
              </div>
              {/* Overlapping small circle */}
              <div className={`absolute -right-3 -bottom-3 w-8 h-8  rounded-full border-2 bg-white shadow-sm transition-all duration-300 flex items-center justify-center ${
                selectedOption === 'yes' ? 'border-teal-500' : 'border-gray-100 group-hover:border-teal-200'
              }`}>
                {selectedOption === 'yes' && (
                  <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                )}
              </div>
            </div>

            {/* Label */}
            <span
              className={`text-base sm:text-lg font-bold transition-colors duration-300 ${
                selectedOption === 'yes' ? 'text-teal-600' : 'text-[#0F2D46]'
              }`}
            >
              Yes
            </span>
          </button>

          {/* No Option */}
          <button
            onClick={() => handleSelection('no')}
            className="group relative flex flex-col items-center cursor-pointer"
          >
            {/* Card Container with overlapping circle */}
            <div className="relative mb-6">
              <div
                className={`w-28 h-28 sm:w-32 sm:h-32 md:w-24 md:h-24 rounded-2xl border-2 flex items-center justify-center transition-all duration-300 ${
                  selectedOption === 'no'
                    ? 'border-teal-500 bg-teal-50 shadow-md'
                    : 'border-gray-200 bg-white group-hover:border-teal-300 group-hover:shadow-md'
                }`}
              >
                <span
                  className={`text-6xl sm:text-7xl font-bold transition-colors duration-300 ${
                    selectedOption === 'no' ? 'text-teal-600' : 'text-[#D0DAE3]'
                  }`}
                  style={{ textShadow: '2px 2px 0px rgba(15, 45, 70, 0.05)' }}
                >
                  N
                </span>
              </div>
              {/* Overlapping small circle */}
              <div className={`absolute -right-3 -bottom-3 w-8 h-8  rounded-full border-2 bg-white shadow-sm transition-all duration-300 flex items-center justify-center ${
                selectedOption === 'no' ? 'border-teal-500' : 'border-gray-100 group-hover:border-teal-200'
              }`}>
                {selectedOption === 'no' && (
                  <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                )}
              </div>
            </div>

            {/* Label */}
            <span
              className={`text-base sm:text-lg font-bold transition-colors duration-300 ${
                selectedOption === 'no' ? 'text-teal-600' : 'text-[#0F2D46]'
              }`}
            >
              No
            </span>
          </button>
        </div>
        </div>
      ) : (
        /* Landlord Connect Section */
        <div className="relative z-10  w-full max-w-3xl mx-auto px-4">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="flex items-center gap-2 pb-10 text-[#3D7475] font-bold text-sm mb-1 hover:opacity-80 transition-opacity"
          >
            <ChevronLeft size={20} />
            BACK
          </button>

          <div className="text-center">
            <h1 className="text-3xl  font-semibold text-[#0F2D46] mb-4">
              Do you want to connect with your landlord?
            </h1>
            <p className="text-base sm:text-lg text-[#0F2D46] opacity-80 mb-12 max-w-3xl mx-auto leading-relaxed">
              Tell your landlord you're using TenantCloud. We'll send them an email invite to join you and share the lease.
            </p>

            {/* Email Input */}
            <div className="max-w-lg mx-auto mb-8">
              <label className="block text-left text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={landlordEmail}
                onChange={(e) => setLandlordEmail(e.target.value)}
                placeholder=""
                className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent text-gray-700 transition-all"
              />
            </div>

            {/* Skip Link */}
            <button
              onClick={handleSkip}
              className="text-[#3D7475] text-base font-semibold mb-8  transition-colors block mx-auto"
            >
              I will do it later
            </button>

            {/* Next Button */}
            <div className="flex justify-center">
              <button
                onClick={handleLandlordNext}
                disabled={!landlordEmail.trim()}
                className={`px-12 py-3 rounded-lg font-semibold text-white transition-all ${
                  landlordEmail.trim()
                    ? 'bg-[#3D7475] hover:bg-[#2F5C5D] shadow-lg shadow-[#3D7475]/30'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Button (from the image) */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-teal-600 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110 flex items-center justify-center z-50">
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
    </div>
  );
};

