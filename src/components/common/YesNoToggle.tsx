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
                className={`w-38 py-2 rounded-full text-white font-medium text-lg transition-all duration-200 ${value === true
                    ? 'bg-[#84CC16] shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]'
                    : 'bg-[#84CC16] hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]'
                    }`}
            >
                {labels.yes}
            </button>
            <button
                onClick={() => onChange(false)}
                className={`w-38 py-2 rounded-full text-white font-medium text-lg transition-all duration-200 ${value === false
                    ? 'bg-[#84CC16] shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]'
                    : 'bg-[#84CC16] hover:shadow-[inset_0_3px_6px_rgba(0,0,0,0.2)]'
                    }`}
            >
                {labels.no}
            </button>
        </div>
    );
};

export default YesNoToggle;
