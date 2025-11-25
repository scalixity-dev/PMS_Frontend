import React from 'react';
import { Check } from 'lucide-react';

interface IssueDefinitionProps {
    selectedIssue: string | null;
    onSelect: (issue: string) => void;
    subCategory: string; // To potentially filter issues
}

// Mock data mapping sub-categories to issues
// For now, we'll just implement the ones from the screenshot (Refrigerator)
const issuesMap: Record<string, Array<{ id: string; label: string }>> = {
    refrigerator: [
        { id: 'temperature', label: 'Temperature' },
        { id: 'freezer', label: 'Freezer' },
        { id: 'shelves', label: 'Shelves' },
        { id: 'light', label: 'Light' },
        { id: 'handle', label: 'Handle' },
    ],
    // Fallback
    default: [
        { id: 'other', label: 'Other' },
    ]
};

const IssueDefinition: React.FC<IssueDefinitionProps> = ({ selectedIssue, onSelect, subCategory }) => {
    const items = issuesMap[subCategory] || issuesMap['refrigerator']; // Default to refrigerator for demo/screenshot match

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Define the problem</h2>
                <p className="text-gray-500">Please select the option below.</p>
            </div>

            <div className="bg-[#F0F0F6] p-10 rounded-[2rem] min-h-[300px] flex flex-wrap content-start gap-4">
                {items.map((item) => {
                    const isSelected = selectedIssue === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 font-medium
                ${isSelected
                                    ? 'bg-[#7BD747] text-white shadow-sm'
                                    : 'bg-[#7BD747] text-white opacity-80 hover:opacity-100'
                                }
              `}
                        >
                            <div className={`
                w-5 h-5 rounded-full border-2 border-white flex items-center justify-center
                ${isSelected ? 'bg-white' : 'bg-transparent'}
              `}>
                                {isSelected && <Check size={12} className="text-[#7BD747]" strokeWidth={4} />}
                            </div>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default IssueDefinition;
