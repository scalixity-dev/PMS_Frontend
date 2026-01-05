import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Upload, FileText, X, Search, ChevronDown } from 'lucide-react';
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';
import CustomDropdown from '../../components/CustomDropdown';
import ImageCropModal from '../Tenants/components/ImageCropModal';
import { serviceProviderService, type CreateServiceProviderDto } from '../../../../services/service-provider.service';
import { API_ENDPOINTS } from '../../../../config/api.config';


const SUB_CATEGORIES: Record<string, string[]> = {
    'Cleaning': ['Carpet Cleaning', 'Chimney Sweep', 'Commercial Cleaning', 'Dumpster Service', 'Gutter Cleaning', 'House Cleaning', 'Junk Removal', 'Office Cleaning', 'Pressure Washing', 'Window Cleaning'],
    'General providers': ['Architect', 'Designer', 'Engineer', 'Inspector', 'Insurance Agent', 'Lawyer', 'Locksmith', 'Notary', 'Pest Control', 'Photographer', 'Security System', 'Surveyor'],
    'Handyman & Repair': ['Appliance Repair', 'Cabinetry', 'Carpenter', 'Concrete', 'Countertops', 'Deck & Fence', 'Drywall', 'Electrician', 'Flooring', 'Foundation', 'Garage Door', 'General Contractor', 'Glass & Mirror', 'Handyman', 'HVAC', 'Insulation', 'Masonry', 'Painter', 'Roofing', 'Siding', 'Tiling', 'Waterproofing', 'Windows & Doors'],
    'Home services': ['Concierge', 'Dog Walker', 'Errand Service', 'House Sitter', 'Interior Designer', 'Landscaping', 'Lawn Care', 'Moving Service', 'Pool Service', 'Snow Removal', 'Tree Service'],
    'Landlord services': ['Accountant', 'Attorney', 'Collection Agency', 'Eviction Service', 'Property Manager', 'Real Estate Agent', 'Tenant Screening'],
    'Plumbing': ['Drain Cleaning', 'Emergency Plumbing', 'Gas Line', 'Pipe Repair', 'Septic System', 'Sewer Line', 'Water Heater', 'Water Treatment'],
    'Other': ['Other']
};

const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
    </div>
);

const InputField = ({ label, placeholder, value, onChange, name, type = "text", className = "flex-1", error, rightIcon }: any) => (
    <div className={className}>
        {label && <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">{label}{label && label.includes('*') ? '' : ''}</label>}
        <div className="relative">
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full bg-white border ${error ? 'border-red-500' : 'border-gray-200'} text-gray-800 px-6 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium placeholder:text-gray-400 ${rightIcon ? 'pr-12' : ''}`}
            />
            {rightIcon && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {rightIcon}
                </div>
            )}
        </div>
        {error && <span className="text-xs text-red-500 mt-1 ml-1">{error}</span>}
    </div>
);

const AddEditServicePro = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditMode = !!id;

    // File Upload Refs and State
    const profileInputRef = useRef<HTMLInputElement>(null);
    const documentsInputRef = useRef<HTMLInputElement>(null);
    const phoneCodeRef = useRef<HTMLDivElement>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Image cropping state
    const [showCropModal, setShowCropModal] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string | null>(null);

    // Location data
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);

    // Phone country code state
    const [isPhoneCodeOpen, setIsPhoneCodeOpen] = useState(false);
    const [phoneCodeSearch, setPhoneCodeSearch] = useState('');

    // Fax country code state
    const [isFaxCodeOpen, setIsFaxCodeOpen] = useState(false);
    const [faxCodeSearch, setFaxCodeSearch] = useState('');
    const faxCodeRef = useRef<HTMLDivElement>(null);

    // Country/State dropdown state
    const [isCountryOpen, setIsCountryOpen] = useState(false);
    const [countrySearch, setCountrySearch] = useState('');
    const countryRef = useRef<HTMLDivElement>(null);

    const [isStateOpen, setIsStateOpen] = useState(false);
    const [stateSearch, setStateSearch] = useState('');
    const stateRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        general: {
            firstName: '',
            lastName: '',
            middleName: '',
            isCompany: false,
            companyName: '',
            companyWebsite: '',
            email: '',
            phoneCountryCode: '',
            phone: '',
            faxCountryCode: '',
            fax: '',
            additionalEmails: [] as string[],
            additionalPhones: [] as string[]
        },
        category: {
            category: '',
            subCategory: ''
        },
        address: {
            address: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        }
    });

    // Initialize countries
    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    // Update states when country changes
    useEffect(() => {
        if (formData.address.country) {
            setStates(State.getStatesOfCountry(formData.address.country));
        } else {
            setStates([]);
        }
        if (formData.address.country) {
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, state: '', city: '' }
            }));
        }
    }, [formData.address.country]);

    // Update cities when state changes
    useEffect(() => {
        if (formData.address.country && formData.address.state) {
            const stateCities = City.getCitiesOfState(formData.address.country, formData.address.state);
            setCities(stateCities);
        } else {
            setCities([]);
        }
        if (formData.address.state) {
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, city: '' }
            }));
        }
    }, [formData.address.country, formData.address.state]);

    // Phone country codes
    const phoneCountryCodes = useMemo(() => {
        return Country.getAllCountries().map(country => ({
            label: `${country.flag} ${country.phonecode.startsWith('+') ? '' : '+'}${country.phonecode}`,
            value: `${country.isoCode}|${country.phonecode}`,
            name: country.name,
            phonecode: country.phonecode.startsWith('+') ? country.phonecode : `+${country.phonecode}`,
            flag: country.flag,
            isoCode: country.isoCode,
        })).sort((a, b) => a.name.localeCompare(b.name));
    }, []);

    // Filter phone codes based on search
    const filteredPhoneCodes = useMemo(() => {
        if (!phoneCodeSearch) return phoneCountryCodes;
        const searchLower = phoneCodeSearch.toLowerCase();
        return phoneCountryCodes.filter(code =>
            code.name.toLowerCase().includes(searchLower) ||
            code.phonecode.includes(searchLower) ||
            code.isoCode.toLowerCase().includes(searchLower)
        );
    }, [phoneCodeSearch, phoneCountryCodes]);

    // Get selected phone code display
    const selectedPhoneCode = useMemo(() => {
        if (!formData.general.phoneCountryCode) return null;
        return phoneCountryCodes.find(code => code.value === formData.general.phoneCountryCode);
    }, [formData.general.phoneCountryCode, phoneCountryCodes]);

    // Get selected fax code display
    const selectedFaxCode = useMemo(() => {
        if (!formData.general.faxCountryCode) return null;
        return phoneCountryCodes.find(code => code.value === formData.general.faxCountryCode);
    }, [formData.general.faxCountryCode, phoneCountryCodes]);

    // Filter countries based on search
    const filteredCountries = useMemo(() => {
        if (!countrySearch) return countries;
        const searchLower = countrySearch.toLowerCase();
        return countries.filter(country =>
            country.name.toLowerCase().includes(searchLower) ||
            country.isoCode.toLowerCase().includes(searchLower)
        );
    }, [countrySearch, countries]);

    // Filter states based on search
    const filteredStates = useMemo(() => {
        if (!stateSearch) return states;
        const searchLower = stateSearch.toLowerCase();
        return states.filter(state =>
            state.name.toLowerCase().includes(searchLower) ||
            state.isoCode.toLowerCase().includes(searchLower)
        );
    }, [stateSearch, states]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (phoneCodeRef.current && !phoneCodeRef.current.contains(event.target as Node)) {
                setIsPhoneCodeOpen(false);
                setPhoneCodeSearch('');
            }
            if (faxCodeRef.current && !faxCodeRef.current.contains(event.target as Node)) {
                setIsFaxCodeOpen(false);
                setFaxCodeSearch('');
            }
            if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
                setIsCountryOpen(false);
                setCountrySearch('');
            }
            if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
                setIsStateOpen(false);
                setStateSearch('');
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch service provider data in edit mode
    useEffect(() => {
        const fetchServiceProvider = async () => {
            if (isEditMode && id) {
                try {
                    setIsLoading(true);
                    const data = await serviceProviderService.getOne(id);

                    // Extract phone country code - find matching code from phoneCountryCodes
                    let phoneCountryCode = '';
                    if (data.phoneCountryCode && data.country) {
                        const matchingCode = phoneCountryCodes.find(code => {
                            const [, codePhoneCode] = code.value.split('|');
                            // Normalize phone codes (remove + if present for comparison)
                            const normalizedCode = codePhoneCode.replace(/^\+/, '');
                            const normalizedDataCode = (data.phoneCountryCode || '').replace(/^\+/, '');
                            return code.isoCode === data.country && normalizedCode === normalizedDataCode;
                        });
                        if (matchingCode) {
                            phoneCountryCode = matchingCode.value;
                        }
                    }

                    // Transform backend data to form data structure
                    setFormData({
                        general: {
                            firstName: data.firstName || '',
                            lastName: data.lastName || '',
                            middleName: data.middleName || '',
                            isCompany: !!data.companyName && data.companyName !== `${data.firstName} ${data.lastName}`,
                            companyName: data.companyName || '',
                            companyWebsite: data.companyWebsite || '',
                            email: data.email || '',
                            phoneCountryCode: phoneCountryCode,
                            phone: data.phoneNumber || '',
                            faxCountryCode: '',
                            fax: data.faxNumber || '',
                            additionalEmails: [],
                            additionalPhones: []
                        },
                        category: {
                            category: data.category || '',
                            subCategory: data.subcategory || ''
                        },
                        address: {
                            address: data.address || '',
                            city: data.city || '',
                            state: data.state || '',
                            zip: data.zipCode || '',
                            country: data.country || ''
                        }
                    });

                    if (data.photoUrl) {
                        setProfilePhoto(data.photoUrl);
                    }
                } catch (err) {
                    setSubmitError(err instanceof Error ? err.message : 'Failed to load service provider data');
                    console.error('Error fetching service provider:', err);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchServiceProvider();
    }, [id, isEditMode, phoneCountryCodes]);

    const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            general: { ...prev.general, [name]: value }
        }));
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [name]: value }
        }));
    };

    const handleDropdownChange = (section: 'category' | 'address', field: string, value: string) => {
        setFormData(prev => {
            const newData = {
                ...prev,
                [section]: { ...prev[section], [field]: value }
            };

            // Reset sub-category if category changes
            if (section === 'category' && field === 'category') {
                newData.category.subCategory = '';
            }

            return newData;
        });
    };

    // Toggle Company
    const toggleCompany = () => {
        setFormData(prev => ({
            ...prev,
            general: { ...prev.general, isCompany: !prev.general.isCompany }
        }));
    };

    // Dynamic List Handlers (Email/Phone)
    const addDynamicField = (field: 'additionalEmails' | 'additionalPhones') => {
        setFormData(prev => {
            if (prev.general[field].length >= 2) return prev;
            return {
                ...prev,
                general: { ...prev.general, [field]: [...prev.general[field], ''] }
            };
        });
    };

    const updateDynamicField = (field: 'additionalEmails' | 'additionalPhones', index: number, value: string) => {
        setFormData(prev => {
            const newArray = [...prev.general[field]];
            newArray[index] = value;
            return {
                ...prev,
                general: { ...prev.general, [field]: newArray }
            };
        });
    };

    const removeDynamicField = (field: 'additionalEmails' | 'additionalPhones', index: number) => {
        setFormData(prev => ({
            ...prev,
            general: { ...prev.general, [field]: prev.general[field].filter((_, i) => i !== index) }
        }));
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

            // Validate file size (max 10MB to match AddEditTenant.tsx)
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxSize) {
                setSubmitError('Image size must not exceed 10MB');
                if (profileInputRef.current) profileInputRef.current.value = '';
                return;
            }

            setSubmitError(null);
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
        setProfilePhoto(croppedImageUrl);
        setProfilePhotoFile(croppedFile);
        setShowCropModal(false);
        setImageToCrop(null);
        if (profileInputRef.current) profileInputRef.current.value = '';
    };

    const handleCropCancel = () => {
        setShowCropModal(false);
        setImageToCrop(null);
        if (profileInputRef.current) profileInputRef.current.value = '';
    };

    const handleRemoveProfilePhoto = () => {
        setProfilePhoto(null);
        setProfilePhotoFile(null);
        setSubmitError(null);
        if (profileInputRef.current) profileInputRef.current.value = '';
    };

    const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            // Validate file types and sizes
            const validFiles = newFiles.filter(file => {
                const maxSize = 50 * 1024 * 1024; // 50MB
                if (file.size > maxSize) {
                    setSubmitError(`File "${file.name}" exceeds 50MB limit`);
                    return false;
                }
                return true;
            });
            setDocuments(prev => [...prev, ...validFiles]);
        }
    };

    const handleRemoveDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    // Helper function to upload document to service provider
    const uploadDocument = async (serviceProviderId: string, file: File, documentType: string = 'General'): Promise<void> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);
        formData.append('description', '');

        const response = await fetch(API_ENDPOINTS.SERVICE_PROVIDER.UPLOAD_DOCUMENT(serviceProviderId), {
            method: 'POST',
            credentials: 'include',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to upload document' }));
            throw new Error(errorData.message || 'Failed to upload document');
        }
    };

    // Helper function to upload image to S3
    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

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

    const handleSubmit = async () => {
        const newErrors: Record<string, string> = {};
        if (!formData.general.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.general.lastName) newErrors.lastName = 'Last Name is required';
        if (!formData.category.category) newErrors.category = 'Category is required';
        if (!formData.general.email) newErrors.email = 'Email is required';
        if (!formData.general.phone) newErrors.phone = 'Phone is required';
        if (!formData.address.address) newErrors.address = 'Address is required';
        if (!formData.address.country) newErrors.country = 'Country is required';
        if (!formData.address.state) newErrors.state = 'State is required';
        if (!formData.address.zip) newErrors.zip = 'Zip Code is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setErrors({});
        setSubmitError(null);
        setIsLoading(true);

        try {
            // Upload photo first if available
            let photoUrl: string | undefined = undefined;
            if (profilePhotoFile) {
                try {
                    photoUrl = await uploadImage(profilePhotoFile);
                } catch (uploadError) {
                    setSubmitError(uploadError instanceof Error ? uploadError.message : 'Failed to upload profile photo');
                    setIsLoading(false);
                    return;
                }
            }

            // Extract phone country code
            const [, phoneCode] = formData.general.phoneCountryCode
                ? formData.general.phoneCountryCode.split('|')
                : ['', ''];

            // Extract fax country code
            const [, faxCode] = formData.general.faxCountryCode
                ? formData.general.faxCountryCode.split('|')
                : ['', ''];

            // Prepare data for API
            const apiData: CreateServiceProviderDto = {
                firstName: formData.general.firstName,
                middleName: formData.general.middleName || undefined,
                lastName: formData.general.lastName,
                email: formData.general.email,
                phoneCountryCode: phoneCode || undefined,
                phoneNumber: formData.general.phone,
                companyName: formData.general.companyName || formData.general.firstName + ' ' + formData.general.lastName,
                companyWebsite: formData.general.companyWebsite || undefined,
                faxNumber: formData.general.fax ? (faxCode ? `${faxCode} ${formData.general.fax}` : formData.general.fax) : undefined,
                category: formData.category.category,
                subcategory: formData.category.subCategory || undefined,
                address: formData.address.address,
                city: formData.address.city || undefined,
                state: formData.address.state,
                zipCode: formData.address.zip,
                country: formData.address.country,
                photoUrl: photoUrl,
                isActive: true,
            };

            let serviceProviderId: string;
            let isNewProvider = false;

            if (isEditMode && id) {
                // Update existing service provider
                const updated = await serviceProviderService.update(id, apiData);
                serviceProviderId = updated.id;
            } else {
                // Create new service provider
                const created = await serviceProviderService.create(apiData);
                serviceProviderId = created.id;
                isNewProvider = true;
            }

            // Upload documents if any
            if (documents.length > 0 && serviceProviderId) {
                try {
                    for (const doc of documents) {
                        await uploadDocument(serviceProviderId, doc, 'General');
                    }
                } catch (uploadError) {
                    const errorMessage = uploadError instanceof Error ? uploadError.message : 'Failed to upload some documents';

                    // If this is a new provider (not edit mode), attempt rollback by deleting it
                    if (isNewProvider && serviceProviderId) {
                        try {
                            await serviceProviderService.delete(serviceProviderId);
                            console.log('Successfully rolled back service provider creation after document upload failure');
                        } catch (rollbackError) {
                            // Log rollback error but don't crash the UI
                            console.error('Failed to rollback service provider creation:', rollbackError);
                            const rollbackMessage = rollbackError instanceof Error ? rollbackError.message : 'Failed to cleanup';

                            // Notify user about the cleanup failure
                            setSubmitError(
                                `${errorMessage}. Additionally, the service provider was created but document upload failed. ` +
                                `Automatic cleanup failed (${rollbackMessage}). Please contact support or manually delete the service provider (ID: ${serviceProviderId}).`
                            );
                            setIsLoading(false);
                            return;
                        }
                    }

                    // Set error message (rollback succeeded or not applicable)
                    if (isNewProvider) {
                        setSubmitError(
                            `${errorMessage}. The service provider creation has been rolled back. Please try again.`
                        );
                    } else {
                        setSubmitError(
                            `${errorMessage}. The service provider was updated but documents could not be uploaded. Please try uploading documents again.`
                        );
                    }
                    setIsLoading(false);
                    return;
                }
            }

            navigate('/dashboard/contacts/service-pros');
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to create service provider');
            console.error('Error creating service provider:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10 px-4 sm:px-6">
            <div className="p-4 sm:p-6 bg-[#E0E5E5] min-h-screen rounded-[1.5rem] sm:rounded-[2rem]">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">{isEditMode ? 'Edit Service Pro' : 'Add Service Pro'}</h1>
                    </div>
                </div>

                {/* Error Message */}
                {submitError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert" aria-live="assertive" aria-atomic="true">
                        <p className="text-red-600 text-sm font-medium">{submitError}</p>
                    </div>
                )}

                {/* Profile Photo - Centered & Circular (Matches AddEditTenant) */}
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
                                    className={`w-32 h-32 rounded-2xl bg-white border-2 border-dashed ${profilePhoto ? 'border-transparent' : 'border-gray-300'} flex flex-col items-center justify-center overflow-hidden cursor-pointer hover:border-[#3A6D6C] transition-colors relative`}
                                >
                                    {profilePhoto ? (
                                        <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover rounded-2xl" />
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
                                        className="absolute -top-1 -right-1 bg-white text-red-500 hover:text-red-600 p-1.5 rounded-full shadow-md transition-all border border-gray-100"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                            </>
                        ) : null}
                    </div>
                    <span className="text-sm font-medium text-gray-600 mt-3">Profile Photo</span>
                </div>

                {/* General Information */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">General information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <InputField label="First name *" name="firstName" value={formData.general.firstName} onChange={handleGeneralChange} placeholder="Type first name here" error={errors.firstName} />
                        <InputField label="Middle name" name="middleName" value={formData.general.middleName} onChange={handleGeneralChange} placeholder="Type middle name here" />
                        <InputField label="Last name *" name="lastName" value={formData.general.lastName} onChange={handleGeneralChange} placeholder="Type last name here" error={errors.lastName} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4 items-center">
                        <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-lg border border-gray-200 mt-6">
                            <button
                                onClick={toggleCompany}
                                className={`w-12 h-6 rounded-full transition-colors relative ${formData.general.isCompany ? 'bg-[#3A6D6C]' : 'bg-gray-300'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${formData.general.isCompany ? 'left-7' : 'left-1'}`} />
                            </button>
                            <span className="text-sm font-medium text-gray-700">Display as a company?</span>
                        </div>
                        <InputField label="Company name" name="companyName" value={formData.general.companyName} onChange={handleGeneralChange} placeholder="Type company name here" />
                        <InputField label="Company website" name="companyWebsite" value={formData.general.companyWebsite} onChange={handleGeneralChange} placeholder="http://www.site.com" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        <InputField label="Email *" name="email" value={formData.general.email} onChange={handleGeneralChange} placeholder="Add email here" error={errors.email} />
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Phone *</label>
                            <div className={`flex border rounded-xl transition-all ${errors.phone
                                    ? 'border-red-500 border-2'
                                    : 'border-gray-200 focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C]'
                                }`}>
                                {/* Phone Code Selector */}
                                <div className="relative" ref={phoneCodeRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsPhoneCodeOpen(!isPhoneCodeOpen)}
                                        className={`flex items-center gap-1 px-3 py-3 border-r bg-white rounded-l-xl focus:outline-none text-sm min-w-[100px] hover:bg-gray-50 transition-colors ${errors.phone
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">
                                            {selectedPhoneCode ? (
                                                <span className="flex items-center gap-1">
                                                    <span>{selectedPhoneCode.flag}</span>
                                                    <span className="hidden sm:inline">{selectedPhoneCode.phonecode}</span>
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">Code</span>
                                            )}
                                        </span>
                                        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isPhoneCodeOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown */}
                                    {isPhoneCodeOpen && (
                                        <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-300 rounded-xl shadow-lg z-[100] max-h-80 overflow-hidden flex flex-col">
                                            {/* Search Input */}
                                            <div className="p-2 border-b border-gray-200">
                                                <div className="relative">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search country or code..."
                                                        value={phoneCodeSearch}
                                                        onChange={(e) => setPhoneCodeSearch(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-sm"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            {/* Options List */}
                                            <div className="overflow-y-auto max-h-64">
                                                {filteredPhoneCodes.length > 0 ? (
                                                    filteredPhoneCodes.map((code) => (
                                                        <button
                                                            key={code.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData(prev => ({
                                                                    ...prev,
                                                                    general: { ...prev.general, phoneCountryCode: code.value }
                                                                }));
                                                                setIsPhoneCodeOpen(false);
                                                                setPhoneCodeSearch('');
                                                            }}
                                                            className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${formData.general.phoneCountryCode === code.value ? 'bg-[#3A6D6C]/10' : ''
                                                                }`}
                                                        >
                                                            <span className="text-xl">{code.flag}</span>
                                                            <span className="flex-1 text-sm font-medium text-gray-900">{code.name}</span>
                                                            <span className="text-sm text-gray-600">{code.phonecode}</span>
                                                        </button>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                        No countries found
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Phone Number Input */}
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.general.phone}
                                    onChange={handleGeneralChange}
                                    placeholder="Enter phone number"
                                    className="flex-1 min-w-0 px-4 py-3 rounded-r-xl focus:outline-none text-sm placeholder-gray-400 bg-white border-0"
                                />
                            </div>
                            {errors.phone && <span className="text-xs text-red-500 mt-1 ml-1">{errors.phone}</span>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Fax</label>
                            <div className="flex border border-gray-200 rounded-xl transition-all focus-within:ring-2 focus-within:ring-[#3A6D6C] focus-within:border-[#3A6D6C]">
                                {/* Fax Code Selector */}
                                <div className="relative" ref={faxCodeRef}>
                                    <button
                                        type="button"
                                        onClick={() => setIsFaxCodeOpen(!isFaxCodeOpen)}
                                        className="flex items-center gap-1 px-3 py-3 border-r border-gray-200 bg-white rounded-l-xl focus:outline-none text-sm min-w-[100px] hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-sm font-medium">
                                            {selectedFaxCode ? (
                                                <span className="flex items-center gap-1">
                                                    <span>{selectedFaxCode.flag}</span>
                                                    <span className="hidden sm:inline">{selectedFaxCode.phonecode}</span>
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">Code</span>
                                            )}
                                        </span>
                                        <ChevronDown size={16} className={`text-gray-500 transition-transform ${isFaxCodeOpen ? 'rotate-180' : ''}`} />
                                    </button>

                                    {/* Dropdown */}
                                    {isFaxCodeOpen && (
                                        <div className="absolute left-0 top-full mt-1 w-80 bg-white border border-gray-300 rounded-xl shadow-lg z-[100] max-h-80 overflow-hidden flex flex-col">
                                            {/* Search Input */}
                                            <div className="p-2 border-b border-gray-200">
                                                <div className="relative">
                                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input
                                                        type="text"
                                                        placeholder="Search country or code..."
                                                        value={faxCodeSearch}
                                                        onChange={(e) => setFaxCodeSearch(e.target.value)}
                                                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-sm"
                                                        autoFocus
                                                    />
                                                </div>
                                            </div>

                                            {/* Options List */}
                                            <div className="overflow-y-auto max-h-64">
                                                {(() => {
                                                    const filtered = !faxCodeSearch ? phoneCountryCodes : phoneCountryCodes.filter(code => {
                                                        const searchLower = faxCodeSearch.toLowerCase();
                                                        return code.name.toLowerCase().includes(searchLower) ||
                                                            code.phonecode.includes(searchLower) ||
                                                            code.isoCode.toLowerCase().includes(searchLower);
                                                    });
                                                    return filtered.length > 0 ? (
                                                        filtered.map((code) => (
                                                            <button
                                                                key={code.value}
                                                                type="button"
                                                                onClick={() => {
                                                                    setFormData(prev => ({
                                                                        ...prev,
                                                                        general: { ...prev.general, faxCountryCode: code.value }
                                                                    }));
                                                                    setIsFaxCodeOpen(false);
                                                                    setFaxCodeSearch('');
                                                                }}
                                                                className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${formData.general.faxCountryCode === code.value ? 'bg-[#3A6D6C]/10' : ''
                                                                    }`}
                                                            >
                                                                <span className="text-xl">{code.flag}</span>
                                                                <span className="flex-1 text-sm font-medium text-gray-900">{code.name}</span>
                                                                <span className="text-sm text-gray-600">{code.phonecode}</span>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                            No countries found
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Fax Number Input */}
                                <input
                                    type="tel"
                                    name="fax"
                                    value={formData.general.fax}
                                    onChange={handleGeneralChange}
                                    placeholder="Enter fax number"
                                    className="flex-1 min-w-0 px-4 py-3 rounded-r-xl focus:outline-none text-sm placeholder-gray-400 bg-white border-0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Dynamic Emails & Phones */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                            {formData.general.additionalEmails.map((email, idx) => (
                                <div key={idx} className="mb-2">
                                    <InputField
                                        value={email}
                                        onChange={(e: any) => updateDynamicField('additionalEmails', idx, e.target.value)}
                                        placeholder="Add another email"
                                        rightIcon={
                                            <button onClick={() => removeDynamicField('additionalEmails', idx)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={16} />
                                            </button>
                                        }
                                    />
                                </div>
                            ))}
                            {formData.general.additionalEmails.length < 2 && (
                                <button onClick={() => addDynamicField('additionalEmails')} className="text-[#3A6D6C] text-sm font-bold hover:underline flex items-center gap-1">
                                    <Plus size={14} /> Add another email
                                </button>
                            )}
                        </div>
                        <div>
                            {formData.general.additionalPhones.map((phone, idx) => (
                                <div key={idx} className="mb-2">
                                    <InputField
                                        value={phone}
                                        onChange={(e: any) => updateDynamicField('additionalPhones', idx, e.target.value)}
                                        placeholder="Add another phone"
                                        rightIcon={
                                            <button onClick={() => removeDynamicField('additionalPhones', idx)} className="text-red-500 hover:text-red-700">
                                                <Trash2 size={16} />
                                            </button>
                                        }
                                    />
                                </div>
                            ))}
                            {formData.general.additionalPhones.length < 2 && (
                                <button onClick={() => addDynamicField('additionalPhones')} className="text-[#3A6D6C] text-sm font-bold hover:underline flex items-center gap-1">
                                    <Plus size={14} /> Add another phone
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Category */}
                <div className="mb-8">
                    <SectionHeader title="Category" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Category *</label>
                            <CustomDropdown
                                value={formData.category.category}
                                onChange={(value) => handleDropdownChange('category', 'category', value)}
                                options={[
                                    { value: 'Cleaning', label: 'Cleaning' },
                                    { value: 'General providers', label: 'General providers' },
                                    { value: 'Handyman & Repair', label: 'Handyman & Repair' },
                                    { value: 'Home services', label: 'Home services' },
                                    { value: 'Landlord services', label: 'Landlord services' },
                                    { value: 'Plumbing', label: 'Plumbing' },
                                    { value: 'Other', label: 'Other' }
                                ]}
                                placeholder="Select a category"
                                buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                            />
                            {errors.category && <span className="text-xs text-red-500 mt-1 ml-1">{errors.category}</span>}
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Sub-category</label>
                            <CustomDropdown
                                value={formData.category.subCategory}
                                onChange={(value) => handleDropdownChange('category', 'subCategory', value)}
                                options={(SUB_CATEGORIES[formData.category.category] || []).map(sub => ({ value: sub, label: sub }))}
                                placeholder="Select a sub-category"
                                buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                disabled={!formData.category.category}
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="mb-8">
                    <SectionHeader title="Address" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                        {/* Country */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Country *</label>
                            <div className="relative" ref={countryRef}>
                                <button
                                    type="button"
                                    onClick={() => setIsCountryOpen(!isCountryOpen)}
                                    className="w-full bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium text-left flex items-center justify-between"
                                >
                                    <span className={formData.address.country ? 'text-gray-900' : 'text-gray-400'}>
                                        {formData.address.country
                                            ? countries.find(c => c.isoCode === formData.address.country)?.name || 'Select Country'
                                            : 'Select Country'}
                                    </span>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {isCountryOpen && (
                                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-[100] max-h-80 overflow-hidden flex flex-col">
                                        {/* Search Input */}
                                        <div className="p-2 border-b border-gray-200">
                                            <div className="relative">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search country..."
                                                    value={countrySearch}
                                                    onChange={(e) => setCountrySearch(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-sm"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        {/* Options List */}
                                        <div className="overflow-y-auto max-h-64">
                                            {filteredCountries.length > 0 ? (
                                                filteredCountries.map((country) => (
                                                    <button
                                                        key={country.isoCode}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                address: { ...prev.address, country: country.isoCode, state: '', city: '' }
                                                            }));
                                                            setIsCountryOpen(false);
                                                            setCountrySearch('');
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${formData.address.country === country.isoCode ? 'bg-[#3A6D6C]/10' : ''
                                                            }`}
                                                    >
                                                        <span className="flex-1 text-sm font-medium text-gray-900">{country.name}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                    No countries found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.country && <span className="text-xs text-red-500 mt-1 ml-1">{errors.country}</span>}
                        </div>

                        {/* State */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">State / region *</label>
                            <div className="relative" ref={stateRef}>
                                <button
                                    type="button"
                                    onClick={() => !(!formData.address.country || states.length === 0) && setIsStateOpen(!isStateOpen)}
                                    disabled={!formData.address.country || states.length === 0}
                                    className="w-full bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium text-left flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className={formData.address.state ? 'text-gray-900' : 'text-gray-400'}>
                                        {formData.address.state
                                            ? states.find(s => s.isoCode === formData.address.state)?.name || 'Select State'
                                            : 'Select State'}
                                    </span>
                                    <ChevronDown size={16} className={`text-gray-500 transition-transform ${isStateOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown */}
                                {isStateOpen && formData.address.country && states.length > 0 && (
                                    <div className="absolute left-0 top-full mt-1 w-full bg-white border border-gray-300 rounded-xl shadow-lg z-[100] max-h-80 overflow-hidden flex flex-col">
                                        {/* Search Input */}
                                        <div className="p-2 border-b border-gray-200">
                                            <div className="relative">
                                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Search state..."
                                                    value={stateSearch}
                                                    onChange={(e) => setStateSearch(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3A6D6C] text-sm"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>

                                        {/* Options List */}
                                        <div className="overflow-y-auto max-h-64">
                                            {filteredStates.length > 0 ? (
                                                filteredStates.map((state) => (
                                                    <button
                                                        key={state.isoCode}
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData(prev => ({
                                                                ...prev,
                                                                address: { ...prev.address, state: state.isoCode, city: '' }
                                                            }));
                                                            setIsStateOpen(false);
                                                            setStateSearch('');
                                                        }}
                                                        className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-[#3A6D6C]/10 transition-colors text-left ${formData.address.state === state.isoCode ? 'bg-[#3A6D6C]/10' : ''
                                                            }`}
                                                    >
                                                        <span className="flex-1 text-sm font-medium text-gray-900">{state.name}</span>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                                    No states found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {errors.state && <span className="text-xs text-red-500 mt-1 ml-1">{errors.state}</span>}
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">City</label>
                            <select
                                name="city"
                                value={formData.address.city}
                                onChange={(e) => handleAddressChange(e as any)}
                                disabled={!formData.address.state || cities.length === 0}
                                className="w-full bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium placeholder:text-gray-400 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <option value="">{cities.length === 0 && formData.address.state ? 'No cities available' : 'Select City'}</option>
                                {cities.map((city) => (
                                    <option key={city.name} value={city.name}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Address */}
                        <div>
                            <InputField label="Address *" name="address" value={formData.address.address} onChange={handleAddressChange} placeholder="Start typing the address..." error={errors.address} />
                        </div>
                        {/* Zip Code */}
                        <div>
                            <InputField label="Zip Code *" name="zip" value={formData.address.zip} onChange={handleAddressChange} placeholder="Zip Code" error={errors.zip} />
                        </div>
                    </div>
                </div>

                {/* Document Upload */}
                <div className="mb-8">
                    <input type="file" ref={documentsInputRef} onChange={handleDocumentSelect} className="hidden" multiple />
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
                                        onClick={() => handleRemoveDocument(idx)}
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
                <div className="flex justify-start gap-4 w-full sm:w-auto">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-md font-semibold shadow-lg hover:bg-[#2c5251] transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                        {isLoading ? 'Creating...' : (isEditMode ? 'Update' : 'Create')}
                    </button>
                </div>
            </div>

            {/* Image Crop Modal */}
            {showCropModal && imageToCrop && (
                <ImageCropModal
                    image={imageToCrop}
                    onClose={handleCropCancel}
                    onCropComplete={handleCropComplete}
                    aspectRatio={1}
                    circularCrop={false}
                    containerSize={280}
                />
            )}
        </div>
    );
};

export default AddEditServicePro;
