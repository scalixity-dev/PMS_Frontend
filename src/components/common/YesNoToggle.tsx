import React from 'react';

interface YesNoToggleProps {
    value: boolean | null;
    onChange: (value: boolean) => void;
    labels?: { yes: string; no: string };
}

const YesNoToggle: React.FC<YesNoToggleProps> = ({ value, onChange, labels = { yes: 'Yes', no: 'No' } }) => {
    return (
        <div className="bg-[#F0F0F6] p-6 rounded-full shadow-sm w-full max-w-2xl flex justify-center items-center gap-12">
            <button
                onClick={() => onChange(true)}
                className={`w-38 py-3 px-8 rounded-full font-medium text-lg transition-all duration-200 ${
                    value === true
                        ? 'bg-[#84CC16] text-white shadow-lg scale-105 ring-4 ring-[#84CC16]/30'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-300'
                }`}
            >
                {labels.yes}
            </button>
            <button
                onClick={() => onChange(false)}
                className={`w-38 py-3 px-8 rounded-full font-medium text-lg transition-all duration-200 ${
                    value === false
                        ? 'bg-[#84CC16] text-white shadow-lg scale-105 ring-4 ring-[#84CC16]/30'
                        : 'bg-white text-gray-600 hover:bg-gray-100 border-2 border-gray-300'
                }`}
            >
                {labels.no}
            </button>
        </div>
    );
};

export default YesNoToggle;
