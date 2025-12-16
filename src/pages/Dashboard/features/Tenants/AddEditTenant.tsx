import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Plus, Trash2, Upload, FileText, X } from 'lucide-react';
import { format, parse, differenceInYears, isValid } from 'date-fns';
import DatePicker from '../../../../components/ui/DatePicker';
import CustomDropdown from '../../components/CustomDropdown';

// Mock Data for Edit Mode
const MOCK_TENANT_DATA: Record<string, any> = {
    '1': {
        personalInfo: {
            firstName: 'Anjali',
            middleName: '',
            lastName: 'Vyas',
            companyName: 'Tech Corp',
            dateOfBirth: '15/05/1990',
            email: 'Anjli57474@gmail.com',
            phone: '+91 8569325417',
            age: '33',
        },
        forwardingAddress: {
            address: 'Silicon City Main Rd',
            unit: 'A-204',
            city: 'Indore',
            state: 'MP',
            zip: '452012',
            country: 'India'
        },
        emergencyContacts: [
            { id: 1, name: 'Jay Rai', email: 'jay@example.com', phone: '+91 78546 21026', details: 'Brother' }
        ],
        pets: [
            { id: 1, type: 'Dog', name: 'Tommy', weight: '5kg', breed: 'German Shepherd' }
        ],
        vehicles: [
            { id: 1, type: 'Car', make: 'Honda', model: 'City', year: '2021', color: 'Red', licensePlate: 'MP09AB1234', registeredIn: 'MP' }
        ],
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
    },
    '2': {
        personalInfo: {
            firstName: 'Sam',
            middleName: '',
            lastName: 'Curren',
            companyName: 'Design Studio',
            dateOfBirth: '20/08/1988',
            email: 'Currensam@gmail.com',
            phone: '+91 8569325417',
            age: '35',
        },
        forwardingAddress: {
            address: '',
            unit: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        },
        emergencyContacts: [
            { id: 1, name: '', email: '', phone: '', details: '' }
        ],
        pets: [
            { id: 1, type: '', name: '', weight: '', breed: '' }
        ],
        vehicles: [
            { id: 1, type: '', make: '', model: '', year: '', color: '', licensePlate: '', registeredIn: '' }
        ],
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
    }
};

// US States Data
const US_STATES = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
    { value: 'CO', label: 'Colorado' },
    { value: 'CT', label: 'Connecticut' },
    { value: 'DE', label: 'Delaware' },
    { value: 'FL', label: 'Florida' },
    { value: 'GA', label: 'Georgia' },
    { value: 'HI', label: 'Hawaii' },
    { value: 'ID', label: 'Idaho' },
    { value: 'IL', label: 'Illinois' },
    { value: 'IN', label: 'Indiana' },
    { value: 'IA', label: 'Iowa' },
    { value: 'KS', label: 'Kansas' },
    { value: 'KY', label: 'Kentucky' },
    { value: 'LA', label: 'Louisiana' },
    { value: 'ME', label: 'Maine' },
    { value: 'MD', label: 'Maryland' },
    { value: 'MA', label: 'Massachusetts' },
    { value: 'MI', label: 'Michigan' },
    { value: 'MN', label: 'Minnesota' },
    { value: 'MS', label: 'Mississippi' },
    { value: 'MO', label: 'Missouri' },
    { value: 'MT', label: 'Montana' },
    { value: 'NE', label: 'Nebraska' },
    { value: 'NV', label: 'Nevada' },
    { value: 'NH', label: 'New Hampshire' },
    { value: 'NJ', label: 'New Jersey' },
    { value: 'NM', label: 'New Mexico' },
    { value: 'NY', label: 'New York' },
    { value: 'NC', label: 'North Carolina' },
    { value: 'ND', label: 'North Dakota' },
    { value: 'OH', label: 'Ohio' },
    { value: 'OK', label: 'Oklahoma' },
    { value: 'OR', label: 'Oregon' },
    { value: 'PA', label: 'Pennsylvania' },
    { value: 'RI', label: 'Rhode Island' },
    { value: 'SC', label: 'South Carolina' },
    { value: 'SD', label: 'South Dakota' },
    { value: 'TN', label: 'Tennessee' },
    { value: 'TX', label: 'Texas' },
    { value: 'UT', label: 'Utah' },
    { value: 'VT', label: 'Vermont' },
    { value: 'VA', label: 'Virginia' },
    { value: 'WA', label: 'Washington' },
    { value: 'WV', label: 'West Virginia' },
    { value: 'WI', label: 'Wisconsin' },
    { value: 'WY', label: 'Wyoming' }
];

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

    // File Upload Refs and State
    const profileInputRef = useRef<HTMLInputElement>(null);
    const documentsInputRef = useRef<HTMLInputElement>(null);
    const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
    const [documents, setDocuments] = useState<File[]>([]);

    // State for sections visibility
    const [sections, setSections] = useState({
        forwardingAddress: false,
        emergencyContacts: false,
        pets: false,
        vehicles: false
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Form Data
    const [formData, setFormData] = useState({
        personalInfo: {
            firstName: '',
            middleName: '',
            lastName: '',
            companyName: '',
            dateOfBirth: '',
            email: '',
            phone: '',
            age: '',
        },
        forwardingAddress: {
            address: '',
            unit: '',
            city: '',
            state: '',
            zip: '',
            country: ''
        },
        emergencyContacts: [
            { id: 1, name: '', email: '', phone: '', details: '' }
        ],
        pets: [
            { id: 1, type: '', name: '', weight: '', breed: '' }
        ],
        vehicles: [
            { id: 1, type: '', make: '', model: '', year: '', color: '', licensePlate: '', registeredIn: '' }
        ]
    });

    // Prefill Data in Edit Mode
    useEffect(() => {
        if (isEditMode && id && MOCK_TENANT_DATA[id]) {
            const data = MOCK_TENANT_DATA[id];

            setFormData(prev => ({
                ...prev,
                personalInfo: data.personalInfo,
                forwardingAddress: data.forwardingAddress,
                emergencyContacts: data.emergencyContacts.length > 0 ? data.emergencyContacts : prev.emergencyContacts,
                pets: data.pets.length > 0 ? data.pets : prev.pets,
                vehicles: data.vehicles.length > 0 ? data.vehicles : prev.vehicles
            }));

            setProfilePhoto(data.image || null);

            // Determine which sections should be open based on data presence
            setSections({
                forwardingAddress: !!data.forwardingAddress.address,
                emergencyContacts: data.emergencyContacts.some((c: any) => c.name),
                pets: data.pets.some((p: any) => p.name),
                vehicles: data.vehicles.some((v: any) => v.make)
            });
        }
    }, [id, isEditMode]);

    const toggleSection = (section: keyof typeof sections, value: boolean) => {
        setSections(prev => ({ ...prev, [section]: value }));
    };

    const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            personalInfo: { ...prev.personalInfo, [name]: value }
        }));
    };

    const handleForwardingAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            forwardingAddress: { ...prev.forwardingAddress, [name]: value }
        }));
    };

    const handleForwardingAddressDropdownChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            forwardingAddress: { ...prev.forwardingAddress, [name]: value }
        }));
    };

    // Generic list handlers
    const handleListChange = (section: 'emergencyContacts' | 'pets' | 'vehicles', id: number, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].map((item: any) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        }));
    };

    const handleAddListItem = (section: 'emergencyContacts' | 'pets' | 'vehicles') => {
        setFormData(prev => {
            const newItem = {
                id: Math.max(0, ...prev[section].map((i: any) => i.id)) + 1,
                // Default values based on section
                ...(section === 'emergencyContacts' ? { name: '', email: '', phone: '', details: '' } : {}),
                ...(section === 'pets' ? { type: '', name: '', weight: '', breed: '' } : {}),
                ...(section === 'vehicles' ? { type: '', make: '', model: '', year: '', color: '', licensePlate: '', registeredIn: '' } : {})
            };
            return { ...prev, [section]: [...prev[section], newItem] };
        });
    };

    const handleRemoveListItem = (section: 'emergencyContacts' | 'pets' | 'vehicles', id: number) => {
        setFormData(prev => ({
            ...prev,
            [section]: prev[section].filter((item: any) => item.id !== id)
        }));
    };

    // File Handlers
    const handleProfilePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setProfilePhoto(ev.target.result as string);
                }
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
            const newFiles = Array.from(e.target.files);
            setDocuments(prev => [...prev, ...newFiles]);
        }
    };

    const handleRemoveDocument = (index: number) => {
        setDocuments(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.personalInfo.firstName) newErrors.firstName = 'First Name is required';
        if (!formData.personalInfo.lastName) newErrors.lastName = 'Last Name is required';
        if (!formData.personalInfo.phone) newErrors.phone = 'Phone is required';
        if (!formData.personalInfo.email) newErrors.email = 'Email is required';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            // Scroll to top to see errors
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Clear errors
        setErrors({});

        console.log('Submitting Form Data:', formData);
        console.log('Profile Photo:', profilePhoto);
        console.log('Documents:', documents);

        // Simulate API call and success navigation
        alert('Tenant updated successfully! (Data logged to console)');
        navigate('/dashboard/contacts/tenants');
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

    return (
        <div className="max-w-6xl mx-auto min-h-screen font-outfit pb-10">
            {/* Breadcrumb - Optional based on design, keeping simple implementation for now */}

            <div className="p-6 bg-[#E0E5E5] min-h-screen rounded-[2rem]">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                            <ChevronLeft className="w-6 h-6 text-black" />
                        </button>
                        <h1 className="text-2xl font-bold text-black">{isEditMode ? 'Edit Tenant' : 'Add Tenant'}</h1>
                    </div>
                </div>

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

                {/* Personal Information */}
                <div className="mb-8">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <InputField label="First Name" name="firstName" value={formData.personalInfo.firstName} onChange={handlePersonalInfoChange} placeholder="First Name" error={errors.firstName} />
                        <InputField label="Middle Name" name="middleName" value={formData.personalInfo.middleName} onChange={handlePersonalInfoChange} placeholder="Middle Name" />
                        <InputField label="Last Name" name="lastName" value={formData.personalInfo.lastName} onChange={handlePersonalInfoChange} placeholder="Last Name" error={errors.lastName} />
                        <InputField label="Company Name" name="companyName" value={formData.personalInfo.companyName} onChange={handlePersonalInfoChange} placeholder="Company Name" />
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
                                        setFormData(prev => ({
                                            ...prev,
                                            personalInfo: {
                                                ...prev.personalInfo,
                                                dateOfBirth: dateString,
                                                age: age
                                            }
                                        }));
                                    } else {
                                        setFormData(prev => ({
                                            ...prev,
                                            personalInfo: {
                                                ...prev.personalInfo,
                                                dateOfBirth: '',
                                                age: ''
                                            }
                                        }));
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
                            <InputField label="City" name="city" value={formData.forwardingAddress.city} onChange={handleForwardingAddressChange} placeholder="City" />
                            <InputField label="State/Region" name="state" value={formData.forwardingAddress.state} onChange={handleForwardingAddressChange} placeholder="State" />
                            <InputField label="Zip" name="zip" value={formData.forwardingAddress.zip} onChange={handleForwardingAddressChange} placeholder="Zip" />
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Country*</label>
                                <CustomDropdown
                                    value={formData.forwardingAddress.country}
                                    onChange={(value) => handleForwardingAddressDropdownChange('country', value)}
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
                            onAdd={() => handleAddListItem('emergencyContacts')}
                        />
                        {formData.emergencyContacts.map((contact, idx) => (
                            <div key={contact.id} className="mb-6 relative group">
                                {idx > 0 && (
                                    <button
                                        onClick={() => handleRemoveListItem('emergencyContacts', contact.id)}
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
                                        onChange={(e: any) => handleListChange('emergencyContacts', contact.id, 'name', e.target.value)}
                                        placeholder="Name"
                                    />
                                    <InputField
                                        label="Email"
                                        value={contact.email}
                                        onChange={(e: any) => handleListChange('emergencyContacts', contact.id, 'email', e.target.value)}
                                        placeholder="Email"
                                    />
                                    <InputField
                                        label="Phone Number"
                                        value={contact.phone}
                                        onChange={(e: any) => handleListChange('emergencyContacts', contact.id, 'phone', e.target.value)}
                                        placeholder="Phone Number"
                                    />
                                </div>
                                <div className="w-full">
                                    <textarea
                                        value={contact.details}
                                        onChange={(e) => handleListChange('emergencyContacts', contact.id, 'details', e.target.value)}
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
                            onAdd={() => handleAddListItem('pets')}
                        />
                        {formData.pets.map((pet, idx) => (
                            <div key={pet.id} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 relative group">
                                {idx > 0 && (
                                    <button
                                        onClick={() => handleRemoveListItem('pets', pet.id)}
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
                                        onChange={(value) => handleListChange('pets', pet.id, 'type', value)}
                                        options={[
                                            { value: 'Dog', label: 'Dog' },
                                            { value: 'Cat', label: 'Cat' }
                                        ]}
                                        placeholder="Choose"
                                        buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                    />
                                </div>
                                <InputField label="Name" value={pet.name} onChange={(e: any) => handleListChange('pets', pet.id, 'name', e.target.value)} placeholder="Name" />
                                <InputField label="Weight" value={pet.weight} onChange={(e: any) => handleListChange('pets', pet.id, 'weight', e.target.value)} placeholder="Weight" />
                                <InputField label="Breed" value={pet.breed} onChange={(e: any) => handleListChange('pets', pet.id, 'breed', e.target.value)} placeholder="Breed" />
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
                            onAdd={() => handleAddListItem('vehicles')}
                        />
                        {formData.vehicles.map((vehicle, idx) => (
                            <div key={vehicle.id} className="mb-6 relative group">
                                {idx > 0 && (
                                    <button
                                        onClick={() => handleRemoveListItem('vehicles', vehicle.id)}
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
                                            onChange={(value) => handleListChange('vehicles', vehicle.id, 'type', value)}
                                            options={[
                                                { value: 'Car', label: 'Car' },
                                                { value: 'Bike', label: 'Bike' }
                                            ]}
                                            placeholder="Choose"
                                            buttonClassName="w-full bg-white border border-gray-200 text-gray-800 px-6 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                        />
                                    </div>
                                    <InputField label="Make" value={vehicle.make} onChange={(e: any) => handleListChange('vehicles', vehicle.id, 'make', e.target.value)} placeholder="Type Here" />
                                    <InputField label="Model" value={vehicle.model} onChange={(e: any) => handleListChange('vehicles', vehicle.id, 'model', e.target.value)} placeholder="Type Here" />
                                    <InputField label="Year" value={vehicle.year} onChange={(e: any) => handleListChange('vehicles', vehicle.id, 'year', e.target.value)} placeholder="Year" />
                                    <InputField label="Color" value={vehicle.color} onChange={(e: any) => handleListChange('vehicles', vehicle.id, 'color', e.target.value)} placeholder="Color" />
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">License plate*</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={vehicle.licensePlate}
                                                onChange={(e) => handleListChange('vehicles', vehicle.id, 'licensePlate', e.target.value)}
                                                placeholder="Type"
                                                className="flex-1 bg-white border border-gray-200 text-gray-800 px-6 py-3 rounded-lg outline-none focus:ring-2 focus:ring-[#3A6D6C]/20 transition-all font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <label className="block text-xs font-bold text-gray-600 mb-2 ml-1">Registered in*</label>
                                        <CustomDropdown
                                            value={vehicle.registeredIn}
                                            onChange={(value) => handleListChange('vehicles', vehicle.id, 'registeredIn', value)}
                                            options={US_STATES}
                                            searchable={true}
                                            placeholder="Select State"
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
                        Update
                    </button>
                </div>

            </div>
        </div>
    );
};

export default AddEditTenant;
