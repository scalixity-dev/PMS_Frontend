import React from 'react';

interface ToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    size?: 'default' | 'small';
    labelClassName?: string;
    disabled?: boolean;
}

const Toggle: React.FC<ToggleProps> = ({ checked, onChange, label, size = 'default', labelClassName, disabled = false }) => {
    const isSmall = size === 'small';
    const containerClass = isSmall ? 'w-12 h-7' : 'w-14 h-8';
    const knobClass = isSmall ? 'w-5 h-5' : 'w-6 h-6';
    const knobPosition = isSmall ? (checked ? 'left-6' : 'left-1') : (checked ? 'left-7' : 'left-1');

    return (
        <div className={`flex items-center gap-3 ${disabled ? 'opacity-70 cursor-not-allowed' : ''}`}>
            <button
                onClick={() => !disabled && onChange(!checked)}
                disabled={disabled}
                className={`${containerClass} rounded-full transition-colors relative ${checked ? 'bg-[#7BD747]' : 'bg-gray-300'} ${disabled ? 'cursor-not-allowed' : ''}`}
            >
                <div className={`absolute top-1 ${knobClass} bg-white rounded-full transition-transform ${knobPosition}`} />
            </button>
            {label && <span className={labelClassName || "font-medium text-gray-700"}>{label}</span>}
        </div>
    );
};

export default Toggle;
