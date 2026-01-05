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
            <div className="text-center mb-8">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">
                    What is this Request about?
                </h1>
                <p className="text-gray-400 text-sm font-normal">
                    Start Selecting the category to define the issue
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-5 px-10 max-w-xl mx-auto">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        onClick={() => onSelect(category.id)}
                        className="cursor-pointer group flex flex-col items-center"
                    >
                        <div className={`relative w-full aspect-[5/3] rounded-2xl border-2 transition-all duration-300 flex items-center justify-center bg-white ${selectedCategory === category.id
                            ? "border-[#7ED957]"
                            : "border-gray-100 group-hover:border-gray-200"
                            }`}>
                            <category.icon size={48} strokeWidth={1.2} className={`${selectedCategory === category.id ? "text-gray-900" : "text-gray-800"
                                }`} />

                            <div className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-transparent shadow-sm transition-all duration-300 ${selectedCategory === category.id
                                ? "bg-[#7ED957]"
                                : "bg-[#F3F4F6] border-white"
                                }`} />
                        </div>
                        <span className={`mt-2 font-medium text-base transition-colors ${selectedCategory === category.id ? "text-[#1F2937]" : "text-gray-700"
                            }`}>
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                    disabled={!selectedCategory}
                    onClick={onNext}
                    className={!selectedCategory ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-12" : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-12"}
                    text="Next"
                />
            </div>
        </>
    );
};

export default Step1Category;
