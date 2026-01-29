import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Bell, X, ChevronLeft, ChevronRight } from "lucide-react";
import ApplicationSubmittedModal from "./components/ApplicationSubmittedModal";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import DeleteConfirmationModal from "../../../../components/common/modals/DeleteConfirmationModal";
import { UserApplicationCard, UserApplicationCardSkeleton, type ApplicationItem } from "./components/UserApplicationCard";
import { API_ENDPOINTS } from "../../../../config/api.config";

interface InvitationItem {
  id: string;
  inviterName: string;
  propertyName: string;
  propertyAddress: string;
  propertyId: string;
  initials: string;
}

const ITEMS_PER_PAGE = 10;

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [showInvitationsSection, setShowInvitationsSection] = useState(false);
  const [invitations, setInvitations] = useState<InvitationItem[]>([]);
  const [isLoadingInvitations, setIsLoadingInvitations] = useState(true);
  const [isLoadingApplications, setIsLoadingApplications] = useState(true);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'invitation' | 'application';
    targetId?: string;
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
      setIsLoadingInvitations(true);
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
          return;
        }
        console.error("Failed to fetch invitations:", error);
        setInvitations([]);
      }
      setIsLoadingInvitations(false);
    };

    fetchInvitations();

    return () => controller.abort();
  }, []);

  const [applications, setApplications] = useState<ApplicationItem[]>([]);

  // Fetch applications from API
  useEffect(() => {
    const controller = new AbortController();

    const fetchApplications = async () => {
      setIsLoadingApplications(true);
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
              id: String(app.id),
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
        } else {
          // Log non-401 errors for debugging
          console.error(`Failed to fetch applications: ${response.status} ${response.statusText}`);
          const errorData = await response.json().catch(() => ({}));
          console.error("Error details:", errorData);
          setApplications([]);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }
        console.error("Failed to fetch applications:", error);
        setApplications([]);
      }
      setIsLoadingApplications(false);
    };

    fetchApplications();

    return () => controller.abort();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);

  const paginatedApplications = applications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [applications.length, totalPages, currentPage]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-full mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-4 sm:gap-10">
            <h1 className="text-xl sm:text-2xl font-semibold text-[#1A1A1A]">Application</h1>
            <span className="text-[#A1A1AA] text-base sm:text-lg font-medium">
              Total {applications.filter(app => app.status !== 'Draft').length}
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 sm:gap-4">
            {/* Notification Bell - Toggles Invitation Cards */}
            <button
              onClick={() => setShowInvitationsSection(!showInvitationsSection)}
              className="relative shrink-0"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#7ED957] rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity shadow-sm">
                <Bell size={20} className="sm:w-[22px]" fill="white" strokeWidth={1.5} />
              </div>
              {invitations.length > 0 && !isLoadingInvitations && (
                <div className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#FF3B30] border-2 border-white rounded-full flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white">
                  {invitations.length}
                </div>
              )}
            </button>

            {/* Find a Place Button */}
            <PrimaryActionButton
              text="Find a Place"
              className="bg-[#7ED957] hover:bg-[#6BC847] px-4! sm:px-6! py-2! sm:py-2.5! text-xs sm:text-sm"
              to="/userdashboard/properties"
            />
          </div>
        </div>

        {/* Invitations Section */}
        {showInvitationsSection && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
            {isLoadingInvitations ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-5 h-[100px] animate-pulse flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : invitations.length > 0 ? (
              <>
                <h2 className="text-lg font-semibold text-[#1A1A1A]">Invitations ({invitations.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {invitations.map((inv) => (
                    <div key={inv.id} className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-[0px_4px_4px_0px_#00000040]">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#52D3A2] flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0">
                          {inv.initials}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <h3 className="font-semibold text-[#1A1A1A] text-sm truncate">{inv.inviterName}</h3>
                          <p className="text-xs sm:text-sm text-[#71717A] leading-tight mt-0.5 break-words">
                            invited you to apply for <span className="text-[#1A1A1A] font-medium">{inv.propertyName}</span>, {inv.propertyAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 sm:justify-end sm:pr-2 pl-13 sm:pl-0">
                        <button
                          onClick={() => setDeleteModalState({ isOpen: true, type: 'invitation', targetId: inv.id })}
                          className="text-[#64748B] text-sm font-medium hover:text-[#1A1A1A] transition-colors"
                        >
                          Ignore
                        </button>
                        <button
                          onClick={() => navigate(`/userdashboard/properties/${inv.propertyId}`)}
                          className="text-[#7ED957] text-sm font-bold hover:opacity-80 transition-opacity"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="bg-[#F9FAFB] rounded-xl border border-dashed border-[#E5E7EB] p-8 text-center text-[#71717A]">
                No new invitations at the moment.
              </div>
            )}
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
                setInvitations(prev => prev.filter(inv => String(inv.id) !== String(invId)));
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
                    body: JSON.stringify({}),
                  });

                  if (deleteResponse.ok) {
                    // Remove from state only after successful API deletion
                    setApplications(prev => prev.filter(app => String(app.id) !== String(appId)));
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
          {isLoadingApplications ? (
            // Skeleton Loading State
            Array.from({ length: 4 }).map((_, index) => (
              <UserApplicationCardSkeleton key={index} />
            ))
          ) : (
            paginatedApplications.map((app) => (
              <UserApplicationCard
                key={app.id}
                app={app}
                onDelete={(id) => setDeleteModalState({ isOpen: true, type: 'application', targetId: String(id) })}
                onNavigate={() => navigate(
                  app.status === "Draft" ? "/userdashboard/new-application" : `/userdashboard/applications/${app.id}`,
                  {
                    state: app.status === "Draft" && app.propertyId ? { propertyId: app.propertyId } : undefined
                  }
                )}
              />
            ))
          )}

          {
            !isLoadingApplications && applications.length === 0 && (
              <div className="col-span-full w-full py-20 flex flex-col items-center justify-center text-gray-400">
                <p className="text-lg font-medium">No applications found</p>
                <p className="text-sm">Start a new application or check your invitations.</p>
              </div>
            )
          }
        </div >

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2 pb-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full transition-colors ${currentPage === 1
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <ChevronLeft size={24} />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${currentPage === page
                    ? 'bg-[#7ED957] text-white shadow-lg'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                    }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full transition-colors ${currentPage === totalPages
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}
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



