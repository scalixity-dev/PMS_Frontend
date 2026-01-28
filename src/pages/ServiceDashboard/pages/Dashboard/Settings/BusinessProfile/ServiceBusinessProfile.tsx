import React, { useState, useRef, useEffect } from 'react';
import {
    CheckCircle2,
    Check,
    Camera,
    X
} from 'lucide-react';
import ServiceBreadCrumb from '../../../../components/ServiceBreadCrumb';
import ServiceTabs from '../../../../components/ServiceTabs';
import DashboardButton from '../../../../components/DashboardButton';
import { useNavigate } from 'react-router-dom';
import SearchableDropdown from '../../../../../../components/ui/SearchableDropdown';
import DeleteConfirmationModal from '../../../../../../components/common/modals/DeleteConfirmationModal';
import { Country, State, City } from 'country-state-city';
import type { ICountry, IState, ICity } from 'country-state-city';

// Define service categories and their options
const SERVICE_CATEGORIES = [
    {
        label: "Cleaning",
        options: ["House Cleaning", "Carpet Clean", "Window", "Debris", "Exterior", "Commercial Cleaning Service"]
    },
    {
        label: "Plumbing",
        options: ["Leak Repair", "Pipe Installation", "Drain Cleaning", "Water Heater", "Toilet Repair"]
    },
    {
        label: "Electrical",
        options: ["Wiring", "Lighting", "Panel Upgrade", "Outlet Installation", "Emergency Repair"]
    },
    {
        label: "HVAC",
        options: ["AC Repair", "Heating System", "Duct Cleaning", "Thermostat Installation"]
    },
    {
        label: "Landscaping",
        options: ["Lawn Mowing", "Tree Trimming", "Garden Design", "Irrigation", "Snow Removal"]
    }
];

const ServiceBusinessProfile = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Location Data
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);
    const [cities, setCities] = useState<ICity[]>([]);

    // State for categories
    const [selectedCategory, setSelectedCategory] = useState<string>("Cleaning");

    // Edit mode states
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isSavingPersonal, setIsSavingPersonal] = useState(false);

    // Form Data State
    const [formData, setFormData] = useState({
        firstName: 'Siddak',
        lastName: 'Bagga',
        email: 'siddakbagga@gmail.com',
        phone: '+91 9999999999',
        displayPhone: true,
        password: '', // Should be empty initially
        country: 'India',
        state: 'Madhya Pradesh',
        city: 'Indore',
        pincode: '452001',
        description: '',
        services: ['House Cleaning', 'Window', 'Commercial Cleaning Service'] as string[],
        coverPhoto: null as string | null
    });

    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSavePassword = () => {
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            alert("All password fields are required.");
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            alert("New passwords do not match.");
            return;
        }
        console.log("Saving password:", passwordForm);
        alert("Password updated successfully.");
        setIsChangingPassword(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    const userProfile = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        avatar: 'https://cdn.usegalileo.ai/sdxl10/24036f56-0610-4762-8176-805bc9713602.png',
    };

    // Derived available options based on selected category
    const currentCategoryOptions = SERVICE_CATEGORIES.find(c => c.label === selectedCategory)?.options || [];

    // Load API Data
    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    // Load states when country changes
    useEffect(() => {
        if (formData.country) {
            // Find country code from name or code
            const selectedCountry = countries.find(c => c.name === formData.country || c.isoCode === formData.country);
            if (selectedCountry) {
                const countryStates = State.getStatesOfCountry(selectedCountry.isoCode);
                setStates(countryStates);
                // If current state is not valid for new country, clear it
                if (formData.state && !countryStates.find(s => s.name === formData.state)) {
                    // Optional: clean up state if needed, but keeping text for flexibility
                }
            }
        } else {
            setStates([]);
        }
    }, [formData.country, countries]);

    // Load cities when state changes
    useEffect(() => {
        if (formData.country && formData.state) {
            const selectedCountry = countries.find(c => c.name === formData.country || c.isoCode === formData.country);
            const selectedState = states.find(s => s.name === formData.state || s.isoCode === formData.state);

            if (selectedCountry && selectedState) {
                const stateCities = City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode);
                setCities(stateCities);
            }
        } else {
            setCities([]);
        }
    }, [formData.country, formData.state, countries, states]);

    // Handlers
    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSavePersonal = () => {
        if (isEditingPersonal) {
            // Validation
            if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
                alert("Please fill in First Name, Last Name and Email.");
                return;
            }
            // Save Simulation
            setIsSavingPersonal(true);
            setTimeout(() => {
                setIsSavingPersonal(false);
                setIsEditingPersonal(false);
                // alert("Personal information updated.");
            }, 800);
        } else {
            setIsEditingPersonal(true);
        }
    };

    const handleDeleteAccount = () => {
        // API call to delete account would go here
        console.log("Deleting account...");
        setShowDeleteModal(false);
        navigate('/'); // Redirect after deletion
    };

    const toggleService = (service: string) => {
        setFormData(prev => {
            const currentServices = prev.services;
            if (currentServices.includes(service)) {
                return { ...prev, services: currentServices.filter(s => s !== service) };
            } else {
                return { ...prev, services: [...currentServices, service] };
            }
        });
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validation
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
            if (!validTypes.includes(file.type)) {
                alert("Please upload a valid image (JPEG, PNG, GIF, WEBP, SVG).");
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB
                alert("Image size must be less than 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, coverPhoto: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeCoverPhoto = () => {
        setFormData(prev => ({ ...prev, coverPhoto: null }));
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="min-h-screen font-sans">
            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteAccount}
                title="Delete Account"
                message="Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost."
            />

            <div className="w-full">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <ServiceBreadCrumb
                        items={[
                            { label: 'Dashboard', to: '/service-dashboard' },
                            { label: 'Settings', to: '/service-dashboard/settings' },
                            { label: 'Business Profile', active: true }
                        ]}
                    />
                </div>

                <div className="bg-[#F6F6F6] rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-6 py-2 border-b border-gray-300">
                        <h1 className="text-2xl font-semibold text-gray-800">Business Profile</h1>
                    </div>
                    {/* Header Tabs */}
                    <div className="border-b border-gray-300 flex items-center px-6 pt-3">
                        <ServiceTabs
                            tabs={[
                                { label: 'Business Profile', value: 'business_profile' },
                                { label: 'Job Preference', value: 'job_preference' }
                            ]}
                            activeTab="business_profile"
                            onTabChange={(val) => {
                                if (val === 'job_preference') {
                                    navigate('/service-dashboard/settings/job-preference'); // Adjust route if needed, assuming standard pattern
                                }
                            }}
                            className="border-none"
                        />
                    </div>

                    <div className="p-8">
                        {/* Profile Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-12">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-blue-100">
                                    <img
                                        src={userProfile.avatar}
                                        alt={userProfile.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=User&background=ff6b6b&color=fff';
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="text-center sm:text-left mt-2">
                                <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                                <p className="text-gray-500">{userProfile.email}</p>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                                <DashboardButton
                                    onClick={handleSavePersonal}
                                    disabled={isSavingPersonal}
                                    className="h-8 text-xs font-bold"
                                >
                                    {isSavingPersonal ? 'Saving...' : (isEditingPersonal ? 'Save' : 'Edit')}
                                </DashboardButton>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">First Name</label>
                                    {isEditingPersonal ? (
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    ) : (
                                        <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm">
                                            {formData.firstName}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Last Name</label>
                                    {isEditingPersonal ? (
                                        <input
                                            type="text"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    ) : (
                                        <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm">
                                            {formData.lastName}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
                                    <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm flex items-center justify-between">
                                        <span className="truncate pr-2">{formData.email}</span>
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Phone Number</label>
                                    {isEditingPersonal ? (
                                        <input
                                            type="text"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm mb-3 focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    ) : (
                                        <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm mb-3">
                                            {formData.phone}
                                        </div>
                                    )}
                                    <div
                                        role="switch"
                                        aria-checked={formData.displayPhone}
                                        tabIndex={0}
                                        className="flex items-center gap-2 ml-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500 rounded p-1"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                handleInputChange('displayPhone', !formData.displayPhone);
                                            }
                                        }}
                                        onClick={() => {
                                            handleInputChange('displayPhone', !formData.displayPhone);
                                        }}
                                    >
                                        <div className={`w-10 h-5 rounded-full p-1 transition-colors ${formData.displayPhone ? 'bg-[#7BD747]' : 'bg-gray-300'}`}>
                                            <div className={`w-3 h-3 bg-white rounded-full shadow-sm transform transition-transform ${formData.displayPhone ? 'translate-x-5' : 'translate-x-0'}`} />
                                        </div>
                                        <span className="text-xs font-medium text-gray-600">Display the phone number</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-800">Email Address</span>
                                        <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-bold rounded-full border border-green-200 flex items-center gap-1">
                                            Verified
                                            <CheckCircle2 className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-400 mt-1 ml-1">Your email is {formData.email}</div>


                                <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed mt-4">
                                    <span className="text-sm font-semibold text-gray-800">Password</span>
                                    <div className="flex items-center gap-2">
                                        {isChangingPassword && (
                                            <button
                                                onClick={handleSavePassword}
                                                className="text-xs font-semibold text-green-600 hover:text-green-700"
                                            >
                                                Save
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setIsChangingPassword(!isChangingPassword);
                                                if (!isChangingPassword) {
                                                    // Reset form when opening
                                                    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
                                                }
                                            }}
                                            className="text-xs font-semibold text-[#5F6D7E] hover:text-[#2c5251]"
                                        >
                                            {isChangingPassword ? 'Cancel' : 'Change'}
                                        </button>
                                    </div>
                                </div>
                                {isChangingPassword ? (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Old Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.oldPassword}
                                                onChange={(e) => handlePasswordChange('oldPassword', e.target.value)}
                                                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.newPassword}
                                                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={passwordForm.confirmPassword}
                                                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                                className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-xs text-gray-400 -mt-2 ml-1">You haven't changed the password yet.</div>
                                )}
                            </div>
                        </div>

                        {/* Business Address */}
                        <div className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-gray-900">Business Address</h2>
                                <DashboardButton
                                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                                    className="h-8 text-xs font-bold"
                                >
                                    {isEditingAddress ? 'Save' : 'Edit'}
                                </DashboardButton>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Country</label>
                                    {isEditingAddress ? (
                                        <SearchableDropdown
                                            value={formData.country}
                                            options={countries.map(c => c.name)}
                                            onChange={(value) => {
                                                handleInputChange('country', value);
                                                handleInputChange('state', ''); // Reset state
                                                handleInputChange('city', ''); // Reset city
                                            }}
                                            placeholder="Select Country"
                                            buttonClassName="w-full flex items-center justify-between bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-sm shadow-sm hover:border-gray-400 transition-colors"
                                            className="w-full"
                                            allowCustomValue={true}
                                        />
                                    ) : (
                                        <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm">
                                            {formData.country}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">State</label>
                                    {isEditingAddress ? (
                                        <SearchableDropdown
                                            value={formData.state}
                                            options={states.map(s => s.name)}
                                            onChange={(value) => {
                                                handleInputChange('state', value);
                                                handleInputChange('city', ''); // Reset city
                                            }}
                                            placeholder="Select State"
                                            buttonClassName="w-full flex items-center justify-between bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-sm shadow-sm hover:border-gray-400 transition-colors"
                                            className="w-full"
                                            allowCustomValue={true}
                                        />
                                    ) : (
                                        <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm">
                                            {formData.state}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">City</label>
                                    {isEditingAddress ? (
                                        <SearchableDropdown
                                            value={formData.city}
                                            options={cities.map(c => c.name)}
                                            onChange={(value) => handleInputChange('city', value)}
                                            placeholder="Select City"
                                            buttonClassName="w-full flex items-center justify-between bg-white border border-gray-300 px-3 py-2.5 rounded-lg text-sm shadow-sm hover:border-gray-400 transition-colors"
                                            className="w-full"
                                            allowCustomValue={true}
                                        />
                                    ) : (
                                        <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm">
                                            {formData.city}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Pincode</label>
                                    {isEditingAddress ? (
                                        <input
                                            type="text"
                                            value={formData.pincode}
                                            onChange={(e) => handleInputChange('pincode', e.target.value)}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    ) : (
                                        <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm">
                                            {formData.pincode}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Professional Services */}
                        <div className="mb-12">
                            <h2 className="text-lg font-bold text-gray-900 mb-1">Professional services</h2>
                            <p className="text-xs text-gray-500 mb-4 ml-1">What do you specialize in?</p>

                            <div className="mb-6 max-w-sm">
                                <SearchableDropdown
                                    value={selectedCategory}
                                    options={SERVICE_CATEGORIES.map(c => c.label)}
                                    onChange={(value) => setSelectedCategory(value)}
                                    placeholder="Select a service category"
                                    buttonClassName="w-full flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-lg font-medium shadow-sm hover:border-gray-300 transition-colors"
                                    className="w-full"
                                />
                            </div>

                            <div className="flex flex-wrap gap-3 mb-8">
                                {currentCategoryOptions.map((service, index) => (
                                    <div
                                        key={index}
                                        onClick={() => toggleService(service)}
                                        className={`px-4 py-2 rounded-lg text-xs font-medium border shadow-sm transition-colors cursor-pointer ${formData.services.includes(service)
                                            ? 'bg-[#7BD747] text-white border-[#7BD747]'
                                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                            }`}
                                    >
                                        {service}
                                    </div>
                                ))}
                                {currentCategoryOptions.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No services available for this category.</p>
                                )}
                            </div>

                            <div className="mt-8">
                                <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Description of service</label>
                                <textarea
                                    className="w-full p-4 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 shadow-sm h-32 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
                                    placeholder="Describe your services..."
                                    value={formData.description}
                                    onChange={(e) => handleInputChange('description', e.target.value)}
                                />
                            </div>

                            <div className="mt-6">
                                <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Cover photo</label>
                                <div className="w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative overflow-hidden hover:bg-gray-50 transition-colors">
                                    {formData.coverPhoto ? (
                                        <>
                                            <img src={formData.coverPhoto} alt="Cover" className="w-full h-full object-cover" />
                                            <button
                                                onClick={removeCoverPhoto}
                                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-sm"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-6 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-200">
                                                <Camera className="text-gray-400" size={24} />
                                            </div>
                                            <p className="text-sm font-medium text-gray-600">Click to upload cover photo</p>
                                            <p className="text-xs text-gray-400 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delete Account */}
                        <div className="mt-12 pt-8 border-t border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Account</h2>
                            <p className="text-sm text-red-400 mb-6">Please note that all of the information will be permanently deleted.</p>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-6 py-2.5 bg-[#FF5858] text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceBusinessProfile;
