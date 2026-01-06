import { useNavigate } from 'react-router-dom';
import { DollarSign, Wrench, User } from 'lucide-react';
import { getCurrencySymbol } from '../../../../../utils/currency.utils';

interface PropertyCardProps {
    id: string | number;
    image: string | null;
    name: string;
    address: string;
    balance: number;
    type?: string;
    country?: string;
    propertyType?: 'single_apartment' | 'multi_apartment';
    isSelected?: boolean;
    onSelect?: (id: string | number, selected: boolean) => void;
    selectionMode?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
    id,
    image,
    name,
    address,
    balance,
    type = 'Single Apartment',
    country,
    propertyType = 'single_apartment',
    isSelected = false,
    onSelect,
    selectionMode = false
}) => {
    const navigate = useNavigate();
    const currencySymbol = getCurrencySymbol(country);
    const isSingleApartment = propertyType === 'single_apartment';

    const handleCardClick = () => {
        if (selectionMode && onSelect) {
            onSelect(id, !isSelected);
        } else {
            navigate(`/dashboard/properties/${id}`);
        }
    };

    const handleCheckboxChange = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onSelect) {
            onSelect(id, !isSelected);
        }
    };

    return (
        <div
            className={`bg-[#F6F6F8] rounded-[2rem] p-4 shadow-sm relative flex flex-col h-full ${selectionMode ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${isSelected ? 'ring-2 ring-[#82D64D] ring-offset-2' : ''}`}
            onClick={handleCardClick}
        >
            {/* Selection Checkbox */}
            {selectionMode && (
                <div
                    className="absolute top-4 left-4 z-10"
                    onClick={handleCheckboxChange}
                >
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${isSelected
                            ? 'bg-[#82D64D] border-[#82D64D]'
                            : 'bg-white border-gray-300'
                        }`}>
                        {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>
            )}
            {/* Image Section */}
            <div className="w-full h-48 mb-4 relative flex-shrink-0">
                {image ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover rounded-2xl"
                        onError={(e) => {
                            // If image fails to load, show placeholder
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const placeholder = target.nextElementSibling as HTMLElement;
                            if (placeholder) {
                                placeholder.style.display = 'flex';
                            }
                        }}
                    />
                ) : null}
                <div
                    className={`w-full h-full rounded-2xl ${image ? 'hidden' : 'flex'} items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300`}
                >
                    <div className="text-center">
                        <div className="text-gray-400 text-4xl mb-2">🏠</div>
                        <p className="text-gray-500 text-xs font-medium">No Image</p>
                    </div>
                </div>
                {isSingleApartment && (
                    <div className="bg-[#82D64D] text-white px-4 py-1.5 rounded-full text-sm font-medium absolute top-3 right-3 shadow-sm">
                        Balance {currencySymbol} {balance.toLocaleString()}
                    </div>
                )}
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <span className="bg-[#D1E2D1] text-[#3A6D6C] text-xs px-3 py-1 rounded-full font-medium">
                        {type}
                    </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
                <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-2">
                    {address}
                </p>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/dashboard/properties/${id}`);
                    }}
                    className="bg-[#82D64D] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#72c042] transition-colors w-full mb-4 mt-auto"
                >
                    View Property
                </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-between mt-auto bg-white shadow-sm px-3 py-3 rounded-2xl overflow-x-auto">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/dashboard/accounting/transactions', { state: { preSelectedProperty: name } });
                    }}
                    className="flex items-center justify-center gap-1.5 bg-[#82D64D] text-white px-3 py-2 rounded-full text-[10px] font-medium hover:bg-[#72c042] transition-colors flex-1 whitespace-nowrap"
                >
                    <div className="p-0.5 border border-white rounded-full">
                        <DollarSign className="w-2.5 h-2.5" />
                    </div>
                    Accounting
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/dashboard/maintenance/requests', { state: { preSelectedProperty: name } });
                    }}
                    className="flex items-center justify-center gap-1.5 bg-[#82D64D] text-white px-3 py-2 rounded-full text-[10px] font-medium hover:bg-[#72c042] transition-colors flex-1 whitespace-nowrap"
                >
                    <Wrench className="w-3 h-3" />
                    Requests
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate('/dashboard/contacts/tenants', { state: { preSelectedProperty: name } });
                    }}
                    className="flex items-center justify-center gap-1.5 bg-[#82D64D] text-white px-3 py-2 rounded-full text-[10px] font-medium hover:bg-[#72c042] transition-colors flex-1 whitespace-nowrap"
                >
                    <User className="w-3 h-3" />
                    Tenants
                </button>
            </div>
        </div>
    );
};

export default PropertyCard;
