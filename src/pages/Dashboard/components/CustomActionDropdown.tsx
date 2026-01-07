import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionOption {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

interface CustomActionDropdownProps {
  buttonLabel: string;
  options: ActionOption[];
  buttonClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  disabled?: boolean;
}

const CustomActionDropdown: React.FC<CustomActionDropdownProps> = ({
  buttonLabel,
  options,
  buttonClassName = '',
  dropdownClassName = '',
  optionClassName = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: ActionOption) => {
    option.onClick();
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "px-6 py-2.5 bg-[var(--dashboard-accent)] hover:opacity-90 rounded-lg font-bold text-white flex items-center gap-2 transition-all border-[0.92px] border-white shadow-[0px_3.68px_3.68px_0px_#00000040]",
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          buttonClassName
        )}
      >
        <span>{buttonLabel}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className={cn(
          "absolute top-full right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-xl z-40 py-1 animate-in fade-in slide-in-from-top-2 duration-200",
          dropdownClassName
        )}>
          <div className="max-h-60 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-1">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-sm transition-all rounded-lg hover:bg-gray-50 text-gray-700 font-medium flex items-center gap-2",
                  optionClassName
                )}
              >
                {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomActionDropdown;

