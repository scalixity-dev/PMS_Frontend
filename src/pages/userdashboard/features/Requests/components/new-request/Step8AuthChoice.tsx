import React from "react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";

interface Step8Props {
    authorization: string | null;
    onSelect: (val: string) => void;
    onNext: () => void;
}

const Step8AuthChoice: React.FC<Step8Props> = ({ authorization, onSelect, onNext }) => {
    return (
        <>
            {/* Header Section - Responsive text sizing and spacing */}
            <div className="text-center mb-6 md:mb-8 px-4">
                <h1 className="text-lg md:text-xl font-medium text-[#1A1A1A] mb-1">Authorization to enter</h1>
                <p className="text-gray-400 text-xs md:text-sm font-normal">Start Selecting the category to define the issue</p>
            </div>

            {/* Authorization Buttons - Responsive layout and sizing */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-16 max-w-xl mx-auto px-4 mb-6 md:mb-8">
                {[
                    { id: "yes", label: "Yes" },
                    { id: "no", label: "No" }
                ].map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={`w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 rounded-lg border-2 transition-all duration-200 font-medium text-sm md:text-base text-gray-900 ${authorization === option.id
                            ? "border-[#7ED957] bg-white shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Next Button - Responsive sizing and spacing */}
            <div className="mt-6 mb-2 flex justify-center px-4">
                <PrimaryActionButton
                    disabled={!authorization}
                    onClick={onNext}
                    text="Next"
                    className={!authorization
                        ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-8 md:px-12 w-full md:w-auto"
                        : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-8 md:px-12 w-full md:w-auto"}
                />
            </div>
        </>
    );
};

export default Step8AuthChoice;
