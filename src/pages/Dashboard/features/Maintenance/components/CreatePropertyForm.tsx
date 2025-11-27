import React, { useState } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';

interface CreatePropertyFormProps {
    onCancel: () => void;
    onCreate: (propertyData: any) => void;
}

const CreatePropertyForm: React.FC<CreatePropertyFormProps> = ({ onCancel, onCreate }) => {
    const [propertyType, setPropertyType] = useState('Single Family');
    const [isManufactured, setIsManufactured] = useState('no');
    const [formData, setFormData] = useState({
        unitNumber: '',
        unitType: '',
        marketRent: '',
        address: '',
        city: '',
        stateRegion: '',
        country: 'India',
        zip: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        onCreate({
            ...formData,
            propertyType,
            isManufactured: propertyType === 'Single Family' ? isManufactured : undefined
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            <div className="text-center mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">New Property</h2>
                <p className="text-gray-500">Enter the details for your new property.</p>
            </div>

            <div className="w-full space-y-6">
                {/* Property Type */}
                <div>
                    <CustomDropdown
                        label="Property Type"
                        value={propertyType}
                        onChange={(value) => setPropertyType(value)}
                        options={[
                            { value: 'Single Family', label: 'Single Family' },
                            { value: 'Multi Family', label: 'Multi Family' }
                        ]}
                        required
                        buttonClassName="!border-none !px-6 !py-3 !rounded-md !bg-white"
                        textClassName="font-medium text-gray-700"
                        labelClassName="font-bold !ml-1"
                    />
                </div>

                {/* Conditional Fields */}
                {propertyType === 'Single Family' ? (
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Is this property a manufactured/mobile home? *</label>
                        <div className="flex gap-6 ml-1">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isManufactured === 'yes' ? 'border-black' : 'border-gray-400'}`}>
                                    {isManufactured === 'yes' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                </div>
                                <input
                                    type="radio"
                                    name="isManufactured"
                                    value="yes"
                                    checked={isManufactured === 'yes'}
                                    onChange={() => setIsManufactured('yes')}
                                    className="hidden"
                                />
                                <span className="font-medium">Yes</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isManufactured === 'no' ? 'border-black' : 'border-gray-400'}`}>
                                    {isManufactured === 'no' && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                                </div>
                                <input
                                    type="radio"
                                    name="isManufactured"
                                    value="no"
                                    checked={isManufactured === 'no'}
                                    onChange={() => setIsManufactured('no')}
                                    className="hidden"
                                />
                                <span className="font-medium">No</span>
                            </label>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Unit #*</label>
                            <input
                                type="text"
                                name="unitNumber"
                                value={formData.unitNumber}
                                onChange={handleChange}
                                placeholder="0.00"
                                className="w-full px-6 py-3 bg-white rounded-md border-none outline-none placeholder-gray-400"
                            />
                        </div>
                        <div>
                            <CustomDropdown
                                label="Unit Type"
                                value={formData.unitType}
                                onChange={(value) => setFormData(prev => ({ ...prev, unitType: value }))}
                                options={[
                                    { value: 'Room', label: 'Room' },
                                    { value: 'Apartment', label: 'Apartment' },
                                    { value: 'Multiplex', label: 'Multiplex' },
                                    { value: 'Single-Family', label: 'Single-Family' },
                                    { value: 'Townhouse', label: 'Townhouse' },
                                    { value: 'Condo', label: 'Condo' },
                                    { value: 'Commercial', label: 'Commercial' }
                                ]}
                                required
                                buttonClassName="!border-none !px-6 !py-3 !rounded-md !bg-white"
                                textClassName="font-medium text-gray-700"
                                labelClassName="font-bold !ml-1"
                            />
                        </div>
                    </div>
                )}

                {/* Market Rent */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Market Rent*</label>
                    <input
                        type="text"
                        name="marketRent"
                        value={formData.marketRent}
                        onChange={handleChange}
                        placeholder="Market Rent"
                        className="w-full px-6 py-3 bg-white rounded-md border-none outline-none placeholder-gray-400"
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Address*</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="w-full px-6 py-3 bg-white rounded-md border-none outline-none placeholder-gray-400"
                    />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">City*</label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="w-full px-6 py-3 bg-white rounded-md border-none outline-none placeholder-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">State / Region*</label>
                        <input
                            type="text"
                            name="stateRegion"
                            value={formData.stateRegion}
                            onChange={handleChange}
                            placeholder="State / Region"
                            className="w-full px-6 py-3 bg-white rounded-md border-none outline-none placeholder-gray-400"
                        />
                    </div>
                </div>

                {/* Country & Zip */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <CustomDropdown
                            label="Country"
                            value={formData.country}
                            onChange={(value) => setFormData(prev => ({ ...prev, country: value }))}
                            options={[
                                { value: 'India', label: 'India' },
                                { value: 'USA', label: 'USA' },
                                { value: 'UK', label: 'UK' }
                            ]}
                            required
                            buttonClassName="!border-none !px-6 !py-3 !rounded-md !bg-white"
                            textClassName="font-medium text-gray-700"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Zip*</label>
                        <input
                            type="text"
                            name="zip"
                            value={formData.zip}
                            onChange={handleChange}
                            placeholder="Zip"
                            className="w-full px-6 py-3 bg-white rounded-md border-none outline-none placeholder-gray-400"
                        />
                    </div>
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="grid grid-cols-2 gap-4 mt-12 w-full">
                <div className="flex gap-4">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-2 rounded-md border-2 border-white bg-white text-black text-lg font-bold hover:bg-gray-50 transition-colors shadow-lg"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-2 rounded-md bg-[#3D7475] text-white text-lg font-bold hover:opacity-90 transition-opacity shadow-lg"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreatePropertyForm;
