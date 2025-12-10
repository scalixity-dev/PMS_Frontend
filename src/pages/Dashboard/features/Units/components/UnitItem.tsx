import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface Unit {
    id: string;
    name: string;
    type: string;
    status: 'Occupied' | 'Vacant';
    rent: number;
    beds: number;
    baths: number;
    sqft: number;
    image: string;
}

interface UnitItemProps {
    unit: Unit;
    propertyId: string;
}

const UnitItem: React.FC<UnitItemProps> = ({ unit, propertyId }) => {
    const navigate = useNavigate();
    const isOccupied = unit.status === 'Occupied';
    
    const handleViewUnit = () => {
        // Navigate to unit detail page
        navigate(`/dashboard/units/${unit.id}?propertyId=${propertyId}`);
    };

    return (
        <div className="bg-[#d9ebd3] rounded-[2rem] p-3 flex gap-2 min-w-[300px] shadow-lg border border-white/50">
            {/* Column 1: Image & Basic Info */}
            <div className="flex flex-col gap-2 w-36 flex-shrink-0">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800 text-base">{unit.name}</h4>
                </div>
                <span className="bg-white px-3 py-0.5 rounded-full text-[10px] font-medium text-gray-600 w-fit shadow-sm border border-gray-100">
                    {unit.type}
                </span>
                <div className="relative w-full h-24 rounded-xl overflow-hidden mt-1 bg-gray-100">
                    {unit.image ? (
                        <img
                            src={unit.image}
                            alt={unit.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                                <div className="text-gray-300 text-2xl mb-1">🏠</div>
                                <p className="text-gray-400 text-[8px] font-medium">No Image</p>
                            </div>
                        </div>
                    )}
                    <span className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold text-white ${isOccupied ? 'bg-[#82D64D]' : 'bg-[#9CA3AF]'}`}>
                        {unit.status}
                    </span>
                </div>
            </div>

            {/* Column 2: Rent & Stats */}
            <div className="flex flex-col gap-3 flex-1 justify-center">
                <div className="bg-[#4ad1a6] text-white px-4 py-1.5 rounded-full text-xs font-bold w-fit shadow-sm">
                    Rent - {unit.rent ? `₹${unit.rent.toLocaleString()}` : '-----'}
                </div>

                <div className="flex flex-col gap-2">
                    {/* Beds */}
                    <div className="flex items-center gap-2">
                        <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-gray-700 shadow-sm text-sm">
                            {unit.beds}
                        </div>
                        <div className="bg-white px-4 py-1 rounded-full text-[14px] font-semibold text-gray-600 shadow-sm min-w-[60px] text-center">
                            Beds
                        </div>
                    </div>
                    {/* Baths */}
                    <div className="flex items-center gap-2">
                        <div className="bg-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-gray-700 shadow-sm text-sm">
                            {unit.baths}
                        </div>
                        <div className="bg-white px-4 py-1 rounded-full text-[14px] font-semibold text-gray-600 shadow-sm min-w-[60px] text-center">
                            Baths
                        </div>
                    </div>
                    {/* SqFt */}
                    <div className="flex items-center gap-2">
                        <div className="bg-white px-2 h-8 rounded-lg flex items-center justify-center font-bold text-gray-700 shadow-sm min-w-[50px] text-sm">
                            {unit.sqft}
                        </div>
                        <div className="bg-white px-4 py-1 rounded-full text-[14px] font-semibold text-gray-600 shadow-sm min-w-[60px] text-center">
                            Sq.Ft
                        </div>
                    </div>
                </div>
            </div>

            {/* Column 3: Actions */}
            <div className="flex flex-col gap-2 justify-center w-22 mt-10">
                {!isOccupied && (
                    <button className="bg-[#82D64D] text-white w-full py-1.5 rounded-full text-xs font-bold hover:bg-[#72c042] transition-colors shadow-sm">
                        List
                    </button>
                )}
                {!isOccupied && (
                    <button className="bg-[#82D64D] text-white w-full py-1.5 rounded-full text-xs font-bold hover:bg-[#72c042] transition-colors shadow-sm">
                        Move in
                    </button>
                )}
                <button 
                    onClick={handleViewUnit}
                    className="bg-[#3A6D6C] text-white w-full py-1.5 rounded-md text-xs font-bold hover:bg-[#2c5251] transition-colors shadow-sm"
                >
                    View Unit
                </button>
            </div>
        </div>
    );
};

export default UnitItem;
