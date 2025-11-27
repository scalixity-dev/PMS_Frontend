import { useNavigate } from 'react-router-dom';
import { DollarSign, Wrench, User } from 'lucide-react';

interface PropertyCardProps {
    id: number;
    image: string;
    name: string;
    address: string;
    balance: number;
    type?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    id,
    image,
    name,
    address,
    balance,
    type = 'Single Family'
}) => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#F6F6F8] rounded-[2rem] p-4 shadow-sm relative">
            <div className="flex gap-4">
                {/* Image Section */}
                <div className="w-48 flex-shrink-0">
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover rounded-2xl"
                    />
                </div>

                {/* Content Section */}
                <div className="flex-1 pt-2">
                    <div className="flex justify-between items-start mb-2">
                        <span className="bg-[#D1E2D1] text-[#3A6D6C] text-xs px-3 py-1 rounded-full font-medium">
                            {type}
                        </span>
                        <div className="bg-[#82D64D] text-white px-4 py-1.5 rounded-full text-sm font-medium absolute top-4 right-4">
                            Balance ₹ {balance.toLocaleString()}
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed w-2/3">
                        {address}
                    </p>

                    <button
                        onClick={() => navigate(`/dashboard/properties/${id}`)}
                        className="bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#72c042] transition-colors"
                    >
                        View Property
                    </button>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 shadow-md px-2 py-3 rounded-full">
                <button className="flex items-center gap-2 bg-[#82D64D] text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-[#72c042] transition-colors">
                    <div className="p-0.5 border border-white rounded-full">
                        <DollarSign className="w-3 h-3" />
                    </div>
                    Accounting
                </button>
                <button className="flex items-center gap-2 bg-[#82D64D] text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-[#72c042] transition-colors">
                    <Wrench className="w-3 h-3" />
                    MR Requests
                </button>
                <button className="flex items-center gap-2 bg-[#82D64D] text-white px-4 py-2 rounded-full text-xs font-medium hover:bg-[#72c042] transition-colors">
                    <User className="w-3 h-3" />
                    Tenants
                </button>
            </div>
        </div>
    );
};

export default PropertyCard;
