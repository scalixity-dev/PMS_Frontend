export const Heading = () => {
  return (
    <div className="text-center mb-10 md:mb-14 px-4">
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
        Plans & Pricing
      </h2>
      <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
        Why pay more than $200 a month for Property Management software?
      </p>
    </div>
  );
};
export const SubHeading = () => {
  return (
    <div className="text-center md:text-left space-y-2">
      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
        Our maximum is their minimum —
      </p>
      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
        unlimited units for unlimited value.
      </p>
    </div>
  );
};

export const TableTitle = () => {
  return (
    <div className="flex flex-col items-center text-center gap-4 sm:gap-6 px-4">
      <div className="space-y-2">
        <p className="text-sm sm:text-base text-gray-700">
          Prices exclude any applicable taxes
        </p>
        <p className="text-sm sm:text-base text-gray-700">
          Onboarding available. Onboarding fees apply based on portfolio size.
        </p>
      </div>

      <button className="bg-[#3D7475] text-white font-semibold py-3 px-6 sm:px-8 rounded-2xl hover:bg-teal-800 transition-colors border-2 border-white shadow-md">
        Compare all features
      </button>
    </div>
  );
};