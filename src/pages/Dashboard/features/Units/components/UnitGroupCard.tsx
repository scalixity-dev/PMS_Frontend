import React from 'react';
import UnitItem, { type Unit } from './UnitItem';
import CustomTextBox from '../../../components/CustomTextBox';
import { getStatusColor } from '../utils';

export interface UnitGroup {
    id: string;
    propertyName: string;
    address: string;
    image: string;
    status: 'Occupied' | 'Vacant' | 'Partially Occupied';
    units: Unit[];
    propertyType?: 'SINGLE' | 'MULTI';
    country?: string;
}

interface UnitGroupCardProps {
    group: UnitGroup;
}

const UnitGroupCard: React.FC<UnitGroupCardProps> = ({ group }) => {
    const unitsPerRow = 2;
    const rows: Unit[][] = [];

    // Split units into rows of 2
    for (let i = 0; i < group.units.length; i += unitsPerRow) {
        rows.push(group.units.slice(i, i + unitsPerRow));
    }

    return (
        <div className="bg-[#F0F0F6] rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-6 mb-6 md:mb-8 shadow-lg overflow-x-auto">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={`flex items-center min-w-max ${rowIndex === 0 ? '' : 'mb-8 md:mb-12'} ${rowIndex === rows.length - 1 ? '' : ''}`}>
                    {/* Property Card Section - Only show on first row */}
                    {rowIndex === 0 && (
                        <div className="rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 shadow-lg w-[220px] md:w-[280px] flex-shrink-0 relative z-10">
                            <div className="flex justify-between items-start mb-2 md:mb-3">
                                <h3 className="text-sm md:text-base font-bold text-gray-800 line-clamp-2">{group.propertyName}</h3>
                            </div>

                            <CustomTextBox value={group.address} className="mb-3 md:mb-4 w-fit" valueClassName="!text-[10px] md:!text-xs" />

                            <div className="relative h-28 w-28 md:h-40 md:w-40 rounded-xl md:rounded-2xl overflow-hidden bg-gray-100">
                                {group.image ? (
                                    <img
                                        src={group.image}
                                        alt={group.propertyName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                        <div className="text-center">
                                            <div className="text-gray-300 text-3xl mb-1">🏠</div>
                                            <p className="text-gray-400 text-[10px] font-medium">No Image</p>
                                        </div>
                                    </div>
                                )}
                                <div className={`absolute top-2 right-2 md:top-3 md:right-3 ${getStatusColor(group.status)} text-white text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 rounded-full font-medium`}>
                                    {group.status}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Spacer for subsequent rows to align with first row */}
                    {rowIndex > 0 && (
                        <div className="flex-shrink-0 w-[220px] md:w-[280px]"></div>
                    )}

                    {/* Units List with Connectors */}
                    {row.map((unit, unitIndex) => {
                        const globalIndex = rowIndex * unitsPerRow + unitIndex;
                        return (
                            <div key={unit.id} className="flex items-center">
                                {/* Connector Line */}
                                <div className="flex items-center">
                                    <div className="h-[2px] w-4 md:w-6 bg-gray-400"></div>
                                    <div className="h-[2px] w-3 md:w-4 bg-gray-400"></div>
                                </div>

                                {/* Unit Item with Index */}
                                <div className="relative">
                                    <div className="absolute -left-4 md:-left-5 top-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-xs md:text-sm font-bold z-20 border-2 md:border-4 border-[#F0F0F6]">
                                        {globalIndex + 1}
                                    </div>
                                    <UnitItem unit={unit} propertyId={group.id} country={group.country} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};

export default UnitGroupCard;
