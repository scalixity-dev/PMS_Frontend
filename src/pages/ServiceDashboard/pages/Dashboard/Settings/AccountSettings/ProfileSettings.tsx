import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check } from 'lucide-react';
import ServiceBreadCrumb from '../../../../components/ServiceBreadCrumb';
import { useGetCurrentUser, useUpdateProfile } from '../../../../../../hooks/useAuthQueries';
import ServiceTabs from '../../../../components/ServiceTabs';
import DashboardButton from '../../../../components/DashboardButton';
import DeleteConfirmationModal from '../../../../../../components/common/modals/DeleteConfirmationModal';
import SearchableDropdown from '../../../../../../components/ui/SearchableDropdown';
import { Country, State } from 'country-state-city';
import type { ICountry, IState } from 'country-state-city';
import { authService } from '../../../../../../services/auth.service';
import { API_ENDPOINTS } from '../../../../../../config/api.config';
import { useToast } from '../../../../../../components/common/Toast';
import { formatRole } from '../../../../../../utils/roleIcon';

const ProfileSettings = () => {
    const toast = useToast();
    const navigate = useNavigate();

    // -- State --
    const [activeTab, setActiveTab] = useState('profile');

    // Edit modes
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [isChangingEmail, setIsChangingEmail] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
    const profileFileRef = useRef<HTMLInputElement>(null);

    // Location Data
    const [countries, setCountries] = useState<ICountry[]>([]);
    const [states, setStates] = useState<IState[]>([]);

    // Form Data - initialized from API
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        phoneCountryCode: 'US|1',
        role: '',
        country: 'US',
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
            setProfilePhotoUrl((currentUser as any).profilePhotoUrl ?? null);
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
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [emailForm, setEmailForm] = useState({ newEmail: '', currentPassword: '' });
    const [profileErrors, setProfileErrors] = useState<{
        personal?: string;
        address?: string;
        email?: string;
    }>({});

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

    const normalizePhone = (raw: string) => (raw || '').replace(/\D/g, '');
    const normalizeCountryCode = (raw: string) => {
        const trimmed = (raw || '').trim();
        if (!trimmed) return undefined;
        // Allow optional leading '+', rest must be digits.
        return trimmed.startsWith('+') ? `+${trimmed.slice(1).replace(/\D/g, '')}` : trimmed.replace(/\D/g, '');
    };
    const isValidPincode = (value: string) => !value || /^\d{4,10}$/.test(value.trim());
    const isValidPhone = (value: string) => !value || /^\d{4,15}$/.test(normalizePhone(value));
    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const handleSavePersonal = () => {
        // Strip formatting chars before send — backend regex requires pure digits.
        const phoneNumber = normalizePhone(formData.phoneNumber);
        const phoneCountryCode = normalizeCountryCode(formData.phoneCountryCode);
        if (!isValidPhone(phoneNumber)) {
            setProfileErrors((prev) => ({ ...prev, personal: 'Phone number must be between 4 and 15 digits.' }));
            return;
        }
        setProfileErrors((prev) => ({ ...prev, personal: undefined }));
        updateProfileMutation.mutate(
            {
                phoneCountryCode: phoneCountryCode || undefined,
                phoneNumber: phoneNumber || undefined,
            },
            {
                onSuccess: () => setIsEditingPersonal(false),
                onError: (error: any) =>
                    setProfileErrors((prev) => ({ ...prev, personal: error?.message || 'Failed to save personal information.' })),
            }
        );
    };

    const handleSaveAddress = () => {
        if (!isValidPincode(formData.pincode)) {
            setProfileErrors((prev) => ({ ...prev, address: 'Pincode must contain 4 to 10 digits.' }));
            return;
        }
        setProfileErrors((prev) => ({ ...prev, address: undefined }));
        updateProfileMutation.mutate(
            {
                country: formData.country?.trim() || undefined,
                state: formData.state?.trim() || undefined,
                pincode: formData.pincode?.trim() || undefined,
                address: formData.address?.trim() || undefined,
            },
            {
                onSuccess: () => setIsEditingAddress(false),
                onError: (error: any) =>
                    setProfileErrors((prev) => ({ ...prev, address: error?.message || 'Failed to save address.' })),
            }
        );
    };

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSavePassword = async () => {
        if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error("All password fields are required.");
            return;
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }
        try {
            setIsSavingPassword(true);
            await authService.changePassword(passwordForm.oldPassword, passwordForm.newPassword);
            toast.success("Password updated successfully.");
            setIsChangingPassword(false);
            setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Failed to update password');
        } finally {
            setIsSavingPassword(false);
        }
    };

    const handleDeleteAccount = () => {
        console.log("Deleting account...");
        setShowDeleteModal(false);
        navigate('/');
    };

    const handleSaveEmail = async () => {
        const nextEmail = emailForm.newEmail.trim();
        if (!nextEmail || !emailForm.currentPassword) {
            setProfileErrors((prev) => ({ ...prev, email: 'New email and current password are required.' }));
            return;
        }
        if (!isValidEmail(nextEmail)) {
            setProfileErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
            return;
        }
        if (nextEmail.toLowerCase() === (formData.email || '').trim().toLowerCase()) {
            setProfileErrors((prev) => ({ ...prev, email: 'New email must be different from current email.' }));
            return;
        }

        try {
            const result = await authService.changeEmail(nextEmail, emailForm.currentPassword);
            setFormData((prev) => ({ ...prev, email: result.email }));
            setEmailForm({ newEmail: '', currentPassword: '' });
            setIsChangingEmail(false);
            setProfileErrors((prev) => ({ ...prev, email: undefined }));
        } catch (err: any) {
            setProfileErrors((prev) => ({ ...prev, email: err?.message || 'Failed to update email.' }));
        }
    };

    const handleProfilePhotoPick = async (file?: File) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setProfileErrors((prev) => ({ ...prev, personal: 'Only image files are allowed for profile photo.' }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setProfileErrors((prev) => ({ ...prev, personal: 'Profile photo must be 5 MB or smaller.' }));
            return;
        }

        try {
            setIsUploadingPhoto(true);
            const form = new FormData();
            form.append('file', file);
            const uploadRes = await fetch(API_ENDPOINTS.UPLOAD.IMAGE, {
                method: 'POST',
                body: form,
                credentials: 'include',
            });
            const uploadData = await uploadRes.json().catch(() => ({}));
            const url = uploadData?.data?.url || uploadData?.url;
            if (!uploadRes.ok || !url) {
                throw new Error(uploadData?.message || 'Failed to upload profile photo.');
            }
            await updateProfileMutation.mutateAsync({ profilePhotoUrl: url } as any);
            setProfilePhotoUrl(url);
            setProfileErrors((prev) => ({ ...prev, personal: undefined }));
        } catch (err: any) {
            setProfileErrors((prev) => ({ ...prev, personal: err?.message || 'Failed to upload profile photo.' }));
        } finally {
            setIsUploadingPhoto(false);
        }
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
                                    {profilePhotoUrl ? (
                                        <img src={profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-bold text-gray-700 bg-coral-100 uppercase">
                                            {userProfile.initials}
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={profileFileRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        void handleProfilePhotoPick(file);
                                        e.currentTarget.value = '';
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => profileFileRef.current?.click()}
                                    disabled={isUploadingPhoto}
                                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#7CD947] text-white shadow-md hover:bg-[#6bc238] transition-colors flex items-center justify-center disabled:opacity-60"
                                    title="Upload profile photo"
                                >
                                    <Camera size={14} />
                                </button>
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                                <p className="text-sm text-gray-500">{userProfile.email}</p>
                                {isUploadingPhoto && <p className="text-xs text-gray-500 mt-1">Uploading photo...</p>}
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
                                        {formatRole(formData.role)}
                                    </div>
                                </div>
                            </div>
                            {profileErrors.personal && (
                                <p className="text-xs text-red-500 mt-3">{profileErrors.personal}</p>
                            )}
                        </div>

                        {/* Separator */}
                        <div className="border-b border-gray-200 mb-8" />

                        {/* 3. Email & Password Section */}
                        <div className="space-y-6 mb-10">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed mt-4">
                                <span className="text-sm font-semibold text-gray-800">Email Address</span>
                                <div className="flex items-center gap-2">
                                    {isChangingEmail && (
                                        <button
                                            onClick={handleSaveEmail}
                                            className="text-xs font-semibold text-green-600 hover:text-green-700"
                                        >
                                            Save
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            setIsChangingEmail(!isChangingEmail);
                                            setProfileErrors((prev) => ({ ...prev, email: undefined }));
                                            if (!isChangingEmail) {
                                                setEmailForm({ newEmail: '', currentPassword: '' });
                                            }
                                        }}
                                        className="text-xs font-semibold text-[#5F6D7E] hover:text-[#2c5251]"
                                    >
                                        {isChangingEmail ? 'Cancel' : 'Change'}
                                    </button>
                                </div>
                            </div>
                            {isChangingEmail ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">New Email</label>
                                        <input
                                            type="email"
                                            value={emailForm.newEmail}
                                            onChange={(e) => {
                                                setEmailForm((prev) => ({ ...prev, newEmail: e.target.value }));
                                                setProfileErrors((prev) => ({ ...prev, email: undefined }));
                                            }}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 mb-2 ml-1">Current Password</label>
                                        <input
                                            type="password"
                                            value={emailForm.currentPassword}
                                            onChange={(e) => {
                                                setEmailForm((prev) => ({ ...prev, currentPassword: e.target.value }));
                                                setProfileErrors((prev) => ({ ...prev, email: undefined }));
                                            }}
                                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-800 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="text-xs text-gray-400 -mt-2 ml-1">Current email: {formData.email || '-'}</div>
                            )}
                            {profileErrors.email && <p className="text-xs text-red-500 -mt-2">{profileErrors.email}</p>}

                            <div className="flex justify-between items-center py-2 border-b border-gray-50 border-dashed mt-4">
                                <span className="text-sm font-semibold text-gray-800">Password</span>
                                <div className="flex items-center gap-2">
                                    {isChangingPassword && (
                                        <button
                                            onClick={handleSavePassword}
                                            disabled={isSavingPassword}
                                            className="text-xs font-semibold text-green-600 hover:text-green-700"
                                        >
                                            {isSavingPassword ? 'Saving...' : 'Save'}
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
                            {profileErrors.address && (
                                <p className="text-xs text-red-500 mt-3">{profileErrors.address}</p>
                            )}
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
