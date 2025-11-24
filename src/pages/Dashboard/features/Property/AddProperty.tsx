import React, { useState, useRef } from 'react';
import { Upload, Trash2, Plus, X, Check, FileText } from 'lucide-react';
import Input from '../../../../components/common/Input';

interface Unit {
  unitNumber: string;
  unitType: string;
  size: string;
  baths: string;
  rent: string;
  deposit: string;
  beds: string;
}

const AddProperty: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    propertyName: '',
    yearBuilt: '',
    mls: '',
    streetAddress: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    propertyType: 'single', // 'single' | 'multi'
    isManufactured: false,
    beds: '',
    baths: '',
    size: '',
    marketRent: '',
    deposit: '',
    parking: '',
    laundry: '',
    ac: '',
    features: [] as string[],
    amenities: [] as string[],
    customFeature: '',
    coverPhoto: null as File | null,
    galleryPhotos: [] as File[],
    attachments: [] as File[],
    units: [] as Unit[],
  });

  const [customFeatureInput, setCustomFeatureInput] = useState('');

  // Refs for file inputs
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryPhotosInputRef = useRef<HTMLInputElement>(null);
  const attachmentsInputRef = useRef<HTMLInputElement>(null);


  // Options
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

  const propertyFeaturesList = [
    'Fireplace', 'Furnished', 'Internet', 'Storage', 'Fire Pit', 'Dishwasher'
  ];

  const propertyAmenitiesList = [
    'Basketball Court', 'Elevator', 'Dog Park', 'Game Room', 'Fire Pit', 'Hot Tub', 'Playground', 'Pool'
  ];

  // Handlers
  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (feature: string) => {
    setFormData(prev => {
      const exists = prev.features.includes(feature);
      return {
        ...prev,
        features: exists
          ? prev.features.filter(f => f !== feature)
          : [...prev.features, feature]
      };
    });
  };

  const toggleAmenity = (amenity: string) => {
    setFormData(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter(a => a !== amenity)
          : [...prev.amenities, amenity]
      };
    });
  };

  const addCustomFeature = () => {
    if (customFeatureInput.trim()) {
      toggleFeature(customFeatureInput.trim());
      setCustomFeatureInput('');
    }
  };

  const addCustomAmenity = () => {
    if (customFeatureInput.trim()) {
      toggleAmenity(customFeatureInput.trim());
      setCustomFeatureInput('');
    }
  };

  const addUnit = () => {
    setFormData(prev => ({
      ...prev,
      units: [...prev.units, { unitNumber: '', unitType: '', size: '', baths: '', rent: '', deposit: '', beds: '' }]
    }));
  };

  const updateUnit = (index: number, field: keyof Unit, value: string) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.map((u, i) => i === index ? { ...u, [field]: value } : u)
    }));
  };

  const removeUnit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      units: prev.units.filter((_, i) => i !== index)
    }));
  };

  // File Handlers
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, coverPhoto: e.target.files![0] }));
    }
  };

  const handleGalleryPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, galleryPhotos: [...prev.galleryPhotos, ...newPhotos] }));
    }
  };

  const handleAttachmentsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newAttachments = Array.from(e.target.files);
      setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...newAttachments] }));
    }
  };

  const removeCoverPhoto = () => {
    setFormData(prev => ({ ...prev, coverPhoto: null }));
    if (coverPhotoInputRef.current) coverPhotoInputRef.current.value = '';
  };

  const removeGalleryPhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== index)
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
    alert('Property Created (Demo)');
  };

  return (
    <div className="bg-[#DFE5E3] min-h-screen max-w-6xl mx-auto p-8 font-sans rounded-xl text-[#4B5563]">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        
        {/* Property Photo */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Property photo</h2>
          <input 
            type="file" 
            ref={coverPhotoInputRef}
            onChange={handleCoverPhotoChange}
            accept="image/*"
            className="hidden"
          />
          {formData.coverPhoto ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-2 flex flex-col items-center justify-center h-64 relative overflow-hidden">
              <img 
                src={URL.createObjectURL(formData.coverPhoto)} 
                alt="Property Cover" 
                className="w-full h-full object-cover rounded-lg"
              />
              <button 
                type="button" 
                onClick={removeCoverPhoto}
                className="absolute top-4 right-4 bg-white/80 p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => coverPhotoInputRef.current?.click()}
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center h-64 relative cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="bg-teal-50 p-3 rounded-full mb-2">
                  <Upload className="text-teal-600" size={24} />
                </div>
                <span className="text-xs font-medium text-gray-500">Upload Photos</span>
              </div>
            </div>
          )}
        </section>

        {/* Gallery Photos */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Gallery Photos</h2>
          <input 
            type="file" 
            ref={galleryPhotosInputRef}
            onChange={handleGalleryPhotosChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="flex gap-4 flex-wrap">
            {formData.galleryPhotos.map((photo, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 w-40 h-40 flex flex-col items-center justify-center relative overflow-hidden">
                <img 
                  src={URL.createObjectURL(photo)} 
                  alt={`Gallery ${i}`} 
                  className="w-full h-full object-cover"
                />
                <button 
                  type="button" 
                  onClick={() => removeGalleryPhoto(i)}
                  className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            
            {/* Add More Button */}
            <button 
              type="button" 
              onClick={() => galleryPhotosInputRef.current?.click()}
              className="w-40 h-40 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col items-center">
                <div className="bg-teal-50 p-2 rounded-full mb-2">
                  <Upload className="text-teal-600" size={20} />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-gray-600 border border-green-500 rounded-full px-3 py-0.5 mt-1">
                  Add more <Plus size={14} />
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* General Information */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">General Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Property Name*</label>
              <Input 
                placeholder="Property Name" 
                value={formData.propertyName}
                onChange={(e) => updateFormData('propertyName', e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 ml-1">Year Built*</label>
                <Input 
                  placeholder="2021" 
                  value={formData.yearBuilt}
                  onChange={(e) => updateFormData('yearBuilt', e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 ml-1">MLS?</label>
                <div className="relative">
                   <select 
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 outline-none appearance-none"
                    value={formData.mls}
                    onChange={(e) => updateFormData('mls', e.target.value)}
                   >
                     <option value="">Search</option>
                     <option value="yes">Yes</option>
                     <option value="no">No</option>
                   </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                     <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Street address*</label>
              <Input 
                placeholder="Street Address" 
                value={formData.streetAddress}
                onChange={(e) => updateFormData('streetAddress', e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 ml-1">City*</label>
                <Input 
                  placeholder="City" 
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 ml-1">State / Region*</label>
                <Input 
                  placeholder="State" 
                  value={formData.state}
                  onChange={(e) => updateFormData('state', e.target.value)}
                  className="bg-white border-gray-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Zip *</label>
              <Input 
                placeholder="Enter Zip code" 
                value={formData.zip}
                onChange={(e) => updateFormData('zip', e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Country *</label>
              <Input 
                placeholder="Enter country" 
                value={formData.country}
                onChange={(e) => updateFormData('country', e.target.value)}
                className="bg-white border-gray-200"
              />
            </div>
          </div>
        </section>

        {/* Property Type */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Property type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Unit */}
            <div 
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                formData.propertyType === 'single' 
                  ? 'bg-white border-gray-200 shadow-sm' 
                  : 'bg-white/50 border-transparent hover:bg-white'
              }`}
              onClick={() => updateFormData('propertyType', 'single')}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  formData.propertyType === 'single' ? 'border-green-500' : 'border-gray-400'
                }`}>
                  {formData.propertyType === 'single' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                </div>
                <span className="font-semibold text-gray-800">Single Unit type</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Single family rentals (often abbreviated as SFR) are rentals in which there is only one rental associated to a specific address. This type of rental is usually used for a house, single mobile home, or a single condo. <span className="font-semibold text-gray-700">This type of property does not allow to add any units/rooms.</span>
              </p>
            </div>

            {/* Multi Unit */}
            <div 
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                formData.propertyType === 'multi' 
                  ? 'bg-white border-gray-200 shadow-sm' 
                  : 'bg-white/50 border-transparent hover:bg-white'
              }`}
              onClick={() => updateFormData('propertyType', 'multi')}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  formData.propertyType === 'multi' ? 'border-green-500' : 'border-gray-400'
                }`}>
                  {formData.propertyType === 'multi' && <div className="w-3 h-3 bg-green-500 rounded-full" />}
                </div>
                <span className="font-semibold text-gray-800">Multi Unit type</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Multi-unit property are for rentals in which there are multiple rental units per a single address. This type of property is typically used for renting out rooms of a house, apartment units, office units, condos, garages, storage units, mobile home park and etc.
              </p>
            </div>
          </div>
        </section>

        {/* Single Unit Sections */}
        {formData.propertyType === 'single' && (
          <>
            {/* Insurance Information */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Insurance information</h2>
              <div className="mb-6">
                <p className="text-sm mb-3 text-gray-700">Is this property a manufactured/mobile home?*</p>
                <div className="flex gap-4">
                   <button
                     type="button"
                     onClick={() => updateFormData('isManufactured', true)}
                     className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                       formData.isManufactured ? 'bg-[#84CC16] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                     }`}
                   >
                     {formData.isManufactured && <Check size={14} />} Yes
                   </button>
                   <button
                     type="button"
                     onClick={() => updateFormData('isManufactured', false)}
                     className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                       !formData.isManufactured ? 'bg-[#84CC16] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                     }`}
                   >
                     {!formData.isManufactured && <Check size={14} />} No
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Beds*</label>
                  <div className="relative">
                    <select 
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 outline-none appearance-none"
                      value={formData.beds}
                      onChange={(e) => updateFormData('beds', e.target.value)}
                    >
                      <option value="">Studio</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3+</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Baths*</label>
                  <Input 
                    placeholder="None" 
                    value={formData.baths}
                    onChange={(e) => updateFormData('baths', e.target.value)}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Size, sq.ft*</label>
                  <Input 
                    placeholder="500" 
                    value={formData.size}
                    onChange={(e) => updateFormData('size', e.target.value)}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Market Rent*</label>
                  <Input 
                    placeholder="0.00" 
                    value={formData.marketRent}
                    onChange={(e) => updateFormData('marketRent', e.target.value)}
                    className="bg-white border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Deposit*</label>
                  <Input 
                    placeholder="0.00" 
                    value={formData.deposit}
                    onChange={(e) => updateFormData('deposit', e.target.value)}
                    className="bg-white border-gray-200"
                  />
                </div>
              </div>
            </section>

            {/* Basic Amenities */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Basic amenities</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Parking*</label>
                  <div className="relative">
                    <select 
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 outline-none appearance-none"
                      value={formData.parking}
                      onChange={(e) => updateFormData('parking', e.target.value)}
                    >
                      <option value="">Gourmet</option>
                      {parkingOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Laundry*</label>
                  <div className="relative">
                    <select 
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 outline-none appearance-none"
                      value={formData.laundry}
                      onChange={(e) => updateFormData('laundry', e.target.value)}
                    >
                      <option value="">Search</option>
                      {laundryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Air Conditioning*</label>
                  <div className="relative">
                    <select 
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 outline-none appearance-none"
                      value={formData.ac}
                      onChange={(e) => updateFormData('ac', e.target.value)}
                    >
                      <option value="">Search</option>
                      {acOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Property Features */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Property features</h2>
              <div className="flex flex-wrap gap-3 mb-6">
                {propertyFeaturesList.map(feature => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-2 ${
                      formData.features.includes(feature)
                        ? 'bg-[#84CC16] text-white border-[#84CC16]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#84CC16]'
                    }`}
                  >
                    {feature}
                    {formData.features.includes(feature) && <X size={12} className="ml-1" onClick={(e) => { e.stopPropagation(); toggleFeature(feature); }} />}
                    {!formData.features.includes(feature) && <Plus size={12} className="ml-1" />}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-xs font-medium mb-2 ml-1">Enter Custom Features</label>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input 
                      placeholder="Custom Features" 
                      value={customFeatureInput}
                      onChange={(e) => setCustomFeatureInput(e.target.value)}
                      className="bg-[#84CC16] text-white placeholder-white/80 border-none"
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={addCustomFeature}
                    className="px-8 py-2 bg-[#376F7E] text-white rounded-full text-sm font-medium hover:bg-[#2c5a66]"
                  >
                    Save
                  </button>
                  <button 
                    type="button"
                    onClick={() => setCustomFeatureInput('')}
                    className="px-8 py-2 bg-[#4B5563] text-white rounded-full text-sm font-medium hover:bg-[#374151]"
                  >
                    Close
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Multi Unit Sections */}
        {formData.propertyType === 'multi' && (
          <section>
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Units information</h2>
            <div className="space-y-6 mb-8">
              {formData.units.map((unit, index) => (
                <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 relative">
                  <button 
                    type="button"
                    onClick={() => removeUnit(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">unit {index + 1}</label>
                      <Input 
                        placeholder={`unit ${index + 1}`}
                        value={unit.unitNumber}
                        onChange={(e) => updateUnit(index, 'unitNumber', e.target.value)}
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">unit type*</label>
                      <Input 
                        placeholder="000" 
                        value={unit.unitType}
                        onChange={(e) => updateUnit(index, 'unitType', e.target.value)}
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">Size,sq.ft*</label>
                      <div className="relative">
                         <select 
                          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-700 outline-none appearance-none"
                          value={unit.size}
                          onChange={(e) => updateUnit(index, 'size', e.target.value)}
                         >
                           <option value="">Search</option>
                           <option value="500">500</option>
                           <option value="1000">1000</option>
                         </select>
                         <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                           <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                             <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                           </svg>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">Baths*</label>
                      <Input 
                        placeholder="0.00" 
                        value={unit.baths}
                        onChange={(e) => updateUnit(index, 'baths', e.target.value)}
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">Rent*</label>
                      <Input 
                        placeholder="0.00" 
                        value={unit.rent}
                        onChange={(e) => updateUnit(index, 'rent', e.target.value)}
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">Deposit*</label>
                      <Input 
                        placeholder="0.00" 
                        value={unit.deposit}
                        onChange={(e) => updateUnit(index, 'deposit', e.target.value)}
                        className="bg-white border-gray-200"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">Beds*</label>
                      <Input 
                        placeholder="Select beds" 
                        value={unit.beds}
                        onChange={(e) => updateUnit(index, 'beds', e.target.value)}
                        className="bg-white border-gray-200"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button 
                type="button"
                onClick={addUnit}
                className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 text-sm font-medium"
              >
                Add unit <Plus size={16} className="border border-gray-400 rounded-full p-0.5" />
              </button>
            </div>
          </section>
        )}

        {/* Property Amenities */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Property amenities</h2>
          <div className="flex flex-wrap gap-3 mb-6">
            {propertyAmenitiesList.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-2 ${
                  formData.amenities.includes(amenity)
                    ? 'bg-[#84CC16] text-white border-[#84CC16]'
                    : 'bg-[#84CC16] text-white border-[#84CC16] hover:opacity-90'
                }`}
              >
                {amenity}
                {formData.amenities.includes(amenity) ? <Check size={12} className="ml-1" /> : <Plus size={12} className="ml-1" />}
              </button>
            ))}
          </div>

          {formData.propertyType === 'multi' && (
            <div className="mb-6">
              <label className="block text-xs font-medium mb-2 ml-1">Enter Custom Amenities</label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input 
                    placeholder="Custom Amenities" 
                    value={customFeatureInput}
                    onChange={(e) => setCustomFeatureInput(e.target.value)}
                    className="bg-[#84CC16] text-white placeholder-white/80 border-none"
                  />
                </div>
                <button 
                  type="button"
                  onClick={addCustomAmenity}
                  className="px-8 py-2 bg-[#376F7E] text-white rounded-full text-sm font-medium hover:bg-[#2c5a66]"
                >
                  Save
                </button>
                <button 
                  type="button"
                  onClick={() => setCustomFeatureInput('')}
                  className="px-8 py-2 bg-[#4B5563] text-white rounded-full text-sm font-medium hover:bg-[#374151]"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Property Attachments */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Property Attachments</h2>
          <input 
            type="file" 
            ref={attachmentsInputRef}
            onChange={handleAttachmentsChange}
            multiple
            className="hidden"
          />
          
          {formData.attachments.length > 0 && (
            <div className="flex flex-col gap-2 mb-4">
              {formData.attachments.map((file, i) => (
                <div key={i} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded">
                      <FileText size={20} className="text-gray-600" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeAttachment(i)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div 
            onClick={() => attachmentsInputRef.current?.click()}
            className="bg-[#F3F4F6] rounded-xl border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center h-48 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <Upload className="text-gray-800" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-500">Upload Attachments</span>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            className="px-8 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-8 py-2 bg-[#376F7E] text-white rounded-lg font-medium hover:bg-[#2c5a66]"
          >
            Create
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProperty;

