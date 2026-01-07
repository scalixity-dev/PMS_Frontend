import React from "react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";
import { requestMapping } from "../../constants/requestData";

interface Step4Props {
    selectedCategory: string | null;
    selectedProblem: string | null;
    finalDetail: string | null;
    onSelect: (item: string) => void;
    onNext: () => void;
    onSkip: () => void;
}

const Step4FinalDetail: React.FC<Step4Props> = ({ selectedCategory, selectedProblem, finalDetail, onSelect, onNext, onSkip }) => {
    const details = (selectedCategory && selectedProblem) ? requestMapping[selectedCategory]?.details[selectedProblem] || ["General issue"] : ["General issue"];

    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">
                    Add Final Detail
                </h1>
                <p className="text-gray-400 text-sm font-normal">
                    Start Selecting the category to define the issue
                </p>
            </div>

            <div className="grid grid-cols-2 gap-6 max-w-xl mx-auto px-4 mb-4">
                {details.map((item) => (
                    <div key={item}
                        onClick={() => onSelect(item)}
                        className={`group cursor-pointer flex items-center gap-4 bg-white px-4 py-2 rounded-lg border-2 transition-all duration-200 box-border h-[72px] ${finalDetail === item ? "border-[#7ED957] shadow-sm" : "border-gray-100 hover:border-gray-300"}`}
                    >
                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${finalDetail === item ? "bg-[#7ED957] border-[#7ED957]" : "border-gray-300 group-hover:border-[#7ED957]"}`}>
                            {finalDetail === item && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                        </div>
                        <span className={`font-normal text-lg ${finalDetail === item ? "text-[#1A1A1A]" : "text-gray-900"}`}>{item}</span>
                    </div>
                ))}
            </div>

            <div className="text-center mb-8">
                <span className="text-gray-500 text-sm">None of the above? </span>
                <button className="text-[#004D40] text-sm font-medium hover:underline" onClick={onSkip}>Skip</button>
            </div>

            <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                    disabled={!finalDetail}
                    onClick={onNext}
                    className={!finalDetail ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-12" : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-12"}
                    text="Next"
                />
            </div>
        </>
    );
};

export default Step4FinalDetail;
