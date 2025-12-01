import React from 'react';

interface EquipmentCardProps {
    image: string;
    propertyName: string;
    category: string;
    unit: string;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({
    image,
    propertyName,
    category,
    unit
}) => {
    return (
        <div className="bg-[#F6F6F8] rounded-[2rem] p-4 shadow-sm flex flex-col gap-4">
            {/* Image Section */}
            <div className="w-full h-48 flex-shrink-0">
                <img
                    src={image}
                    alt={propertyName}
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-base font-bold text-gray-800 leading-tight">{propertyName}</h3>
                    <p className="text-xs text-gray-600 mb-3">{category}</p>

                    <div className="inline-block bg-[#D1D1D1] text-gray-700 text-xs px-6 py-1 rounded-full font-medium mb-3">
                        {unit}
                    </div>
                </div>

                <button className="w-full bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#72c042] transition-colors">
                    View Equipments
                </button>
            </div>
        </div>
    );
};

export default EquipmentCard;
