import React from 'react';
import { Trash2, BedDouble, Bath, Edit } from 'lucide-react';

interface PropertyCardProps {
  property: {
    id: string;
    name: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    image?: string;
  };
  onDelete: () => void;
  onBack: () => void;
  onEdit?: () => void;
  onNext?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onDelete, onBack, onEdit, onNext }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-full max-w-md mx-auto">
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200">
        {property.image ? (
          <img 
            src={property.image} 
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
            <span className="text-gray-600 text-lg font-medium">Property Image</span>
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="p-6">
        {/* Property Name */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{property.name}</h3>
        
        {/* Address */}
        <p className="text-sm text-gray-600 mb-4">{property.address}</p>
        
        {/* Price and Amenities */}
        <div className="flex items-center justify-between mb-6">
          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">₹ {property.price.toLocaleString()}</span>
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
                {property.bathrooms}
              </span>
            </div>
            
            {/* Bedrooms */}
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                <BedDouble size={16} className="text-teal-600" />
              </div>
              <span className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs font-medium flex items-center justify-center">
                {property.bedrooms}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 bg-white rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            Back
          </button>
          {onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-colors flex items-center justify-center gap-2"
            >
              <Edit size={18} />
              Edit
            </button>
          )}
         
          <button
            onClick={onDelete}
            className="flex-1 px-4 py-2.5 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
