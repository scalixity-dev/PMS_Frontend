import type { FC } from 'react';
import { BedDouble, Bath } from 'lucide-react';

interface PropertyData {
    propertyName?: string;
    address?: string;
    city?: string;
    stateRegion?: string;
    zip?: string;
    marketRent?: number;
    bathrooms?: number;
    beds?: number;
}

interface PropertySummaryMapProps {
    data: PropertyData;
    onBack: () => void;
}

const PropertySummaryMap: FC<PropertySummaryMapProps> = ({ data, onBack }) => {
    return (
        <div className="w-full flex flex-col items-center">
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Select property</h2>
                <p className="text-[var(--color-subheading)]">Select the property or unit you want to list or create a new one.</p>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md mx-auto">
                {/* Property Cover Photo or Map Placeholder */}
                <div className="relative h-48 bg-gray-200">
                    {data.coverPhotoUrl ? (
                        <img 
                            src={data.coverPhotoUrl} 
                            alt={data.propertyName || 'Property'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-4xl mb-2 block">🗺️</span>
                                <span className="text-gray-500 font-medium">Map View</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Property Details */}
                <div className="p-6">
                    {/* Property Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{data.propertyName || 'Property Name'}</h3>

                    {/* Address */}
                    <p className="text-sm text-gray-600 mb-4">
                        {[data.address, data.city, data.stateRegion, data.zip].filter(Boolean).join(', ')}
                    </p>

                    {/* Price and Amenities */}
                    <div className="flex items-center justify-between mb-6">
                        {/* Price */}
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-gray-900">
                                ₹ {data.marketRent ? Number(data.marketRent).toLocaleString() : '0'}
                            </span>
                            <span className="text-sm text-gray-500">/month</span>
                        </div>

                        {/* Amenities */}
                        <div className="flex items-center gap-3">
                            {/* Bathrooms */}
                            <div className="flex items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                                    <Bath size={16} className="text-orange-600" />
                                </div>
                                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs font-medium flex items-center justify-center">
                                    {data.bathrooms || '0'}
                                </span>
                            </div>

                            {/* Bedrooms */}
                            <div className="flex items-center gap-1.5">
                                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                                    <BedDouble size={16} className="text-teal-600" />
                                </div>
                                <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-medium flex items-center justify-center">
                                    {data.beds || '0'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onBack}
                            className="w-full px-4 py-2.5 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertySummaryMap;
