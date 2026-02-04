import React, { useState, useEffect } from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import BaseModal from "../../../../components/common/modals/BaseModal";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";


import { useAuthStore } from "./store/authStore";
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';
import type { UserInfo } from "../../utils/types";



const Profile: React.FC = () => {
  const { userInfo, setUserInfo } = useAuthStore();

  // Modal State
  const [editMode, setEditMode] = useState<'personal' | 'address' | 'email' | 'password' | null>(null);
  const [tempInfo, setTempInfo] = useState<UserInfo | null>(userInfo);

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



  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleEditClick = (mode: 'personal' | 'address' | 'email' | 'password') => {
    setTempInfo(userInfo);
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

  const handleSave = () => {
    if (editMode === 'password') {
      // Mock password save validation could go here
      console.log("Password changed", passwordData);
      setEditMode(null);
      return;
    }
    if (tempInfo) {
      setUserInfo(tempInfo);
    }
    setEditMode(null);
  };

  const handleDeleteAccount = () => {
    // Implement delete account logic here
    console.log("Account deleted");
    setIsDeleteModalOpen(false);
  };


  const handleClose = () => {
    setEditMode(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempInfo(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };



  return (
    <UserAccountSettingsLayout activeTab="Profile">
      {/* User Profile Overview */}
      <div className="flex flex-col md:flex-row px-4 md:px-8 items-center gap-4 md:gap-6 mb-6 md:mb-10">
        <div className="relative">
          <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full bg-gradient-to-br from-[#7CD947] to-[#5BB030] flex items-center justify-center overflow-hidden transition-all duration-500">
            <span className="text-white font-bold text-2xl md:text-3xl lg:text-4xl">
              {userInfo.firstName[0]?.toUpperCase()}{userInfo.lastName[0]?.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-0.5 md:space-y-1 text-center md:text-left">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-medium text-[#1A1A1A]">{userInfo.firstName} {userInfo.lastName}</h2>
          <p className="text-sm md:text-base lg:text-lg text-[#6B7280] font-medium">{userInfo.role}</p>
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
                value={userInfo.dob}
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
                value={userInfo.phone}
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
                value={userInfo.role}
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
            <button
              onClick={() => handleEditClick('email')}
              className="text-sm font-bold text-[#617C6C] hover:text-[#4A6354] transition-colors w-full sm:w-auto text-left sm:text-right"
            >
              Change
            </button>
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
              value={userInfo.country}
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
              editMode === 'email' ? 'Change Email Address' :
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
              <input
                type="text"
                name="dob"
                value={tempInfo.dob}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
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
                title="Email cannot be changed here, please use Change Email button"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={tempInfo.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
              />
            </div>
          </div>
        )}

        {editMode === 'address' && tempInfo && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={tempInfo.country}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
              <input
                type="text"
                name="city"
                value={tempInfo.city}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
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

        {editMode === 'email' && tempInfo && (
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">New Email Address</label>
              <input
                type="email"
                name="email"
                value={tempInfo.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
                placeholder="Enter new email address"
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
