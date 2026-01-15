import React from 'react';

interface RequestCardProps {
    status: 'Normal' | 'Urgent'| 'Critical';
    category: string;
    propertyName: string;
    avatarSeed: string;
}

const RequestCard: React.FC<RequestCardProps> = ({ status, category, propertyName, avatarSeed }) => {
    const isCritical = status === 'Critical';

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border ${isCritical ? 'border-red-100' : 'border-gray-100'} hover:shadow-md transition-shadow relative`}>
            {/* Status Badge */}
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${isCritical ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500' : 'bg-green-500'}`}></div>
                {status}
            </div>

            <div className="mb-6">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border-2 border-white shadow-sm">
                    <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                        alt="User"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-1 pr-16 leading-tight">{category}</h3>
            <p className="text-gray-500 text-sm mb-8">{propertyName}</p>

            <div className="flex justify-end">
                <button className="text-[#7BD747] font-medium text-sm hover:underline">View</button>
            </div>
        </div>
    );
}

export default RequestCard;
