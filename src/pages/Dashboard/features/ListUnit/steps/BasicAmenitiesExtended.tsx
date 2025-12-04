import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface BasicAmenitiesExtendedProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const BasicAmenitiesExtended: React.FC<BasicAmenitiesExtendedProps> = ({ data, updateData }) => {
    // Initialize extendedAmenities if it doesn't exist
    const selectedAmenities = data.extendedAmenities || [];
    const [customAmenityInput, setCustomAmenityInput] = useState('');

    // Helper function to get unique amenities array (idempotent deduplication)
    const getUniqueAmenities = (amenities: string[]): string[] => {
        return Array.from(new Set(amenities.filter(Boolean)));
    };

    // Get latest amenities from data to avoid stale closure issues
    const getLatestAmenities = (): string[] => {
        return getUniqueAmenities(data.extendedAmenities || []);
    };

    const toggleAmenity = (amenity: string) => {
        const currentAmenities = getLatestAmenities();
        const newAmenities = currentAmenities.includes(amenity)
            ? currentAmenities.filter((a: string) => a !== amenity)
            : [...currentAmenities, amenity];
        updateData('extendedAmenities', getUniqueAmenities(newAmenities));
    };

    const addCustomAmenity = () => {
        const trimmedInput = customAmenityInput.trim();
        if (!trimmedInput) return;
        
        // Read latest amenities to avoid stale closure
        const currentAmenities = getLatestAmenities();
        
        // Idempotent: deduplicate before adding
        if (!currentAmenities.includes(trimmedInput)) {
            const newAmenities = getUniqueAmenities([...currentAmenities, trimmedInput]);
            updateData('extendedAmenities', newAmenities);
            setCustomAmenityInput('');
        }
    };

    const removeCustomAmenity = (amenity: string) => {
        // Read latest amenities to avoid stale closure
        const currentAmenities = getLatestAmenities();
        const newAmenities = getUniqueAmenities(
            currentAmenities.filter((a: string) => a !== amenity)
        );
        updateData('extendedAmenities', newAmenities);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCustomAmenity();
        }
    };

    const amenitiesList = [
        "Play Ground",
        "Tennis Court",
        "Game Room",
        "Theater Room",
        "Near Park",
        "Elevator",
        "Swimming Pool",
        "Gym"
    ];

    // Separate predefined and custom amenities
    const predefinedAmenities = amenitiesList;
    const customAmenities = selectedAmenities.filter((amenity: string) => !amenitiesList.includes(amenity));

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Basic amenities</h2>
                <p className="text-[var(--color-subheading)]">Select the property amenities below.</p>
            </div>

            <div className="bg-[#F0F2F5] p-8 rounded-[30px] w-full max-w-4xl shadow-sm space-y-6">
                {/* Predefined Amenities */}
                <div className="flex flex-wrap gap-4">
                    {predefinedAmenities.map((amenity) => {
                        const isSelected = selectedAmenities.includes(amenity);
                        return (
                            <button
                                key={amenity}
                                onClick={() => toggleAmenity(amenity)}
                                className={`
                                    px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                                    ${isSelected
                                        ? 'bg-[#76C043] text-white shadow-md'
                                        : 'bg-white text-gray-700 border-2 border-[#76C043] hover:bg-gray-50'
                                    }
                                `}
                            >
                                {amenity}
                                {!isSelected && (
                                    <span className="text-xl leading-none font-light text-[#76C043]">+</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Custom Amenities Section */}
                <div className="border-t border-gray-300 pt-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Add Custom Amenity
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={customAmenityInput}
                                onChange={(e) => setCustomAmenityInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Enter custom amenity name"
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#76C043]/20 focus:border-[#76C043] bg-white text-gray-900 placeholder-gray-400"
                            />
                            <button
                                onClick={addCustomAmenity}
                                disabled={!customAmenityInput.trim() || selectedAmenities.includes(customAmenityInput.trim())}
                                className="px-6 py-2.5 bg-[#76C043] text-white rounded-lg font-medium hover:bg-[#65a838] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                <Plus size={18} />
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Display Custom Amenities */}
                    {customAmenities.length > 0 && (
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-3">Custom Amenities:</p>
                            <div className="flex flex-wrap gap-4">
                                {customAmenities.map((amenity: string) => (
                                    <div
                                        key={amenity}
                                        className="px-6 py-3 rounded-full text-sm font-medium bg-[#76C043] text-white shadow-md flex items-center gap-2"
                                    >
                                        <span>{amenity}</span>
                                        <button
                                            onClick={() => removeCustomAmenity(amenity)}
                                            className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                            aria-label={`Remove ${amenity}`}
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BasicAmenitiesExtended;
