import React from 'react';

interface TransactionTypeToggleProps {
    value: 'property' | 'general';
    onChange: (value: 'property' | 'general') => void;
    text?: {
        property?: string;
        general?: string;
    };
}

const TransactionTypeToggle: React.FC<TransactionTypeToggleProps> = ({ value, onChange, text }) => {
    const propertyLabel = text?.property ?? 'Property Income';
    const generalLabel = text?.general ?? 'General Income';

    return (
        <div className="bg-[#F3F4F6] p-2 rounded-full shadow-sm inline-flex items-center gap-4 border border-gray-100">
            <button
                onClick={() => onChange('property')}
                className={`flex items-center gap-3 px-8 py-3 rounded-full text-white font-semibold text-base transition-all duration-200 ${'bg-[#84CC16] shadow-md hover:opacity-90'} `}
            >
                <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="w-5 h-5 rounded-full border-2 border-white"></div>
                    {value === 'property' && (
                        <div className="absolute w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                </div>
                {propertyLabel}
            </button>

            <button
                onClick={() => onChange('general')}
                className={`flex items-center gap-3 px-8 py-3 rounded-full text-white font-semibold text-base transition-all duration-200 ${'bg-[#84CC16] shadow-md hover:opacity-90'} `}
            >
                <div className="relative flex items-center justify-center w-5 h-5">
                    <div className="w-5 h-5 rounded-full border-2 border-white"></div>
                    {value === 'general' && (
                        <div className="absolute w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                </div>
                {generalLabel}
            </button>
        </div>
    );
};

export default TransactionTypeToggle;
