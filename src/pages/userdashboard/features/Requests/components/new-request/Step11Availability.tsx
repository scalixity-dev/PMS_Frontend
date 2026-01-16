import React from "react";
import { Check, Trash2, Plus } from "lucide-react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";
import DatePicker from "@/components/ui/DatePicker";
import type { AvailabilityOption } from "../../../../utils/types";

interface Step11Props {
    availability: AvailabilityOption[];
    onDateChange: (id: number, date: string) => void;
    onSlotToggle: (id: number, slot: string) => void;
    onRemoveDate: (id: number) => void;
    onAddDate: () => void;
    onNext: () => void;
}

const Step11Availability: React.FC<Step11Props> = ({
    availability,
    onDateChange,
    onSlotToggle,
    onRemoveDate,
    onAddDate,
    onNext
}) => {
    return (
        <>
            {/* Header Section - Responsive text sizing and spacing */}
            <div className="text-center mb-6 md:mb-8 px-4">
                <h1 className="text-lg md:text-xl font-medium text-[#1A1A1A] mb-1">Availability details</h1>
                <p className="text-gray-400 text-xs md:text-sm font-normal">Please provide the possible options below..</p>
            </div>

            {/* Availability Options - Responsive sizing */}
            <div className="max-w-sm mx-auto px-4 mb-6 md:mb-8">
                {availability.map((option, index) => (
                    <div key={option.id} className="mb-6 md:mb-8">
                        {/* Option Header - Responsive sizing */}
                        <div className="flex items-center gap-2 mb-2 md:mb-3">
                            <span className="font-bold text-sm md:text-base text-[#1A1A1A]">Option {index + 1}</span>
                            <button
                                onClick={() => onRemoveDate(option.id)}
                                className="text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
                            </button>
                        </div>

                        {/* Date Picker - Responsive sizing */}
                        <div className="mb-3 md:mb-4">
                            <label className="block text-xs md:text-sm font-semibold text-gray-700 mb-1.5 md:mb-2">Date <span className="text-red-500">*</span></label>
                            <DatePicker
                                value={option.date && option.date.includes("-") ? (() => {
                                    const [year, month, day] = option.date.split("-").map(Number);
                                    const date = new Date(year, month - 1, day);
                                    return isNaN(date.getTime()) ? undefined : date;
                                })() : undefined}
                                onChange={(date) => {
                                    if (date) {
                                        // Convert Date to YYYY-MM-DD format
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        onDateChange(option.id, `${year}-${month}-${day}`);
                                    } else {
                                        onDateChange(option.id, '');
                                    }
                                }}
                                placeholder="Select date"
                                className="w-full rounded-lg border border-gray-300 focus:border-[#7ED957] focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Time Slots - Responsive grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                            {["8am - 12pm", "12pm - 4pm", "4pm - 8pm"].map((slot) => (
                                <label key={slot} className="flex items-center gap-2 md:gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${option.timeSlots.includes(slot) ? "bg-[#7ED957] border-[#7ED957]" : "border-gray-300 bg-white group-hover:border-gray-400"}`}>
                                        {option.timeSlots.includes(slot) && <Check size={14} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={option.timeSlots.includes(slot)}
                                        onChange={() => onSlotToggle(option.id, slot)}
                                    />
                                    <span className="text-gray-700 text-xs md:text-sm">{slot}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Add Date Button - Responsive sizing */}
                <button
                    onClick={onAddDate}
                    className="flex items-center gap-2 text-[#7ED957] font-medium hover:opacity-80 transition-opacity mt-2 text-sm md:text-base"
                >
                    <Plus size={18} className="md:w-5 md:h-5" />
                    Add date
                </button>
            </div>

            {/* Next Button - Responsive sizing and spacing */}
            <div className="mt-6 mb-2 flex justify-center px-4">
                <PrimaryActionButton
                    disabled={availability.length === 0 || availability.some(opt => !opt.date || opt.timeSlots.length === 0)}
                    onClick={onNext}
                    text="Next"
                    className={availability.length === 0 || availability.some(opt => !opt.date || opt.timeSlots.length === 0)
                        ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-8 md:px-12 w-full md:w-auto"
                        : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-8 md:px-12 w-full md:w-auto"}
                />
            </div>
        </>
    );
};

export default Step11Availability;
