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
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 shadow-sm flex flex-col h-full border border-gray-100">
            {/* Image Section */}
            <div className="w-full h-40 md:h-48 mb-3 md:mb-4 relative flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover rounded-[1.2rem] md:rounded-2xl"
                />
                <div className={`absolute top-3 left-3 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold text-white shadow-sm ${status === 'listed' ? 'bg-[#366914]' : 'bg-[#366914]' // Using same green for now as per screenshot
                    }`}>
                    {status === 'listed' ? 'Listed' : 'Unlisted'}
                </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-1 gap-2">
                    <h3 className="text-base md:text-lg font-bold text-gray-800 line-clamp-1">{name}</h3>

                    {/* Amenities - Bathrooms */}
                    <div className="flex items-center gap-1.5 md:gap-2 bg-[#F6F6F8] rounded-full px-1.5 md:px-2 py-0.5 md:py-1 flex-shrink-0">
                        <Bath className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-800" />
                        <span className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center bg-[#FF8A65] text-white text-[10px] md:text-xs font-bold rounded-full">
                            {bathrooms}
                        </span>
                        <span className="bg-[#2ED47A] text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full hidden sm:inline-block">
                            Bathrooms
                        </span>
                        <span className="bg-[#2ED47A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full sm:hidden">
                            Bath
                        </span>
                    </div>
                </div>

                <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-3 leading-relaxed line-clamp-1">
                    {address}
                </p>

                <div className="flex justify-between items-center mb-3 md:mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-base md:text-lg font-bold text-gray-800">
                            {price ? `${currencySymbol} ${price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : `${currencySymbol} -----`}
                        </span>
                        <span className="text-[10px] md:text-xs text-gray-500">/month</span>
                    </div>

                    {/* Amenities - Bedrooms */}
                    <div className="flex items-center gap-1.5 md:gap-2 bg-[#F6F6F8] rounded-full px-1.5 md:px-2 py-0.5 md:py-1">
                        <BedDouble className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-800" />
                        <span className="w-4 h-4 md:w-5 md:h-5 flex items-center justify-center bg-[#FF8A65] text-white text-[10px] md:text-xs font-bold rounded-full">
                            {bedrooms}
                        </span>
                        <span className="bg-[#2ED47A] text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 rounded-full hidden sm:inline-block">
                            Bedrooms
                        </span>
                        <span className="bg-[#2ED47A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full sm:hidden">
                            Bed
                        </span>
                    </div>
                </div>

                {status === 'listed' ? (
                    <button
                        onClick={() => navigate(listingId ? `/dashboard/listings/${listingId}` : `/dashboard/listings/${id}`)}
                        className="bg-[#467676] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#3A6D6C] transition-colors w-full md:w-32 mt-auto"
                    >
                        View Listing
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(propertyId ? `/dashboard/list-unit?propertyId=${propertyId}` : '/dashboard/list-unit')}
                        className="bg-[#467676] text-white px-4 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#3A6D6C] transition-colors w-full md:w-32 mt-auto flex items-center justify-center gap-2"
                    >
                        List a unit
                        <PlusCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ListingCard;
