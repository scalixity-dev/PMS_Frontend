import React, { useState, useEffect, useMemo } from "react";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { Country, State, City } from 'country-state-city';
import { format } from 'date-fns';
import BaseModal from "../../../../components/common/modals/BaseModal";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import CustomDropdown from "../../../Dashboard/components/CustomDropdown";
import DatePicker from "../../../../components/ui/DatePicker";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";
import { formatPhoneNumber, isValidPhoneNumberLoose, isValidPhoneNumber, extractDialCode } from '@/utils/phone.utils';
import { isValidPincode } from '@/utils/pincode.utils';
import { formatRole } from '@/utils/roleIcon';
import { useToast } from "../../../../components/common/Toast";


import { useAuthStore } from "./store/authStore";
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import type { UserInfo } from "../../utils/types";
import { useUpdateProfile, useChangePassword, useGetCurrentUser, useDeleteAccount } from "../../../../hooks/useAuthQueries";
import { useNavigate } from "react-router-dom";

// Resolves a bare dialling code ("+1") stored on the backend back to a
// "ISO|digits" selector value. The backend only stores the dial code, not
// which country picked it, so codes shared by multiple countries (e.g. +1 for
// both US and Canada) default to the US entry rather than losing the value.
const resolvePhoneCountryCode = (code?: string | null): string => {
  if (!code) return '';
  const digits = code.replace(/\D/g, '');
  if (!digits) return '';
  const countries = Country.getAllCountries();
  if (countries.some(c => c.isoCode === 'US' && c.phonecode === digits)) {
    return `US|${digits}`;
  }
  const match = countries.find(c => c.phonecode === digits);
  return match ? `${match.isoCode}|${digits}` : '';
};

const parseDob = (value?: string | null): Date | undefined => {
  if (!value) return undefined;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? undefined : d;
};



const Profile: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { userInfo, setUserInfo } = useAuthStore();

  // Refetch current user from API on mount so data survives page refresh
  const { data: apiUser } = useGetCurrentUser();

  // Modal State
  const [editMode, setEditMode] = useState<'personal' | 'address' | 'password' | null>(null);
  const [tempInfo, setTempInfo] = useState<UserInfo | null>(userInfo);

  // Sync zustand store with API data on mount/refresh
  useEffect(() => {
    if (apiUser) {
      const nameParts = (apiUser.fullName || '').trim().split(/\s+/);
      const hydrated: UserInfo = {
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: apiUser.email || '',
        phone: (apiUser as any).phoneNumber || '',
        phoneCountryCode: resolvePhoneCountryCode((apiUser as any).phoneCountryCode),
        country: (apiUser as any).country || '',
        state: (apiUser as any).state || '',
        city: (apiUser as any).city || '',
        pincode: (apiUser as any).pincode || '',
        dob: (apiUser as any).dateOfBirth || '',
        role: apiUser.role || '',
        address: (apiUser as any).address || '',
        profilePhotoUrl: (apiUser as any).profilePhotoUrl || '',
      } as any;
      setUserInfo(hydrated);
      setTempInfo(hydrated);
    }
  }, [apiUser, setUserInfo]);

  useEffect(() => {
    if (userInfo && !tempInfo) {
      setTempInfo(userInfo);
    }
  }, [userInfo, tempInfo]);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const deleteAccountMutation = useDeleteAccount();



  // Country/State/City dropdown options for the Address edit modal
  const countryOptions = useMemo(() => (
    Country.getAllCountries()
      .map(c => ({ value: c.isoCode, label: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label))
  ), []);

  const stateOptions = useMemo(() => {
    if (!tempInfo?.country) return [];
    return State.getStatesOfCountry(tempInfo.country)
      .map(s => ({ value: s.isoCode, label: s.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [tempInfo?.country]);

  const cityOptions = useMemo(() => {
    if (!tempInfo?.country || !tempInfo?.state) return [];
    return City.getCitiesOfState(tempInfo.country, tempInfo.state)
      .map(c => ({ value: c.name, label: c.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [tempInfo?.country, tempInfo?.state]);

  // Phone country-code dropdown options for the Personal Information edit modal.
  // Label is just flag + dial code (not the country name) so the compact
  // trigger button never wraps to two lines.
  const phoneCountryCodeOptions = useMemo(() => (
    Country.getAllCountries()
      .map(c => ({ value: `${c.isoCode}|${c.phonecode}`, label: `${c.flag} +${c.phonecode}`, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(({ value, label }) => ({ value, label }))
  ), []);

  // Resolve a stored country value (ISO code, or a legacy free-text name) to a display name
  const getCountryDisplayName = (value?: string) => {
    if (!value) return '';
    return Country.getCountryByCode(value)?.name || value;
  };

  const getStateDisplayName = (countryValue?: string, stateValue?: string) => {
    if (!stateValue) return '';
    if (countryValue) {
      const match = State.getStateByCodeAndCountry(stateValue, countryValue);
      if (match) return match.name;
    }
    return stateValue;
  };

  const handleCountrySelect = (value: string) => {
    setTempInfo(prev => prev ? { ...prev, country: value, state: '', city: '' } : null);
  };

  const handleStateSelect = (value: string) => {
    setTempInfo(prev => prev ? { ...prev, state: value, city: '' } : null);
  };

  const handleCitySelect = (value: string) => {
    setTempInfo(prev => prev ? { ...prev, city: value } : null);
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleEditClick = (mode: 'personal' | 'address' | 'password') => {
    // Default to United States (+1) when nothing has been set yet, matching
    // the default used across the rest of the app (e.g. signup onboarding).
    let base = userInfo;
    if (base) {
      if (mode === 'address' && !base.country) {
        base = { ...base, country: 'US' };
      }
      if (mode === 'personal' && !base.phoneCountryCode) {
        base = { ...base, phoneCountryCode: 'US|1' };
      }
    }
    setTempInfo(base);
    // Reset password data when opening password modal
    if (mode === 'password') {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPasswordVisibility({
        current: false,
        new: false,
        confirm: false
      });
    }
    setEditMode(mode);
  };

  if (!userInfo) {
    return (
      <UserAccountSettingsLayout activeTab="Profile">
        <div className="flex items-center justify-center p-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--dashboard-accent)]"></div>
        </div>
      </UserAccountSettingsLayout>
    );
  }

  const handleSave = async () => {
    setSaveError(null);
    setSaveSuccess(null);

    if (editMode === 'password') {
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        setSaveError('Please fill all password fields');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setSaveError('New passwords do not match');
        return;
      }
      if (passwordData.newPassword.length < 8) {
        setSaveError('Password must be at least 8 characters');
        return;
      }
      try {
        await changePasswordMutation.mutateAsync({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        });
        setSaveSuccess('Password changed successfully');
        setEditMode(null);
      } catch (err: any) {
        setSaveError(err?.message || 'Failed to change password');
      }
      return;
    }

    if (!tempInfo) return;

    if (editMode === 'personal' && tempInfo.phone) {
      const phoneIsValid = tempInfo.phoneCountryCode
        ? isValidPhoneNumber(tempInfo.phoneCountryCode, tempInfo.phone)
        : isValidPhoneNumberLoose(tempInfo.phone);
      if (!phoneIsValid) {
        setSaveError('Please enter a valid phone number');
        return;
      }
    }
    if (editMode === 'address' && tempInfo.pincode && !isValidPincode(tempInfo.pincode, tempInfo.country)) {
      setSaveError('Please enter a valid pincode for the selected country');
      return;
    }

    try {
      if (editMode === 'personal') {
        await updateProfileMutation.mutateAsync({
          fullName: `${tempInfo.firstName || ''} ${tempInfo.lastName || ''}`.trim(),
          phoneCountryCode: extractDialCode(tempInfo.phoneCountryCode),
          phoneNumber: tempInfo.phone,
          dateOfBirth: tempInfo.dob || undefined,
        });
      } else if (editMode === 'address') {
        await updateProfileMutation.mutateAsync({
          country: tempInfo.country,
          state: tempInfo.state,
          city: tempInfo.city,
          pincode: tempInfo.pincode,
        });
      }
      setUserInfo(tempInfo);
      setSaveSuccess('Profile updated successfully');
      setEditMode(null);
    } catch (err: any) {
      setSaveError(err?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccountMutation.mutateAsync();
      setIsDeleteModalOpen(false);
      setSaveSuccess('Account deleted successfully');
      navigate('/login');
    } catch (err: any) {
      setIsDeleteModalOpen(false);
      setSaveError(err?.message || 'Failed to delete account');
    }
  };


  const handleClose = () => {
    setEditMode(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'phone') {
      finalValue = formatPhoneNumber(value);
    }

    setTempInfo(prev => prev ? ({ ...prev, [name]: finalValue }) : null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };



  return (
    <UserAccountSettingsLayout activeTab="Profile">
      {saveSuccess && (
        <div className="mx-4 md:mx-8 mb-4 bg-green-50 border border-green-200 rounded-md p-3 text-sm text-green-700 flex items-center justify-between">
          <span>{saveSuccess}</span>
          <button onClick={() => setSaveSuccess(null)} className="text-green-700 hover:text-green-900 text-xs font-bold">×</button>
        </div>
      )}
      {/* User Profile Overview */}
      <div className="flex flex-col md:flex-row px-4 md:px-8 items-center gap-4 md:gap-6 mb-6 md:mb-10">
        <div className="relative group">
          <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-[#7CD947] to-[#5BB030] flex items-center justify-center overflow-hidden transition-all duration-500">
            {(userInfo as any).profilePhotoUrl ? (
              <img src={(userInfo as any).profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-2xl md:text-3xl lg:text-4xl">
                {userInfo.firstName[0]?.toUpperCase()}{userInfo.lastName[0]?.toUpperCase()}
              </span>
            )}
          </div>
          {/* Camera/upload overlay */}
          <label className="absolute bottom-0 right-0 bg-[#3A6D6C] hover:bg-[#2c5251] text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-md transition-colors" title="Change photo">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (!file.type.startsWith('image/')) {
                  toast.error('Please select an image file');
                  return;
                }
                if (file.size > 5 * 1024 * 1024) {
                  toast.error(`Profile photo must be under 5 MB. Selected: ${(file.size / 1024 / 1024).toFixed(1)} MB`);
                  return;
                }
                try {
                  // Step 1: upload image → get URL
                  const fd = new FormData();
                  fd.append('file', file);
                  const uploadRes = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/upload/image`, {
                    method: 'POST',
                    credentials: 'include',
                    body: fd,
                  });
                  if (!uploadRes.ok) {
                    const err = await uploadRes.json().catch(() => ({}));
                    throw new Error(err.message || 'Image upload failed');
                  }
                  const uploadData = await uploadRes.json();
                  const url = uploadData.url;
                  // Step 2: PATCH /auth/profile with new URL
                  await updateProfileMutation.mutateAsync({ profilePhotoUrl: url } as any);
                  setUserInfo({ ...(userInfo as any), profilePhotoUrl: url });
                  setSaveSuccess('Profile photo updated');
                } catch (err: any) {
                  setSaveError(err?.message || 'Failed to upload profile photo');
                }
              }}
            />
          </label>
        </div>

        <div className="space-y-0.5 md:space-y-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#1A1A1A]">{userInfo.firstName} {userInfo.lastName}</h2>
          <p className="text-sm md:text-base lg:text-lg text-[#6B7280] font-medium">{formatRole(userInfo.role)}</p>
          <p className="text-sm md:text-base lg:text-lg text-[#6B7280] font-medium break-all">{userInfo.email}</p>
        </div>
      </div>


      {/* Divider */}
      <div className="border-t border-[#E5E7EB] mb-8"></div>

      {/* Personal Information Section */}
      <section className="px-4 md:px-8 lg:px-20">
        <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-[#E5E7EB] mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-[#1A1A1A]">Personal Information</h2>
          <PrimaryActionButton
            text="Edit"
            onClick={() => handleEditClick('personal')}
            className="bg-[#84CC16] hover:bg-[#6BC53B] !rounded-lg font-semibold text-sm md:text-base !px-3 md:!px-6 py-2 md:py-2.5 shadow-sm border-[1.84px] border-white"
          />
        </div>

        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-8">
            <div className="space-y-2.5">
              <label className="block text-[13px] font-semibold text-[#1A1A1A]">
                First Name
              </label>
              <input
                type="text"
                value={userInfo.firstName}
                disabled
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium"
              />
            </div>
            <div className="space-y-2.5">
              <label className="block text-[13px] font-bold text-[#1A1A1A]">
                Last Name
              </label>
              <input
                type="text"
                value={userInfo.lastName}
                disabled
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium"
              />
            </div>
            <div className="space-y-2.5">
              <label className="block text-[13px] font-bold text-[#1A1A1A]">
                Date of Birth
              </label>
              <input
                type="text"
                value={(() => { const d = parseDob(userInfo.dob); return d ? format(d, 'MMM dd, yyyy') : ''; })()}
                disabled
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium"
              />
            </div>
            <div className="space-y-2.5">
              <label className="block text-[13px] font-bold text-[#1A1A1A]">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={userInfo.email}
                  disabled
                  className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#84CC16] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
              </div>
            </div>
            <div className="space-y-2.5">
              <label className="block text-[13px] font-bold text-[#1A1A1A]">
                Phone Number
              </label>
              <input
                type="tel"
                value={userInfo.phone ? `${extractDialCode(userInfo.phoneCountryCode) || ''} ${userInfo.phone}`.trim() : ''}
                disabled
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium"
              />
            </div>
            <div className="space-y-2.5">
              <label className="block text-[13px] font-bold text-[#1A1A1A]">
                User Role
              </label>
              <input
                type="text"
                value={formatRole(userInfo.role)}
                disabled
                className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium"
              />
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] my-6 md:my-8"></div>

          {/* Email Verification Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 gap-3 sm:gap-0">
            <div className="space-y-1">
              <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                <span className="text-base md:text-lg font-semibold text-[#1A1A1A]">Email Address</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 md:px-3 py-1 rounded-full bg-[#84CC16] text-white text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
                  Verified
                  <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-[#84CC16]" strokeWidth={4} />
                  </div>
                </span>
              </div>
              <p className="text-xs md:text-[13px] text-[#6B7280] font-medium break-all">
                Your Email id is {userInfo.email}
              </p>
            </div>
          </div>

          <div className="border-t border-[#E5E7EB] my-6 md:my-8"></div>

          {/* Password Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-2 gap-3 sm:gap-0">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-base md:text-lg font-semibold text-[#1A1A1A]">Password</span>
              </div>
              <p className="text-xs md:text-[13px] text-[#6B7280] font-medium">You haven&apos;t changed the password yet.</p>
            </div>
            <button
              onClick={() => handleEditClick('password')}
              className="text-sm font-bold text-[#617C6C] hover:text-[#4A6354] transition-colors w-full sm:w-auto text-left sm:text-right"
            >
              Change
            </button>
          </div>
          <div className="border-t border-[#E5E7EB] my-6 md:my-8"></div>
        </div>
      </section>

      {/* Address Section */}
      <section className="px-4 md:px-8 lg:px-20">
        <div className="flex items-center justify-between pb-3 md:pb-4 border-b border-[#E5E7EB] mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl lg:text-2xl font-medium text-[#1A1A1A]">Address</h2>
          <PrimaryActionButton
            text="Edit"
            onClick={() => handleEditClick('address')}
            className="bg-[#84CC16] hover:bg-[#6BC53B] !rounded-lg font-semibold text-sm md:text-base !px-3 md:!px-6 py-2 md:py-2.5 shadow-sm border-[1.84px] border-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-6 md:gap-y-8">
          <div className="space-y-2.5">
            <label className="block text-[13px] font-bold text-[#1A1A1A]">Country</label>
            <input
              type="text"
              value={getCountryDisplayName(userInfo.country)}
              disabled
              className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium"
            />
          </div>
          <div className="space-y-2.5">
            <label className="block text-[13px] font-bold text-[#1A1A1A]">State</label>
            <input
              type="text"
              value={getStateDisplayName(userInfo.country, userInfo.state)}
              disabled
              className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium"
            />
          </div>
          <div className="space-y-2.5">
            <label className="block text-[13px] font-bold text-[#1A1A1A]">City</label>
            <input
              type="text"
              value={userInfo.city}
              disabled
              className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium"
            />
          </div>
          <div className="space-y-2.5">
            <label className="block text-[13px] font-bold text-[#1A1A1A]">Pincode</label>
            <input
              type="text"
              value={userInfo.pincode}
              disabled
              className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-[10px] text-sm text-[#ADADAD] font-medium"
            />
          </div>
        </div>
      </section>

      {/* Delete Account Section */}
      <section className="px-4 md:px-8 lg:px-20">
        <h2 className="text-base md:text-lg font-semibold text-black mb-2">Delete Account</h2>
        <p className="text-xs md:text-sm text-red-600 mb-4">
          Please note that all of the information will be permanently deleted.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-4 md:px-6 py-2 bg-[#FF4F5B] text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-[0px_3.68px_3.68px_0px_#00000040] w-full sm:w-auto"
        >
          Delete Account
        </button>

      </section>

      {/* Edit Modal */}
      <BaseModal
        isOpen={!!editMode}
        onClose={handleClose}
        title={
          editMode === 'personal' ? 'Edit Personal Information' :
            editMode === 'address' ? 'Edit Address' :
              'Change Password'
        }
        footerButtons={[
          {
            label: 'Cancel',
            onClick: handleClose,
            variant: 'ghost' as const,
          },
          {
            label: 'Save Changes',
            onClick: handleSave,
            variant: 'primary' as const,
            icon: <Check size={16} strokeWidth={3} />,
            className: "border border-white shadow-md hover:shadow-lg !bg-[#7CD947]"
          }
        ]}
        maxWidth="max-w-lg"
        padding="px-6 py-6"
        titleSize="text-lg"
      >
        {saveError && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-md p-2 text-xs text-red-700">
            {saveError}
          </div>
        )}
        {(updateProfileMutation.isPending || changePasswordMutation.isPending) && (
          <div className="mb-3 bg-blue-50 border border-blue-200 rounded-md p-2 text-xs text-blue-700 flex items-center gap-2">
            <Loader2 className="w-3 h-3 animate-spin" /> Saving...
          </div>
        )}
        {editMode === 'personal' && tempInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                name="firstName"
                value={tempInfo.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={tempInfo.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Date of Birth</label>
              <DatePicker
                value={parseDob(tempInfo.dob)}
                onChange={(date) => setTempInfo(prev => prev ? { ...prev, dob: date ? format(date, 'yyyy-MM-dd') : '' } : null)}
                placeholder="Select date of birth"
                maxDate={new Date()}
                className="px-3 py-2 border border-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={tempInfo.email}
                disabled
                className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-md text-sm text-gray-500 cursor-not-allowed"
                title="Email cannot be changed"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <div className="flex gap-2">
                <div className="w-24 flex-shrink-0">
                  <CustomDropdown
                    value={tempInfo.phoneCountryCode || ''}
                    onChange={(value) => setTempInfo(prev => prev ? { ...prev, phoneCountryCode: value } : null)}
                    options={phoneCountryCodeOptions}
                    searchable
                    placeholder="Code"
                    buttonClassName="px-2 py-2"
                    dropdownClassName="w-48"
                  />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={tempInfo.phone}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="flex-1 min-w-0 px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
                />
              </div>
            </div>
          </div>
        )}

        {editMode === 'address' && tempInfo && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
              <CustomDropdown
                value={tempInfo.country}
                onChange={handleCountrySelect}
                options={countryOptions}
                searchable
                placeholder="Select country"
                buttonClassName="px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
              <CustomDropdown
                value={tempInfo.state || ''}
                onChange={handleStateSelect}
                options={stateOptions}
                searchable
                disabled={!tempInfo.country || stateOptions.length === 0}
                placeholder="Select state"
                buttonClassName="px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <CustomDropdown
                value={tempInfo.city}
                onChange={handleCitySelect}
                options={cityOptions}
                searchable
                disabled={!tempInfo.state || cityOptions.length === 0}
                placeholder="Select city"
                buttonClassName="px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={tempInfo.pincode}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
              />
            </div>
          </div>
        )}

        {editMode === 'password' && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={passwordVisibility.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947] pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {passwordVisibility.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={passwordVisibility.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947] pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {passwordVisibility.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <div className="relative">
                <input
                  type={passwordVisibility.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947] pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {passwordVisibility.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </BaseModal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        message="Are you sure you want to delete your account? All of your information will be permanently deleted. This action cannot be undone."
        confirmText="Delete Account"
      />
    </UserAccountSettingsLayout>

  );
};

export default Profile;
