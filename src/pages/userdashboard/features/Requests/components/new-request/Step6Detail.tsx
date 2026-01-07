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
            <div className="text-center mb-8">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">
                    Explain in detail
                </h1>
                <p className="text-gray-400 text-sm font-normal">
                    Start Selecting the category to define the issue
                </p>
            </div>

            <div className="max-w-xl mx-auto px-4 mb-4">
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-300 focus:border-[#7ED957] focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                    />
                </div>
                <div>
                    <textarea
                        placeholder="Describe"
                        value={description}
                        onChange={(e) => onDescriptionChange(e.target.value)}
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg bg-white border-2 border-gray-300 focus:border-[#7ED957] focus:outline-none transition-colors text-gray-900 placeholder-gray-400 resize-none"
                    />
                </div>
            </div>

            <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                    disabled={!title.trim() || !description.trim()}
                    onClick={onNext}
                    className={!title.trim() || !description.trim() ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-12" : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-12"}
                    text="Next"
                />
            </div>
        </>
    );
};

export default Step6Detail;
