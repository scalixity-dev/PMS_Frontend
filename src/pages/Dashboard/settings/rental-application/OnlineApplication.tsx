import { useState } from "react";
import { Lightbulb } from "lucide-react";

interface FeeCollectionOption {
    value: "auto" | "request";
    label: string;
}

const FEE_COLLECTION_OPTIONS: FeeCollectionOption[] = [
    {
        value: "auto",
        label: "Automatically when the application is submitted",
    },
    {
        value: "request",
        label: "By request after the application has been submitted",
    },
];

export default function OnlineApplication() {
    const [feeCollection, setFeeCollection] = useState<"auto" | "request">("auto");

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Application fee</h2>
                <p className="text-gray-600 text-sm mt-1 max-w-3xl">
                    Choose the mode of your account either "Landlord" or "Property Manager". You
                    can switch between account modes at any time.
                </p>
                <button className="text-[#327B6E] text-sm font-medium mt-1 hover:underline">
                    Learn more
                </button>
            </div>

            <div className="space-y-4">
                {FEE_COLLECTION_OPTIONS.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-3 cursor-pointer group"
                    >
                        <div className="relative flex items-center justify-center">
                            <input
                                type="radio"
                                name="feeCollection"
                                value={option.value}
                                checked={feeCollection === option.value}
                                onChange={() => setFeeCollection(option.value)}
                                className="peer sr-only"
                            />
                            <div
                                className={`w-5 h-5 rounded-full border-2 transition-colors ${feeCollection === option.value
                                    ? "border-[#7CD947]"
                                    : "border-gray-800 group-hover:border-gray-900"
                                    }`}
                            />
                            <div
                                className={`absolute w-2.5 h-2.5 rounded-full bg-[#7CD947] transition-transform ${feeCollection === option.value ? "scale-100" : "scale-0"
                                    }`}
                            />
                        </div>
                        <span
                            className={`text-sm font-medium ${feeCollection === option.value ? "text-gray-900" : "text-gray-600"
                                }`}
                        >
                            {option.label}
                        </span>
                    </label>
                ))}
            </div>

            <div className="pt-4">
                <Lightbulb className="w-5 h-5 text-gray-900" strokeWidth={1.5} />
            </div>
        </div>
    );
}
