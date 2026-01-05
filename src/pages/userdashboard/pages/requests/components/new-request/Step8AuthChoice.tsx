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
            <div className="text-center mb-8">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">Authorization to enter</h1>
                <p className="text-gray-400 text-sm font-normal">Start Selecting the category to define the issue</p>
            </div>

            <div className="flex justify-center gap-16 max-w-xl mx-auto px-4 mb-8">
                {[
                    { id: "yes", label: "Yes" },
                    { id: "no", label: "No" }
                ].map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option.id)}
                        className={`px-8 py-4 rounded-lg border-2 transition-all duration-200 font-medium text-gray-900 ${authorization === option.id
                            ? "border-[#7ED957] bg-white shadow-sm"
                            : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                    disabled={!authorization}
                    onClick={onNext}
                    text="Next"
                    className={!authorization ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-12" : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-12"}
                />
            </div>
        </>
    );
};

export default Step8AuthChoice;
