import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DropdownOption {
  value: string;
  label: string;
}

interface CustomDropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  textClassName?: string;
  buttonClassName?: string;
  dropdownClassName?: string;
  optionClassName?: string;
  iconClassName?: string;
  searchable?: boolean;
  error?: string | boolean;
  className?: string;
  onToggle?: (isOpen: boolean) => void;
  isOpen?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  buttonClassName = '',
  textClassName = '',
  dropdownClassName = '',
  optionClassName = '',
  iconClassName = '',
  searchable = false,
  error,
  className,
  onToggle,
  isOpen: controlledIsOpen,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // Filter options based on search query
  const filteredOptions = searchable && searchQuery
    ? options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : options;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (!isControlled) setInternalIsOpen(false);
        setSearchQuery('');
        onToggle?.(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    if (!isControlled) setInternalIsOpen(false);
    setSearchQuery('');
    onToggle?.(false);
  };

  const handleOpen = () => {
    if (!disabled) {
      const newState = !isOpen;
      if (!isControlled) setInternalIsOpen(newState);
      onToggle?.(newState);
      if (!newState) {
        setSearchQuery('');
      }
    }
  };

  return (
    <div className={cn("w-full relative", className)} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}{required && '*'}
        </label>
      )}

      {/* Dropdown Trigger */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2.5 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all",
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : "border-gray-300 hover:border-[var(--color-primary)]",
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          buttonClassName
        )}
      >
        <span className={`${selectedOption ? 'text-gray-900' : 'text-gray-400'} ${textClassName}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={20}
          className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''} ${iconClassName}`}
        />
      </button>

      {/* Dropdown Menu */}
      <div className={cn(
        "absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 ease-in-out",
        isOpen && !disabled ? "max-h-60 opacity-100 mt-2 visible" : "max-h-0 opacity-0 mt-0 invisible border-none",
        dropdownClassName
      )}>
        {/* Search Input */}
        {searchable && (
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] text-sm"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

        {/* Options List */}
        <div className="max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 text-left ${optionClassName}`}
              >
                <span className="text-base sm:text-sm text-gray-900">{option.label}</span>
                {value === option.value && (
                  <Check size={16} className="text-[var(--color-primary)]" />
                )}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;
