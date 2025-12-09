import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Upload, Trash2, Plus, X, Check } from 'lucide-react';
import Input from '../../../../components/common/Input';
import CustomDropdown from '../../components/CustomDropdown';
import { useGetUnit, useUpdateUnit } from '../../../../hooks/useUnitQueries';
import { useGetProperty } from '../../../../hooks/usePropertyQueries';
import { API_ENDPOINTS } from '../../../../config/api.config';
import { getCurrencySymbol } from '../../../../utils/currency.utils';

const EditUnit: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const [searchParams] = useSearchParams();
  const propertyId = searchParams.get('propertyId');
  const navigate = useNavigate();
  const { data: unit } = useGetUnit(unitId || null, !!unitId);
  const { data: property } = useGetProperty(propertyId || null, !!propertyId);
  const updateUnit = useUpdateUnit();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    unitName: '',
    apartmentType: '',
    beds: '',
    baths: '',
    size: '',
    rent: '',
    deposit: '',
    description: '',
    parking: '',
    laundry: '',
    ac: '',
    features: [] as string[],
    amenities: [] as string[],
    customFeature: '',
    customAmenity: '',
    galleryPhotos: [] as Array<{ file: File; url: string }>,
  });

  const [coverPhotoFile, setCoverPhotoFile] = useState<File | null>(null);

  const [customFeatureInput, setCustomFeatureInput] = useState('');
  const [customAmenityInput, setCustomAmenityInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [existingCoverPhotoUrl, setExistingCoverPhotoUrl] = useState<string | null>(null);
  const [existingGalleryPhotoUrls, setExistingGalleryPhotoUrls] = useState<string[]>([]);

  // Populate form data when unit data is loaded
  useEffect(() => {
    if (unit) {
      setFormData({
        unitName: unit.unitName || '',
        apartmentType: unit.apartmentType || '',
        beds: unit.beds?.toString() || '',
        baths: unit.baths?.toString() || '',
        size: unit.sizeSqft?.toString() || '',
        rent: unit.rent?.toString() || '',
        deposit: unit.deposit?.toString() || '',
        description: unit.description || '',
        parking: unit.amenities?.parking?.toLowerCase() || 'none',
        laundry: unit.amenities?.laundry?.toLowerCase() || 'none',
        ac: unit.amenities?.airConditioning?.toLowerCase() || 'none',
        features: unit.amenities?.propertyFeatures || [],
        amenities: unit.amenities?.propertyAmenities || [],
        customFeature: '',
        customAmenity: '',
        galleryPhotos: [],
      });
      
      setCoverPhotoFile(null);

      if (unit.coverPhotoUrl) {
        setExistingCoverPhotoUrl(unit.coverPhotoUrl);
      }

      if (unit.photos && unit.photos.length > 0) {
        setExistingGalleryPhotoUrls(unit.photos.map((p: any) => p.photoUrl));
      }
    }
  }, [unit]);

  // Refs for file inputs
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryPhotosInputRef = useRef<HTMLInputElement>(null);
  
  // Ref to track object URLs for cleanup
  const galleryPhotoUrlsRef = useRef<string[]>([]);

  // Cleanup: Revoke all object URLs on unmount
  useEffect(() => {
    return () => {
      // Revoke all gallery photo URLs
      galleryPhotoUrlsRef.current.forEach(url => {
        URL.revokeObjectURL(url);
      });
      galleryPhotoUrlsRef.current = [];
    };
  }, []); // Empty deps - only run on unmount

  // Options
  const parkingOptions = [
    { value: 'garage', label: 'Garage' },
    { value: 'street', label: 'Street Parking' },
    { value: 'driveway', label: 'Driveway' },
    { value: 'dedicated_spot', label: 'Dedicated Spot' },
    { value: 'private_lot', label: 'Private Lot' },
    { value: 'assigned', label: 'Assigned' },
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
    { value: 'cooler', label: 'Cooler' },
    { value: 'none', label: 'None' },
  ];

  const unitTypeOptions = [
    { value: '1BHK', label: '1BHK' },
    { value: '2BHK', label: '2BHK' },
    { value: '3BHK', label: '3BHK' },
    { value: '4BHK', label: '4BHK' },
    { value: '5BHK', label: '5BHK' },
    { value: 'Studio', label: 'Studio' },
    { value: 'Villa', label: 'Villa' },
    { value: 'Penthouse', label: 'Penthouse' },
    { value: 'Duplex', label: 'Duplex' },
    { value: 'Townhouse', label: 'Townhouse' },
    { value: 'Apartment', label: 'Apartment' },
    { value: 'Condo', label: 'Condo' },
  ];

  const propertyFeaturesList = [
    'Fireplace', 'Furnished', 'Internet', 'Storage', 'Fire Pit', 'Dishwasher'
  ];

  const propertyAmenitiesList = [
    'Basketball Court', 'Elevator', 'Dog Park', 'Game Room', 'Fire Pit', 'Hot Tub', 'Playground', 'Pool'
  ];

  // Get currency symbol from property country
  const currencySymbol = useMemo(() => {
    if (property?.address?.country) {
      return getCurrencySymbol(property.address.country);
    }
    return '$';
  }, [property]);

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
    if (customAmenityInput.trim()) {
      toggleAmenity(customAmenityInput.trim());
      setCustomAmenityInput('');
    }
  };

  // File Handlers
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverPhotoFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setExistingCoverPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files).map(file => {
        const url = URL.createObjectURL(file);
        galleryPhotoUrlsRef.current.push(url);
        return { file, url };
      });
      setFormData(prev => ({ ...prev, galleryPhotos: [...prev.galleryPhotos, ...newPhotos] }));
    }
  };

  const removeCoverPhoto = () => {
    setCoverPhotoFile(null);
    setExistingCoverPhotoUrl(null);
    if (coverPhotoInputRef.current) coverPhotoInputRef.current.value = '';
  };

  const removeGalleryPhoto = (index: number) => {
    setFormData(prev => {
      // Revoke the URL for the photo being removed
      const photoToRemove = prev.galleryPhotos[index];
      if (photoToRemove) {
        URL.revokeObjectURL(photoToRemove.url);
        // Remove from ref tracking
        galleryPhotoUrlsRef.current = galleryPhotoUrlsRef.current.filter(url => url !== photoToRemove.url);
      }
      return {
        ...prev,
        galleryPhotos: prev.galleryPhotos.filter((_, i) => i !== index)
      };
    });
  };

  const removeExistingGalleryPhoto = (index: number) => {
    setExistingGalleryPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Helper function to upload image
  const uploadImage = async (file: File): Promise<string> => {
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    const response = await fetch(API_ENDPOINTS.UPLOAD.IMAGE, {
      method: 'POST',
      credentials: 'include',
      body: uploadFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to upload image' }));
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  // Map frontend values to backend enum values
  const mapParkingToBackend = (value: string): 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED' => {
    const mapping: Record<string, 'NONE' | 'STREET' | 'GARAGE' | 'DRIVEWAY' | 'DEDICATED_SPOT' | 'PRIVATE_LOT' | 'ASSIGNED'> = {
      'none': 'NONE',
      'street': 'STREET',
      'garage': 'GARAGE',
      'driveway': 'DRIVEWAY',
      'dedicated_spot': 'DEDICATED_SPOT',
      'private_lot': 'PRIVATE_LOT',
      'assigned': 'ASSIGNED',
    };
    // All backend enum cases are explicitly handled above
    if (!(value in mapping)) {
      console.warn(`Unknown parking value: ${value}, defaulting to NONE`);
      return 'NONE';
    }
    return mapping[value];
  };

  const mapLaundryToBackend = (value: string): 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS' => {
    const mapping: Record<string, 'NONE' | 'IN_UNIT' | 'ON_SITE' | 'HOOKUPS'> = {
      'none': 'NONE',
      'in_unit': 'IN_UNIT',
      'on_site': 'ON_SITE',
      'hookups': 'HOOKUPS',
    };
    return mapping[value] || 'NONE';
  };

  const mapACToBackend = (value: string): 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER' => {
    const mapping: Record<string, 'NONE' | 'CENTRAL' | 'WINDOW' | 'PORTABLE' | 'COOLER'> = {
      'none': 'NONE',
      'central': 'CENTRAL',
      'window': 'WINDOW',
      'portable': 'PORTABLE',
      'cooler': 'COOLER',
    };
    // All backend enum cases are explicitly handled above
    if (!(value in mapping)) {
      console.warn(`Unknown AC value: ${value}, defaulting to NONE`);
      return 'NONE';
    }
    return mapping[value];
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.unitName.trim()) {
      errors.unitName = 'Unit name is required';
    }

    if (!formData.beds || formData.beds.trim() === '') {
      errors.beds = 'Beds is required';
    }


    if (!formData.baths || formData.baths.trim() === '') {
      errors.baths = 'Baths is required';
    } else {
      const bathsValue = parseFloat(formData.baths);
      if (isNaN(bathsValue) || bathsValue < 0) {
        errors.baths = 'Baths must be a positive number';
      }
    }

    if (formData.size && formData.size.trim() !== '') {
      const sizeValue = parseFloat(formData.size);
      if (isNaN(sizeValue) || sizeValue <= 0) {
        errors.size = 'Size must be a positive number';
      }
    }

    if (formData.rent && formData.rent.trim() !== '') {
      const rentValue = parseFloat(formData.rent);
      if (isNaN(rentValue) || rentValue < 0) {
        errors.rent = 'Rent must be a positive number';
      }
    }

    if (formData.deposit && formData.deposit.trim() !== '') {
      const depositValue = parseFloat(formData.deposit);
      if (isNaN(depositValue) || depositValue < 0) {
        errors.deposit = 'Deposit must be a positive number';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setValidationErrors({});

    if (!validateForm()) {
      setLoading(false);
      setError('Please fix the validation errors before submitting');
      return;
    }

    try {
      // Step 1: Upload cover photo if new file selected
      let coverPhotoUrl: string | undefined;
      if (coverPhotoFile) {
        coverPhotoUrl = await uploadImage(coverPhotoFile);
      } else if (existingCoverPhotoUrl && !existingCoverPhotoUrl.startsWith('blob:') && !existingCoverPhotoUrl.startsWith('data:')) {
        // Keep existing URL if it's not a blob/data URL (newly uploaded/preview)
        coverPhotoUrl = existingCoverPhotoUrl;
      }

      // Step 2: Upload gallery photos
      const galleryPhotoUrls: string[] = [...existingGalleryPhotoUrls];
      for (const photo of formData.galleryPhotos) {
        const url = await uploadImage(photo.file);
        galleryPhotoUrls.push(url);
      }

      // Step 3: Prepare unit update data
      const updateData: any = {
        unitName: formData.unitName,
      };

      if (formData.apartmentType) {
        updateData.apartmentType = formData.apartmentType;
      }
      if (formData.size) {
        updateData.sizeSqft = parseFloat(formData.size);
      }
      if (formData.beds) {
        updateData.beds = parseInt(formData.beds);
      }
      if (formData.baths) {
        updateData.baths = parseFloat(formData.baths);
      }
      if (formData.rent) {
        updateData.rent = parseFloat(formData.rent);
      }
      if (formData.deposit) {
        updateData.deposit = parseFloat(formData.deposit);
      }
      if (coverPhotoUrl) {
        updateData.coverPhotoUrl = coverPhotoUrl;
      }
      if (formData.description) {
        updateData.description = formData.description;
      }

      // Add amenities
      updateData.amenities = {
        parking: mapParkingToBackend(formData.parking || 'none'),
        laundry: mapLaundryToBackend(formData.laundry || 'none'),
        airConditioning: mapACToBackend(formData.ac || 'none'),
        propertyFeatures: formData.features.length > 0 ? formData.features : undefined,
        propertyAmenities: formData.amenities.length > 0 ? formData.amenities : undefined,
      };

      // Add photos (cover photo + gallery photos)
      const photos: Array<{ photoUrl: string; isPrimary: boolean }> = [];
      if (coverPhotoUrl) {
        photos.push({ photoUrl: coverPhotoUrl, isPrimary: true });
      }
      galleryPhotoUrls.forEach((url, index) => {
        photos.push({ photoUrl: url, isPrimary: index === 0 && !coverPhotoUrl });
      });
      if (photos.length > 0) {
        updateData.photos = photos;
      }

      // Step 4: Update unit
      if (unitId) {
        await updateUnit.mutateAsync({ unitId, updateData });
      }

      // Step 5: Navigate back to unit detail
      if (unitId && propertyId) {
        navigate(`/dashboard/units/${unitId}?propertyId=${propertyId}`);
      } else if (unitId) {
        navigate(`/dashboard/units/${unitId}`);
      } else {
        navigate('/dashboard/portfolio/units');
      }
    } catch (err) {
      console.error('Error updating unit:', err);
      setError(err instanceof Error ? err.message : 'Failed to update unit');
    } finally {
      setLoading(false);
    }
  };

  if (!unit && !loading) {
    return (
      <div className="bg-[#DFE5E3] min-h-screen max-w-6xl mx-auto p-8 font-sans rounded-xl text-[#4B5563] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">Unit not found</p>
          <button
            onClick={() => navigate('/dashboard/portfolio/units')}
            className="bg-[#3A6D6C] text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-[#2c5554] transition-colors"
          >
            Back to Units
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#DFE5E3] min-h-screen max-w-6xl mx-auto p-8 font-sans rounded-xl text-[#4B5563]">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Edit Unit</h1>
          <button
            type="button"
            onClick={() => {
              if (unitId && propertyId) {
                navigate(`/dashboard/units/${unitId}?propertyId=${propertyId}`);
              } else {
                navigate('/dashboard/portfolio/units');
              }
            }}
            className="text-gray-600 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Unit Cover Photo */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Unit Cover Photo</h2>
          <input
            type="file"
            ref={coverPhotoInputRef}
            onChange={handleCoverPhotoChange}
            accept="image/*"
            className="hidden"
          />
          {existingCoverPhotoUrl ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-2 flex flex-col items-center justify-center h-64 relative overflow-hidden">
              <img
                src={existingCoverPhotoUrl}
                alt="Unit Cover"
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
                <span className="text-xs font-medium text-gray-500">Upload Cover Photo</span>
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
            {existingGalleryPhotoUrls.map((url, i) => (
              <div key={`existing-${i}`} className="bg-white rounded-xl border border-gray-200 w-40 h-40 flex flex-col items-center justify-center relative overflow-hidden">
                <img
                  src={url}
                  alt={`Gallery ${i}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeExistingGalleryPhoto(i)}
                  className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {formData.galleryPhotos.map((photo, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 w-40 h-40 flex flex-col items-center justify-center relative overflow-hidden">
                <img
                  src={photo.url}
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

        {/* Unit Information */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Unit Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Unit Name*</label>
              <Input
                placeholder="Unit Name (e.g., Unit 1, Studio, Apartment A)"
                value={formData.unitName}
                onChange={(e) => {
                  updateFormData('unitName', e.target.value);
                  if (validationErrors.unitName) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.unitName;
                      return newErrors;
                    });
                  }
                }}
                className={`bg-white border-gray-200 ${validationErrors.unitName ? 'border-red-500' : ''}`}
              />
              {validationErrors.unitName && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.unitName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Apartment Type</label>
              <CustomDropdown
                value={formData.apartmentType}
                onChange={(value) => updateFormData('apartmentType', value)}
                options={unitTypeOptions}
                placeholder="Select apartment type"
                buttonClassName="bg-white border-gray-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 ml-1">Beds*</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.beds}
                  onChange={(e) => {
                    updateFormData('beds', e.target.value);
                    if (validationErrors.beds) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.beds;
                        return newErrors;
                      });
                    }
                  }}
                  className={`bg-white border-gray-200 ${validationErrors.beds ? 'border-red-500' : ''}`}
                />
                {validationErrors.beds && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.beds}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 ml-1">Baths*</label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="0"
                  value={formData.baths}
                  onChange={(e) => {
                    updateFormData('baths', e.target.value);
                    if (validationErrors.baths) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.baths;
                        return newErrors;
                      });
                    }
                  }}
                  className={`bg-white border-gray-200 ${validationErrors.baths ? 'border-red-500' : ''}`}
                />
                {validationErrors.baths && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.baths}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Size (sq.ft)</label>
              <Input
                type="number"
                placeholder="Enter size in square feet"
                value={formData.size}
                onChange={(e) => {
                  updateFormData('size', e.target.value);
                  if (validationErrors.size) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.size;
                      return newErrors;
                    });
                  }
                }}
                className={`bg-white border-gray-200 ${validationErrors.size ? 'border-red-500' : ''}`}
              />
              {validationErrors.size && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.size}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Rent ({currencySymbol})</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter monthly rent"
                value={formData.rent}
                onChange={(e) => {
                  updateFormData('rent', e.target.value);
                  if (validationErrors.rent) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.rent;
                      return newErrors;
                    });
                  }
                }}
                className={`bg-white border-gray-200 ${validationErrors.rent ? 'border-red-500' : ''}`}
              />
              {validationErrors.rent && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.rent}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Deposit ({currencySymbol})</label>
              <Input
                type="number"
                step="0.01"
                placeholder="Enter security deposit"
                value={formData.deposit}
                onChange={(e) => {
                  updateFormData('deposit', e.target.value);
                  if (validationErrors.deposit) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.deposit;
                      return newErrors;
                    });
                  }
                }}
                className={`bg-white border-gray-200 ${validationErrors.deposit ? 'border-red-500' : ''}`}
              />
              {validationErrors.deposit && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.deposit}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Description</label>
              <textarea
                placeholder="Enter unit description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] focus:border-transparent resize-none"
              />
            </div>
          </div>
        </section>

        {/* Amenities */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Amenities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Parking</label>
              <CustomDropdown
                value={formData.parking}
                onChange={(value) => updateFormData('parking', value)}
                options={parkingOptions}
                placeholder="Select parking"
                buttonClassName="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Laundry</label>
              <CustomDropdown
                value={formData.laundry}
                onChange={(value) => updateFormData('laundry', value)}
                options={laundryOptions}
                placeholder="Select laundry"
                buttonClassName="bg-white border-gray-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Air Conditioning</label>
              <CustomDropdown
                value={formData.ac}
                onChange={(value) => updateFormData('ac', value)}
                options={acOptions}
                placeholder="Select AC"
                buttonClassName="bg-white border-gray-200"
              />
            </div>
          </div>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Unit Features</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {propertyFeaturesList.map((feature) => (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.features.includes(feature)
                    ? 'bg-[#82D64D] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {formData.features.includes(feature) && <Check size={16} className="inline mr-1" />}
                {feature}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add custom feature"
              value={customFeatureInput}
              onChange={(e) => setCustomFeatureInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomFeature();
                }
              }}
              className="bg-white border-gray-200"
            />
            <button
              type="button"
              onClick={addCustomFeature}
              className="px-4 py-2 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5554] transition-colors"
            >
              Add
            </button>
          </div>
        </section>

        {/* Property Amenities */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Unit Amenities</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {propertyAmenitiesList.map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  formData.amenities.includes(amenity)
                    ? 'bg-[#82D64D] text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {formData.amenities.includes(amenity) && <Check size={16} className="inline mr-1" />}
                {amenity}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add custom amenity"
              value={customAmenityInput}
              onChange={(e) => setCustomAmenityInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomAmenity();
                }
              }}
              className="bg-white border-gray-200"
            />
            <button
              type="button"
              onClick={addCustomAmenity}
              className="px-4 py-2 bg-[#3A6D6C] text-white rounded-lg font-medium hover:bg-[#2c5554] transition-colors"
            >
              Add
            </button>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              if (unitId && propertyId) {
                navigate(`/dashboard/units/${unitId}?propertyId=${propertyId}`);
              } else {
                navigate('/dashboard/portfolio/units');
              }
            }}
            disabled={loading}
            className="px-8 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2 bg-[#376F7E] text-white rounded-lg font-medium hover:bg-[#2c5a66] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Unit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditUnit;
