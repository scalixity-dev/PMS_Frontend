import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import ServiceBreadCrumb from '../../../../components/ServiceBreadCrumb';
import { useGetCurrentUser, useUpdateProfile } from '../../../../../../hooks/useAuthQueries';
import ServiceTabs from '../../../../components/ServiceTabs';
import DashboardButton from '../../../../components/DashboardButton';
import DeleteConfirmationModal from '../../../../../../components/common/modals/DeleteConfirmationModal';
import SearchableDropdown from '../../../../../../components/ui/SearchableDropdown';
import { Country, State } from 'country-state-city';
import type { ICountry, IState } from 'country-state-city';

const ProfileSettings = () => {
    const navigate = useNavigate();

    // -- State --
    const [activeTab, setActiveTab] = useState('profile');

    // Edit modes
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Location Data
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);

    // Form Data - initialized from API
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        phoneCountryCode: '',
        role: '',
        country: '',
        state: '',
        address: '',
        pincode: '',
    });

    const { data: currentUser, isLoading: userLoading } = useGetCurrentUser();
    const updateProfileMutation = useUpdateProfile();

    // Populate form from current user
    useEffect(() => {
        if (currentUser) {
            setFormData({
                fullName: currentUser.fullName ?? '',
                email: currentUser.email ?? '',
                phoneNumber: currentUser.phoneNumber ?? '',
                phoneCountryCode: currentUser.phoneCountryCode ?? '',
                role: currentUser.role ?? 'Service Provider',
                country: currentUser.country ?? '',
                state: currentUser.state ?? '',
                address: currentUser.address ?? '',
                pincode: currentUser.pincode ?? '',
            });
        }
    }, [currentUser]);

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

    // Password Form
    const [passwordForm, setPasswordForm] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const userProfile = {
        name: formData.fullName || currentUser?.fullName || 'Service Provider',
        email: formData.email || currentUser?.email || '',
        initials: (formData.fullName || currentUser?.fullName || 'SP')
            .split(/\s+/)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
    };

    // -- Handlers --

    const handleTabChange = (val: string) => {
        setActiveTab(val);
        if (val === 'security') navigate('/service-dashboard/settings/security');
        if (val === 'integrations') navigate('/service-dashboard/settings/integrations');
        if (val === 'notifications') navigate('/service-dashboard/settings/notifications');
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSavePersonal = () => {
        updateProfileMutation.mutate(
            {
                phoneCountryCode: formData.phoneCountryCode || undefined,
                phoneNumber: formData.phoneNumber || undefined,
            },
            {
                onSuccess: () => setIsEditingPersonal(false),
            }
        );
    };

    const handleSaveAddress = () => {
        updateProfileMutation.mutate(
            {
                country: formData.country || undefined,
                state: formData.state || undefined,
                pincode: formData.pincode || undefined,
                address: formData.address || undefined,
            },
            {
                onSuccess: () => setIsEditingAddress(false),
            }
        );
    };

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
        if (passwordForm.newPassword.length < 6) {
            alert("Password must be at least 6 characters.");
            return;
        }

        console.log("Saving password:", passwordForm);
        // Simulate API
        alert("Password updated successfully.");
        setIsChangingPassword(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    };

    const handleDeleteAccount = () => {
        console.log("Deleting account...");
        setShowDeleteModal(false);
        navigate('/');
    };

    return (
        <div className="min-h-screen font-sans w-full max-w-full overflow-x-hidden">
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
                            { label: 'Profile', active: true }
                        ]}
                    />
                </div>

                {/* Main Content Card */}
                <div className="bg-[#F6F6F6] rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-800">Account settings</h1>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-4 sm:px-6 pt-2">
                        <ServiceTabs
                            tabs={[
                                { label: 'Profile', value: 'profile' },
                                { label: 'Security', value: 'security' },
                                { label: 'Integrations', value: 'integrations' },
                                { label: 'Notifications', value: 'notifications' }
                            ]}
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            className="border-none"
                        />
                    </div>

                    <div className="p-4 sm:p-8">
                        {userLoading ? (
                            <div className="py-12 text-center text-gray-500">Loading profile...</div>
                        ) : (
                            <>
                        {/* 1. Header Section (Avatar) */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 sm:mb-10">
                            <div className="relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-blue-100">
                                    <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-gray-700 bg-coral-100 uppercase">
                                        {userProfile.initials}
                                    </div>
                                </div>
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                                <p className="text-sm text-gray-500">{userProfile.email}</p>
                            </div>
                        </div>

                        {/* 2. Personal Information */}
                        <div className="mb-10">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
                                <DashboardButton
                                    onClick={() => (isEditingPersonal ? handleSavePersonal() : setIsEditingPersonal(true))}
                                    disabled={updateProfileMutation.isPending}
                                    className="h-8 text-xs font-bold px-4"
                                >
                                    {isEditingPersonal ? (updateProfileMutation.isPending ? 'Saving...' : 'Save') : 'Edit'}
                                </DashboardButton>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6">
                                {/* Full Name (read-only) */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Full Name</label>
                                    <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm">
                                        {formData.fullName}
                                    </div>
                                </div>

                                {/* Email Address (read-only) */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Email Address</label>
                                    <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm flex items-center justify-between">
                                        <span className="truncate pr-2">{formData.email}</span>
                                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-green-600" />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Number */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Phone Number</label>
                                    {isEditingPersonal ? (
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                placeholder="Code"
                                                value={formData.phoneCountryCode}
                                                onChange={(e) => handleInputChange('phoneCountryCode', e.target.value)}
                                                className="w-20 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                            <input
                                                type="text"
                                                value={formData.phoneNumber}
                                                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                                className="flex-1 p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                            />
                                        </div>
                                    ) : (
                                        <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm">
                                            {formData.phoneCountryCode ? `${formData.phoneCountryCode} ` : ''}{formData.phoneNumber || '-'}
                                        </div>
                                    )}
                                </div>

                                {/* User Role */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">User Role</label>
                                    <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-500 shadow-sm">
                                        {formData.role}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="border-b border-gray-200 mb-8" />

                        {/* 3. Email & Password Section */}
                        <div className="space-y-6 mb-10">
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
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
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

                        <div className="border-b border-gray-200 mb-8" />

                        {/* 4. Address */}
                        <div className="mb-12">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Address</h2>
                                <DashboardButton
                                    onClick={() => (isEditingAddress ? handleSaveAddress() : setIsEditingAddress(true))}
                                    disabled={updateProfileMutation.isPending}
                                    className="h-8 text-xs font-bold px-4"
                                >
                                    {isEditingAddress ? (updateProfileMutation.isPending ? 'Saving...' : 'Save') : 'Edit'}
                                </DashboardButton>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Country</label>
                                    {isEditingAddress ? (
                                        <SearchableDropdown
                                            value={formData.country}
                                            options={countries.map(c => c.name)}
                                            onChange={(value) => {
                                                handleInputChange('country', value);
                                                handleInputChange('state', '');
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
                                            onChange={(value) => handleInputChange('state', value)}
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
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Address</label>
                                    {isEditingAddress ? (
                                        <input
                                            type="text"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange('address', e.target.value)}
                                            placeholder="Street address, city"
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    ) : (
                                        <div className="w-full p-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-800 shadow-sm">
                                            {formData.address || '-'}
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

                        {/* 5. Delete Account */}
                        <div className="mt-12 pt-8">
                            <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Account</h2>
                            <p className="text-sm text-red-500 mb-6">Please note that all of the information will be permanently deleted.</p>

                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="px-6 py-2.5 bg-[#FF5858] text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors shadow-sm"
                            >
                                Delete Account
                            </button>
                        </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ProfileSettings;
