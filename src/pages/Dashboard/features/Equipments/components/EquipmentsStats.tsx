import React from 'react';

const EquipmentsStats: React.FC = () => {
    return (
        <div className="flex gap-4 mb-6 overflow-x-auto">
            {/* Property Stat */}
            <div className="bg-[#82D64D] rounded-full px-2 py-2 flex items-center gap-3 min-w-fit">
                <span className="text-white font-medium ml-4 text-sm">Property</span>
                <div className="flex gap-2">
                    <div className="bg-white rounded-full px-3 py-1 flex items-center gap-2">
                        <span className="font-bold text-sm">5</span>
                        <span className="text-xs text-gray-600">Assigned</span>
                    </div>
                    <div className="bg-white rounded-full px-3 py-1 flex items-center gap-2">
                        <span className="font-bold text-sm">2</span>
                        <span className="text-xs text-gray-600">Unassigned</span>
                    </div>
                </div>
            </div>

            {/* Service Checkup Stat */}
            <div className="bg-[#82D64D] rounded-full px-2 py-2 flex items-center gap-3 min-w-fit">
                <span className="text-white font-medium ml-4 text-sm">Service Checkup</span>
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-2">
                    <span className="font-bold text-sm">2</span>
                    <span className="text-xs text-gray-600">Scheduled</span>
                </div>
            </div>

            {/* Warranty Expiration Stat */}
            <div className="bg-[#82D64D] rounded-full px-2 py-2 flex items-center gap-3 min-w-fit">
                <span className="text-white font-medium ml-4 text-sm">Warranty expiration</span>
                <div className="bg-white rounded-full px-3 py-1 flex items-center gap-2">
                    <span className="font-bold text-sm">0</span>
                    <span className="text-xs text-gray-600">Days</span>
                </div>
            </div>
        </div>
    );
};

export default EquipmentsStats;
