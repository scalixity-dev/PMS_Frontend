import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../lib/utils';;

interface CustomCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, label, className }) => {
    return (
        <label className={cn("flex items-center gap-3 cursor-pointer group", className)}>
            <div className='w-8 h-8 rounded-full bg-[#cde3c7] flex items-center justify-center'>
                <div
                onClick={(e) => {
                    e.preventDefault(); // Prevent double toggling if label wraps input
                    onChange(!checked);
                }}
                className={`
                    w-4 h-4 rounded-xs flex items-center justify-center transition-colors border-none
                    ${checked ? 'bg-[#7BD747]' : 'bg-[#D1D5DB]'}
                `}
            >
                {checked && <Check size={16} className="text-white" />}
            </div>
            </div>
            {label && <span className="text-gray-700 font-medium">{label}</span>}
        </label>
    );
};

export default CustomCheckbox;
