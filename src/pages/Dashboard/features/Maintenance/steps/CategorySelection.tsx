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
            <div className="text-center mb-6 md:mb-8">
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-2">What is this request about?</h2>
                <p className="text-sm md:text-base text-gray-500 max-w-md mx-auto">Start selecting the category to define the issue or use the smart search.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 bg-[#F0F0F6] p-4 md:p-10 rounded-[1.5rem] md:rounded-4xl">
                {categories.map((category) => {
                    const isSelected = selectedCategory === category.id;
                    const Icon = category.icon;

                    return (
                        <div
                            key={category.id}
                            onClick={() => onSelect(category.id)}
                            className={`
                relative flex flex-col items-center justify-center p-3 md:p-6 rounded-2xl md:rounded-3xl cursor-pointer transition-all duration-200 aspect-[4/5] md:aspect-auto md:h-64
                ${isSelected
                                    ? 'bg-[#7BD747] text-white shadow-none ring-2 ring-[#7BD747] ring-offset-2'
                                    : 'bg-[#7BD747] text-white shadow-none opacity-90 hover:opacity-100'
                                }
              `}
                        >
                            {/* Selection Circle/Check */}
                            <div className="absolute top-2 left-2 md:top-4 md:left-4">
                                <div className={`
                  w-5 h-5 md:w-6 md:h-6 rounded-full border-2 border-white flex items-center justify-center transition-transform duration-200
                  ${isSelected ? 'bg-white scale-110' : 'bg-transparent'}
                `}>
                                    {isSelected && <Check size={12} className=" md:w-3.5 md:h-3.5 text-[#7BD747]" strokeWidth={4} />}
                                </div>
                            </div>

                            <Icon className="mb-2 md:mb-4 text-white w-8 h-8 md:w-12 md:h-12" strokeWidth={1.5} />

                            <h3 className="text-sm md:text-xl font-bold mb-1 md:mb-2 text-center leading-tight">{category.label}</h3>
                            <p className="text-[10px] md:text-sm text-center opacity-90 leading-relaxed px-1 hidden md:block">
                                {category.description}
                            </p>
                            {/* Mobile simplified description or just label? Keeping simplified text for mobile if needed, or hiding description to save space as icons + label are usually enough for "quick" selection, but description adds context. 
                            Let's show description on mobile but very small, or hide it if it clutter.
                            Decided to HIDE description on very small screens to keep it clean (Reviewers often prefer cleaner mobile UI). 
                            Actually, let's show it but clamp lines.
                            */}
                            <p className="text-[10px] text-center opacity-90 leading-tight px-1 md:hidden line-clamp-2">
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
