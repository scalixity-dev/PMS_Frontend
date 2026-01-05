import React from 'react';
import { Check } from 'lucide-react';

interface SubCategorySelectionProps {
    selectedSubCategory: string | null;
    onSelect: (subCategory: string) => void;
    category: string; // To potentially filter sub-categories
}

// Mock data mapping categories to sub-categories
const subCategoriesMap: Record<string, Array<{ id: string; label: string }>> = {
    appliances: [
        { id: 'refrigerator', label: 'Refrigerator' },
        { id: 'dishwasher', label: 'Dishwasher' },
        { id: 'oven_stove', label: 'Oven / Stove' },
        { id: 'laundry', label: 'Laundry' },
        { id: 'water_heater', label: 'Water Heater' },
        { id: 'cooling', label: 'Cooling' },
    ],
    electrical: [
        { id: 'outlet', label: 'Outlet' },
        { id: 'lighting', label: 'Lighting' },
        { id: 'circuit_breaker', label: 'Circuit Breaker' },
        { id: 'wiring', label: 'Wiring' },
        { id: 'switches', label: 'Switches' },
    ],
    exterior: [
        { id: 'roof', label: 'Roof' },
        { id: 'doors', label: 'Doors' },
        { id: 'windows', label: 'Windows' },
        { id: 'siding', label: 'Siding' },
        { id: 'gutters', label: 'Gutters' },
    ],
    household: [
        { id: 'doors_interior', label: 'Doors' },
        { id: 'windows_interior', label: 'Windows' },
        { id: 'closets', label: 'Closets' },
        { id: 'flooring', label: 'Flooring' },
        { id: 'pest_control', label: 'Pest Control' },
    ],
    outdoors: [
        { id: 'landscaping', label: 'Landscaping' },
        { id: 'fencing', label: 'Fencing' },
        { id: 'pool', label: 'Pool' },
        { id: 'porch', label: 'Porch' },
        { id: 'parking', label: 'Parking' },
    ],
    plumbing: [
        { id: 'sink', label: 'Sink' },
        { id: 'toilet', label: 'Toilet' },
        { id: 'shower', label: 'Shower / Bath' },
        { id: 'pipes', label: 'Pipes' },
        { id: 'faucets', label: 'Faucets' },
        { id: 'drains', label: 'Drains' },
    ],
    // Fallback for other categories if selected
    default: [
        { id: 'other', label: 'Other' },
    ]
};

const SubCategorySelection: React.FC<SubCategorySelectionProps> = ({ selectedSubCategory, onSelect, category }) => {
    const items = subCategoriesMap[category] || subCategoriesMap['default'];

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Please specify the request</h2>
                <p className="text-gray-500">Select the sub-category of the issue below.</p>
            </div>

            <div className="bg-[#F0F0F6] p-4 md:p-10 rounded-[2rem] min-h-[300px] flex flex-wrap content-start gap-3 md:gap-4 justify-center md:justify-start">
                {items.map((item) => {
                    const isSelected = selectedSubCategory === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onSelect(item.id)}
                            className={`
                flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-200 font-medium
                ${isSelected
                                    ? 'bg-[#7BD747] text-white shadow-sm'
                                    : 'bg-[#7BD747] text-white opacity-80 hover:opacity-100' // Matching the green pill style
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

export default SubCategorySelection;
