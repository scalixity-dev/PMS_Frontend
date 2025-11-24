import React from 'react';
import CustomDropdown from '../../../components/CustomDropdown';

interface BasicAmenitiesProps {
  data: any;
  updateData: (key: string, value: any) => void;
}

const BasicAmenities: React.FC<BasicAmenitiesProps> = ({ data, updateData }) => {
  const parkingOptions = [
    { value: 'garage', label: 'Garage' },
    { value: 'street', label: 'Street Parking' },
    { value: 'private_lot', label: 'Private Lot' },
    { value: 'none', label: 'None' },
  ];

  const laundryOptions = [
    { value: 'in_unit', label: 'In Unit' },
    { value: 'on_site', label: 'On Site' },
    { value: 'hookups', label: 'Hookups Only' },
    { value: 'none', label: 'None' },
  ];

  const acOptions = [
    { value: 'central', label: 'Central Air' },
    { value: 'window', label: 'Window Unit' },
    { value: 'portable', label: 'Portable' },
    { value: 'none', label: 'None' },
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
              placeholder="Select parking Type"
              buttonClassName="bg-[#76C043] text-white border border-gray-300 placeholder-white"
            />
          </div>
          
          <div className="space-y-2">
            <CustomDropdown
              label="Laundry*"
              value={data.laundry || ''}
              onChange={(value) => updateData('laundry', value)}
              options={laundryOptions}
              placeholder="Select Laundry Type"
              buttonClassName="bg-[#76C043] text-white border border-gray-300"
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicAmenities;
