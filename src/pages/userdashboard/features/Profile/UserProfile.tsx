import React, { useState, useEffect } from "react";
import { Check, Eye, EyeOff, Camera } from "lucide-react";
import BaseModal from "../../../../components/common/modals/BaseModal";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import profilePic from "../../../../assets/images/generated_profile_avatar.png";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";

import { useAuthStore } from "./store/authStore";
import DeleteConfirmationModal from '../../../../components/common/modals/DeleteConfirmationModal';



const Profile: React.FC = () => {
  const { userInfo, setUserInfo } = useAuthStore();

  useEffect(() => {
    if (!userInfo.email) {
      setUserInfo({
        firstName: "Rishabh",
        lastName: "Awasthi",
        dob: "20/02/1990",
        email: "rishabh@gmail.com",
        phone: "+91 9999999999",
        role: "Tenant",
        country: "India",
        city: "Mumbai",
        pincode: "400001",
      });
    }
  }, [userInfo.email, setUserInfo]);

  // Modal State
  const [editMode, setEditMode] = useState<'personal' | 'address' | 'email' | 'password' | null>(null);
  const [tempInfo, setTempInfo] = useState(userInfo);
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

  const handleSave = () => {
    if (editMode === 'password') {
      // Mock password save validation could go here
      console.log("Password changed", passwordData);
      setEditMode(null);
      return;
    }
    setUserInfo(tempInfo);
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
    setTempInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const [profileImage, setProfileImage] = useState(userInfo.profileImage || profilePic);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageResult = reader.result as string;
        setProfileImage(imageResult);
        setUserInfo({ profileImage: imageResult });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <UserAccountSettingsLayout activeTab="Profile">
      {/* User Profile Overview */}
      <div className="flex px-8 items-center gap-6 mb-10">
        <div className="relative group">
          <div className="w-44 h-44 rounded-full bg-gradient-to-br from-orange-200 via-pink-200 to-orange-300 flex items-center justify-center overflow-hidden transition-all duration-500 relative">
            <div className="w-full h-full flex items-center justify-center relative bg-[#F4D1AE]">
              <img
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = `
                  <svg width="100%" height="100%" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" class="absolute">
                    <circle cx="35" cy="28" r="12" fill="#F4D1AE" />
                    <path d="M35 16C28 16 23 20 23 26C23 28 24 30 25 31C25 25 28 20 35 20C42 20 45 25 45 31C46 30 47 28 47 26C47 20 42 16 35 16Z" fill="#2D3748" />
                    <path d="M30 32Q35 36 40 32" stroke="#4A5568" stroke-width="2" stroke-linecap="round" fill="none" />
                    <circle cx="31" cy="26" r="1.5" fill="#4A5568" />
                    <circle cx="39" cy="26" r="1.5" fill="#4A5568" />
                    <path d="M25 35C25 40 30 45 35 45C40 45 45 40 45 35L45 50C45 55 40 60 35 60C30 60 25 55 25 50Z" fill="#87CEEB" />
                  </svg>
                `;
                }}
              />
            </div>
          </div>

          <button
            onClick={handleCameraClick}
            className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md border border-gray-200 text-gray-600 hover:text-[#7CD947] transition-colors z-10"
          >
            <Camera size={20} />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div className="space-y-1">
          <h2 className="text-3xl font-medium text-[#1A1A1A]">{userInfo.firstName} {userInfo.lastName}</h2>
          <p className="text-lg text-[#6B7280] font-medium">{userInfo.role}</p>
          <p className="text-lg text-[#6B7280] font-medium">{userInfo.email}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-[#E5E7EB] mb-8"></div>

      {/* Personal Information Section */}
      <section className="px-20">
        <div className="flex items-center justify-between pb-4  border-b border-[#E5E7EB] mb-8">
          <h2 className="text-2xl font-medium text-[#1A1A1A]">Personal Information</h2>
          <PrimaryActionButton
            text="Edit"
            onClick={() => handleEditClick('personal')}
            className="bg-[#84CC16] hover:bg-[#6BC53B] !rounded-lg font-semibold text-base !px-6 py-2.5 shadow-sm border-[1.84px] border-white"
          />
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
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

          <div className="border-t border-[#E5E7EB] my-8"></div>

          {/* Email Verification Row */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-[#1A1A1A]">Email Address</span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#84CC16] text-white text-[11px] font-bold uppercase tracking-wider">
                  Verified
                  <div className="w-3.5 h-3.5 bg-white rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-[#84CC16]" strokeWidth={4} />
                  </div>
                </span>
              </div>
              <p className="text-[13px] text-[#6B7280] font-medium">
                Your Email id is {userInfo.email}
              </p>
            </div>
            <button
              onClick={() => handleEditClick('email')}
              className="text-sm font-bold text-[#617C6C] hover:text-[#4A6354] transition-colors"
            >
              Change
            </button>
          </div>

          <div className="border-t border-[#E5E7EB] my-8"></div>

          {/* Password Row */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-lg font-semibold text-[#1A1A1A]">Password</span>
              </div>
              <p className="text-[13px] text-[#6B7280] font-medium">You haven&apos;t changed the password yet.</p>
            </div>
            <button
              onClick={() => handleEditClick('password')}
              className="text-sm font-bold text-[#617C6C] hover:text-[#4A6354] transition-colors"
            >
              Change
            </button>
          </div>
          <div className="border-t border-[#E5E7EB] my-8"></div>
        </div>
      </section>

      {/* Address Section */}
      <section className="px-20">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB] mb-8">
          <h2 className="text-2xl font-medium text-[#1A1A1A]">Address</h2>
          <PrimaryActionButton
            text="Edit"
            onClick={() => handleEditClick('address')}
            className="bg-[#84CC16] hover:bg-[#6BC53B] !rounded-lg font-semibold text-base !px-6 py-2.5 shadow-sm border-[1.84px] border-white"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
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
      <section className="px-20">
        <h2 className="text-lg font-semibold text-black mb-2">Delete Account</h2>
        <p className="text-sm text-red-600 mb-4">
          Please note that all of the information will be permanently deleted.
        </p>
        <button
          onClick={() => setIsDeleteModalOpen(true)}
          className="px-6 py-2 bg-[#FF4F5B] text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-[0px_3.68px_3.68px_0px_#00000040]"
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
        {editMode === 'personal' && (
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

        {editMode === 'address' && (
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

        {editMode === 'email' && (
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
