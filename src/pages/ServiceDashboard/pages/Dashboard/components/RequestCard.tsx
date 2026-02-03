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
        <div className={`bg-white rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.08)] border ${isCritical ? 'border-red-200' : 'border-gray-200'} hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all duration-300 relative`}>
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
