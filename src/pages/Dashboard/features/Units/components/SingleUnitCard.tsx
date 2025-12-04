import React from 'react';
import type { UnitGroup } from './UnitGroupCard';
import CustomTextBox from '../../../components/CustomTextBox';

interface SingleUnitCardProps {
    group: UnitGroup;
}

const SingleUnitCard: React.FC<SingleUnitCardProps> = ({ group }) => {
    // Guard: Check if units array exists and has at least one unit
    if (!group.units || group.units.length === 0) {
        return null; // or return an empty state placeholder
    }

    const unit = group.units[0];
    const isOccupied = unit.status === 'Occupied';

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Occupied': return 'bg-[#82D64D]';
            case 'Vacant': return 'bg-gray-500';
            case 'Partially Occupied': return 'bg-[#FDB022]';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className="bg-[#F0F0F6] rounded-[2.5rem] p-6 mb-8 shadow-lg">
            {/* Header Section */}
            <div className="flex items-center gap-4 mb-2">
                <h3 className="text-xl font-bold text-gray-800">{group.propertyName}</h3>
                <span className={`${getStatusColor(group.status)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                    {group.status}
                </span>
            </div>

            <CustomTextBox value={group.address} className="mb-6 w-fit" />

            <div className="flex gap-6 items-center">
                {/* Left Image */}
                <div className="w-[300px] h-[220px] rounded-[2rem] overflow-hidden flex-shrink-0">
                    <img
                        src={group.image}
                        alt={group.propertyName}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right Green Box */}
                <div className="bg-[#82D64D] rounded-[2.5rem] p-4 flex-1 flex flex-col justify-center gap-3 text-white relative overflow-hidden h-[150px]">
                    {/* Row 1 */}
                    <div className="flex items-center gap-4 flex-wrap">
                        <span className="text-xl font-medium">{unit.name}</span>

                        <span className={`${isOccupied ? 'bg-[#3A6D6C] border-white' : 'bg-[#568f44] border-white/20'} text-white px-4 py-1.5 rounded-full text-sm font-medium border`}>
                            {unit.status}
                        </span>

                        <span className="bg-[#FFF8E7] text-gray-800 px-6 py-1.5 rounded-full text-sm font-bold">
                            Rent - ₹{unit.rent.toLocaleString()}.00
                        </span>

                        <div className="ml-auto">
                            {isOccupied ? (
                                <button className="bg-[#5F6D7E] text-white px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors border border-white/30">
                                    Unlist
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button className="bg-[#5F6D7E] text-white px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors border border-white/30">
                                        List
                                    </button>
                                    <button className="bg-[#5F6D7E] text-white px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors border border-white/30">
                                        Move in
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Stats */}
                    <div className="flex items-center gap-4">
                        {/* Beds */}
                        <div className="flex items-center gap-2">
                            <div className="bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                                {unit.beds}
                            </div>
                            <div className="bg-[#D1E2D1] text-gray-700 px-4 py-2 rounded-full text-xs font-medium min-w-[60px] text-center">
                                Beds
                            </div>
                        </div>

                        {/* Baths */}
                        <div className="flex items-center gap-2">
                            <div className="bg-white text-gray-800 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
                                {unit.baths}
                            </div>
                            <div className="bg-[#D1E2D1] text-gray-700 px-4 py-2 rounded-full text-xs font-medium min-w-[60px] text-center">
                                Baths
                            </div>
                        </div>

                        {/* SqFt */}
                        <div className="flex items-center gap-2">
                            <div className="bg-white text-gray-800 px-3 h-10 rounded-full flex items-center justify-center font-bold text-sm min-w-[60px]">
                                {unit.sqft}
                            </div>
                            <div className="bg-[#D1E2D1] text-gray-700 px-4 py-2 rounded-full text-xs font-medium min-w-[60px] text-center">
                                Sq.Ft
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SingleUnitCard;
