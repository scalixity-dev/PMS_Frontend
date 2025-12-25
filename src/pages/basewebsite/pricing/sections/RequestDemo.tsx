import React from 'react';

const RequestDemoCard: React.FC = () => {
  return (
    <div className="max-w-7xl mb-8 mx-auto px-4 sm:px-6 bg-[#819A78]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between">

      <div className="flex-1 text-center md:text-left md:pr-8 mb-8 md:mb-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Request a demo
        </h2>
        <p className="text-lg text-gray-600 mb-6">
          We're happy to answer any questions you have <br className="hidden md:inline" /> about SmartTenantAICloud.
        </p>

        <button className="bg-gradient-to-r from-[#3A4E33] to-[#85B474]  hover:from-[#3A4E33] hover:to-[#3A4E33] text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center mx-auto md:mx-0">
          Request A Demo
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      <div className="flex-none w-full md:w-auto">
        <img
          src="/requestDemo.jpg"
          alt="Modern House"
          className="rounded-lg lg:rounded-xl md:rounded-xl shadow-lg w-full max-w-[420px] h-auto object-cover mx-auto md:mx-0"
        />
      </div>
    </div>
  );
};

export default RequestDemoCard;