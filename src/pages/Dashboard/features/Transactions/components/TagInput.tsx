import React, { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
	value: string[];
	onChange: (tags: string[]) => void;
	placeholder?: string;
	suggestions?: string[];
	className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
	value = [],
	onChange,
	placeholder = 'Type and press Enter to add tags',
	suggestions = [],
	className = '',
}) => {
	const [inputValue, setInputValue] = useState('');
	const [showSuggestions, setShowSuggestions] = useState(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Filter suggestions based on input
	const filteredSuggestions = suggestions.filter(
		(suggestion) =>
			suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
			!value.includes(suggestion)
	);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setShowSuggestions(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setInputValue(val);
		setShowSuggestions(val.length > 0 && filteredSuggestions.length > 0);
	};

	const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter' && inputValue.trim()) {
			e.preventDefault();
			addTag(inputValue.trim());
		} else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
			// Remove last tag when backspace is pressed on empty input
			removeTag(value.length - 1);
		} else if (e.key === 'Escape') {
			setShowSuggestions(false);
		}
	};

	const addTag = (tag: string) => {
		if (tag && !value.includes(tag)) {
			onChange([...value, tag]);
			setInputValue('');
			setShowSuggestions(false);
		}
	};

	const removeTag = (index: number) => {
		onChange(value.filter((_, i) => i !== index));
	};

	const handleSuggestionClick = (suggestion: string) => {
		addTag(suggestion);
	};

	return (
		<div ref={containerRef} className={`relative ${className}`}>
			{/* Tags Container */}
			<div
				className="w-full min-h-[48px] rounded-md bg-white px-3 py-2 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-[#84CC16]/20 focus-within:border-[#84CC16] transition-all flex flex-wrap gap-2 items-center cursor-text"
				onClick={() => inputRef.current?.focus()}
			>
				{/* Existing Tags */}
				{value.map((tag, index) => (
					<span
						key={index}
						className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#84CC16]/10 text-[#84CC16] text-sm font-medium rounded-full"
					>
						{tag}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation();
								removeTag(index);
							}}
							className="hover:bg-[#84CC16]/20 rounded-full p-0.5 transition-colors"
							aria-label={`Remove ${tag}`}
						>
							<X className="w-3 h-3" />
						</button>
					</span>
				))}

				{/* Input */}
				<input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onKeyDown={handleInputKeyDown}
					onFocus={() => {
						if (inputValue && filteredSuggestions.length > 0) {
							setShowSuggestions(true);
						}
					}}
					placeholder={value.length === 0 ? placeholder : ''}
					className="flex-1 min-w-[120px] outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
				/>
			</div>

			{/* Suggestions Dropdown */}
			{showSuggestions && filteredSuggestions.length > 0 && (
				<div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-48 overflow-y-auto">
					{filteredSuggestions.map((suggestion, index) => (
						<button
							key={index}
							type="button"
							onClick={() => handleSuggestionClick(suggestion)}
							className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
						>
							<Plus className="w-4 h-4 text-gray-400" />
							<span>{suggestion}</span>
						</button>
					))}
				</div>
			)}
		</div>
	);
};

export default TagInput;
