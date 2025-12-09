import React from 'react';

interface CustomTextBoxProps {
    label?: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    readOnly?: boolean;
    className?: string;
    labelClassName?: string;
    valueClassName?: string;
    multiline?: boolean;
}

/**
 * CustomTextBox - A reusable text box component with label and value display
 * 
 * @param label - Optional label text to display on the left side. If not provided, only value is shown
 * @param value - The value text to display on the right side
 * @param onChange - Optional callback for when value changes (for editable mode)
 * @param placeholder - Optional placeholder text
 * @param disabled - Whether the input is disabled
 * @param readOnly - Whether the input is read-only (default display mode)
 * @param className - Additional classes for the container
 * @param labelClassName - Additional classes for the label
 * @param valueClassName - Additional classes for the value/input
 */
const CustomTextBox: React.FC<CustomTextBoxProps> = ({
    label,
    value,
    onChange,
    placeholder = '',
    disabled = false,
    readOnly = true,
    className = '',
    labelClassName = '',
    valueClassName = '',
    multiline = false
}) => {
    return (
        <div className={`flex ${multiline ? 'items-start' : 'items-center'} bg-[#E3EBDE] rounded-full px-3 py-1.5 shadow-[inset_2px_2px_0px_0px_rgba(83,83,83,0.25)] ${className}`}>
            {label && (
                <span
                    className={`text-[10px] font-medium text-gray-600 ${label ? 'w-1/3' : ''} ${multiline ? 'whitespace-normal' : 'truncate'} ${labelClassName}`}
                    title={label}
                >
                    {label}
                </span>
            )}
            {readOnly ? (
                <span
                    className={`text-xs text-gray-800 font-medium ${label ? 'w-2/3 pl-2' : 'w-full'} ${multiline ? 'whitespace-normal break-words' : 'truncate'} ${valueClassName}`}
                    title={value}
                >
                    {value}
                </span>
            ) : (
                multiline ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`text-xs text-gray-800 font-medium ${label ? 'w-2/3 pl-2' : 'w-full'} bg-transparent border-none outline-none focus:ring-0 resize-none h-full ${valueClassName}`}
                        title={value}
                    />
                ) : (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className={`text-xs text-gray-800 font-medium ${label ? 'w-2/3 pl-2' : 'w-full'} bg-transparent border-none outline-none focus:ring-0 ${valueClassName}`}
                        title={value}
                    />
                )
            )}
        </div>
    );
};

export default CustomTextBox;
