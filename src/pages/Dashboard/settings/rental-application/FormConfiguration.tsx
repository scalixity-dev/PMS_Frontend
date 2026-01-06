import { useState } from "react";
import { Check } from "lucide-react";

interface ConfigurationOption {
    id: "basic" | "custom";
    title: string;
    description: string;
}

const CONFIGURATION_OPTIONS: ConfigurationOption[] = [
    {
        id: "basic",
        title: "Basic",
        description: "For landlords who manage their own properties. This mode will assume you are the owner of all properties and will assist in managing your properties in an easy to use manner."
    },
    {
        id: "custom",
        title: "Custom",
        description: "For landlords who manage their own properties. This mode will assume you are the owner of all properties and will assist in managing your properties in an easy to use manner."
    }
];

export default function FormConfiguration() {
    const [selectedMode, setSelectedMode] = useState<"basic" | "custom">("basic");

    return (
        <div className="space-y-6 w-full md:w-3/5">
            <div>
                <h2 className="text-lg font-bold text-gray-900">Application form configuration</h2>
                <p className="text-gray-600 text-sm mt-1 max-w-3xl">
                    Choose the mode of your account either "Landlord" or "Property Manager". You
                    can switch between account modes at any time.
                </p>
                <button className="text-[#327B6E] text-sm font-medium mt-1 hover:underline">
                    Learn more
                </button>
            </div>

            <div className="space-y-4">
                {CONFIGURATION_OPTIONS.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => setSelectedMode(option.id)}
                        className={`relative rounded-lg p-6 border transition-all cursor-pointer ${selectedMode === option.id
                            ? "border-[#7CD947] bg-white ring-1 ring-[#7CD947]"
                            : "border-gray-300 bg-[#E8E8E8] hover:border-gray-400"
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            <div
                                className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center transition-colors border-2 ${selectedMode === option.id
                                    ? "bg-[#7CD947] border-[#7CD947] text-white"
                                    : "bg-transparent border-gray-500 text-gray-500"
                                    }`}
                            >
                                <Check className="w-4 h-4" strokeWidth={3} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">{option.title}</h3>
                                <p className="text-gray-500 text-sm mt-2 leading-relaxed max-w-2xl">
                                    {option.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
