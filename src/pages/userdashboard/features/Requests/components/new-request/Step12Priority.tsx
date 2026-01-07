import React, { type RefObject } from "react";
import { ChevronDown } from "lucide-react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";

interface Step12Props {
    priority: "Low" | "Normal" | "Critical" | null;
    isPriorityDropdownOpen: boolean;
    priorityDropdownRef: RefObject<HTMLDivElement | null>;
    setIsPriorityDropdownOpen: (val: boolean) => void;
    onSelect: (val: "Low" | "Normal" | "Critical") => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
}

const Step12Priority: React.FC<Step12Props> = ({
    priority,
    isPriorityDropdownOpen,
    priorityDropdownRef,
    setIsPriorityDropdownOpen,
    onSelect,
    onSubmit,
    isSubmitting = false
}) => {
    return (
        <div className="text-center py-10">
            <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">Request Priority</h1>
            <p className="text-gray-400 text-sm font-normal mb-8">How Urgent it is?</p>

            <div className="max-w-md mx-auto px-4 mb-8">
                <div className="relative" ref={priorityDropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsPriorityDropdownOpen(!isPriorityDropdownOpen)}
                        className="w-full flex items-center justify-between px-4 py-3 bg-white border-2 border-gray-300 rounded-lg focus:border-[#7ED957] focus:outline-none transition-colors text-gray-900"
                    >
                        <span>{priority || "Select Priority"}</span>
                        <ChevronDown
                            size={20}
                            className={`text-gray-500 transition-transform ${isPriorityDropdownOpen ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {isPriorityDropdownOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
                            {["Low", "Normal", "Critical"].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => {
                                        onSelect(option as "Low" | "Normal" | "Critical");
                                        setIsPriorityDropdownOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${priority === option ? "bg-gray-50" : ""
                                        }`}
                                >
                                    <span className="text-gray-900">{option}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <PrimaryActionButton
                    disabled={!priority || isSubmitting}
                    onClick={onSubmit}
                    text={isSubmitting ? "Creating..." : "Create a request"}
                    className={!priority || isSubmitting ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-12" : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/30 px-12"}
                />
            </div>
        </div>
    );
};

export default Step12Priority;
