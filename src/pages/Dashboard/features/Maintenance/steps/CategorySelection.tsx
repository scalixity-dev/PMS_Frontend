import React from 'react';
import { Tv, Zap, Home, PaintBucket, Trees, Droplets, Check } from 'lucide-react';

interface CategorySelectionProps {
    selectedCategory: string | null;
    onSelect: (category: string) => void;
}

const categories = [
    {
        id: 'appliances',
        label: 'Appliances',
        description: 'Stove, dishwasher, fridge, heating & cooling',
        icon: Tv,
    },
    {
        id: 'electrical',
        label: 'Electrical',
        description: 'Lights, outlets, breakers, telephone systems',
        icon: Zap,
    },
    {
        id: 'exterior',
        label: 'Exterior',
        description: 'Roof, doors, windows, air conditioning',
        icon: Home,
    },
    {
        id: 'household',
        label: 'Household',
        description: 'Doors, windows, closets, flooring, pest control',
        icon: PaintBucket,
    },
    {
        id: 'outdoors',
        label: 'Outdoors',
        description: 'Landscaping, fencing, pool, porch, parking',
        icon: Trees,
    },
    {
        id: 'plumbing',
        label: 'Plumbing',
        description: 'Drains, faucets, pipes, pumps, sprinkler systems',
        icon: Droplets,
    },
];

const CategorySelection: React.FC<CategorySelectionProps> = ({ selectedCategory, onSelect }) => {
    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-2">What is this request about?</h2>
                <p className="text-gray-500">Start selecting the category to define the issue or use the smart search.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-[#F0F0F6] p-10 rounded-4xl">
                {categories.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    const Icon = category.icon;

                    return (
                        <div
                            key={category.id}
                            onClick={() => onSelect(category.id)}
                            className={`
                relative flex flex-col items-center justify-center p-6 rounded-3xl cursor-pointer transition-all duration-200 h-64
                ${isSelected
                                    ? 'bg-[#7BD747] text-white shadow-none'
                                    : 'bg-[#7BD747] text-white shadow-none opacity-80 hover:opacity-100' // Assuming base color is green from screenshot, but unselected might be different. 
                                // Wait, screenshot shows ALL are green. Selected has a checkmark. Unselected has a circle.
                                // Let's adjust.
                                }
              `}
                        // Actually, looking closely at the screenshot:
                        // All cards have a green background.
                        // Selected card (Appliances) has a checkmark in a white circle.
                        // Unselected cards have an empty white circle.
                        // The text is white on all cards.
                        >
                            {/* Selection Circle/Check */}
                            <div className="absolute top-4 left-4">
                                <div className={`
                  w-6 h-6 rounded-full border-2 border-white flex items-center justify-center
                  ${isSelected ? 'bg-white' : 'bg-transparent'}
                `}>
                                    {isSelected && <Check size={14} className="text-[#7BD747]" strokeWidth={4} />}
                                </div>
                            </div>

                            <Icon size={48} className="mb-4 text-white" strokeWidth={1.5} />

                            <h3 className="text-xl font-bold mb-2 text-center">{category.label}</h3>
                            <p className="text-sm text-center opacity-90 leading-relaxed px-2">
                                {category.description}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CategorySelection;
