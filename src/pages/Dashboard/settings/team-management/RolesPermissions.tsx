import { useState, useCallback, memo } from "react";
import { TeamManagementSettingsLayout } from "../../../../components/common/TeamManagementSettingsLayout";
import { X } from "lucide-react";

// Constants
const INPUT_CLASS = "w-full px-4 py-3 border-b border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-500 transition-colors";

// Types
interface FormData {
    name: string;
    phoneNumber: string;
    emailAddress: string;
}

interface TeamMember {
    id: string;
    name: string;
    phoneNumber: string;
    emailAddress: string;
    role: string;
}

interface FormInputProps {
    type: "text" | "tel" | "email";
    name: keyof FormData;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// Mock Data - Single admin member
const mockTeamMembers: TeamMember[] = [
    {
        id: "1",
        name: "Shawn James",
        phoneNumber: "+1 569 349 495",
        emailAddress: "shawn.james@example.com",
        role: "Admin"
    }
];

// Reusable Components
const FormInput = ({ type, name, placeholder, value, onChange }: FormInputProps) => (
    <div>
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            className={INPUT_CLASS}
            aria-label={placeholder}
        />
    </div>
);

interface InviteModalProps {
    isOpen: boolean;
    formData: FormData;
    onClose: () => void;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInvite: () => void;
}

const InviteModal = memo(({ isOpen, formData, onClose, onInputChange, onInvite }: InviteModalProps) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/20 bg-opacity-50 z-50 flex items-center justify-center"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
                        Invite Member
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="px-6 py-6 space-y-5">
                    <FormInput
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={onInputChange}
                    />
                    <FormInput
                        type="tel"
                        name="phoneNumber"
                        placeholder="Phone Number"
                        value={formData.phoneNumber}
                        onChange={onInputChange}
                    />
                    <FormInput
                        type="email"
                        name="emailAddress"
                        placeholder="Email Address"
                        value={formData.emailAddress}
                        onChange={onInputChange}
                    />
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-5 flex justify-end">
                    <button
                        type="button"
                        onClick={onInvite}
                        className="px-6 py-2.5 rounded-lg text-white font-medium text-sm bg-[#5A8A7A] border border-white shadow-md hover:shadow-lg transition-shadow"
                    >
                        Invite
                    </button>
                </div>
            </div>
        </div>
    );
});

InviteModal.displayName = "InviteModal";

const UserAvatar = memo(() => (
    <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center shrink-0">
        <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
    </div>
));

UserAvatar.displayName = "UserAvatar";

// Main Component
export default function RolesPermissions() {
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: "",
        phoneNumber: "",
        emailAddress: "",
    });

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsInviteModalOpen(false);
    }, []);

    const handleOpenModal = useCallback(() => {
        setIsInviteModalOpen(true);
    }, []);

    const handleInvite = useCallback(() => {
        // Handle invite logic here
        console.log("Inviting member:", formData);
        setIsInviteModalOpen(false);
        setFormData({ name: "", phoneNumber: "", emailAddress: "" });
    }, [formData]);

    const handleSearchChange = useCallback((query: string) => {
        // Add search logic here to filter team members
        console.log("Searching for:", query);
    }, []);

    const headerActions = (
        <button
            type="button"
            onClick={handleOpenModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-white font-medium text-sm bg-[#7CD947] border border-white shadow-md hover:shadow-lg transition-shadow"
        >
            Invite Team member
        </button>
    );

    return (
        <>
            <InviteModal
                isOpen={isInviteModalOpen}
                formData={formData}
                onClose={handleCloseModal}
                onInputChange={handleInputChange}
                onInvite={handleInvite}
            />

            <TeamManagementSettingsLayout
                activeTab="roles-permissions"
                headerActions={headerActions}
                onSearchChange={handleSearchChange}
            >
                <div className="space-y-6">
                    {/* Admin Role Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockTeamMembers.map(member => (
                            <div key={member.id} className="relative">
                                {/* Role Label - positioned at top left */}
                                <div className="absolute -top-3 left-6 z-10 px-5 py-2.5 bg-[#D9D9D9] rounded-xl">
                                    <h3 className="text-sm font-semibold text-gray-900">{member.role}</h3>
                                </div>

                                {/* User Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 pt-12">
                                    <div className="flex items-center gap-4">
                                        <UserAvatar />
                                        {/* User Info */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-semibold text-gray-900 mb-1 truncate">{member.name}</h4>
                                            <p className="text-sm text-gray-600 truncate">{member.phoneNumber}</p>
                                            <p className="text-xs text-gray-500 truncate mt-1">{member.emailAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </TeamManagementSettingsLayout>
        </>
    );
}
