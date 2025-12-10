import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface ToggleOption {
    label: string;
    value: string;
}

interface TransactionToggleProps {
    options: ToggleOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

const TransactionToggle: React.FC<TransactionToggleProps> = ({ options, value, onChange, className }) => {
    return (
        <div className={`bg-white rounded-full p-2 inline-flex gap-2 mb-8 shadow-sm ${className}`}>
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${value === option.value
                        ? 'bg-[#7BD747] text-white shadow-sm'
                        : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    {value === option.value ? (
                        <CheckCircle2 className="w-4 h-4 fill-white text-[#7BD747]" />
                    ) : (
                        <Circle className="w-4 h-4" />
                    )}
                    {option.label}
                </button>
            ))}
        </div>
    );
};

export default TransactionToggle;
