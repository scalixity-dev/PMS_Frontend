import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label }) => {
    return (
        <div className="flex items-center cursor-pointer" onClick={() => onChange(!checked)}>
            <div className={`relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out ${checked ? 'bg-[#84CC16]' : 'bg-gray-300'}`}>
                <div
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'}`}
                />
            </div>
            {label && <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>}
        </div>
    );
};

export default Toggle;
