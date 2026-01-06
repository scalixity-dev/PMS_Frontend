import React from 'react';
import { Check } from 'lucide-react';

interface FinalDetailsProps {
    selectedDetail: string | null;
    onSelect: (detail: string) => void;
    issue: string; // To filter details based on the selected issue
}

// Mock data mapping issues to final details
const detailsMap: Record<string, Array<{ id: string; label: string }>> = {
    temperature: [
        { id: 'too_cold', label: 'Too cold' },
        { id: 'not_getting_cold', label: 'Not getting cold' },
    ],
    light: [
        { id: 'not_working', label: 'Not working' },
        { id: 'dim_light', label: 'Dim light' },
    ],
    // Fallback/Default options for other issues
    default: [
        { id: 'broken', label: 'Broken' },
        { id: 'loose', label: 'Loose' },
        { id: 'other', label: 'Other' },
    ]
};

const FinalDetails: React.FC<FinalDetailsProps> = ({ selectedDetail, onSelect, issue }) => {
    const items = detailsMap[issue] || detailsMap['default'];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Add final details</h2>
                <p className="text-gray-500">Please select the option below.</p>
            </div>

            <div className="bg-[#F0F0F6] p-4 md:p-10 rounded-[2rem] min-h-[300px] flex flex-wrap content-start gap-3 md:gap-4 justify-center md:justify-start">
                {items.map((item) => {
                    const isSelected = selectedDetail === item.id;

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

export default FinalDetails;
