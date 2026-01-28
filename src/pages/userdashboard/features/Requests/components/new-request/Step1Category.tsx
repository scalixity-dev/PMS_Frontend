import React from "react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";
import { categories } from "../../constants/requestData";

interface Step1Props {
    selectedCategory: string | null;
    onSelect: (id: string) => void;
    onNext: () => void;
}

const Step1Category: React.FC<Step1Props> = ({ selectedCategory, onSelect, onNext }) => {
    return (
        <>
            {/* Header Section - Responsive text sizing and spacing */}
            <div className="text-center mb-6 md:mb-8 px-4">
                <h1 className="text-lg md:text-xl font-medium text-[#1A1A1A] mb-1">
                    What is this Request about?
                </h1>
                <p className="text-gray-400 text-xs md:text-sm font-normal">
                    Start Selecting the category to define the issue
                </p>
            </div>

            {/* Category Grid - Responsive columns and spacing */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 md:gap-x-8 md:gap-y-5 lg:gap-x-12 px-4 md:px-6 lg:px-10 max-w-xl mx-auto">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => onSelect(category.id)}
                        className="cursor-pointer group flex flex-col items-center"
                    >
                        {/* Category Card - Responsive sizing */}
                        <div className={`relative w-full aspect-[5/3] rounded-lg md:rounded-2xl border-2 transition-all duration-300 flex items-center justify-center bg-white ${selectedCategory === category.id
                            ? "border-[#7ED957]"
                            : "border-gray-100 group-hover:border-gray-200"
                            }`}>
                            {/* Icon - Responsive sizing */}
                            <category.icon
                                size={window.innerWidth < 768 ? 36 : 48}
                                strokeWidth={1.2}
                                className={`${selectedCategory === category.id ? "text-gray-900" : "text-gray-800"}`}
                            />

                            {/* Selection Indicator - Responsive sizing */}
                            <div className={`absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 rounded-full border-4 border-transparent shadow-sm transition-all duration-300 ${selectedCategory === category.id
                                ? "bg-[#7ED957]"
                                : "bg-[#F3F4F6] border-white"
                                }`} />
                        </div>
                        {/* Category Name - Responsive text sizing */}
                        <span className={`mt-1.5 md:mt-2 font-medium text-sm md:text-base transition-colors text-center ${selectedCategory === category.id ? "text-[#1F2937]" : "text-gray-700"
                            }`}>
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>

            {/* Next Button - Responsive sizing and spacing */}
            <div className="mt-6 md:mt-8 mb-2 flex justify-center px-4">
                <PrimaryActionButton
                    disabled={!selectedCategory}
                    onClick={onNext}
                    className={!selectedCategory
                        ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-8 md:px-12 w-full md:w-auto"
                        : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-8 md:px-12 w-full md:w-auto"}
                    text="Next"
                />
            </div>
        </>
    );
};

export default Step1Category;
