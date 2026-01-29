import { useNavigate } from 'react-router-dom';

interface RequestCardProps {
    id: string;
    status: 'Normal' | 'Urgent' | 'Critical';
    category: string;
    propertyName: string;
}

const RequestCard: React.FC<RequestCardProps> = ({ id, status, category, propertyName }) => {
    const navigate = useNavigate();
    const isCritical = status === 'Critical';

    return (
        <div className={`bg-white rounded-2xl p-6 shadow-sm border ${isCritical ? 'border-red-100' : 'border-gray-100'} hover:shadow-md transition-shadow relative`}>
            {/* Status Badge */}
            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${isCritical ? 'bg-red-100 text-red-500' : 'bg-green-100 text-green-600'}`}>
                <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500' : 'bg-green-500'}`}></div>
                {status}
            </div>


            <h3 className="text-lg font-bold text-gray-900 mb-1 pr-16 leading-tight">{category}</h3>
            <p className="text-gray-500 text-sm mb-8">{propertyName}</p>

            <div className="flex justify-end">
                <button
                    onClick={() => navigate(`/service-dashboard/requests/${id}`)}
                    className="text-[#7BD747] font-medium text-sm hover:underline"
                >
                    View
                </button>
            </div>
        </div>
    );
}

export default RequestCard;
