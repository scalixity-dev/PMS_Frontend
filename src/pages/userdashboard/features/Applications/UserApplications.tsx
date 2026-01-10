import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, Trash2, X } from "lucide-react";
import ApplicationSubmittedModal from "./components/ApplicationSubmittedModal";
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

// Helper function to format date - handles both YYYY-MM-DD and ISO strings
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

import { API_ENDPOINTS } from "../../../../config/api.config";

// Application Card Component with memoized avatar
interface ApplicationCardProps {
  app: ApplicationItem;
  onDelete: (id: number | string) => void;
  onNavigate: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({ app, onDelete, onNavigate }) => {
  // Memoize avatar URL to prevent unnecessary API calls
  const avatarUrl = useMemo(
    () => `https://api.dicebear.com/7.x/personas/svg?seed=${getAvatarSeed(app.name)}`,
    [app.name]
  );

  return (
    <div className="bg-[#F7F7F7] rounded-2xl border border-[#F3F4F6] shadow-[0px_4px_4px_0px_#00000040] w-full flex flex-col relative">
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

      {/* Delete Application Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(app.id);
        }}
        className="absolute top-4 right-4 z-10 p-1.5 bg-white rounded-full text-gray-400 hover:text-red-500 transition-all shadow-sm"
      >
        <Trash2 size={16} />
      </button>

      {/* Main Content */}
      <div className="flex flex-col items-center pt-12 px-6">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-[#E0F2FE] mb-3 overflow-hidden">
          <img
            src={avatarUrl}
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
          onClick={onNavigate}
          className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
        >
          {app.status === "Draft" ? "Continue application" : "View application"}
        </button>
      </div>
    </div>
  );
};

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [showInvitationsSection, setShowInvitationsSection] = useState(false);
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'invitation' | 'application';
    targetId?: number | string;
  }>({ isOpen: false, type: 'invitation' });

  const [errorToast, setErrorToast] = useState<string | null>(null);

  const location = useLocation();
  const [submittedModalState, setSubmittedModalState] = useState<{
    isOpen: boolean;
    propertyName: string;
    landlordName: string;
  }>({ isOpen: false, propertyName: '', landlordName: '' });

  useEffect(() => {
    if (location.state?.submissionSuccess) {
      setSubmittedModalState({
        isOpen: true,
        propertyName: location.state.propertyName || 'Property',
        landlordName: location.state.landlordName || 'Landlord'
      });
      // Clear navigation state to prevent modal from reappearing on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Fetch properties for invitations
  useEffect(() => {
    const controller = new AbortController();

    const fetchInvitations = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PROPERTY.GET_PUBLIC_LISTINGS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();
          const hiddenProps = JSON.parse(localStorage.getItem('hidden_invitation_properties') || '[]');

          // Filter out hidden properties, then limit to 4
          const mappedInvitations: InvitationItem[] = data
            .filter((item: any) => !hiddenProps.includes(item.id))
            .slice(0, 4)
            .map((item: any) => {
              const address = item.address;
              const addressString = address
                ? `${address.streetAddress || ''}, ${address.city || ''}, ${address.stateRegion || ''}, ${address.zipCode || ''}, ${address.country || ''}`.replace(/^, |, $/g, '').replace(/, ,/g, ',')
                : '';

              const beds = item.singleUnitDetail?.beds ?? null;
              const propertyName = item.listing?.title ||
                (beds !== null ? `${beds} Bedroom ${item.propertyType === 'SINGLE' ? 'Property' : 'Unit'}` : item.propertyName);

              // Use logic from property detail to get landlord/agent name
              const inviterName = item.listingAgent?.fullName || item.listingContactName || item.manager?.fullName || "Property Manager";
              const initials = (inviterName?.trim() || 'P').split(/\s+/).map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

              return {
                id: `inv_${item.id}`,
                inviterName: inviterName,
                propertyName: propertyName,
                propertyAddress: addressString,
                propertyId: item.id,
                initials: initials
              };
            });

          setInvitations(mappedInvitations);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Request was aborted, this is expected on unmount
          return;
        }
        console.error("Failed to fetch invitation properties:", error);
      }
    };

    fetchInvitations();

    return () => controller.abort();
  }, []);

  const [applications, setApplications] = useState<ApplicationItem[]>(() => {
    const localApps = JSON.parse(localStorage.getItem('user_applications') || '[]');
    return localApps;
  });

  // Fetch applications from API
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.APPLICATION.GET_ALL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed, assuming cookie-based or handled globally
          },
        });

        if (response.ok) {
          const data = await response.json();

          // Map API data to ApplicationItem structure
          const apiApps: ApplicationItem[] = data.map((app: any) => {
            // Safe nested access and default values
            const applicantName = app.applicant?.fullName || app.primaryApplicantName || "Unknown Applicant";
            const applicantPhone = app.applicant?.phoneNumber || app.primaryApplicantPhone || "N/A";
            const propertyAddress = app.property?.address
              ? `${app.property.address.streetAddress || ''}, ${app.property.address.city || ''}, ${app.property.address.stateRegion || ''}`
                .replace(/^, |, $/g, '').replace(/, ,/g, ',')
              : app.propertyAddress || "Address not available";

            return {
              id: app.id,
              name: applicantName,
              phone: applicantPhone,
              status: app.status || "Submitted", // Default to Submitted if status is missing
              appliedDate: app.createdAt ? app.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
              address: propertyAddress,
              propertyId: app.propertyId
            };
          });

          setApplications(prev => {
            // Keep all local applications (drafts and local submissions)
            // Filter out any local apps that are already returned by the API (matching by ID)
            const apiIds = new Set(apiApps.map(a => String(a.id)));
            const uniqueLocal = prev.filter(app => !apiIds.has(String(app.id)));

            return [...uniqueLocal, ...apiApps];
          });
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplications();
  }, []);

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
            <span className="text-[#A1A1AA] text-lg font-medium">
              Total {applications.filter(app => app.status !== 'Draft').length}
            </span>
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
                      onClick={() => navigate(`/userdashboard/properties/${inv.propertyId}`)}
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

                // Find property ID from the invitation to hide it persistently
                const invitation = invitations.find(inv => inv.id === invId);
                if (invitation) {
                  const hiddenProps = JSON.parse(localStorage.getItem('hidden_invitation_properties') || '[]');
                  if (!hiddenProps.includes(invitation.propertyId)) {
                    hiddenProps.push(invitation.propertyId);
                    localStorage.setItem('hidden_invitation_properties', JSON.stringify(hiddenProps));
                  }
                }

                // Update UI immediately
                setInvitations(prev => prev.filter(inv => inv.id !== invId));
              } else if (deleteModalState.type === 'application' && deleteModalState.targetId) {
                const appId = deleteModalState.targetId;

                // ⚠️ WARNING: This only deletes locally. API applications will reappear on refresh.
                // TODO: Implement proper API deletion when backend endpoint is ready:
                // if (typeof appId === 'number') {
                //   await fetch(`${API_ENDPOINTS.APPLICATION.DELETE}/${appId}`, {
                //     method: 'DELETE'
                //   });
                // }

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onDelete={(id) => setDeleteModalState({ isOpen: true, type: 'application', targetId: id })}
              onNavigate={() => navigate(
                app.status === "Draft" ? "/userdashboard/new-application" : `/userdashboard/applications/${app.id}`,
                {
                  state: app.status === "Draft" && app.propertyId ? { propertyId: app.propertyId } : undefined
                }
              )}
            />
          ))}
          {
            applications.length === 0 && (
              <div className="w-full py-20 flex flex-col items-center justify-center text-gray-400">
                <p className="text-lg font-medium">No applications found</p>
                <p className="text-sm">Start a new application or check your invitations.</p>
              </div>
            )
          }
        </div >
      </div >

      {/* Error Toast */}
      {
        errorToast && (
          <div className="fixed bottom-8 right-8 bg-[#EF4444] text-white px-6 py-4 rounded-xl shadow-2xl z-50 max-w-md flex items-center gap-4 animate-in slide-in-from-right duration-300 border border-white/20 backdrop-blur-sm">
            <div className="flex-1">
              <p className="text-sm font-semibold">Error</p>
              <p className="text-xs opacity-90">{errorToast}</p>
            </div>
            <button
              onClick={() => setErrorToast(null)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )
      }

      <ApplicationSubmittedModal
        isOpen={submittedModalState.isOpen}
        onClose={() => setSubmittedModalState(prev => ({ ...prev, isOpen: false }))}
        propertyName={submittedModalState.propertyName}
        landlordName={submittedModalState.landlordName}
      />
    </div >
  );
};

export default Applications;



