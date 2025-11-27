import React from 'react';
import { Check } from 'lucide-react';

interface PrioritySelectionProps {
    selectedPriority: string | null;
    onSelect: (priority: string) => void;
    onSubmit: () => void;
}

const priorities = [
    { id: 'low', label: 'Low', activeColor: 'bg-[#7BD747]', hoverColor: 'hover:bg-[#7BD747]' },
    { id: 'normal', label: 'Normal', activeColor: 'bg-[#3B82F6]', hoverColor: 'hover:bg-[#3B82F6]' },
    { id: 'high', label: 'High', activeColor: 'bg-[#F59E0B]', hoverColor: 'hover:bg-[#F59E0B]' },
    { id: 'critical', label: 'Critical', activeColor: 'bg-[#EF4444]', hoverColor: 'hover:bg-[#EF4444]' }
];

const PrioritySelection: React.FC<PrioritySelectionProps> = ({ selectedPriority, onSelect, onSubmit }) => {
    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Request priority</h2>
                <p className="text-gray-500">How urgent the issue is?</p>
            </div>

            <div className="w-full bg-[#F0F2F5] rounded-[2rem] p-8 space-y-4 mb-12">
                {priorities.map((priority) => (
                    <button
                        key={priority.id}
                        onClick={() => onSelect(priority.id)}
                        className={`
                            w-full py-4 px-6 rounded-full flex items-center gap-4 transition-all
                            ${selectedPriority === priority.id
                                ? `${priority.activeColor} text-white shadow-md`
                                : `bg-[#7BD747] text-white ${priority.hoverColor}`
                            }
                        `}
                    >
                        <div className={`
                            w-6 h-6 rounded-full border-2 border-white flex items-center justify-center
                        `}>
                            {selectedPriority === priority.id && <Check size={14} className="text-white" strokeWidth={3} />}
                        </div>
                        <span className="font-medium text-lg">{priority.label}</span>
                    </button>
                ))}
            </div>

            <button
                onClick={onSubmit}
                disabled={!selectedPriority}
                className={`
                    bg-[#3D7475] text-white px-12 py-3.5 rounded-lg font-bold text-lg transition-all shadow-lg
                    ${!selectedPriority ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
                `}
            >
                Create a Request
            </button>
        </div>
    );
};

export default PrioritySelection;
