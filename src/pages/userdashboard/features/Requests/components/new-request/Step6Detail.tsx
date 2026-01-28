import React from "react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";

interface Step6Props {
    title: string;
    description: string;
    onTitleChange: (val: string) => void;
    onDescriptionChange: (val: string) => void;
    onNext: () => void;
}

const Step6Detail: React.FC<Step6Props> = ({ title, description, onTitleChange, onDescriptionChange, onNext }) => {
    return (
        <>
            {/* Header Section - Responsive text sizing and spacing */}
            <div className="text-center mb-6 md:mb-8 px-4">
                <h1 className="text-lg md:text-xl font-medium text-[#1A1A1A] mb-1">
                    Explain in detail
                </h1>
                <p className="text-gray-400 text-xs md:text-sm font-normal">
                    Start Selecting the category to define the issue
                </p>
            </div>

            {/* Form Section - Responsive sizing */}
            <div className="max-w-xl mx-auto px-4 mb-4">
                <div className="mb-4 md:mb-6">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-white rounded-lg border-2 border-gray-300 focus:border-[#7ED957] focus:outline-none transition-colors text-sm md:text-base text-gray-900 placeholder-gray-400"
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Describe"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        rows={6}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg bg-white border-2 border-gray-300 focus:border-[#7ED957] focus:outline-none transition-colors text-sm md:text-base text-gray-900 placeholder-gray-400 resize-none"
                    />
                </div>
            </div>

            {/* Next Button - Responsive sizing and spacing */}
            <div className="mt-6 mb-2 flex justify-center px-4">
                <PrimaryActionButton
                    disabled={!title.trim() || !description.trim()}
                    onClick={onNext}
                    className={!title.trim() || !description.trim()
                        ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-8 md:px-12 w-full md:w-auto"
                        : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-8 md:px-12 w-full md:w-auto"}
                    text="Next"
                />
            </div>
        </>
    );
};

export default Step6Detail;
