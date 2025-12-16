import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Upload, FileText, X } from 'lucide-react';
import { format, parse, differenceInYears, isValid } from 'date-fns';
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';
import DatePicker from '../../../../components/ui/DatePicker';
import CustomDropdown from '../../components/CustomDropdown';
import ImageCropModal from './components/ImageCropModal';
import { useTenantFormStore } from './store/tenantFormStore';
import {
  useGetTenant,
  useCreateTenant,
  useUpdateTenant,
  useUploadTenantProfilePhoto,
  useUploadTenantDocument,
} from '../../../../hooks/useTenantQueries';



// Reusable Components
const SectionHeader = ({ title, onRemove, onAdd, showAdd }: { title: string, onRemove?: () => void, onAdd?: () => void, showAdd?: boolean }) => (
    <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        {onRemove && (
            <button
                onClick={onRemove}
                className="bg-[#DC2626] text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-red-700 transition-colors"
            >
                Remove
            </button>
        )}
        {showAdd && onAdd && (
            <button
                onClick={onAdd}
                className="bg-[#3A6D6C] text-white px-4 py-1.5 rounded-full text-xs font-medium hover:bg-[#2c5251] transition-colors flex items-center gap-1"
            >
                Add {title.toLowerCase().replace(/s$/, '')} <Plus size={14} />
            </button>
        )}
    </div>
);

const InputField = ({ label, placeholder, value, onChange, name, type = "text", className = "flex-1", error }: any) => (
    <div className={className}>
        <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">{label}*</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-white border ${error ? 'border-red-500' : 'border-gray-200'} text-gray-800 px-6 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium placeholder:text-gray-400`}
        />
        {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
);

const AddEditTenant = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // Zustand store
    const {
        formData,
        profilePhoto,
        profilePhotoFile,
        documents,
        sections,
        errors,
        submitError,
        setFormData,
        updatePersonalInfo,
        updateForwardingAddress,
        updateEmergencyContact,
        addEmergencyContact,
        removeEmergencyContact,
        updatePet,
        addPet,
        removePet,
        updateVehicle,
        addVehicle,
        removeVehicle,
        setProfilePhoto,
        addDocument,
        removeDocument,
        toggleSection,
        setErrors,
        setSubmitError,
        resetForm,
    } = useTenantFormStore();

    // File Upload Refs
    const profileInputRef = useRef<HTMLInputElement>(null);
    const documentsInputRef = useRef<HTMLInputElement>(null);

    // Image cropping state
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);

    // Location data for forwarding address
    const [countries, setCountries] = React.useState<ICountry[]>([]);
    const [states, setStates] = React.useState<IState[]>([]);
    const [cities, setCities] = React.useState<ICity[]>([]);

    // React Query hooks
    const { data: tenantData, isLoading: isLoadingTenant, error: tenantError } = useGetTenant(id || null, isEditMode);
    const createTenantMutation = useCreateTenant();
    const updateTenantMutation = useUpdateTenant();
    const uploadProfilePhotoMutation = useUploadTenantProfilePhoto();
    const uploadDocumentMutation = useUploadTenantDocument();

    const loading = isLoadingTenant || createTenantMutation.isPending || updateTenantMutation.isPending;

    // Load tenant data in Edit Mode
    useEffect(() => {
        if (isEditMode && tenantData) {
            // Transform backend data to form data
            setFormData({
                personalInfo: {
                    firstName: tenantData.firstName,
                    middleName: tenantData.middleName || '',
                    lastName: tenantData.lastName,
                    companyName: '', // Not in backend schema
                    dateOfBirth: '', // Not in backend schema
                    email: tenantData.user?.email || tenantData.contactBookEntry?.email || '',
                    phone: tenantData.phoneNumber || '',
                    age: '', // Not in backend schema
                },
                forwardingAddress: (() => {
                    // Try to parse forwarding address if it exists
                    // Format: "Address, Unit X, City, State, Zip, Country"
                    const addr = tenantData.forwardingAddress || '';
                    if (!addr) {
                        return {
                            address: '',
                            unit: '',
                            city: '',
                            stateRegion: '',
                            zip: '',
                            country: ''
                        };
                    }
                    
                    // Simple parsing - split by comma and try to identify parts
                    const parts = addr.split(',').map(p => p.trim());
                    return {
                        address: parts[0] || '',
                        unit: parts.find(p => p.toLowerCase().includes('unit'))?.replace(/unit/gi, '').trim() || '',
                        city: parts.find(p => !p.toLowerCase().includes('unit') && parts.indexOf(p) > 0 && parts.indexOf(p) < parts.length - 2) || '',
                        stateRegion: '', // Will need to be matched from state options
                        zip: parts[parts.length - 2] || '',
                        country: '' // Will need to be matched from country options
                    };
                })(),
                emergencyContacts: tenantData.emergencyContacts.length > 0
                    ? tenantData.emergencyContacts.map((contact, idx) => ({
                        id: idx + 1,
                        name: contact.name,
                        email: contact.email || '',
                        phone: contact.phoneNumber,
                        details: contact.relationship || ''
                    }))
                    : [{ id: 1, name: '', email: '', phone: '', details: '' }],
                pets: tenantData.pets.length > 0
                    ? tenantData.pets.map((pet, idx) => ({
                        id: idx + 1,
                        type: pet.type,
                        name: pet.name,
                        weight: pet.weight ? String(pet.weight) : '',
                        breed: pet.breed || ''
                    }))
                    : [{ id: 1, type: '', name: '', weight: '', breed: '' }],
                vehicles: tenantData.vehicles.length > 0
                    ? tenantData.vehicles.map((vehicle, idx) => ({
                        id: idx + 1,
                        type: vehicle.type,
                        make: vehicle.make,
                        model: vehicle.model,
                        year: vehicle.year ? String(vehicle.year) : '',
                        color: vehicle.color || '',
                        licensePlate: vehicle.licensePlate,
                        registeredIn: vehicle.registeredIn || ''
                    }))
                    : [{ id: 1, type: '', make: '', model: '', year: '', color: '', licensePlate: '', registeredIn: '' }]
            });

            setProfilePhoto(tenantData.profilePhotoUrl || null, null);

            // Determine which sections should be open based on data presence
            toggleSection('forwardingAddress', !!tenantData.forwardingAddress);
            toggleSection('emergencyContacts', tenantData.emergencyContacts.length > 0);
            toggleSection('pets', tenantData.pets.length > 0);
            toggleSection('vehicles', tenantData.vehicles.length > 0);
        } else if (!isEditMode) {
            // Reset form when switching to create mode
            resetForm();
        }
    }, [tenantData, isEditMode, setFormData, setProfilePhoto, toggleSection, resetForm]);

    // Handle tenant error
    useEffect(() => {
        if (tenantError) {
            setSubmitError(tenantError instanceof Error ? tenantError.message : 'Failed to load tenant data');
        }
    }, [tenantError, setSubmitError]);

    // Load all countries on mount
    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (formData.forwardingAddress.country) {
            const countryStates = State.getStatesOfCountry(formData.forwardingAddress.country);
            setStates(countryStates);
            // Reset state and city when country changes
            if (formData.forwardingAddress.stateRegion) {
                updateForwardingAddress('stateRegion', '');
                updateForwardingAddress('city', '');
            }
        } else {
            setStates([]);
        }
    }, [formData.forwardingAddress.country, updateForwardingAddress]);

    // Load cities when state changes
    useEffect(() => {
        if (formData.forwardingAddress.country && formData.forwardingAddress.stateRegion) {
            const stateCities = City.getCitiesOfState(formData.forwardingAddress.country, formData.forwardingAddress.stateRegion);
            setCities(stateCities);
            // Reset city when state changes
            if (formData.forwardingAddress.city) {
                updateForwardingAddress('city', '');
            }
        } else {
            setCities([]);
        }
    }, [formData.forwardingAddress.country, formData.forwardingAddress.stateRegion, formData.forwardingAddress.city, updateForwardingAddress]);

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

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        updatePersonalInfo(name, value);
    };

    const handleForwardingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateForwardingAddress(name, value);
    };

    const handleForwardingAddressDropdownChange = (name: string, value: string) => {
        updateForwardingAddress(name, value);
    };

    // File Handlers
    const handleProfilePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setSubmitError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                if (profileInputRef.current) profileInputRef.current.value = '';
                return;
            }

            // Validate file size (max 10MB)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                setSubmitError('Image size must not exceed 10MB');
                if (profileInputRef.current) profileInputRef.current.value = '';
                return;
            }

            // Read file and show crop modal
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setImageToCrop(ev.target.result as string);
                    setShowCropModal(true);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropComplete = (croppedImageUrl: string, croppedFile: File) => {
        setProfilePhoto(croppedImageUrl, croppedFile);
        setShowCropModal(false);
        setImageToCrop(null);
        // Clean up the object URL after a delay to prevent memory leaks
        setTimeout(() => {
            if (croppedImageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(croppedImageUrl);
            }
        }, 100);
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setImageToCrop(null);
        if (profileInputRef.current) profileInputRef.current.value = '';
    };

    const handleRemoveProfilePhoto = () => {
        setProfilePhoto(null, null);
        if (profileInputRef.current) profileInputRef.current.value = '';
    };

    const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            newFiles.forEach(file => addDocument(file));
        }
    };

    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};
        if (!formData.personalInfo.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.personalInfo.lastName) newErrors.lastName = 'Last Name is required';
        if (!formData.personalInfo.phone) newErrors.phone = 'Phone is required';
        if (!formData.personalInfo.email) newErrors.email = 'Email is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setErrors({});
        setSubmitError(null);

        try {
            // Build forwarding address string from form data
            const forwardingAddressParts = [];
            if (formData.forwardingAddress.address) forwardingAddressParts.push(formData.forwardingAddress.address);
            if (formData.forwardingAddress.unit) forwardingAddressParts.push(`Unit ${formData.forwardingAddress.unit}`);
            if (formData.forwardingAddress.city) forwardingAddressParts.push(formData.forwardingAddress.city);
            if (formData.forwardingAddress.stateRegion) {
                const stateName = stateOptions.find(s => s.value === formData.forwardingAddress.stateRegion)?.label || formData.forwardingAddress.stateRegion;
                forwardingAddressParts.push(stateName);
            }
            if (formData.forwardingAddress.zip) forwardingAddressParts.push(formData.forwardingAddress.zip);
            if (formData.forwardingAddress.country) {
                const countryName = countryOptions.find(c => c.value === formData.forwardingAddress.country)?.label || formData.forwardingAddress.country;
                forwardingAddressParts.push(countryName);
            }
            const forwardingAddress = forwardingAddressParts.length > 0 ? forwardingAddressParts.join(', ') : undefined;

            // Transform form data to API DTO format
            const tenantData = {
                email: formData.personalInfo.email, // Required - used to find or invite user
                firstName: formData.personalInfo.firstName,
                middleName: formData.personalInfo.middleName || undefined,
                lastName: formData.personalInfo.lastName,
                phoneCountryCode: formData.personalInfo.phone?.split(' ')[0] || undefined,
                phoneNumber: formData.personalInfo.phone || undefined,
                forwardingAddress,
                emergencyContacts: formData.emergencyContacts
                    .filter(contact => contact.name && contact.phone)
                    .map(contact => ({
                        name: contact.name,
                        phoneNumber: contact.phone,
                        relationship: contact.details || 'Emergency Contact',
                        email: contact.email || undefined,
                        address: undefined
                    })),
                pets: formData.pets
                    .filter(pet => pet.name && pet.type)
                    .map(pet => ({
                        type: pet.type,
                        name: pet.name,
                        breed: pet.breed || undefined,
                        weight: pet.weight ? parseFloat(pet.weight) : undefined,
                        age: undefined, // Not in form
                        notes: undefined,
                        vaccination: false
                    })),
                vehicles: formData.vehicles
                    .filter(vehicle => vehicle.make && vehicle.model && vehicle.licensePlate)
                    .map(vehicle => ({
                        type: vehicle.type,
                        make: vehicle.make,
                        model: vehicle.model,
                        year: vehicle.year ? parseInt(vehicle.year) : undefined,
                        color: vehicle.color || undefined,
                        licensePlate: vehicle.licensePlate,
                        registeredIn: vehicle.registeredIn || undefined
                    }))
            };

            let tenantId: string;

            if (isEditMode && id) {
                // Update existing tenant
                const updatedTenant = await updateTenantMutation.mutateAsync({
                    tenantId: id,
                    updateData: tenantData,
                });
                tenantId = updatedTenant.id;

                // Upload profile photo if changed
                if (profilePhotoFile) {
                    await uploadProfilePhotoMutation.mutateAsync({
                        tenantId,
                        file: profilePhotoFile,
                    });
                }

                // Upload documents
                for (const doc of documents) {
                    await uploadDocumentMutation.mutateAsync({
                        tenantId,
                        file: doc,
                        documentType: 'GENERAL',
                        description: '',
                    });
                }
            } else {
                // Create new tenant
                const newTenant = await createTenantMutation.mutateAsync(tenantData);
                tenantId = newTenant.id;

                // Upload profile photo if provided
                if (profilePhotoFile) {
                    await uploadProfilePhotoMutation.mutateAsync({
                        tenantId,
                        file: profilePhotoFile,
                    });
                }

                // Upload documents
                for (const doc of documents) {
                    await uploadDocumentMutation.mutateAsync({
                        tenantId,
                        file: doc,
                        documentType: 'GENERAL',
                        description: '',
                    });
                }
            }

            navigate('/dashboard/contacts/tenants');
        } catch (err) {
            console.error('Error submitting tenant:', err);
            setSubmitError(err instanceof Error ? err.message : 'Failed to save tenant');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const AddSectionButton = ({ onClick, label }: { onClick: () => void, label: string }) => (
        <div className="mb-6">
            <button
                onClick={onClick}
                className="bg-white border border-gray-200 text-gray-600 hover:text-gray-800 hover:border-gray-400 px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm"
            >
                + Add {label}
            </button>
        </div>
    );

    if (loading && isEditMode) {
        return (
            <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10">
                <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-4xl flex items-center justify-center">
                    <p className="text-gray-600">Loading tenant data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb - Optional based on design, keeping simple implementation for now */}

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-4xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">{isEditMode ? 'Edit Tenant' : 'Add Tenant'}</h1>
                    </div>
                </div>

                {/* Error Message */}
                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm">{submitError}</p>
                    </div>
                )}

                {/* Profile Photo - Centered & Circular */}
                <div className="flex flex-col items-center justify-center mb-8">
                    <input
                        type="file"
                        ref={profileInputRef}
                        onChange={handleProfilePhotoSelect}
                        className="hidden"
                        accept="image/*"
                    />
                    <div className="relative group">
                        {!showCropModal ? (
                            <>
                                <div
                                    onClick={() => profileInputRef.current?.click()}
                                    className={`w-32 h-32 rounded-full bg-white border-2 border-dashed ${profilePhoto ? 'border-transparent' : 'border-gray-300'} flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-[#3A6D6C] transition-colors relative`}
                                >
                                    {profilePhoto ? (
                                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-gray-50 hover:bg-gray-100 transition-colors" />
                                            <div className="z-10 flex flex-col items-center gap-1">
                                                <Upload size={20} className="text-[#3A6D6C]" />
                                                <span className="text-[10px] font-semibold text-[#3A6D6C]">Upload</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                                {profilePhoto && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleRemoveProfilePhoto(); }}
                                        className="absolute -top-1 -right-1 bg-white text-red-500 hover:text-red-600 p-1.5 rounded-full shadow-md transition-all border border-gray-100 z-10"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="w-32 h-32 rounded-full bg-white border-2 border-gray-300 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xs text-gray-500">Crop in modal</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <span className="text-sm font-medium text-gray-600 mt-3">Profile Photo</span>
                </div>

                {/* Personal Information */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <InputField label="First Name" name="firstName" value={formData.personalInfo.firstName} onChange={handlePersonalInfoChange} placeholder="First Name" error={errors.firstName} />
                        <InputField label="Middle Name" name="middleName" value={formData.personalInfo.middleName} onChange={handlePersonalInfoChange} placeholder="Middle Name" />
                        <InputField label="Last Name" name="lastName" value={formData.personalInfo.lastName} onChange={handlePersonalInfoChange} placeholder="Last Name" error={errors.lastName} />
                       
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Date of birth</label>
                            <DatePicker
                                value={(() => {
                                    if (!formData.personalInfo.dateOfBirth) return undefined;
                                    const parsedDate = parse(formData.personalInfo.dateOfBirth, 'dd/MM/yyyy', new Date());
                                    return isValid(parsedDate) ? parsedDate : undefined;
                                })()}
                                onChange={(date) => {
                                    if (date && isValid(date)) {
                                        const dateString = format(date, 'dd/MM/yyyy');
                                        const age = differenceInYears(new Date(), date).toString();
                                        updatePersonalInfo('dateOfBirth', dateString);
                                        updatePersonalInfo('age', age);
                                    } else {
                                        updatePersonalInfo('dateOfBirth', '');
                                        updatePersonalInfo('age', '');
                                    }
                                }}
                                placeholder="Select Date"
                                className="w-full bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                            />
                        </div>
                        <InputField label="Email" name="email" value={formData.personalInfo.email} onChange={handlePersonalInfoChange} placeholder="Email Address" type="email" error={errors.email} />
                        <InputField label="Phone Number" name="phone" value={formData.personalInfo.phone} onChange={handlePersonalInfoChange} placeholder="Phone Number" error={errors.phone} />
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Age</label>
                            <input
                                type="text"
                                value={formData.personalInfo.age}
                                readOnly
                                className="w-full bg-gray-50 border border-gray-200 text-gray-500 px-6 py-3 rounded-lg outline-none font-medium cursor-not-allowed"
                                placeholder="Age (Calculated)"
                            />
                        </div>
                    </div>
                </div>

                {/* Forwarding Address */}
                {sections.forwardingAddress ? (
                    <div className="mb-8">
                        <SectionHeader
                            title="Forwarding address"
                            onRemove={() => toggleSection('forwardingAddress', false)}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <InputField label="Address" name="address" value={formData.forwardingAddress.address} onChange={handleForwardingAddressChange} placeholder="Address" />
                            <InputField label="Unit/Ap." name="unit" value={formData.forwardingAddress.unit} onChange={handleForwardingAddressChange} placeholder="Unit" />
                            
                            {/* Country & State/Region */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Country</label>
                                    <CustomDropdown
                                        value={formData.forwardingAddress.country}
                                        onChange={(value) => handleForwardingAddressDropdownChange('country', value)}
                                        options={countryOptions}
                                        placeholder="Select country"
                                        disabled={countryOptions.length === 0}
                                        searchable={true}
                                        buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">State / Region</label>
                                    <CustomDropdown
                                        value={formData.forwardingAddress.stateRegion}
                                        onChange={(value) => handleForwardingAddressDropdownChange('stateRegion', value)}
                                        options={stateOptions}
                                        placeholder={formData.forwardingAddress.country ? "Select state" : "Select country first"}
                                        disabled={!formData.forwardingAddress.country || stateOptions.length === 0}
                                        searchable={true}
                                        buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* City & Zip */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">City</label>
                                    <CustomDropdown
                                        value={formData.forwardingAddress.city}
                                        onChange={(value) => handleForwardingAddressDropdownChange('city', value)}
                                        options={cityOptions}
                                        placeholder={formData.forwardingAddress.stateRegion ? "Select city" : formData.forwardingAddress.country ? "Select state first" : "Select country first"}
                                        disabled={!formData.forwardingAddress.stateRegion || cityOptions.length === 0}
                                        searchable={true}
                                        buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                    />
                                </div>
                                <InputField label="Zip" name="zip" value={formData.forwardingAddress.zip} onChange={handleForwardingAddressChange} placeholder="Zip" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <AddSectionButton onClick={() => toggleSection('forwardingAddress', true)} label="Forwarding Address" />
                )}

                {/* Emergency Contacts */}
                {sections.emergencyContacts ? (
                    <div className="mb-8">
                        <SectionHeader
                            title="Emergency contacts"
                            onRemove={() => toggleSection('emergencyContacts', false)}
                            showAdd={true}
                            onAdd={() => addEmergencyContact()}
                        />
                        {formData.emergencyContacts.map((contact, idx) => (
                            <div key={contact.id} className="mb-6 relative group">
                                {idx > 0 && (
                                    <button
                                        onClick={() => removeEmergencyContact(contact.id)}
                                        className="absolute -top-3 right-0 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove Contact"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <InputField
                                        label="Name"
                                        value={contact.name}
                                        onChange={(e: any) => updateEmergencyContact(contact.id, 'name', e.target.value)}
                                        placeholder="Name"
                                    />
                                    <InputField
                                        label="Email"
                                        value={contact.email}
                                        onChange={(e: any) => updateEmergencyContact(contact.id, 'email', e.target.value)}
                                        placeholder="Email"
                                    />
                                    <InputField
                                        label="Phone Number"
                                        value={contact.phone}
                                        onChange={(e: any) => updateEmergencyContact(contact.id, 'phone', e.target.value)}
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div className="w-full">
                                    <textarea
                                        value={contact.details}
                                        onChange={(e) => updateEmergencyContact(contact.id, 'details', e.target.value)}
                                        placeholder="Type Details here.."
                                        className="w-full bg-white border border-gray-200 text-gray-800 px-6 py-4 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium placeholder:text-gray-400 min-h-[120px] resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <AddSectionButton onClick={() => toggleSection('emergencyContacts', true)} label="Emergency Contacts" />
                )}

                {/* Pets */}
                {sections.pets ? (
                    <div className="mb-8">
                        <SectionHeader
                            title="Pets"
                            onRemove={() => toggleSection('pets', false)}
                            showAdd={true}
                            onAdd={() => addPet()}
                        />
                        {formData.pets.map((pet, idx) => (
                            <div key={pet.id} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 relative group">
                                {idx > 0 && (
                                    <button
                                        onClick={() => removePet(pet.id)}
                                        className="absolute -top-3 right-0 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove Pet"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Type*</label>
                                    <CustomDropdown
                                        value={pet.type}
                                        onChange={(value) => updatePet(pet.id, 'type', value)}
                                        options={[
                                            { value: 'Dog', label: 'Dog' },
                                            { value: 'Cat', label: 'Cat' }
                                        ]}
                                        placeholder="Choose"
                                        buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                    />
                                </div>
                                <InputField label="Name" value={pet.name} onChange={(e: any) => updatePet(pet.id, 'name', e.target.value)} placeholder="Name" />
                                <InputField label="Weight" value={pet.weight} onChange={(e: any) => updatePet(pet.id, 'weight', e.target.value)} placeholder="Weight" />
                                <InputField label="Breed" value={pet.breed} onChange={(e: any) => updatePet(pet.id, 'breed', e.target.value)} placeholder="Breed" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <AddSectionButton onClick={() => toggleSection('pets', true)} label="Pets" />
                )}

                {/* Vehicles */}
                {sections.vehicles ? (
                    <div className="mb-8">
                        <SectionHeader
                            title="Vehicles"
                            onRemove={() => toggleSection('vehicles', false)}
                            showAdd={true}
                            onAdd={() => addVehicle()}
                        />
                        {formData.vehicles.map((vehicle, idx) => (
                            <div key={vehicle.id} className="mb-6 relative group">
                                {idx > 0 && (
                                    <button
                                        onClick={() => removeVehicle(vehicle.id)}
                                        className="absolute -top-3 right-0 bg-red-500 text-white p-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Remove Vehicle"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                )}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Type*</label>
                                        <CustomDropdown
                                            value={vehicle.type}
                                            onChange={(value) => updateVehicle(vehicle.id, 'type', value)}
                                            options={[
                                                { value: 'Car', label: 'Car' },
                                                { value: 'Bike', label: 'Bike' }
                                            ]}
                                            placeholder="Choose"
                                            buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                        />
                                    </div>
                                    <InputField label="Make" value={vehicle.make} onChange={(e: any) => updateVehicle(vehicle.id, 'make', e.target.value)} placeholder="Type Here" />
                                    <InputField label="Model" value={vehicle.model} onChange={(e: any) => updateVehicle(vehicle.id, 'model', e.target.value)} placeholder="Type Here" />
                                    <InputField label="Year" value={vehicle.year} onChange={(e: any) => updateVehicle(vehicle.id, 'year', e.target.value)} placeholder="Year" />
                                    <InputField label="Color" value={vehicle.color} onChange={(e: any) => updateVehicle(vehicle.id, 'color', e.target.value)} placeholder="Color" />
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">License plate*</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={vehicle.licensePlate}
                                                onChange={(e) => updateVehicle(vehicle.id, 'licensePlate', e.target.value)}
                                                placeholder="Type"
                                                className="flex-1 bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Registered in*</label>
                                        <CustomDropdown
                                            value={vehicle.registeredIn}
                                            onChange={(value) => updateVehicle(vehicle.id, 'registeredIn', value)}
                                            options={formData.forwardingAddress.country && stateOptions.length > 0 ? stateOptions : []}
                                            searchable={true}
                                            placeholder={formData.forwardingAddress.country ? "Select State" : "Select country in forwarding address first"}
                                            disabled={!formData.forwardingAddress.country || stateOptions.length === 0}
                                            buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <AddSectionButton onClick={() => toggleSection('vehicles', true)} label="Vehicles" />
                )}
                <div className="mb-8">
                    <input
                        type="file"
                        ref={documentsInputRef}
                        onChange={handleDocumentSelect}
                        className="hidden"
                        multiple
                    />
                    <div
                        onClick={() => documentsInputRef.current?.click()}
                        className="bg-[#EFEDF6] rounded-3xl h-48 flex flex-col items-center justify-center text-gray-500 relative cursor-pointer hover:bg-[#e8e6f0] transition-colors border-2 border-dashed border-gray-200 hover:border-[#3A6D6C]"
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2">
                                <Upload size={24} className="text-black" />
                            </div>
                            <span className="text-xs font-medium text-gray-600">Upload documents</span>
                        </div>
                    </div>

                    {/* Uploaded Documents List */}
                    {documents.length > 0 && (
                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {documents.map((doc, idx) => (
                                <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="bg-gray-100 p-2 rounded-lg text-gray-600">
                                            <FileText size={16} />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700 truncate">{doc.name}</span>
                                    </div>
                                    <button
                                        onClick={() => removeDocument(idx)}
                                        className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* Action Buttons */}
                <div className="flex justify-start gap-4">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-md font-semibold shadow-lg hover:bg-[#2c5251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Saving...' : (isEditMode ? 'Update' : 'Create')}
                    </button>
                </div>

            </div>

            {/* Image Crop Modal - Compact */}
            {showCropModal && imageToCrop && (
                <ImageCropModal
                    image={imageToCrop}
                    onClose={handleCropCancel}
                    onCropComplete={handleCropComplete}
                    aspectRatio={1}
                    circularCrop={true}
                    containerSize={280}
                />
            )}
        </div>
    );
};

export default AddEditTenant;
