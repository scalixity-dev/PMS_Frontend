import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface SelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedItems: string[]) => void;
    title: string;
    subtitle: string;
    options: string[];
    initialSelected: string[];
}

const SelectionModal: React.FC<SelectionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    title,
    subtitle,
    options,
    initialSelected
}) => {
    const [selected, setSelected] = useState<string[]>(initialSelected);

    useEffect(() => {
        setSelected(initialSelected);
    }, [initialSelected, isOpen]);

    const toggleSelection = (item: string) => {
        if (selected.includes(item)) {
            setSelected(selected.filter(i => i !== item));
        } else {
            setSelected([...selected, item]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#F0F2F5] rounded-[2rem] p-8 w-full max-w-2xl shadow-xl relative">
                {/* Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#1A1A1A] mb-2">{title}</h2>
                    <p className="text-gray-500">{subtitle}</p>
                </div>

                {/* Options */}
                <div className="bg-white rounded-[2rem] p-8 min-h-[200px] mb-8 shadow-sm">
                    <div className="flex flex-wrap gap-3">
                        {options.map((option) => {
                            const isSelected = selected.includes(option);
                            return (
                                <button
                                    key={option}
                                    onClick={() => toggleSelection(option)}
                                    className={`
                                        px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all border
                                        ${isSelected
                                            ? 'bg-[#82D64D] text-white border-[#82D64D]'
                                            : 'bg-white text-[#1A1A1A] border-[#82D64D] hover:bg-gray-50'
                                        }
                                    `}
                                >
                                    {option}
                                    {!isSelected && <Plus className="w-4 h-4 text-[#1A1A1A]" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-8 py-3 rounded-lg text-sm font-bold bg-[#E0E0E0] text-gray-700 hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(selected)}
                        className="px-8 py-3 rounded-lg text-sm font-bold bg-[#3D7475] text-white hover:bg-[#366A6B] transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectionModal;
