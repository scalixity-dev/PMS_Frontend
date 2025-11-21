import React from 'react';
import { Upload, Check } from 'lucide-react';

interface ApplicationSettingsProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

const ApplicationSettings: React.FC<ApplicationSettingsProps> = ({ data, updateData }) => {
  const amenitiesList = [
    "Parking", "Laundry", "Air Conditioning", "Dishwasher", 
    "Pet Friendly", "Pool", "Gym", "Elevator"
  ];

  const toggleAmenity = (amenity: string) => {
    const currentAmenities = data.amenities || [];
    if (currentAmenities.includes(amenity)) {
      updateData('amenities', currentAmenities.filter((a: string) => a !== amenity));
    } else {
      updateData('amenities', [...currentAmenities, amenity]);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm w-full">
      <div className="space-y-6">
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] h-32"
            value={data.description || ''}
            onChange={(e) => updateData('description', e.target.value)}
            placeholder="Describe your property..."
          />
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {amenitiesList.map((amenity) => (
              <button
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`flex items-center gap-2 p-2 rounded-md border text-sm transition-colors ${
                  (data.amenities || []).includes(amenity)
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {(data.amenities || []).includes(amenity) && <Check size={14} />}
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Media Upload Placeholder */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photos & Video</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors">
            <Upload size={32} className="mb-2" />
            <p className="text-sm font-medium">Click to upload or drag and drop</p>
            <p className="text-xs">SVG, PNG, JPG or GIF (max. 800x400px)</p>
          </div>
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-900">Publish Listing</h3>
            <p className="text-xs text-gray-500">Automatically syndicates to partner sites</p>
          </div>
          <button
            onClick={() => updateData('publish', !data.publish)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              data.publish ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                data.publish ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSettings;
