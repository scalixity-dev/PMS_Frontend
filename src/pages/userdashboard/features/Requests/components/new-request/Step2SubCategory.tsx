import React from "react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";
import { requestMapping } from "../../constants/requestData";

interface Step2Props {
    selectedCategory: string | null;
    selectedSubCategory: string | null;
    onSelect: (item: string) => void;
    onNext: () => void;
    onSkip: () => void;
}

const Step2SubCategory: React.FC<Step2Props> = ({ selectedCategory, selectedSubCategory, onSelect, onNext, onSkip }) => {
    const subCategories = selectedCategory ? requestMapping[selectedCategory]?.subCategories || [] : [];

    return (
        <>
            {/* Header Section - Responsive text sizing and spacing */}
            <div className="text-center mb-6 md:mb-8 px-4">
                <h1 className="text-lg md:text-xl font-medium text-[#1A1A1A] mb-1">
                    Please specify the request
                </h1>
                <p className="text-gray-400 text-xs md:text-sm font-normal">
                    Start Selecting the category to define the issue
                </p>
            </div>

            {/* SubCategory Grid - Responsive columns and spacing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 max-w-xl mx-auto px-4 mb-4">
                {subCategories.map((item) => (
                    <div key={item}
                        onClick={() => onSelect(item)}
                        className={`group cursor-pointer flex items-center gap-3 md:gap-4 bg-white px-3 md:px-4 py-2 rounded-lg border-2 transition-all duration-200 box-border h-[60px] md:h-[72px] ${selectedSubCategory === item ? "border-[#7ED957] shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
                    >
                        {/* Radio Button - Responsive sizing */}
                        <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${selectedSubCategory === item ? "bg-[#7ED957] border-[#7ED957]" : "border-gray-300 group-hover:border-[#7ED957]"}`}>
                            {selectedSubCategory === item && <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-white" />}
                        </div>
                        {/* SubCategory Text - Responsive sizing */}
                        <span className={`font-normal text-base md:text-lg ${selectedSubCategory === item ? "text-[#1A1A1A]" : "text-gray-900"}`}>{item}</span>
                    </div>
                ))}
            </div>

            {/* Skip Option - Responsive text sizing */}
            <div className="text-center mb-6 md:mb-8 px-4">
                <span className="text-gray-500 text-xs md:text-sm">None of the above? </span>
                <button className="text-[#004D40] text-xs md:text-sm font-medium hover:underline" onClick={onSkip}>Skip</button>
            </div>

            {/* Next Button - Responsive sizing and spacing */}
            <div className="mt-6 mb-2 flex justify-center px-4">
                <PrimaryActionButton
                    disabled={!selectedSubCategory}
                    onClick={onNext}
                    className={!selectedSubCategory
                        ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-8 md:px-12 w-full md:w-auto"
                        : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-8 md:px-12 w-full md:w-auto"}
                    text="Next"
                />
            </div>
        </>
    );
};

export default Step2SubCategory;
