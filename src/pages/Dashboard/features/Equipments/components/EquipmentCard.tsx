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
        <div className="bg-[#F6F6F8] rounded-[2rem] p-4 shadow-sm flex gap-4 items-center">
            {/* Image Section */}
            <div className="w-48 h-32 flex-shrink-0">
                <img
                    src={image}
                    alt={propertyName}
                    className="w-full h-full object-cover rounded-2xl"
                />
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col h-full justify-between py-1">
                <div>
                    <h3 className="text-base font-bold text-gray-800 leading-tight">{propertyName}</h3>
                    <p className="text-xs text-gray-600 mb-3">{category}</p>

                    <div className="inline-block bg-[#D1D1D1] text-gray-700 text-xs px-6 py-1 rounded-full font-medium mb-3">
                        {unit}
                    </div>
                </div>

                <button className="w-fit bg-[#82D64D] text-white px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#72c042] transition-colors">
                    View Equipments
                </button>
            </div>
        </div>
    );
};

export default EquipmentCard;
