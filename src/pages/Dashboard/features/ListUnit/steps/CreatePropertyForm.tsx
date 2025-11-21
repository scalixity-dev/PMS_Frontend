import React, { useState } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';

interface CreatePropertyFormProps {
  onBack: () => void;
  onSubmit: (propertyData: any) => void;
}

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({ onBack, onSubmit }) => {
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: '',
    isManufactured: '',
    marketRent: '',
    beds: '',
    bathrooms: '',
    sizeSquareFt: '',
    yearBuilt: '',
    address: '',
    city: '',
    stateRegion: '',
    country: '',
    zip: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, isManufactured: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Name*
          </label>
          <input
            type="text"
            name="propertyName"
            value={formData.propertyName}
            onChange={handleChange}
            placeholder="Property Name"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
            required
          />
        </div>

        {/* Property Type */}
        <CustomDropdown
          label="Property Type"
          value={formData.propertyType}
          onChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
          options={[
            { value: 'apartment', label: 'Apartment' },
            { value: 'house', label: 'House' },
            { value: 'condo', label: 'Condo' },
            { value: 'townhouse', label: 'Townhouse' },
            { value: 'duplex', label: 'Duplex' }
          ]}
          placeholder="Property Type"
          required
        />

        {/* Manufactured Home Radio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Is this property a manufactured/mobile home?*
          </label>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isManufactured"
                value="yes"
                checked={formData.isManufactured === 'yes'}
                onChange={() => handleRadioChange('yes')}
                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
                required
              />
              <span className="text-sm text-gray-700">Yes</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="isManufactured"
                value="no"
                checked={formData.isManufactured === 'no'}
                onChange={() => handleRadioChange('no')}
                className="w-4 h-4 text-[var(--color-primary)] border-gray-300 focus:ring-[var(--color-primary)]"
                required
              />
              <span className="text-sm text-gray-700">No</span>
            </label>
          </div>
        </div>

        {/* Market Rent & Beds */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Rent*
            </label>
            <input
              type="number"
              name="marketRent"
              value={formData.marketRent}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
              required
            />
          </div>
          <CustomDropdown
            label="Beds"
            value={formData.beds}
            onChange={(value) => setFormData(prev => ({ ...prev, beds: value }))}
            options={[
              { value: '0', label: 'Studio' },
              { value: '1', label: '1' },
              { value: '2', label: '2' },
              { value: '3', label: '3' },
              { value: '4', label: '4' },
              { value: '5', label: '5+' }
            ]}
            placeholder="Select beds"
            required
          />
        </div>

        {/* Baths & Size sq ft */}
        <div className="grid grid-cols-2 gap-4">
          <CustomDropdown
            label="Baths"
            value={formData.bathrooms}
            onChange={(value) => setFormData(prev => ({ ...prev, bathrooms: value }))}
            options={[
              { value: '1', label: '1' },
              { value: '1.5', label: '1.5' },
              { value: '2', label: '2' },
              { value: '2.5', label: '2.5' },
              { value: '3', label: '3' },
              { value: '3.5', label: '3.5' },
              { value: '4', label: '4+' }
            ]}
            placeholder="Select baths"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Size sq ft*
            </label>
            <input
              type="number"
              name="sizeSquareFt"
              value={formData.sizeSquareFt}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
              required
            />
          </div>
        </div>

        {/* Year Built */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year Built*
          </label>
          <input
            type="number"
            name="yearBuilt"
            value={formData.yearBuilt}
            onChange={handleChange}
            placeholder="0.00"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address*
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
            required
          />
        </div>

        {/* City & State/Region */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City*
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
              required
            />
          </div>
          <CustomDropdown
            label="State / Region"
            value={formData.stateRegion}
            onChange={(value) => setFormData(prev => ({ ...prev, stateRegion: value }))}
            options={[
              { value: 'AL', label: 'Alabama' },
              { value: 'AK', label: 'Alaska' },
              { value: 'AZ', label: 'Arizona' },
              { value: 'CA', label: 'California' },
              { value: 'FL', label: 'Florida' },
              { value: 'NY', label: 'New York' },
              { value: 'TX', label: 'Texas' }
            ]}
            placeholder="Select state"
            required
          />
        </div>

        {/* Country & Zip */}
        <div className="grid grid-cols-2 gap-4">
          <CustomDropdown
            label="Country"
            value={formData.country}
            onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
            options={[
              { value: 'US', label: 'United States' },
              { value: 'CA', label: 'Canada' },
              { value: 'UK', label: 'United Kingdom' },
              { value: 'IN', label: 'India' }
            ]}
            placeholder="Select country"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zip*
            </label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              placeholder="0.00"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white text-gray-900 placeholder-gray-400"
              required
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Create Property
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePropertyForm;
