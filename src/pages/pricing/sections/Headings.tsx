export const Heading = () => {
  return (
    <div className="text-center mb-12 md:mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Plans & Pricing</h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
        Why pay more than $200 a month for Property Management software?
        </p>
    </div>
  );
};
export const SubHeading = () => {
  return (
    <div className="text-center mb-12 md:mb-16">
        <p className="text-xl md:text-2xl font-bold text-gray-900 max-w-lg mx-auto">
            Our maximum is their minimum —
        </p>
        <p className="text-xl md:text-2xl font-bold text-gray-900 max-w-lg mx-auto">
            unlimited units for unlimited value.
        </p>
    </div>
  );
};

export const TableTitle = () => {
    return(<>
        <div className="text-center">
            <p className="text-base text-gray-700 mt-20">Prices exclude any applicable taxes</p>
            <p className="text-base text-gray-700 mt-6">Onboarding available. Onboarding fees apply based on portfolio size.</p>
        </div>

        <button className="bg-[#3D7475] text-white font-semibold py-3 px-8 rounded-2xl hover:bg-teal-800 transition-colors shadow-lg border-2 border-white">
            Compare all feature
        </button>
    </>)
}