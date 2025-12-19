import { useEffect, useState } from "react";
import { User, X } from "lucide-react";
import Button from "../../../../components/common/Button";
import { authService } from "../../../../services/auth.service";
import { AccountSettingsLayout } from "../../../../components/common/AccountSettingsLayout";

interface ProfileUser {
  fullName: string;
  email: string;
  role: string;
}

interface ProfileDetails {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  country: string;
  city: string;
  postalCode: string;
}

interface EditPersonalInfoModalProps {
  isOpen: boolean;
  initialValues: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
  };
  onClose: () => void;
  onSave: (values: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
  }) => void;
}

interface EditAddressModalProps {
  isOpen: boolean;
  initialValues: {
    country: string;
    city: string;
    postalCode: string;
  };
  onClose: () => void;
  onSave: (values: { country: string; city: string; postalCode: string }) => void;
}

function EditPersonalInfoModal(props: EditPersonalInfoModalProps) {
  const { isOpen, onClose, onSave, initialValues } = props;

  const [formValues, setFormValues] = useState({
    firstName: initialValues.firstName,
    lastName: initialValues.lastName,
    dateOfBirth: initialValues.dateOfBirth,
    phoneNumber: initialValues.phoneNumber,
  });

  useEffect(() => {
    if (isOpen) {
      setFormValues({
        firstName: initialValues.firstName,
        lastName: initialValues.lastName,
        dateOfBirth: initialValues.dateOfBirth,
        phoneNumber: initialValues.phoneNumber,
      });
    }
  }, [initialValues, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: "firstName" | "lastName" | "dateOfBirth" | "phoneNumber", value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveClick = () => {
    onSave(formValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-in-from-right">
        <div className="bg-[#3D7475] p-6 flex items-center justify-between">
          <div className="bg-[#84CC16] text-white px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-sm font-semibold">Edit personal information</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">First name</label>
            <input
              type="text"
              value={formValues.firstName}
              onChange={(event) => handleChange("firstName", event.target.value)}
              className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all"
              placeholder="First name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">Last name</label>
            <input
              type="text"
              value={formValues.lastName}
              onChange={(event) => handleChange("lastName", event.target.value)}
              className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all"
              placeholder="Last name"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">Date of birth</label>
            <input
              type="text"
              value={formValues.dateOfBirth}
              onChange={(event) => handleChange("dateOfBirth", event.target.value)}
              className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all"
              placeholder="DD-MM-YYYY"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">Phone number</label>
            <input
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

function EditAddressModal(props: EditAddressModalProps) {
  const { isOpen, onClose, onSave, initialValues } = props;

  const [formValues, setFormValues] = useState({
    country: initialValues.country,
    city: initialValues.city,
    postalCode: initialValues.postalCode,
  });

  useEffect(() => {
    if (isOpen) {
      setFormValues({
        country: initialValues.country,
        city: initialValues.city,
        postalCode: initialValues.postalCode,
      });
    }
  }, [initialValues, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (field: "country" | "city" | "postalCode", value: string) => {
    setFormValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveClick = () => {
    onSave(formValues);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-slide-in-from-right">
        <div className="bg-[#3D7475] p-6 flex items-center justify-between">
          <div className="bg-[#84CC16] text-white px-4 py-2 rounded-full flex items-center gap-2">
            <span className="text-sm font-semibold">Edit address</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:bg-white/10 p-1 rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">Country</label>
            <input
              type="text"
              value={formValues.country}
              onChange={(event) => handleChange("country", event.target.value)}
              className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all"
              placeholder="Country"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">City</label>
            <input
              type="text"
              value={formValues.city}
              onChange={(event) => handleChange("city", event.target.value)}
              className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all"
              placeholder="City"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-800 mb-2 ml-1">Pincode</label>
            <input
              type="text"
              value={formValues.postalCode}
              onChange={(event) => handleChange("postalCode", event.target.value)}
              className="w-full bg-[#84CC16] text-white placeholder-white/70 px-6 py-3 rounded-full outline-none focus:ring-2 focus:ring-[#3D7475]/20 transition-all"
              placeholder="452001"
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

export default function ProfileSettings() {
  const [user, setUser] = useState<ProfileUser>({
    fullName: "",
    email: "",
    role: "",
  });

  const [profileDetails, setProfileDetails] = useState<ProfileDetails>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    country: "",
    city: "",
    postalCode: "",
  });

  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

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
        });

        setProfileDetails((previous) => ({
          ...previous,
          firstName: firstNameFromUser,
          lastName: lastNameFromUser,
          phoneNumber: currentUser.phoneNumber || previous.phoneNumber,
          country: currentUser.country || previous.country,
          // Note: currentUser.address is a full address string, not just city
          // Since CurrentUser interface doesn't have a city field, we keep the previous city value
          city: previous.city,
          postalCode: currentUser.pincode || previous.postalCode,
        }));
      } catch (error) {
        // Log error for debugging while keeping defaults
        console.error("Failed to fetch user profile:", error);
        // Optionally, you could show a user-friendly error message here
      }
    };

    fetchUser();
  }, []);

  const handleSavePersonalInfo = (values: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    phoneNumber: string;
  }) => {
    setProfileDetails((previous) => ({
      ...previous,
      firstName: values.firstName,
      lastName: values.lastName,
      dateOfBirth: values.dateOfBirth,
      phoneNumber: values.phoneNumber,
    }));

    setUser((previous) => ({
      ...previous,
      fullName: `${values.firstName} ${values.lastName}`.trim(),
    }));
  };

  const handleSaveAddress = (values: { country: string; city: string; postalCode: string }) => {
    setProfileDetails((previous) => ({
      ...previous,
      country: values.country,
      city: values.city,
      postalCode: values.postalCode,
    }));
  };

  return (
    <AccountSettingsLayout activeTab="profile">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-[#F4F4F4] border border-[#E4E4E4] flex items-center justify-center text-gray-600">
            <User size={40} />
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900">{user.fullName}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
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
            <label className="text-xs font-semibold text-gray-600">Date of Birth</label>
            <input
              disabled
              value={profileDetails.dateOfBirth}
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
          <button type="button" className="text-sm font-semibold text-[#1E88E5] hover:underline">
            Change
          </button>
        </div>

        <div className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Password</p>
            <p className="text-xs text-gray-500 mt-1">You haven&apos;t changed the password yet.</p>
          </div>
          <button type="button" className="text-sm font-semibold text-[#1E88E5] hover:underline">
            Change
          </button>
        </div>
      </section>

      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Address</h2>
          <Button
            type="button"
            onClick={() => setIsAddressModalOpen(true)}
            className="rounded-full !bg-[#6BC53B] text-white shadow-[0_6px_12px_rgba(124,217,71,0.4)] border-none px-6 py-1.5 h-auto text-sm hover:!bg-[#5ab030]"
          >
            Edit
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Country</label>
            <input
              disabled
              value={profileDetails.country}
              className="w-full h-10 rounded-md border border-[#E4E4E4] bg-[#F7F7F7] px-3 text-sm text-gray-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">City</label>
            <input
              disabled
              value={profileDetails.city}
              className="w-full h-10 rounded-md border border-[#E4E4E4] bg-[#F7F7F7] px-3 text-sm text-gray-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-600">Pincode</label>
            <input
              disabled
              value={profileDetails.postalCode}
              className="w-full h-10 rounded-md border border-[#E4E4E4] bg-[#F7F7F7] px-3 text-sm text-gray-800"
            />
          </div>
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
          dateOfBirth: profileDetails.dateOfBirth,
          phoneNumber: profileDetails.phoneNumber,
        }}
        onSave={handleSavePersonalInfo}
      />

      <EditAddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        initialValues={{
          country: profileDetails.country,
          city: profileDetails.city,
          postalCode: profileDetails.postalCode,
        }}
        onSave={handleSaveAddress}
      />
    </AccountSettingsLayout>
  );
}


