import React from 'react';
import CustomDropdown from '../../../components/CustomDropdown';

interface BasicAmenitiesProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

const BasicAmenities: React.FC<BasicAmenitiesProps> = ({ data, updateData }) => {
  // Parking options matching Prisma enum ParkingType
  const parkingOptions = [
    { value: 'NONE', label: 'None' },
    { value: 'STREET', label: 'Street Parking' },
    { value: 'GARAGE', label: 'Garage' },
    { value: 'DRIVEWAY', label: 'Driveway' },
    { value: 'DEDICATED_SPOT', label: 'Dedicated Spot' },
    { value: 'PRIVATE_LOT', label: 'Private Lot' },
    { value: 'ASSIGNED', label: 'Assigned' },
  ];

  // Laundry options matching Prisma enum LaundryType
  const laundryOptions = [
    { value: 'NONE', label: 'None' },
    { value: 'IN_UNIT', label: 'In Unit' },
    { value: 'ON_SITE', label: 'On Site' },
    { value: 'HOOKUPS', label: 'Hookups Only' },
  ];

  // Air Conditioning options matching Prisma enum AirConditioningType
  const acOptions = [
    { value: 'NONE', label: 'None' },
    { value: 'CENTRAL', label: 'Central Air' },
    { value: 'WINDOW', label: 'Window Unit' },
    { value: 'PORTABLE', label: 'Portable' },
    { value: 'COOLER', label: 'Cooler' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold mb-2 text-[var(--color-heading)]">Basic amenities</h2>
        <p className="text-[var(--color-subheading)]">Select the property features and amenities below.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl w-full max-w-4xl shadow-sm border border-white/60">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <CustomDropdown
              label="Parking*"
              value={data.parking || ''}
              onChange={(value) => updateData('parking', value)}
              options={parkingOptions}
              placeholder="Select parking type"
              buttonClassName="bg-[#76C043] text-white border border-gray-300 placeholder-white"
              required
            />
          </div>
          
          <div className="space-y-2">
            <CustomDropdown
              label="Laundry*"
              value={data.laundry || ''}
              onChange={(value) => updateData('laundry', value)}
              options={laundryOptions}
              placeholder="Select laundry type"
              buttonClassName="bg-[#76C043] text-white border border-gray-300"
              required
            />
          </div>

          <div className="space-y-2">
            <CustomDropdown
              label="Air Conditioning*"
              value={data.ac || ''}
              onChange={(value) => updateData('ac', value)}
              options={acOptions}
              placeholder="Select AC type"
              buttonClassName="bg-[#76C043] text-white border border-gray-300"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicAmenities;
