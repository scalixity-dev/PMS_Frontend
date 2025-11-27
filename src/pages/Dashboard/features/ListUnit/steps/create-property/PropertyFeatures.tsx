import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface PropertyFeaturesProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const PropertyFeatures: React.FC<PropertyFeaturesProps> = ({ data, updateData }) => {
    const [customFeatureInput, setCustomFeatureInput] = useState('');
    const [showCustomInput, setShowCustomInput] = useState(false);

    const defaultFeatures = [
        'Furnished',
        'Hardwood Floor',
        'Renovated',
        'Fire place',
        'Internet',
        'Carpet',
        'Storage'
    ];

    const selectedFeatures = data.features || [];
    // Combine default features with custom features (those not in default list)
    const customFeatures = selectedFeatures.filter((f: string) => !defaultFeatures.includes(f));
    const allFeatures = [...defaultFeatures, ...customFeatures];

    const toggleFeature = (feature: string) => {
        if (selectedFeatures.includes(feature)) {
            updateData('features', selectedFeatures.filter((f: string) => f !== feature));
        } else {
            updateData('features', [...selectedFeatures, feature]);
        }
    };

    const handleAddCustomFeature = () => {
        const trimmedFeature = customFeatureInput.trim();
        if (trimmedFeature && !selectedFeatures.includes(trimmedFeature)) {
            updateData('features', [...selectedFeatures, trimmedFeature]);
            setCustomFeatureInput('');
            setShowCustomInput(false);
        }
    };

    const handleRemoveCustomFeature = (feature: string) => {
        updateData('features', selectedFeatures.filter((f: string) => f !== feature));
    };

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Property features</h2>
                <p className="text-[var(--color-subheading)]">Select the property features below.</p>
            </div>

            <div className="w-full max-w-3xl bg-[#F3F4F6] p-8 rounded-3xl min-h-[300px]">
                <div className="flex flex-wrap gap-4">
                    {allFeatures.map((feature) => {
                        const isSelected = selectedFeatures.includes(feature);
                        const isCustom = customFeatures.includes(feature);
                        return (
                            <div key={feature} className="relative group">
                                <button
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
                                    {isSelected ? null : (
                                        <Plus size={18} className="text-gray-400" />
                                    )}
                                </button>
                                {isCustom && isSelected && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveCustomFeature(feature);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        title="Remove custom feature"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    
                    {/* Custom Feature Input */}
                    {showCustomInput ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={customFeatureInput}
                                onChange={(e) => setCustomFeatureInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleAddCustomFeature();
                                    }
                                }}
                                placeholder="Enter feature name"
                                className="px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#86D24A] focus:border-[#86D24A]"
                                autoFocus
                            />
                            <button
                                onClick={handleAddCustomFeature}
                                className="px-4 py-3 bg-[#86D24A] text-white rounded-full font-medium hover:bg-[#76C043] transition-colors"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => {
                                    setShowCustomInput(false);
                                    setCustomFeatureInput('');
                                }}
                                className="px-4 py-3 bg-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-400 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowCustomInput(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all bg-white text-gray-700 border-2 border-dashed border-gray-300 hover:border-[#86D24A] hover:text-[#86D24A]"
                        >
                            <Plus size={18} />
                            Add Custom Feature
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PropertyFeatures;
