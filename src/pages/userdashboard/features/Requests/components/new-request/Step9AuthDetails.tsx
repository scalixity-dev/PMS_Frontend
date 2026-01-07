import React from "react";
import { Check } from "lucide-react";
import PrimaryActionButton from "../../../../../../components/common/buttons/PrimaryActionButton";

interface Step9Props {
    authCode: string;
    pets: string[];
    onAuthCodeChange: (val: string) => void;
    onTogglePet: (pet: string) => void;
    onNext: () => void;
}

const Step9AuthDetails: React.FC<Step9Props> = ({ authCode, pets, onAuthCodeChange, onTogglePet, onNext }) => {
    return (
        <>
            <div className="text-center mb-8">
                <h1 className="text-xl font-medium text-[#1A1A1A] mb-1">Authorization details</h1>
                <p className="text-gray-400 text-sm font-normal">Start Selecting the category to define the issue</p>
            </div>

            <div className="max-w-lg mx-auto px-4 mb-8">
                <input
                    type="text"
                    placeholder="Code"
                    value={authCode}
                    onChange={(e) => onAuthCodeChange(e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-lg border-2 border-gray-200 focus:border-[#7ED957] focus:outline-none transition-colors text-gray-900 placeholder-gray-400"
                />

                <div className="mt-8">
                    <h3 className="text-[#1A1A1A] font-medium mb-4 text-left">Pets in residence</h3>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-20">
                            {["Cat", "Dog"].map((pet) => (
                                <div
                                    key={pet}
                                    className="flex items-center gap-3 cursor-pointer"
                                    onClick={() => onTogglePet(pet)}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${pets.includes(pet) ? "bg-[#7ED957] border-[#7ED957]" : "border-gray-300 bg-white"}`}>
                                        {pets.includes(pet) && <Check size={14} className="text-white" strokeWidth={3} />}
                                    </div>
                                    <span className="text-gray-900 font-normal">{pet}</span>
                                </div>
                            ))}
                        </div>
                        <div
                            className="flex items-center gap-3 cursor-pointer"
                            onClick={() => onTogglePet("Other")}
                        >
                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${pets.includes("Other") ? "bg-[#7ED957] border-[#7ED957]" : "border-gray-300 bg-white"}`}>
                                {pets.includes("Other") && <Check size={14} className="text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-gray-900 font-normal">Other</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 mb-2 flex justify-center">
                <PrimaryActionButton
                    disabled={!authCode.trim()}
                    onClick={onNext}
                    text="Next"
                    className={!authCode.trim() ? "!bg-gray-100 !text-gray-400 cursor-not-allowed uppercase shadow-none px-12" : "bg-[#7ED957] hover:bg-[#6BC847] shadow-lg shadow-[#7ED957]/80 px-12"}
                />
            </div>
        </>
    );
};

export default Step9AuthDetails;
