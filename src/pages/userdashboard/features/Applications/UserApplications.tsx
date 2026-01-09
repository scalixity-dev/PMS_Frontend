import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Trash2 } from "lucide-react";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import DeleteConfirmationModal from "../../../../components/common/modals/DeleteConfirmationModal";

interface ApplicationItem {
  id: number | string;
  name: string;
  phone: string;
  status: "Approved" | "Rejected" | "Submitted" | "Draft";
  appliedDate: string;
  address: string;
  propertyId?: string;
}

interface InvitationItem {
  id: string;
  inviterName: string;
  propertyName: string;
  propertyAddress: string;
  propertyId: string;
  initials: string;
}

// Helper function to generate avatar seed from name
const getAvatarSeed = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [showInvitationsSection, setShowInvitationsSection] = useState(false);
  const [invitations, setInvitations] = useState<InvitationItem[]>([
    {
      id: 'inv_1',
      inviterName: 'Ashendra Sharma',
      propertyName: 'Sagar Sadhan Hotel Rd',
      propertyAddress: 'Thoothukudi, TN 462026, IN',
      propertyId: 'prop_mock_123',
      initials: 'AS'
    },
    {
      id: 'inv_2',
      inviterName: 'Ravi Kumar',
      propertyName: 'Cloud 9 Apartments',
      propertyAddress: 'Hitech City, Hyderabad, TS 500081, IN',
      propertyId: 'prop_mock_456',
      initials: 'RK'
    },
    {
      id: 'inv_3',
      inviterName: 'Siddharth Jain',
      propertyName: 'Oasis Residency',
      propertyAddress: 'Indiranagar, Bangalore, KA 560038, IN',
      propertyId: 'prop_mock_789',
      initials: 'SJ'
    },
    {
      id: 'inv_4',
      inviterName: 'Meera Reddy',
      propertyName: 'Sunrise Villas',
      propertyAddress: 'Whitefield, Bangalore, KA 560066, IN',
      propertyId: 'prop_mock_012',
      initials: 'MR'
    }
  ]);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'invitation' | 'application';
    targetId?: number | string;
  }>({ isOpen: false, type: 'invitation' });
  const [errorToast, setErrorToast] = useState<string | null>(null);

  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    const staticApps: ApplicationItem[] = [
      {
        id: 1,
        name: "Siddak Bagga",
        phone: "+91 88395 86908",
        status: "Approved",
        appliedDate: "2025-12-14",
        address: "Gandhi Path Rd, Jaipur, RJ 302020, IN",
      },
    ];
    const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
    return [...localApps, ...staticApps];
  });

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-full mx-auto p-8 space-y-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-base font-medium">
            <li>
              <Link
                to="/userdashboard"
                className="text-[var(--dashboard-accent)] font-medium hover:opacity-80 transition-opacity"
              >
                Dashboard
              </Link>
            </li>
            <li aria-hidden="true" className="text-[#1A1A1A] font-semibold">
              /
            </li>
            <li className="text-[#1A1A1A] font-medium" aria-current="page">
              Application
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-10">
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">Application</h1>
            <span className="text-[#A1A1AA] text-lg font-medium">Total {applications.length}</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell - Toggles Invitation Cards */}
            <button
              onClick={() => setShowInvitationsSection(!showInvitationsSection)}
              className="relative"
            >
              <div className="w-10 h-10 bg-[#7ED957] rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity shadow-sm">
                <Bell size={22} fill="white" strokeWidth={1.5} />
              </div>
              {invitations.length > 0 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF3B30] border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white">
                  {invitations.length}
                </div>
              )}
            </button>

            {/* Find a Place Button */}
            <PrimaryActionButton
              text="Find a Place"
              className="bg-[#7ED957] hover:bg-[#6BC847] px-6! py-2.5!"
              to="/userdashboard/properties"
            />
          </div>
        </div>

        {/* Invitations Section */}
        {showInvitationsSection && invitations.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-[#1A1A1A]">Invitations ({invitations.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {invitations.map((inv) => (
                <div key={inv.id} className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex items-center justify-between shadow-[0px_4px_4px_0px_#00000040]">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#52D3A2] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {inv.initials}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-semibold text-[#1A1A1A] text-sm">{inv.inviterName}</h3>
                      <p className="text-sm text-[#71717A] leading-tight mt-0.5">
                        invited you to apply for {inv.propertyName}, {inv.propertyAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 pr-2">
                    <button
                      onClick={() => setDeleteModalState({ isOpen: true, type: 'invitation', targetId: inv.id })}
                      className="text-[#64748B] text-sm font-medium hover:text-[#1A1A1A] transition-colors"
                    >
                      Ignore
                    </button>
                    <button
                      onClick={() => navigate("/userdashboard/new-application", {
                        state: { propertyId: inv.propertyId }
                      })}
                      className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
                    >
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {showInvitationsSection && invitations.length === 0 && (
          <div className="bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB] p-8 text-center text-[#71717A]">
            No new invitations at the moment.
          </div>
        )}

        <DeleteConfirmationModal
          isOpen={deleteModalState.isOpen}
          onClose={() => setDeleteModalState({ ...deleteModalState, isOpen: false })}
          onConfirm={() => {
            try {
              if (deleteModalState.type === 'invitation' && deleteModalState.targetId) {
                const invId = deleteModalState.targetId;
                setInvitations(prev => prev.filter(inv => inv.id !== invId));
              } else if (deleteModalState.type === 'application' && deleteModalState.targetId) {
                const appId = deleteModalState.targetId;
                setApplications(prev => prev.filter(app => app.id !== appId));

                // Update local storage with error handling
                const stored = localStorage.getItem('user_applications');
                const localApps = stored ? JSON.parse(stored) : [];
                const updatedLocalApps = localApps.filter((app: any) => app.id !== appId);
                localStorage.setItem('user_applications', JSON.stringify(updatedLocalApps));

                // If it's a draft, clear the full data too
                if (typeof appId === 'string' && appId.startsWith('draft_')) {
                  localStorage.removeItem(`application_draft_data_${appId}`);
                }
              }
            } catch (error) {
              console.error('Failed to update local storage:', error);
              setErrorToast('Failed to save changes. Your browser storage might be full or restricted.');
              // Auto-dismiss after 5 seconds
              setTimeout(() => setErrorToast(null), 5000);
            } finally {
              setDeleteModalState(prev => ({ ...prev, isOpen: false }));
            }
          }}
          title={deleteModalState.type === 'invitation' ? "Ignore Invitation" : "Delete Application"}
          message={deleteModalState.type === 'invitation'
            ? "Are you sure you want to ignore this invitation? This action cannot be undone."
            : "Are you sure you want to delete this application? This action cannot be undone."}
          confirmText={deleteModalState.type === 'invitation' ? "Ignore" : "Delete"}
        />

        <div className="border-t border-[#E5E7EB]"></div>

        {/* Application List */}
        <div className="flex flex-wrap gap-6 ">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-[#F7F7F7] rounded-2xl border border-[#F3F4F6] shadow-[0px_4px_4px_0px_#00000040] min-w-[300px] max-w-[350px] flex flex-col relative"
            >
              {/* Status Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${app.status === "Approved"
                    ? "bg-[#E8F5E9] text-[#2E7D32]"
                    : app.status === "Submitted"
                      ? "bg-[#FFF3E0] text-[#F57C00]"
                      : app.status === "Draft"
                        ? "bg-[#F3F4F6] text-[#71717A]"
                        : "bg-[#FFEBEE] text-[#C62828]"
                    }`}
                >
                  {app.status}
                </span>
              </div>

              {/* Delete Draft Button */}
              {app.status === "Draft" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteModalState({ isOpen: true, type: 'application', targetId: app.id });
                  }}
                  className="absolute top-4 right-4 z-10 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              )}

              {/* Main Content */}
              <div className="flex flex-col items-center pt-12  px-6">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-[#E0F2FE] mb-3 overflow-hidden">
                  <img
                    src={`https://api.dicebear.com/7.x/personas/svg?seed=${getAvatarSeed(app.name)}`}
                    alt={app.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-1">
                  {app.name}
                </h3>

                {/* Applied Date */}
                <p className="text-sm text-[#71717A] mb-4">
                  Applied on {formatDate(app.appliedDate)}
                </p>

                {/* Address */}
                <div className="w-full bg-[#E3F2FD] rounded-lg px-3 py-2 mb-4">
                  <p className="text-xs text-[#1565C0] font-medium text-center">
                    {app.address}
                  </p>
                </div>
              </div>

              {/* Separator */}
              <div className="border-t border-[#E5E7EB]"></div>

              {/* View Application Link */}
              <div className="py-4 flex justify-center">
                <button
                  onClick={() => navigate(app.status === "Draft" ? "/userdashboard/new-application" : `/userdashboard/applications/${app.id}`, {
                    state: app.status === "Draft" && app.propertyId ? { propertyId: app.propertyId } : undefined
                  })}
                  className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                  {app.status === "Draft" ? "Continue application" : "View application"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Toast */}
      {errorToast && (
        <div className="fixed bottom-8 right-8 bg-[#EF4444] text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md flex items-center gap-4 animate-in slide-in-from-right duration-300 border border-white/20 backdrop-blur-sm">
          <div className="flex-1">
            <p className="text-sm font-semibold">Error</p>
            <p className="text-xs opacity-90">{errorToast}</p>
          </div>
          <button
            onClick={() => setErrorToast(null)}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <Trash2 size={16} className="rotate-45" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Applications;



