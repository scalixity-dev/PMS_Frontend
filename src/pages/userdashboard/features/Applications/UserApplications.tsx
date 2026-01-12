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
  imageUrl?: string | null;
}

interface InvitationItem {
  id: string;
  inviterName: string;
  propertyName: string;
  propertyAddress: string;
  propertyId: string;
  initials: string;
}

// Helper function to generate initials from name
const getInitials = (name: string): string => {
  if (!name || name.trim() === '') return 'U';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  
  // Get first letter of first name and last name
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
};

// Helper function to format date - handles both YYYY-MM-DD and ISO strings
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';

  let date: Date;
  // If explicitly YYYY-MM-DD, parse components to start at local midnight
  // (Avoids UTC midnight shifting to previous day in Western timezones)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    const [year, month, day] = dateString.split('-').map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return '-';

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
  const initials = useMemo(() => getInitials(app.name), [app.name]);
  const [imageError, setImageError] = useState(false);

  // Reset image error when imageUrl changes
  useEffect(() => {
    setImageError(false);
  }, [app.imageUrl]);

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
        <div className="w-20 h-20 rounded-full bg-[#E0F2FE] mb-3 overflow-hidden flex items-center justify-center">
          {app.imageUrl && !imageError ? (
            <img
              src={app.imageUrl}
              alt={app.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <span className="text-2xl font-semibold text-[#1565C0]">
              {initials}
            </span>
          )}
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
    const state = location.state as { submissionSuccess?: boolean; propertyName?: string; landlordName?: string } | null;

    if (state?.submissionSuccess) {
      setSubmittedModalState({
        isOpen: true,
        propertyName: state.propertyName || 'Property',
        landlordName: state.landlordName || 'Landlord'
      });
      // Clear navigation state to prevent modal from reappearing on refresh, preserving URL params
      navigate(
        { pathname: location.pathname, search: location.search, hash: location.hash },
        { replace: true, state: {} }
      );
    }
  }, [location, navigate]);

  // Fetch invitations for the current user
  useEffect(() => {
    const controller = new AbortController();

    const fetchInvitations = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.APPLICATION.GET_INVITATIONS, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();
          const hiddenProps = JSON.parse(localStorage.getItem('hidden_invitation_properties') || '[]');

          // Filter out hidden properties, then limit to 4
          const mappedInvitations: InvitationItem[] = data
            .filter((invitation: any) => !hiddenProps.includes(invitation.property?.id))
            .slice(0, 4)
            .map((invitation: any) => {
              const property = invitation.property;
              const address = property?.address;
              const addressString = address
                ? `${address.streetAddress || ''}, ${address.city || ''}, ${address.stateRegion || ''}, ${address.zipCode || ''}, ${address.country || ''}`.replace(/^, |, $/g, '').replace(/, ,/g, ',')
                : '';

              const beds = property?.leasing?.singleUnitDetail?.beds ?? property?.leasing?.unit?.beds ?? null;
              // Get listing title from property listings (first active listing)
              const listingTitle = property?.listings && property.listings.length > 0 
                ? property.listings[0]?.title 
                : null;
              const propertyName = listingTitle ||
                (beds !== null ? `${beds} Bedroom ${property?.propertyType === 'SINGLE' ? 'Property' : 'Unit'}` : property?.propertyName);

              // Use inviter name from invitation
              const inviterName = invitation.invitedBy?.fullName || property?.manager?.fullName || "Property Manager";
              const initials = (inviterName?.trim() || 'P').split(/\s+/).map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

              return {
                id: `inv_${invitation.id}`,
                inviterName: inviterName,
                propertyName: propertyName,
                propertyAddress: addressString,
                propertyId: property?.id,
                initials: initials
              };
            });

          setInvitations(mappedInvitations);
        } else if (response.status === 401) {
          // User not authenticated - no invitations
          setInvitations([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Request was aborted, this is expected on unmount
          return;
        }
        console.error("Failed to fetch invitations:", error);
        setInvitations([]);
      }
    };

    fetchInvitations();

    return () => controller.abort();
  }, []);

  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  // Fetch applications from API
  useEffect(() => {
    const controller = new AbortController();

    const fetchApplications = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.APPLICATION.GET_ALL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();

          // Normalization helper for status
          const normalizeStatus = (status: string): "Approved" | "Rejected" | "Submitted" | "Draft" => {
            const normalized = status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase();
            if (['Approved', 'Rejected', 'Submitted', 'Draft'].includes(normalized)) {
              return normalized as "Approved" | "Rejected" | "Submitted" | "Draft";
            }
            return "Submitted"; // Default fallback
          };

          // Map API data to ApplicationItem structure - only backend applications
          const apiApps: ApplicationItem[] = data.map((app: any) => {
            // Get primary applicant (first one or the one marked as primary)
            const primaryApplicant = app.applicants?.find((a: any) => a.isPrimary) || app.applicants?.[0];
            const applicantName = primaryApplicant
              ? `${primaryApplicant.firstName || ''} ${primaryApplicant.middleName || ''} ${primaryApplicant.lastName || ''}`.trim() || "Unknown Applicant"
              : "Unknown Applicant";
            const applicantPhone = primaryApplicant?.phoneNumber || "N/A";
            
            // Get property address from leasing property
            const propertyAddress = app.leasing?.property?.address
              ? `${app.leasing.property.address.streetAddress || ''}, ${app.leasing.property.address.city || ''}, ${app.leasing.property.address.stateRegion || ''}`
                .replace(/^, |, $/g, '').replace(/, ,/g, ',')
              : "Address not available";

            return {
              id: app.id,
              name: applicantName,
              phone: applicantPhone,
              status: normalizeStatus(app.status), // Normalized status
              appliedDate: app.createdAt ? app.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
              address: propertyAddress,
              propertyId: app.leasing?.property?.id,
              imageUrl: app.imageUrl || null
            };
          });

          // Set only backend applications, no local storage merging
          setApplications(apiApps);
        } else if (response.status === 401) {
          // User not authenticated - no applications
          setApplications([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error("Failed to fetch applications:", error);
        setApplications([]);
      }
    };

    fetchApplications();

    return () => controller.abort();
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
          onConfirm={async () => {
            try {
              if (deleteModalState.type === 'invitation' && deleteModalState.targetId) {
                const invId = deleteModalState.targetId;

                // Find property ID from the invitation to hide it persistently
                const invitation = invitations.find(inv => inv.id === invId);
                if (invitation && invitation.propertyId) {
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

                // Delete from backend API
                try {
                  const deleteResponse = await fetch(API_ENDPOINTS.APPLICATION.DELETE(String(appId)), {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                  });

                  if (deleteResponse.ok) {
                    // Remove from state only after successful API deletion
                    setApplications(prev => prev.filter(app => app.id !== appId));
                  } else {
                    const errorData = await deleteResponse.json().catch(() => ({ message: 'Failed to delete application' }));
                    setErrorToast(errorData.message || 'Failed to delete application. Please try again.');
                    setTimeout(() => setErrorToast(null), 5000);
                  }
                } catch (error) {
                  console.error('Failed to delete application:', error);
                  setErrorToast('Failed to delete application. Please try again.');
                  setTimeout(() => setErrorToast(null), 5000);
                }
              }
            } catch (error) {
              console.error('Failed to process deletion:', error);
              setErrorToast('Failed to process deletion. Please try again.');
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
              <div className="col-span-full w-full py-20 flex flex-col items-center justify-center text-gray-400">
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



