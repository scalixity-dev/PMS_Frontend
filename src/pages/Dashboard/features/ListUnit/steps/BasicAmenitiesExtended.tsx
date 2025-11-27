import React from 'react';

interface BasicAmenitiesExtendedProps {
    data: any;
    updateData: (key: string, value: any) => void;
}

const BasicAmenitiesExtended: React.FC<BasicAmenitiesExtendedProps> = ({ data, updateData }) => {
    // Initialize extendedAmenities if it doesn't exist
    const selectedAmenities = data.extendedAmenities || [];

    const toggleAmenity = (amenity: string) => {
        const newAmenities = selectedAmenities.includes(amenity)
            ? selectedAmenities.filter((a: string) => a !== amenity)
            : [...selectedAmenities, amenity];
        updateData('extendedAmenities', newAmenities);
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

    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Basic amenities</h2>
                <p className="text-[var(--color-subheading)]">Select the property amenities below.</p>
            </div>

            <div className="bg-[#F0F2F5] p-8 rounded-[30px] w-full max-w-4xl shadow-sm">
                <div className="flex flex-wrap gap-4">
                    {amenitiesList.map((amenity) => {
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
            </div>
        </div>
    );
};

export default BasicAmenitiesExtended;
