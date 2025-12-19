import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Trash2, Plus, X, Check, FileText, Undo2 } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';
import Input from '../../../../components/common/Input';
import CustomDropdown from '../../components/CustomDropdown';
import { propertyService } from '../../../../services/property.service';
import { API_ENDPOINTS } from '../../../../config/api.config';
import { getCurrencySymbol } from '../../../../utils/currency.utils';

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
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Location data
  const [countries, setCountries] = useState<ICountry[]>([]);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    propertyName: '',
    yearBuilt: '',
    mls: '',
    streetAddress: '',
    city: '',
    stateRegion: '',
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
    description: '',
    coverPhoto: null as File | null,
    galleryPhotos: [] as File[],
    attachments: [] as File[],
    units: [] as Unit[],
  });

  const [customFeatureInput, setCustomFeatureInput] = useState('');
  const [customAmenityInput, setCustomAmenityInput] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [attachmentErrors, setAttachmentErrors] = useState<{ id: number; name: string }[]>([]);

  // Allowed MIME types for document attachments
  const allowedDocumentTypes = [
    'application/pdf',
    'application/msword', // .doc
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/vnd.ms-excel', // .xls
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  ];

  // Refs for file inputs
  const coverPhotoInputRef = useRef<HTMLInputElement>(null);
  const galleryPhotosInputRef = useRef<HTMLInputElement>(null);
  const attachmentsInputRef = useRef<HTMLInputElement>(null);

  // Load all countries on mount
  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  // Load states when country changes
  useEffect(() => {
    if (formData.country) {
      const countryStates = State.getStatesOfCountry(formData.country);
      setStates(countryStates);
      // Reset state and city when country changes
      if (formData.stateRegion) {
        updateFormData('stateRegion', '');
      }
      if (formData.city) {
        updateFormData('city', '');
      }
    } else {
      setStates([]);
    }
  }, [formData.country]);

  // Load cities when state changes
  useEffect(() => {
    if (formData.country && formData.stateRegion) {
      const stateCities = City.getCitiesOfState(formData.country, formData.stateRegion);
      setCities(stateCities);
      // Reset city when state changes
      if (formData.city) {
        updateFormData('city', '');
      }
    } else {
      setCities([]);
    }
  }, [formData.country, formData.stateRegion]);

  // Convert countries to dropdown options
  const countryOptions = useMemo(() => {
    return countries.map(country => ({
      value: country.isoCode,
      label: country.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [countries]);

  // Convert states to dropdown options
  const stateOptions = useMemo(() => {
    return states.map(state => ({
      value: state.isoCode,
      label: state.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [states]);

  // Convert cities to dropdown options
  const cityOptions = useMemo(() => {
    return cities.map(city => ({
      value: city.name,
      label: city.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, [cities]);

  // Get current currency symbol based on selected country
  const currencySymbol = useMemo(() => {
    return getCurrencySymbol(formData.country);
  }, [formData.country]);


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
      const files = Array.from(e.target.files);
      const validFiles: File[] = [];
      const invalidFiles: { id: number; name: string }[] = [];

      files.forEach(file => {
        if (allowedDocumentTypes.includes(file.type)) {
          validFiles.push(file);
        } else {
          invalidFiles.push({ id: Date.now() + Math.random(), name: file.name });
        }
      });

      if (invalidFiles.length > 0) {
        // Store invalid filenames as objects with id and name
        setAttachmentErrors(prev => [...prev, ...invalidFiles]);
        // Clear these specific errors after 5 seconds
        setTimeout(() => {
          setAttachmentErrors(prev =>
            prev.filter(err => !invalidFiles.some(invalid => invalid.id === err.id)),
          );
        }, 5000);
      }

      if (validFiles.length > 0) {
        setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...validFiles] }));
      }
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

  // Helper function to upload image
  const uploadImage = async (file: File, propertyId?: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    if (propertyId) {
      formData.append('propertyId', propertyId);
    }

    const response = await fetch(API_ENDPOINTS.UPLOAD.IMAGE, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to upload image' }));
      throw new Error(errorData.message || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  };

  // Helper function to upload file/document
  const uploadFile = async (file: File, propertyId?: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'DOCUMENT');
    if (propertyId) {
      formData.append('propertyId', propertyId);
    }

    const response = await fetch(API_ENDPOINTS.UPLOAD.FILE, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to upload file' }));
      throw new Error(errorData.message || 'Failed to upload file');
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
      'private_lot': 'PRIVATE_LOT',
    };
    return mapping[value] || 'NONE';
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
    };
    return mapping[value] || 'NONE';
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Required fields
    if (!formData.propertyName.trim()) {
      errors.propertyName = 'Property name is required';
    }

    if (!formData.streetAddress.trim()) {
      errors.streetAddress = 'Street address is required';
    }

    if (!formData.city) {
      errors.city = 'City is required';
    }

    if (!formData.stateRegion) {
      errors.stateRegion = 'State/Region is required';
    }

    if (!formData.zip.trim()) {
      errors.zip = 'Zip code is required';
    }

    if (!formData.country) {
      errors.country = 'Country is required';
    }

    // Year Built validation (must be integer if provided)
    if (formData.yearBuilt && formData.yearBuilt.trim() !== '') {
      const yearValue = parseInt(formData.yearBuilt);
      if (isNaN(yearValue) || !Number.isInteger(yearValue)) {
        errors.yearBuilt = 'Year built must be a valid integer';
      } else if (yearValue < 1000 || yearValue > new Date().getFullYear() + 1) {
        errors.yearBuilt = `Year built must be between 1000 and ${new Date().getFullYear() + 1}`;
      }
    }

    // MLS validation (must be integer if provided)
    if (formData.mls && formData.mls.trim() !== '') {
      const mlsValue = parseInt(formData.mls);
      if (isNaN(mlsValue) || !Number.isInteger(mlsValue)) {
        errors.mls = 'MLS number must be a valid integer';
      } else if (mlsValue < 0) {
        errors.mls = 'MLS number must be a positive number';
      }
    }

    // Size validation (must be positive number if provided)
    if (formData.size && formData.size.trim() !== '') {
      const sizeValue = parseFloat(formData.size);
      if (isNaN(sizeValue) || sizeValue <= 0) {
        errors.size = 'Size must be a positive number';
      }
    }

    // Market Rent validation (must be positive number if provided)
    if (formData.marketRent && formData.marketRent.trim() !== '') {
      const rentValue = parseFloat(formData.marketRent);
      if (isNaN(rentValue) || rentValue < 0) {
        errors.marketRent = 'Market rent must be a positive number';
      }
    }

    // Deposit validation (must be positive number if provided)
    if (formData.deposit && formData.deposit.trim() !== '') {
      const depositValue = parseFloat(formData.deposit);
      if (isNaN(depositValue) || depositValue < 0) {
        errors.deposit = 'Deposit must be a positive number';
      }
    }

    // Single unit validations
    if (formData.propertyType === 'single') {
      if (!formData.beds) {
        errors.beds = 'Beds is required';
      }
      if (!formData.baths) {
        errors.baths = 'Baths is required';
      }
      if (!formData.size || formData.size.trim() === '') {
        errors.size = 'Size is required';
      }
      if (!formData.marketRent || formData.marketRent.trim() === '') {
        errors.marketRent = 'Market rent is required';
      }
      if (!formData.deposit || formData.deposit.trim() === '') {
        errors.deposit = 'Deposit is required';
      }
      if (!formData.parking) {
        errors.parking = 'Parking is required';
      }
      if (!formData.laundry) {
        errors.laundry = 'Laundry is required';
      }
      if (!formData.ac) {
        errors.ac = 'Air conditioning is required';
      }
    }

    // Multi unit validations
    if (formData.propertyType === 'multi') {
      if (formData.units.length === 0) {
        errors.units = 'At least one unit is required for multi-unit properties';
      } else {
        formData.units.forEach((unit, index) => {
          if (!unit.unitNumber.trim()) {
            errors[`unit_${index}_unitNumber`] = `Unit ${index + 1} number is required`;
          }
          if (!unit.unitType.trim()) {
            errors[`unit_${index}_unitType`] = `Unit ${index + 1} type is required`;
          }
          if (!unit.size || unit.size.trim() === '') {
            errors[`unit_${index}_size`] = `Unit ${index + 1} size is required`;
          }
          if (!unit.beds || unit.beds.trim() === '') {
            errors[`unit_${index}_beds`] = `Unit ${index + 1} beds is required`;
          }
          if (!unit.baths || unit.baths.trim() === '') {
            errors[`unit_${index}_baths`] = `Unit ${index + 1} baths is required`;
          }
          if (!unit.rent || unit.rent.trim() === '') {
            errors[`unit_${index}_rent`] = `Unit ${index + 1} rent is required`;
          }
          if (!unit.deposit || unit.deposit.trim() === '') {
            errors[`unit_${index}_deposit`] = `Unit ${index + 1} deposit is required`;
          }

          // Validate unit numeric fields
          if (unit.size && unit.size.trim() !== '') {
            const sizeValue = parseFloat(unit.size);
            if (isNaN(sizeValue) || sizeValue <= 0) {
              errors[`unit_${index}_size`] = `Unit ${index + 1} size must be a positive number`;
            }
          }
          if (unit.rent && unit.rent.trim() !== '') {
            const rentValue = parseFloat(unit.rent);
            if (isNaN(rentValue) || rentValue < 0) {
              errors[`unit_${index}_rent`] = `Unit ${index + 1} rent must be a positive number`;
            }
          }
          if (unit.deposit && unit.deposit.trim() !== '') {
            const depositValue = parseFloat(unit.deposit);
            if (isNaN(depositValue) || depositValue < 0) {
              errors[`unit_${index}_deposit`] = `Unit ${index + 1} deposit must be a positive number`;
            }
          }
          if (unit.baths && unit.baths.trim() !== '') {
            const bathsValue = parseFloat(unit.baths);
            if (isNaN(bathsValue) || bathsValue < 0) {
              errors[`unit_${index}_baths`] = `Unit ${index + 1} baths must be a positive number`;
            }
          }
        });
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

    // Validate form before submission
    if (!validateForm()) {
      setLoading(false);
      setError('Please fix the validation errors before submitting');
      return;
    }

    try {
      // Step 1: Upload cover photo first (if exists)
      let coverPhotoUrl: string | undefined;
      if (formData.coverPhoto) {
        coverPhotoUrl = await uploadImage(formData.coverPhoto);
      }

      // Step 2: Upload gallery photos
      const galleryPhotoUrls: string[] = [];
      for (const photo of formData.galleryPhotos) {
        const url = await uploadImage(photo);
        galleryPhotoUrls.push(url);
      }

      // Step 3: Prepare property data
      const propertyData: any = {
        propertyName: formData.propertyName,
        propertyType: formData.propertyType === 'single' ? 'SINGLE' : 'MULTI',
        address: {
          streetAddress: formData.streetAddress,
          city: formData.city,
          stateRegion: formData.stateRegion,
          zipCode: formData.zip,
          country: formData.country,
        },
      };

      // Add optional fields
      if (formData.yearBuilt && formData.yearBuilt.trim() !== '') {
        propertyData.yearBuilt = parseInt(formData.yearBuilt);
      }
      if (formData.mls && formData.mls.trim() !== '') {
        propertyData.mlsNumber = parseInt(formData.mls);
      }
      if (formData.size) {
        propertyData.sizeSqft = parseFloat(formData.size);
      }
      if (formData.marketRent) {
        propertyData.marketRent = parseFloat(formData.marketRent);
      }
      if (formData.deposit) {
        propertyData.depositAmount = parseFloat(formData.deposit);
      }
      if (coverPhotoUrl) {
        propertyData.coverPhotoUrl = coverPhotoUrl;
      }
      if (formData.description) {
        propertyData.description = formData.description;
      }

      // Add amenities - always send amenities data (even if values are 'none')
      propertyData.amenities = {
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
        propertyData.photos = photos;
      }

      // Add single unit details for SINGLE property type
      if (formData.propertyType === 'single') {
        // Map beds: "Studio" = 0, "1" = 1, "2" = 2, "3+" = 3
        let bedsValue: number | undefined;
        if (formData.beds) {
          if (formData.beds === 'Studio') {
            bedsValue = 0;
          } else if (formData.beds === '3+') {
            bedsValue = 3;
          } else {
            bedsValue = parseInt(formData.beds);
          }
        }

        propertyData.singleUnitDetails = {
          beds: bedsValue,
          baths: formData.baths ? parseFloat(formData.baths) : undefined,
          marketRent: formData.marketRent ? parseFloat(formData.marketRent) : undefined,
          deposit: formData.deposit ? parseFloat(formData.deposit) : undefined,
        };
      }

      // Add units for MULTI property type
      if (formData.propertyType === 'multi' && formData.units.length > 0) {
        propertyData.units = formData.units.map(unit => ({
          unitName: unit.unitNumber || `Unit ${formData.units.indexOf(unit) + 1}`,
          apartmentType: unit.unitType || undefined,
          sizeSqft: unit.size ? parseFloat(unit.size) : undefined,
          beds: unit.beds ? parseInt(unit.beds) : undefined,
          baths: unit.baths ? parseFloat(unit.baths) : undefined,
          rent: unit.rent ? parseFloat(unit.rent) : undefined,
        }));
      }

      // Step 4: Create property
      const createdProperty = await propertyService.create(propertyData);

      // Step 5: Upload attachments after property is created
      // Only upload if there are actual files - the upload API automatically creates PropertyAttachment records when propertyId is provided
      if (formData.attachments.length > 0 && createdProperty.id) {
        await Promise.all(
          formData.attachments.map(file => uploadFile(file, createdProperty.id))
        );
      }
      // Note: If no attachments are provided, no PropertyAttachment records are created (as expected)

      // Step 6: Navigate to properties list
      navigate('/dashboard/properties');
    } catch (err) {
      console.error('Error creating property:', err);
      setError(err instanceof Error ? err.message : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#DFE5E3] min-h-screen max-w-6xl mx-auto p-8 font-sans rounded-xl text-[#4B5563]">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
        </div>
      )}
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
                onChange={(e) => {
                  updateFormData('propertyName', e.target.value);
                  if (validationErrors.propertyName) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.propertyName;
                      return newErrors;
                    });
                  }
                }}
                className={`bg-white border-gray-200 ${validationErrors.propertyName ? 'border-red-500' : ''}`}
              />
              {validationErrors.propertyName && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.propertyName}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium mb-1 ml-1">Year Built*</label>
                <Input
                  type="number"
                  placeholder="2021"
                  value={formData.yearBuilt}
                  onChange={(e) => {
                    updateFormData('yearBuilt', e.target.value);
                    if (validationErrors.yearBuilt) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.yearBuilt;
                        return newErrors;
                      });
                    }
                  }}
                  className={`bg-white border-gray-200 ${validationErrors.yearBuilt ? 'border-red-500' : ''}`}
                />
                {validationErrors.yearBuilt && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.yearBuilt}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 ml-1">MLS</label>
                <Input
                  type="number"
                  placeholder="Enter MLS Number"
                  value={formData.mls}
                  onChange={(e) => {
                    updateFormData('mls', e.target.value);
                    if (validationErrors.mls) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.mls;
                        return newErrors;
                      });
                    }
                  }}
                  className={`bg-white border-gray-200 ${validationErrors.mls ? 'border-red-500' : ''}`}
                />
                {validationErrors.mls && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.mls}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 ml-1">Street address*</label>
              <Input
                placeholder="Street Address"
                value={formData.streetAddress}
                onChange={(e) => {
                  updateFormData('streetAddress', e.target.value);
                  if (validationErrors.streetAddress) {
                    setValidationErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors.streetAddress;
                      return newErrors;
                    });
                  }
                }}
                className={`bg-white border-gray-200 ${validationErrors.streetAddress ? 'border-red-500' : ''}`}
              />
              {validationErrors.streetAddress && (
                <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.streetAddress}</p>
              )}
            </div>

            {/* Country & State/Region */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <CustomDropdown
                  label="Country"
                  value={formData.country}
                  onChange={(value) => {
                    updateFormData('country', value);
                    if (validationErrors.country) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.country;
                        return newErrors;
                      });
                    }
                  }}
                  options={countryOptions}
                  placeholder="Select country"
                  required
                  disabled={countryOptions.length === 0}
                  searchable={true}
                  buttonClassName={`bg-white border-gray-200 ${validationErrors.country ? 'border-red-500' : ''}`}
                />
                {validationErrors.country && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.country}</p>
                )}
              </div>
              <div>
                <CustomDropdown
                  label="State / Region"
                  value={formData.stateRegion}
                  onChange={(value) => {
                    updateFormData('stateRegion', value);
                    if (validationErrors.stateRegion) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.stateRegion;
                        return newErrors;
                      });
                    }
                  }}
                  options={stateOptions}
                  placeholder={formData.country ? "Select state" : "Select country first"}
                  required
                  disabled={!formData.country || stateOptions.length === 0}
                  searchable={true}
                  buttonClassName={`bg-white border-gray-200 ${validationErrors.stateRegion ? 'border-red-500' : ''}`}
                />
                {validationErrors.stateRegion && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.stateRegion}</p>
                )}
              </div>
            </div>

            {/* City & Zip */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <CustomDropdown
                  label="City"
                  value={formData.city}
                  onChange={(value) => {
                    updateFormData('city', value);
                    if (validationErrors.city) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.city;
                        return newErrors;
                      });
                    }
                  }}
                  options={cityOptions}
                  placeholder={formData.stateRegion ? "Select city" : formData.country ? "Select state first" : "Select country first"}
                  required
                  disabled={!formData.stateRegion || cityOptions.length === 0}
                  searchable={true}
                  buttonClassName={`bg-white border-gray-200 ${validationErrors.city ? 'border-red-500' : ''}`}
                />
                {validationErrors.city && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.city}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1 ml-1">Zip *</label>
                <Input
                  placeholder="Enter Zip code"
                  value={formData.zip}
                  onChange={(e) => {
                    updateFormData('zip', e.target.value);
                    if (validationErrors.zip) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.zip;
                        return newErrors;
                      });
                    }
                  }}
                  className={`bg-white border-gray-200 ${validationErrors.zip ? 'border-red-500' : ''}`}
                />
                {validationErrors.zip && (
                  <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.zip}</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Property Type */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Property type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Unit */}
            <div
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${formData.propertyType === 'single'
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'bg-white/50 border-transparent hover:bg-white'
                }`}
              onClick={() => updateFormData('propertyType', 'single')}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.propertyType === 'single' ? 'border-green-500' : 'border-gray-400'
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
              className={`p-6 rounded-2xl border cursor-pointer transition-all ${formData.propertyType === 'multi'
                  ? 'bg-white border-gray-200 shadow-sm'
                  : 'bg-white/50 border-transparent hover:bg-white'
                }`}
              onClick={() => updateFormData('propertyType', 'multi')}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.propertyType === 'multi' ? 'border-green-500' : 'border-gray-400'
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
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${formData.isManufactured ? 'bg-[#84CC16] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                  >
                    {formData.isManufactured && <Check size={14} />} Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => updateFormData('isManufactured', false)}
                    className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium transition-colors ${!formData.isManufactured ? 'bg-[#84CC16] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
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
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-700 outline-none appearance-none ${validationErrors.beds ? 'border-red-500' : 'border-gray-200'}`}
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
                    >
                      <option value="">Studio</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7</option>
                      <option value="8">8</option>
                      <option value="9">9</option>
                      <option value="10">10+</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  {validationErrors.beds && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.beds}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Baths*</label>
                  <div className="relative">
                    <select
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-700 outline-none appearance-none ${validationErrors.baths ? 'border-red-500' : 'border-gray-200'}`}
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
                    >
                      <option value="">None</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6">6</option>
                      <option value="7">7+</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  {validationErrors.baths && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.baths}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Size, sq.ft*</label>
                  <Input
                    type="number"
                    placeholder="500"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">
                    Market Rent* {formData.country && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">{currencySymbol}</span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={formData.marketRent}
                      onChange={(e) => {
                        updateFormData('marketRent', e.target.value);
                        if (validationErrors.marketRent) {
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.marketRent;
                            return newErrors;
                          });
                        }
                      }}
                      className={`bg-white border-gray-200 pl-8 ${validationErrors.marketRent ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {validationErrors.marketRent && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.marketRent}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">
                    Deposit* {formData.country && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">{currencySymbol}</span>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
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
                      className={`bg-white border-gray-200 pl-8 ${validationErrors.deposit ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {validationErrors.deposit && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.deposit}</p>
                  )}
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
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-700 outline-none appearance-none ${validationErrors.parking ? 'border-red-500' : 'border-gray-200'}`}
                      value={formData.parking}
                      onChange={(e) => {
                        updateFormData('parking', e.target.value);
                        if (validationErrors.parking) {
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.parking;
                            return newErrors;
                          });
                        }
                      }}
                    >
                      <option value="">Search</option>
                      {parkingOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  {validationErrors.parking && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.parking}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Laundry*</label>
                  <div className="relative">
                    <select
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-700 outline-none appearance-none ${validationErrors.laundry ? 'border-red-500' : 'border-gray-200'}`}
                      value={formData.laundry}
                      onChange={(e) => {
                        updateFormData('laundry', e.target.value);
                        if (validationErrors.laundry) {
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.laundry;
                            return newErrors;
                          });
                        }
                      }}
                    >
                      <option value="">Search</option>
                      {laundryOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  {validationErrors.laundry && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.laundry}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 ml-1">Air Conditioning*</label>
                  <div className="relative">
                    <select
                      className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-700 outline-none appearance-none ${validationErrors.ac ? 'border-red-500' : 'border-gray-200'}`}
                      value={formData.ac}
                      onChange={(e) => {
                        updateFormData('ac', e.target.value);
                        if (validationErrors.ac) {
                          setValidationErrors(prev => {
                            const newErrors = { ...prev };
                            delete newErrors.ac;
                            return newErrors;
                          });
                        }
                      }}
                    >
                      <option value="">Search</option>
                      {acOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                  {validationErrors.ac && (
                    <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors.ac}</p>
                  )}
                </div>
              </div>
            </section>

            {/* Property Features */}
            <section>
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Property features</h2>
              <div className="flex flex-wrap gap-3 mb-6">
                {/* Predefined features */}
                {propertyFeaturesList.map(feature => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-2 ${formData.features.includes(feature)
                        ? 'bg-[#84CC16] text-white border-[#84CC16]'
                        : 'bg-white text-gray-600 border-gray-300 hover:border-[#84CC16]'
                      }`}
                  >
                    {feature}
                    {formData.features.includes(feature) && <X size={12} className="ml-1" onClick={(e) => { e.stopPropagation(); toggleFeature(feature); }} />}
                    {!formData.features.includes(feature) && <Plus size={12} className="ml-1" />}
                  </button>
                ))}
                {/* Custom features (not in predefined list) */}
                {formData.features
                  .filter(feature => !propertyFeaturesList.includes(feature))
                  .map(feature => (
                    <button
                      key={feature}
                      type="button"
                      onClick={() => toggleFeature(feature)}
                      className="px-4 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-2 bg-[#84CC16] text-black border-[#84CC16]"
                    >
                      {feature}
                      <X size={12} className="ml-1" onClick={(e) => { e.stopPropagation(); toggleFeature(feature); }} />
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
                      className="bg-[#84CC16] placeholder-white/80 border-none"
                      style={{ color: 'black' }}
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
            {validationErrors.units && (
              <p className="text-red-500 text-xs mb-2 ml-1">{validationErrors.units}</p>
            )}
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
                        onChange={(e) => {
                          updateUnit(index, 'unitNumber', e.target.value);
                          const errorKey = `unit_${index}_unitNumber`;
                          if (validationErrors[errorKey]) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors[errorKey];
                              return newErrors;
                            });
                          }
                        }}
                        className={`bg-white border-gray-200 ${validationErrors[`unit_${index}_unitNumber`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`unit_${index}_unitNumber`] && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors[`unit_${index}_unitNumber`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">unit type*</label>
                      <div className="relative">
                        <select
                          className={`w-full rounded-lg border bg-white px-3 py-2 text-gray-700 outline-none appearance-none ${validationErrors[`unit_${index}_unitType`] ? 'border-red-500' : 'border-gray-200'}`}
                          value={unit.unitType}
                          onChange={(e) => {
                            updateUnit(index, 'unitType', e.target.value);
                            const errorKey = `unit_${index}_unitType`;
                            if (validationErrors[errorKey]) {
                              setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors[errorKey];
                                return newErrors;
                              });
                            }
                          }}
                        >
                          <option value="">Select unit type</option>
                          {unitTypeOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L5 5L9 1" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>
                      {validationErrors[`unit_${index}_unitType`] && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors[`unit_${index}_unitType`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">Size, sq.ft*</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="500.00"
                        value={unit.size}
                        onChange={(e) => {
                          updateUnit(index, 'size', e.target.value);
                          const errorKey = `unit_${index}_size`;
                          if (validationErrors[errorKey]) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors[errorKey];
                              return newErrors;
                            });
                          }
                        }}
                        className={`bg-white border-gray-200 ${validationErrors[`unit_${index}_size`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`unit_${index}_size`] && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors[`unit_${index}_size`]}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">Baths*</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={unit.baths}
                        onChange={(e) => {
                          updateUnit(index, 'baths', e.target.value);
                          const errorKey = `unit_${index}_baths`;
                          if (validationErrors[errorKey]) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors[errorKey];
                              return newErrors;
                            });
                          }
                        }}
                        className={`bg-white border-gray-200 ${validationErrors[`unit_${index}_baths`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`unit_${index}_baths`] && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors[`unit_${index}_baths`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">
                        Rent* {formData.country && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">{currencySymbol}</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={unit.rent}
                          onChange={(e) => {
                            updateUnit(index, 'rent', e.target.value);
                            const errorKey = `unit_${index}_rent`;
                            if (validationErrors[errorKey]) {
                              setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors[errorKey];
                                return newErrors;
                              });
                            }
                          }}
                          className={`bg-white border-gray-200 pl-8 ${validationErrors[`unit_${index}_rent`] ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {validationErrors[`unit_${index}_rent`] && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors[`unit_${index}_rent`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">
                        Deposit* {formData.country && <span className="text-xs text-gray-500 font-normal">({currencySymbol})</span>}
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-medium">{currencySymbol}</span>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={unit.deposit}
                          onChange={(e) => {
                            updateUnit(index, 'deposit', e.target.value);
                            const errorKey = `unit_${index}_deposit`;
                            if (validationErrors[errorKey]) {
                              setValidationErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors[errorKey];
                                return newErrors;
                              });
                            }
                          }}
                          className={`bg-white border-gray-200 pl-8 ${validationErrors[`unit_${index}_deposit`] ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {validationErrors[`unit_${index}_deposit`] && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors[`unit_${index}_deposit`]}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1 ml-1">Beds*</label>
                      <Input
                        type="number"
                        placeholder="Select beds"
                        value={unit.beds}
                        onChange={(e) => {
                          updateUnit(index, 'beds', e.target.value);
                          const errorKey = `unit_${index}_beds`;
                          if (validationErrors[errorKey]) {
                            setValidationErrors(prev => {
                              const newErrors = { ...prev };
                              delete newErrors[errorKey];
                              return newErrors;
                            });
                          }
                        }}
                        className={`bg-white border-gray-200 ${validationErrors[`unit_${index}_beds`] ? 'border-red-500' : ''}`}
                      />
                      {validationErrors[`unit_${index}_beds`] && (
                        <p className="text-red-500 text-xs mt-1 ml-1">{validationErrors[`unit_${index}_beds`]}</p>
                      )}
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
            {/* Predefined amenities */}
            {propertyAmenitiesList.map(amenity => (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-2 ${formData.amenities.includes(amenity)
                    ? 'bg-[#84CC16] text-white border-[#84CC16]'
                    : 'bg-[#84CC16] text-white border-[#84CC16] hover:opacity-90'
                  }`}
              >
                {amenity}
                {formData.amenities.includes(amenity) ? <Check size={12} className="ml-1" /> : <Plus size={12} className="ml-1" />}
              </button>
            ))}
            {/* Custom amenities (not in predefined list) */}
            {formData.amenities
              .filter(amenity => !propertyAmenitiesList.includes(amenity))
              .map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className="px-4 py-1.5 rounded-full text-xs font-medium border transition-colors flex items-center gap-2 bg-[#84CC16] text-black border-[#84CC16]"
                >
                  {amenity}
                  <Check size={12} className="ml-1" />
                </button>
              ))}
          </div>

          {/* Custom Amenities Input - Available for all property types */}
          <div className="mb-6">
            <label className="block text-xs font-medium mb-2 ml-1">Enter Custom Amenities</label>
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Custom Amenities"
                  value={customAmenityInput}
                  onChange={(e) => setCustomAmenityInput(e.target.value)}
                  className="bg-[#84CC16] placeholder-black/80 border-none"
                  style={{ color: 'black' }}
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
                onClick={() => setCustomAmenityInput('')}
                className="px-8 py-2 bg-[#4B5563] text-white rounded-full text-sm font-medium hover:bg-[#374151]"
              >
                Close
              </button>
            </div>
          </div>
        </section>

        {/* Property Description */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Property Description</h2>
          <div className="w-full bg-[#F3F4F6] rounded-2xl overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-[#3D7475] px-6 py-4 flex items-center gap-3 text-white">
              <Undo2 size={20} className="rotate-180" />
              <span className="font-medium text-lg">Description</span>
            </div>

            {/* Textarea */}
            <div className="p-0">
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Add the marketing description here."
                className="w-full h-64 p-6 bg-[#F3F4F6] resize-none focus:outline-none text-gray-700 placeholder-gray-500"
              />
            </div>
          </div>
        </section>

        {/* Property Attachments */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Property Attachments</h2>
          <input
            type="file"
            ref={attachmentsInputRef}
            onChange={handleAttachmentsChange}
            multiple
            accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="hidden"
          />

          {attachmentErrors.length > 0 && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              <p className="font-semibold mb-2">Invalid file types:</p>
              <ul className="list-disc list-inside text-sm">
                {attachmentErrors.map((error, i) => (
                  <li key={`${error.id}-${i}`}>{error.name}</li>
                ))}
              </ul>
              <p className="text-xs mt-2">Allowed types: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)</p>
            </div>
          )}

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
              <span className="text-xs text-gray-400 mt-1">PDF, Word, Excel only</span>
            </div>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard/properties')}
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
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddProperty;

