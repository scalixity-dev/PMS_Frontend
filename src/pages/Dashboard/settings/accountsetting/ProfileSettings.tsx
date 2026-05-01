import { useEffect, useState, useRef } from "react";
import { User, X, Eye, EyeOff, Camera } from "lucide-react";
import Button from "../../../../components/common/Button";
import { authService } from "../../../../services/auth.service";
import { useUpdateProfile } from "../../../../hooks/useAuthQueries";
import { AccountSettingsLayout } from "../../../../components/common/AccountSettingsLayout";
import { API_ENDPOINTS } from "../../../../config/api.config";

interface ProfileUser {
  fullName: string;
  email: string;
  role: string;
  profilePhotoUrl?: string;
}

interface ProfileDetails {
  firstName: string;
  lastName: string;
  phoneNumber: string;
}

const isValidPhoneNumber = (raw: string): boolean => {
  const digits = (raw || "").replace(/\D/g, "");
  return !digits || (digits.length >= 4 && digits.length <= 15);
};

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  initialValues: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  onClose: () => void;
  onSave: (values: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }) => Promise<boolean> | boolean;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<void> | void;
}

function EditPersonalInfoModal(props: EditPersonalInfoModalProps) {
  const { isOpen, onClose, onSave, initialValues } = props;
  const firstInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [formValues, setFormValues] = useState({
    firstName: initialValues.firstName,
    lastName: initialValues.lastName,
    phoneNumber: initialValues.phoneNumber,
  });

  useEffect(() => {
    if (isOpen) {
      setFormValues({
        firstName: initialValues.firstName,
        lastName: initialValues.lastName,
        phoneNumber: initialValues.phoneNumber,
      });
      // Focus the first input when modal opens
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialValues, isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  const handleChange = (field: "firstName" | "lastName" | "phoneNumber", value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveClick = async () => {
    const didSave = await onSave(formValues);
    if (didSave) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-personal-info-title"
        onKeyDown={handleKeyDown}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#3D7475] p-6 flex items-center justify-between">
          <div className="bg-[#84CC16] text-white px-4 py-2 rounded-full flex items-center gap-2">
            <span id="edit-personal-info-title" className="text-sm font-semibold">Edit personal information</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label htmlFor="firstName" className="block text-xs font-bold text-gray-800 mb-2 ml-1">First name</label>
            <input
              id="firstName"
              ref={firstInputRef}
              type="text"
              value={formValues.firstName}
              onChange={(event) => handleChange("firstName", event.target.value)}
              className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all"
              placeholder="First name"
            />
          </div>

          <div>
            <label htmlFor="lastName" className="block text-xs font-bold text-gray-800 mb-2 ml-1">Last name</label>
            <input
              id="lastName"
              type="text"
              value={formValues.lastName}
              onChange={(event) => handleChange("lastName", event.target.value)}
              className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all"
              placeholder="Last name"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-xs font-bold text-gray-800 mb-2 ml-1">Phone number</label>
            <input
              id="phoneNumber"
              type="tel"
              value={formValues.phoneNumber}
              onChange={(event) => handleChange("phoneNumber", event.target.value)}
              className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all"
              placeholder="+91 0000000000"
            />
          </div>
        </div>

        <div className="p-6 pt-0 flex gap-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1 rounded-xl shadow-lg bg-[#4B5563] hover:bg-[#374151]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveClick}
            variant="primary"
            className="flex-1 rounded-xl shadow-lg hover:bg-[#2c5556]"
          >
            Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}

function ChangePasswordModal(props: ChangePasswordModalProps) {
  const { isOpen, onClose, onSave } = props;
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      // Focus the first input when modal opens
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
    }
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Tab") {
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  };

  const validatePassword = (): boolean => {
    if (!currentPassword) {
      setError("Current password is required");
      return false;
    }
    if (!newPassword) {
      setError("New password is required");
      return false;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return false;
    }
    if (newPassword === currentPassword) {
      setError("New password must be different from current password");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match");
      return false;
    }
    setError("");
    return true;
  };

  const [isSavingPwd, setIsSavingPwd] = useState(false);

  const handleSaveClick = async () => {
    if (!validatePassword()) return;
    try {
      setIsSavingPwd(true);
      await onSave(currentPassword, newPassword, confirmPassword);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update password');
    } finally {
      setIsSavingPwd(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-password-title"
        onKeyDown={handleKeyDown}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-in-from-right"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#3D7475] p-6 flex items-center justify-between">
          <div className="bg-[#84CC16] text-white px-4 py-2 rounded-full flex items-center gap-2">
            <span id="change-password-title" className="text-sm font-semibold">Change password</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
            aria-label="Close"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label htmlFor="currentPassword" className="block text-xs font-bold text-gray-800 mb-2 ml-1">Current password</label>
            <div className="relative">
              <input
                id="currentPassword"
                ref={firstInputRef}
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e.target.value);
                  setError("");
                }}
                className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all pr-12"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-xs font-bold text-gray-800 mb-2 ml-1">New password</label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all pr-12"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-800 mb-2 ml-1">Confirm new password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all pr-12"
                placeholder="Confirm new password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
        </div>

        <div className="p-6 pt-0 flex gap-4">
          <Button
            type="button"
            onClick={onClose}
            variant="secondary"
            className="flex-1 rounded-xl shadow-lg bg-[#4B5563] hover:bg-[#374151]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSaveClick}
            disabled={isSavingPwd}
            variant="primary"
            className="flex-1 rounded-xl shadow-lg hover:bg-[#2c5556] disabled:opacity-50"
          >
            {isSavingPwd ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSettings() {
  const [user, setUser] = useState<ProfileUser>({
    fullName: "",
    email: "",
    role: "",
  });

  const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const profileFileRef = useRef<HTMLInputElement>(null);

  const updateProfile = useUpdateProfile();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();

        const fullName = currentUser.fullName || "";
        // Improved name parsing: handle single names, empty strings, and preserve full name structure
        const trimmedName = fullName.trim();
        let firstNameFromUser = "";
        let lastNameFromUser = "";

        if (trimmedName.length > 0) {
          const nameParts = trimmedName.split(/\s+/).filter((part) => part.length > 0);
          if (nameParts.length === 1) {
            // Single name: use as first name, leave last name empty
            firstNameFromUser = nameParts[0];
          } else if (nameParts.length > 1) {
            // Multiple parts: first part is first name, rest is last name
            firstNameFromUser = nameParts[0];
            lastNameFromUser = nameParts.slice(1).join(" ");
          }
        }

        setUser({
          fullName,
          email: currentUser.email || "",
          role: currentUser.role || "",
          profilePhotoUrl: (currentUser as any).profilePhotoUrl || "",
        });

        setProfileDetails((previous) => ({
          ...previous,
          firstName: firstNameFromUser,
          lastName: lastNameFromUser,
          phoneNumber: currentUser.phoneNumber || previous.phoneNumber,
        }));
      } catch (error) {
        // Log error for debugging while keeping defaults
        console.error("Failed to fetch user profile:", error);
        // Optionally, you could show a user-friendly error message here
      }
    };

    fetchUser();
  }, []);

  const handleSavePersonalInfo = async (values: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  }): Promise<boolean> => {
    if (!isValidPhoneNumber(values.phoneNumber)) {
      alert("Phone number must be between 4 and 15 digits.");
      return false;
    }

    setProfileDetails((previous) => ({
      ...previous,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
    }));

    const fullName = `${values.firstName} ${values.lastName}`.trim();
    setUser((previous) => ({
      ...previous,
      fullName: fullName,
    }));

    try {
      await updateProfile.mutateAsync({
        fullName: fullName,
        phoneNumber: values.phoneNumber,
      });
      return true;
    } catch (err: any) {
      alert(err?.message || "Failed to update personal information");
      return false;
    }
  };

  const handleSavePassword = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    try {
      await authService.changePassword(currentPassword, newPassword);
      alert('Password updated successfully');
    } catch (err: any) {
      alert(err?.message || 'Failed to update password');
      throw err;
    }
  };

  const handleProfilePhotoUpload = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Profile photo must be 5 MB or smaller.");
      return;
    }

    try {
      setIsUploadingPhoto(true);
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch(API_ENDPOINTS.UPLOAD.IMAGE, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const uploadJson = await uploadRes.json().catch(() => ({}));
      const url = uploadJson?.data?.url || uploadJson?.url;
      if (!uploadRes.ok || !url) {
        throw new Error(uploadJson?.message || "Failed to upload profile photo");
      }
      await updateProfile.mutateAsync({ profilePhotoUrl: url } as any);
      setUser((previous) => ({ ...previous, profilePhotoUrl: url }));
    } catch (err: any) {
      alert(err?.message || "Failed to upload profile photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  return (
    <AccountSettingsLayout activeTab="profile">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-[#F4F4F4] border border-[#E4E4E4] flex items-center justify-center text-gray-600 overflow-hidden">
              {user.profilePhotoUrl ? (
                <img src={user.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} />
              )}
            </div>
            <input
              ref={profileFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                void handleProfilePhotoUpload(file);
                e.currentTarget.value = "";
              }}
            />
            <button
              type="button"
              onClick={() => profileFileRef.current?.click()}
              disabled={isUploadingPhoto}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#6BC53B] text-white flex items-center justify-center shadow-sm hover:bg-[#5ab030] disabled:opacity-60"
              title="Upload profile photo"
            >
              <Camera size={13} />
            </button>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            {isUploadingPhoto && <p className="text-xs text-gray-500 mt-1">Uploading photo...</p>}
          </div>
        </div>
        <Button
          type="button"
          onClick={() => setIsPersonalModalOpen(true)}
          className="self-start rounded-full !bg-[#6BC53B] text-white shadow-[0_8px_16px_rgba(124,217,71,0.45)] border-none hover:!bg-[#5ab030]"
        >
          Edit
        </Button>
      </div>

      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">First Name</label>
            <input
              disabled
              value={profileDetails.firstName}
              className="w-full h-10 rounded-md border border-[#E4E4E4] bg-[#F7F7F7] px-3 text-sm text-gray-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Last Name</label>
            <input
              disabled
              value={profileDetails.lastName}
              className="w-full h-10 rounded-md border border-[#E4E4E4] bg-[#F7F7F7] px-3 text-sm text-gray-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Email Address</label>
            <input
              disabled
              value={user.email}
              className="w-full h-10 rounded-md border border-[#E4E4E4] bg-[#F7F7F7] px-3 text-sm text-gray-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Phone Number</label>
            <input
              disabled
              value={profileDetails.phoneNumber}
              className="w-full h-10 rounded-md border border-[#E4E4E4] bg-[#F7F7F7] px-3 text-sm text-gray-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">User Role</label>
            <input
              disabled
              value={user.role}
              className="w-full h-10 rounded-md border border-[#7CD947]/30 bg-[#F7F7F7] px-3 text-sm text-gray-800 outline-none focus:ring-0"
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              Email Address
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0FAE8] text-[10px] font-semibold text-[#7CD947] border border-[#D7F0C2]">
                <span className="w-3 h-3 rounded-full bg-[#7CD947]" />
                Verified
              </span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Your email is <span className="font-medium text-gray-700">{user.email}</span>
            </p>
          </div>
        </div>

        <div className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Password</p>
            <p className="text-xs text-gray-500 mt-1">You haven&apos;t changed the password yet.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="text-sm font-semibold text-[#1E88E5] hover:underline"
          >
            Change
          </button>
        </div>
      </section>

      <section className="border border-[#F0B7BF] rounded-2xl bg-[#FFF5F6] px-6 py-5 space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Delete Account</h2>
        <p className="text-xs text-[#E53935]">Please note that all of the information will be permanently deleted.</p>
        <Button
          type="button"
          variant="destructive"
          className="rounded-full shadow-[0_8px_16px_rgba(244,67,54,0.45)]"
        >
          Delete Account
        </Button>
      </section>

      <EditPersonalInfoModal
        isOpen={isPersonalModalOpen}
        onClose={() => setIsPersonalModalOpen(false)}
        initialValues={{
          firstName: profileDetails.firstName,
          lastName: profileDetails.lastName,
          phoneNumber: profileDetails.phoneNumber,
        }}
        onSave={handleSavePersonalInfo}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handleSavePassword}
      />
    </AccountSettingsLayout>
  );
}
