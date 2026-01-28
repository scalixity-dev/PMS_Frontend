import React from "react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";
import SearchableDropdown from "../../../../../../components/ui/SearchableDropdown";

interface Step7Props {
    location: string;
    onLocationChange: (val: string) => void;
    onNext: () => void;
}

const Step7Location: React.FC<Step7Props> = ({ location, onLocationChange, onNext }) => {
    return (
        <>
            {/* Header Section - Responsive text sizing and spacing */}
            <div className="text-center mb-6 md:mb-8 px-4">
                <h1 className="text-lg md:text-xl font-medium text-[#1A1A1A] mb-1">
                    Location Information
                </h1>
                <p className="text-gray-400 text-xs md:text-sm font-normal">
                    Start Selecting the category to define the issue
                </p>
            </div>

            {/* Dropdown Section - Responsive sizing */}
            <div className="max-w-lg mx-auto px-4 mb-4">
                <SearchableDropdown
                    label="Rental *"
                    value={location}
                    options={[
                        "Gandhi Path Rd, Jaipur, RJ 302020",
                        "Silicon City Rd, Indore Division, MP 452012",
                        "Main Street, New York, NY 10001",
                        "Park Avenue, London, UK SW1A 2AA"
                    ]}
                    onChange={onLocationChange}
                    placeholder="Search address"
                    buttonClassName="w-full flex items-center justify-between px-3 md:px-4 py-2.5 md:py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-[#7ED957] focus:outline-none transition-colors text-sm md:text-base text-gray-900"
                    labelClassName="font-semibold text-sm md:text-base"
                />
            </div>

            {/* Next Button - Responsive sizing and spacing */}
            <div className="mt-6 mb-2 flex justify-center px-4">
                <PrimaryActionButton
                    disabled={!location}
                    onClick={onNext}
                    className={!location
                        ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-8 md:px-12 w-full md:w-auto"
                        : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-8 md:px-12 w-full md:w-auto"}
                    text="Next"
                />
            </div>
        </>
    );
};

export default Step7Location;
