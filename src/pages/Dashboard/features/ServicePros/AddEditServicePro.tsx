import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Upload, FileText, X } from 'lucide-react';
import CustomDropdown from '../../components/CustomDropdown';

// Mock Data for Edit Mode
const MOCK_SERVICE_PRO_DATA: Record<string, any> = {
    '1': {
        general: {
            firstName: 'Sam',
            lastName: 'Rao',
            middleName: '',
            isCompany: false,
            companyName: '',
            companyWebsite: '',
            email: 'sam.rao@example.com',
            phone: '+91 78965 41236',
            fax: '',
            additionalEmails: [],
            additionalPhones: []
        },
        category: {
            category: 'Cleaning',
            subCategory: 'Commercial Cleaning'
        },
        address: {
            address: '123 Business Park',
            city: 'Mumbai',
            state: 'MH',
            zip: '400001',
            country: 'India'
        },
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
    },
    '2': {
        general: {
            firstName: 'Vijay',
            lastName: 'Rfgdd',
            middleName: '',
            isCompany: false,
            companyName: '',
            companyWebsite: '',
            email: 'vijay@example.com',
            phone: '+91 70326 59874',
            fax: '',
            additionalEmails: [],
            additionalPhones: []
        },
        category: {
            category: 'Other',
            subCategory: 'Appraiser'
        },
        address: {
            address: '456 Market St',
            city: 'Hyderabad',
            state: 'TG',
            zip: '500001',
            country: 'India'
        },
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
    },
    '3': {
        general: {
            firstName: 'Alex',
            lastName: 'Brown',
            middleName: '',
            isCompany: true,
            companyName: 'Brown Plumbing',
            companyWebsite: 'https://brownplumbing.com',
            email: 'alex@brownplumbing.com',
            phone: '+1 555 123 4567',
            fax: '+1 555 123 4568',
            additionalEmails: ['support@brownplumbing.com'],
            additionalPhones: []
        },
        category: {
            category: 'Plumbing',
            subCategory: 'Pipe Repair'
        },
        address: {
            address: '789 Industrial Ave',
            city: 'Chicago',
            state: 'IL',
            zip: '60601',
            country: 'USA'
        },
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200'
    },
    '4': {
        general: {
            firstName: 'John',
            lastName: 'Doe',
            middleName: '',
            isCompany: false,
            companyName: '',
            companyWebsite: '',
            email: 'john.doe@electric.com',
            phone: '+1 555 987 6543',
            fax: '',
            additionalEmails: [],
            additionalPhones: []
        },
        category: {
            category: 'Handyman & Repair',
            subCategory: 'Electrician'
        },
        address: {
            address: '321 Power Ln',
            city: 'Austin',
            state: 'TX',
            zip: '73301',
            country: 'USA'
        },
        image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=200&h=200'
    }
};

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
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        general: {
            firstName: '',
            lastName: '',
            middleName: '',
            isCompany: false,
            companyName: '',
            companyWebsite: '',
            email: '',
            phone: '',
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

    useEffect(() => {
        if (isEditMode && id && MOCK_SERVICE_PRO_DATA[id]) {
            const data = MOCK_SERVICE_PRO_DATA[id];
            setFormData(data);
            setProfilePhoto(data.image || null);
        }
    }, [id, isEditMode]);

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
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setProfilePhoto(ev.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveProfilePhoto = () => {
        setProfilePhoto(null);
        if (profileInputRef.current) profileInputRef.current.value = '';
    };

    const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setDocuments(prev => [...prev, ...Array.from(e.target.files!)]);
        }
    };

    const handleRemoveDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.general.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.general.lastName) newErrors.lastName = 'Last Name is required';
        if (!formData.category.category) newErrors.category = 'Category is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setErrors({});
        console.log('Submitting Service Pro:', { formData, profilePhoto, documents });
        navigate('/dashboard/contacts/service-pros');
    };

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10">
            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">{isEditMode ? 'Edit Service Pro' : 'Add Service Pro'}</h1>
                    </div>
                </div>

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
                                className="absolute -top-1 -right-1 bg-white text-red-500 hover:text-red-600 p-1.5 rounded-full shadow-md transition-all border border-gray-100"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
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
                        <InputField label="Email" name="email" value={formData.general.email} onChange={handleGeneralChange} placeholder="Add email here" />
                        <InputField label="Phone" name="phone" value={formData.general.phone} onChange={handleGeneralChange} placeholder="Add phone number" />
                        <InputField label="Fax" name="fax" value={formData.general.fax} onChange={handleGeneralChange} placeholder="Type the fax" />
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
                        <div className="md:col-span-2">
                            <InputField label="Address" name="address" value={formData.address.address} onChange={handleAddressChange} placeholder="Start typing the address..." />
                        </div>
                        <InputField label="City" name="city" value={formData.address.city} onChange={handleAddressChange} placeholder="City" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <InputField label="State / region" name="state" value={formData.address.state} onChange={handleAddressChange} placeholder="State" />
                        <InputField label="Zip" name="zip" value={formData.address.zip} onChange={handleAddressChange} placeholder="Zip" />
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Country</label>
                            <CustomDropdown
                                value={formData.address.country}
                                onChange={(value) => handleDropdownChange('address', 'country', value)}
                                options={[
                                    { value: 'USA', label: 'USA' },
                                    { value: 'India', label: 'India' }
                                ]}
                                placeholder="Country"
                                buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                            />
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
                <div className="flex justify-start gap-4">
                    <button
                        onClick={handleSubmit}
                        className="bg-[#3A6D6C] text-white px-8 py-3 rounded-md font-semibold shadow-lg hover:bg-[#2c5251] transition-colors"
                    >
                        {isEditMode ? 'Update' : 'Create'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEditServicePro;
