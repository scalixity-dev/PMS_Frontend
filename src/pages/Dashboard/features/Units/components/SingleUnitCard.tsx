import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { UnitGroup } from './UnitGroupCard';
import CustomTextBox from '../../../components/CustomTextBox';
import { getStatusColor } from '../utils';
import { getCurrencySymbol } from '../../../../../utils/currency.utils';

interface SingleUnitCardProps {
    group: UnitGroup;
}

const SingleUnitCard: React.FC<SingleUnitCardProps> = ({ group }) => {
    const navigate = useNavigate();
    const currencySymbol = getCurrencySymbol(group.country);

    // Guard: Check if units array exists and has at least one unit
    if (!group.units || group.units.length === 0) {
        return null; // or return an empty state placeholder
    }

    const unit = group.units[0];
    const isOccupied = unit.status === 'Occupied';

    // Determine navigation based on property type
    // SINGLE properties should go to PropertyDetail, MULTI properties should go to UnitPropertyDetail
    const handleViewUnit = () => {
        if (group.propertyType === 'SINGLE') {
            // Navigate to property detail page for single unit properties
            navigate(`/dashboard/properties/${group.id}`);
        } else {
            // Navigate to unit detail page for multi-unit properties
            navigate(`/dashboard/units/${unit.id}?propertyId=${group.id}`);
        }
    };

    return (
        <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 mb-6 md:mb-8 shadow-lg">
            {/* Header Section */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2">
                <h3 className="text-base md:text-xl font-bold text-gray-800">{group.propertyName}</h3>
                <span className={`${getStatusColor(group.status)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                    {group.status}
                </span>
            </div>

            <CustomTextBox value={group.address} className="mb-4 md:mb-6 w-fit" valueClassName="text-xs md:text-sm" />

            <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                {/* Left Image */}
                <div className="w-full md:w-[300px] h-[160px] md:h-[220px] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex-shrink-0 bg-gray-100">
                    {unit.image ? (
                        <img
                            src={unit.image}
                            alt={unit.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                                <div className="text-gray-300 text-4xl mb-2">🏠</div>
                                <p className="text-gray-400 text-sm font-medium">No Image</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Green Box */}
                <div className="bg-[#82D64D] rounded-[1.5rem] md:rounded-[2.5rem] p-3 md:p-4 flex-1 flex flex-col justify-center gap-2 md:gap-3 text-white relative overflow-hidden min-h-[120px] md:min-h-[150px]">
                    {/* Row 1 */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                        <span className="text-base md:text-xl font-medium">{unit.name}</span>

                        <span className={`${isOccupied ? 'bg-[#3A6D6C] border-white' : 'bg-[#568f44] border-white/20'} text-white px-3 md:px-4 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-medium border`}>
                            {unit.status}
                        </span>

                        <span className="bg-[#FFF8E7] text-gray-800 px-3 md:px-6 py-1 md:py-1.5 rounded-full text-xs md:text-sm font-bold">
                            Rent - {currencySymbol}{unit.rent.toLocaleString()}.00
                        </span>

                        <div className="w-full md:w-auto md:ml-auto mt-2 md:mt-0">
                            {isOccupied || unit.hasActiveListing ? (
                                <div className="flex gap-2">
                                    {unit.hasActiveListing && (
                                        <button className="bg-[#5F6D7E] text-white px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors border border-white/30">
                                            Unlist
                                        </button>
                                    )}
                                    <button
                                        onClick={handleViewUnit}
                                        className="bg-[#3A6D6C] text-white px-6 py-1.5 rounded-md text-sm font-medium hover:bg-[#2c5251] transition-colors border border-white/30"
                                    >
                                        View Unit
                                    </button>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => navigate(`/dashboard/list-unit?propertyId=${group.id}${group.propertyType === 'MULTI' && unit.id !== group.id ? `&unitId=${unit.id}` : ''}`)}
                                        className="bg-[#5F6D7E] text-white px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors border border-white/30"
                                    >
                                        List
                                    </button>
                                    <button className="bg-[#5F6D7E] text-white px-6 py-1.5 rounded-full text-sm font-medium hover:bg-[#4a5563] transition-colors border border-white/30">
                                        Move in
                                    </button>
                                    <button
                                        onClick={handleViewUnit}
                                        className="bg-[#3A6D6C] text-white px-6 py-1.5 rounded-md text-sm font-medium hover:bg-[#2c5251] transition-colors border border-white/30"
                                    >
                                        View Unit
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Stats */}
                    <div className="flex flex-wrap items-center gap-2 md:gap-4">
                        {/* Beds */}
                        <div className="flex items-center gap-1 md:gap-2">
                            <div className="bg-white text-gray-800 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
                                {unit.beds}
                            </div>
                            <div className="bg-[#D1E2D1] text-gray-700 px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-medium min-w-[40px] md:min-w-[60px] text-center">
                                Beds
                            </div>
                        </div>

                        {/* Baths */}
                        <div className="flex items-center gap-1 md:gap-2">
                            <div className="bg-white text-gray-800 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm">
                                {unit.baths}
                            </div>
                            <div className="bg-[#D1E2D1] text-gray-700 px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-medium min-w-[40px] md:min-w-[60px] text-center">
                                Baths
                            </div>
                        </div>

                        {/* SqFt */}
                        <div className="flex items-center gap-1 md:gap-2">
                            <div className="bg-white text-gray-800 px-2 md:px-3 h-8 md:h-10 rounded-full flex items-center justify-center font-bold text-xs md:text-sm min-w-[40px] md:min-w-[60px]">
                                {unit.sqft}
                            </div>
                            <div className="bg-[#D1E2D1] text-gray-700 px-2 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-medium min-w-[40px] md:min-w-[60px] text-center">
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
