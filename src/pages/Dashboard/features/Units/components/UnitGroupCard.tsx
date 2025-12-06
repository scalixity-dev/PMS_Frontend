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

    // Calculate the width of the property card + first connector line
    const propertyCardWidth = 280; // Fixed width for alignment
    const offsetWidth = propertyCardWidth; // Spacer should match property card width exactly

    return (
        <div className="bg-[#F0F0F6] rounded-[2.5rem] p-6 mb-8 shadow-lg">
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className={`flex items-center min-w-max ${rowIndex === 0 ? '' : 'mb-12'} ${rowIndex === rows.length - 1 ? '' : ''}`}>
                    {/* Property Card Section - Only show on first row */}
                    {rowIndex === 0 && (
                        <div className="rounded-[2rem] p-4 shadow-lg w-[280px] flex-shrink-0 relative z-10">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-base font-bold text-gray-800">{group.propertyName}</h3>
                            </div>

                            <CustomTextBox value={group.address} className="mb-4 w-fit" valueClassName="!text-xs" />

                            <div className="relative h-40 w-40 rounded-2xl overflow-hidden">
                                <img
                                    src={group.image}
                                    alt={group.propertyName}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute top-3 right-3 ${getStatusColor(group.status)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                                    {group.status}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Spacer for subsequent rows to align with first row */}
                    {rowIndex > 0 && (
                        <div className="flex-shrink-0" style={{ width: `${offsetWidth}px` }}></div>
                    )}

                    {/* Units List with Connectors */}
                    {row.map((unit, unitIndex) => {
                        const globalIndex = rowIndex * unitsPerRow + unitIndex;
                        return (
                            <div key={unit.id} className="flex items-center">
                                {/* Connector Line */}
                                <div className="flex items-center">
                                    <div className="h-[2px] w-6 bg-gray-400"></div>
                                    <div className="h-[2px] w-4 bg-gray-400"></div>
                                </div>

                                {/* Unit Item with Index */}
                                <div className="relative">
                                    <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-600 text-white flex items-center justify-center text-sm font-bold z-20 border-4 border-[#F0F0F6]">
                                        {globalIndex + 1}
                                    </div>
                                    <UnitItem unit={unit} />
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
