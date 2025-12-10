import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bath, BedDouble, PlusCircle } from 'lucide-react';
import { getCurrencySymbol } from '../../../../../utils/currency.utils';

interface ListingCardProps {
    id: string;
    image: string;
    name: string;
    address: string;
    price: number | null;
    status: 'listed' | 'unlisted';
    bathrooms: number;
    bedrooms: number;
    country?: string;
    listingId?: string;
    propertyId?: string;
}

const ListingCard: React.FC<ListingCardProps> = ({
    id,
    image,
    name,
    address,
    price,
    status,
    bathrooms,
    bedrooms,
    country,
    listingId,
    propertyId
}) => {
    const navigate = useNavigate();
    const currencySymbol = getCurrencySymbol(country);

    return (
        <div className="bg-white rounded-[2rem] p-4 shadow-sm flex flex-col h-full border border-gray-100">
            {/* Image Section */}
            <div className="w-full h-48 mb-4 relative flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover rounded-2xl"
                />
                <div className={`absolute top-3 left-3 px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm ${status === 'listed' ? 'bg-[#366914]' : 'bg-[#366914]' // Using same green for now as per screenshot
                    }`}>
                    {status === 'listed' ? 'Listed' : 'Unlisted'}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-800">{name}</h3>

                    {/* Amenities - Bathrooms */}
                    <div className="flex items-center gap-2 bg-[#F6F6F8] rounded-full px-2 py-1">
                        <Bath className="w-4 h-4 text-gray-800" />
                        <span className="w-5 h-5 flex items-center justify-center bg-[#FF8A65] text-white text-xs font-bold rounded-full">
                            {bathrooms}
                        </span>
                        <span className="bg-[#2ED47A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Bathrooms
                        </span>
                    </div>
                </div>

                <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-1">
                    {address}
                </p>

                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-gray-800">
                            {price ? `${currencySymbol} ${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : `${currencySymbol} -----`}
                        </span>
                        <span className="text-xs text-gray-500">/month</span>
                    </div>

                    {/* Amenities - Bedrooms */}
                    <div className="flex items-center gap-2 bg-[#F6F6F8] rounded-full px-2 py-1">
                        <BedDouble className="w-4 h-4 text-gray-800" />
                        <span className="w-5 h-5 flex items-center justify-center bg-[#FF8A65] text-white text-xs font-bold rounded-full">
                            {bedrooms}
                        </span>
                        <span className="bg-[#2ED47A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Bedrooms
                        </span>
                    </div>
                </div>

                {status === 'listed' ? (
                    <button
                        onClick={() => navigate(listingId ? `/dashboard/listings/${listingId}` : `/dashboard/listings/${id}`)}
                        className="bg-[#467676] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#3A6D6C] transition-colors w-32 mt-auto"
                    >
                        View Listing
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(propertyId ? `/dashboard/list-unit?propertyId=${propertyId}` : '/dashboard/list-unit')}
                        className="bg-[#467676] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#3A6D6C] transition-colors w-32 mt-auto flex items-center justify-center gap-2"
                    >
                        List a unit
                        <PlusCircle className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListingCard;
