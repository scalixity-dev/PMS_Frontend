import React from 'react';
import { Plus } from 'lucide-react';

interface PropertyFeaturesProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ data, updateData }) => {
    const features = [
        'Furnished',
        'Hardwood Floor',
        'Renovated',
        'Fire place',
        'Internet',
        'Carpet',
        'Storage'
    ];

    const selectedFeatures = data.features || [];

    const toggleFeature = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            updateData('features', selectedFeatures.filter((f: string) => f !== feature));
        } else {
            updateData('features', [...selectedFeatures, feature]);
        }
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Property features</h2>
                <p className="text-[var(--color-subheading)]">Select the property features below.</p>
            </div>

            <div className="w-full max-w-3xl bg-[#F3F4F6] p-8 rounded-3xl min-h-[300px]">
                <div className="flex flex-wrap gap-4">
                    {features.map((feature) => {
                        const isSelected = selectedFeatures.includes(feature);
                        return (
                            <button
                                key={feature}
                                onClick={() => toggleFeature(feature)}
                                className={`
                  flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all
                  ${isSelected
                                        ? 'bg-[#86D24A] text-white shadow-sm'
                                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#86D24A] hover:text-[#86D24A]'
                                    }
                `}
                            >
                                {feature}
                                {isSelected ? (
                                    // No icon needed for selected state based on design, but keeping structure if needed
                                    // Or maybe a checkmark? Design shows just color change.
                                    // Actually design shows a Plus icon for unselected and nothing for selected?
                                    // Let's look at the screenshot again.
                                    // Screenshot shows:
                                    // Selected (Green): "Furnished", "Hardwood Floor", "Internet", "Carpet", "Storage" - No icon
                                    // Unselected (White): "Renovated (+)", "Fire place (+)"
                                    // So unselected has (+), selected has no icon.
                                    null
                                ) : (
                                    <Plus size={18} className="text-gray-400" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default PropertyFeatures;
