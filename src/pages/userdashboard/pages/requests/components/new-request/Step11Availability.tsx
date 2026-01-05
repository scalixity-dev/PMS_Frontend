import React from "react";
import { Check, Trash2, Plus } from "lucide-react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";
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
            <div className="text-center mb-8">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">Availability details</h1>
                <p className="text-gray-400 text-sm font-normal">Please provide the possible options below..</p>
            </div>

            <div className="max-w-md mx-auto px-4 mb-8">
                {availability.map((option, index) => (
                    <div key={option.id} className="mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="font-bold text-[#1A1A1A]">Option {index + 1}</span>
                            <button
                                onClick={() => onRemoveDate(option.id)}
                                className="text-red-500 hover:text-red-600 transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Date <span className="text-red-500">*</span></label>
                            <input
                                type="date"
                                value={option.date}
                                onChange={(e) => onDateChange(option.id, e.target.value)}
                                className="w-full px-4 py-3 bg-white rounded-lg border border-gray-300 focus:border-[#7ED957] focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                                placeholder="dd/mm/yyyy"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {["8am - 12pm", "12pm - 4pm", "4pm - 8pm"].map((slot) => (
                                <label key={slot} className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${option.timeSlots.includes(slot) ? "bg-[#7ED957] border-[#7ED957]" : "border-gray-300 bg-white group-hover:border-gray-400"}`}>
                                        {option.timeSlots.includes(slot) && <Check size={14} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={option.timeSlots.includes(slot)}
                                        onChange={() => onSlotToggle(option.id, slot)}
                                    />
                                    <span className="text-gray-700 text-sm">{slot}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}

                <button
                    onClick={onAddDate}
                    className="flex items-center gap-2 text-[#7ED957] font-medium hover:opacity-80 transition-opacity mt-2"
                >
                    <Plus size={20} />
                    Add date
                </button>
            </div>

            <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                    disabled={availability.length === 0 || availability.some(opt => !opt.date || opt.timeSlots.length === 0)}
                    onClick={onNext}
                    text="Next"
                    className={availability.length === 0 || availability.some(opt => !opt.date || opt.timeSlots.length === 0) ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-12" : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-12"}
                />
            </div>
        </>
    );
};

export default Step11Availability;
