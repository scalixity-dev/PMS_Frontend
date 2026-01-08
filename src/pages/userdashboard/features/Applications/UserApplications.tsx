import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import DeleteConfirmationModal from "../../../../components/common/modals/DeleteConfirmationModal";

interface ApplicationItem {
  id: number;
  name: string;
  phone: string;
  status: "Approved" | "Rejected" | "Submitted" | "Draft";
  appliedDate: string;
  address: string;
}

// Helper function to generate avatar seed from name
const getAvatarSeed = (name: string): string => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

const Applications: React.FC = () => {
  const navigate = useNavigate();
  const [showInvitation, setShowInvitation] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [applications] = useState<ApplicationItem[]>(() => {
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
            {/* Notification Bell - Toggles Invitation Card */}
            <button
              onClick={() => setShowInvitation(!showInvitation)}
              className="relative"
            >
              <div className="w-10 h-10 bg-[#7ED957] rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity shadow-sm">
                <Bell size={22} fill="white" strokeWidth={1.5} />
              </div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#FF3B30] border-2 border-white rounded-full"></div>
            </button>

            {/* Find a Place Button */}
            <PrimaryActionButton
              text="Find a Place"
              className="bg-[#7ED957] hover:bg-[#6BC847] px-6! py-2.5!"
              to="/userdashboard/properties"
            />
          </div>
        </div>

        {/* Invitation Card */}
        {showInvitation && (
          <div className="flex justify-start">
            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 flex items-center justify-between w-full max-w-2xl shadow-[0px_4px_4px_0px_#00000040]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#52D3A2] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  AS
                </div>
                <div className="flex flex-col">
                  <h3 className="font-semibold text-[#1A1A1A] text-sm">Ashendra Sharma</h3>
                  <p className="text-sm text-[#71717A] leading-tight mt-0.5">
                    invited you to apply for Sagar Sadhan Hotel Rd, Thoothukudi, TN
                    <br />
                    462026, IN
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-8 pr-2">
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-[#64748B] text-sm font-medium hover:text-[#1A1A1A] transition-colors"
                >
                  Ignore
                </button>
                <button
                  onClick={() => navigate("/userdashboard/new-application", {
                    state: { propertyId: 'prop_mock_123' }
                  })}
                  className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                  View
                </button>
              </div>
            </div>
          </div>
        )}

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            setShowInvitation(false);
            setIsDeleteModalOpen(false);
          }}
          title="Ignore Invitation"
          message="Are you sure you want to ignore this invitation? This action cannot be undone."
          confirmText="Ignore"
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
                  onClick={() => navigate(app.status === "Draft" ? "/userdashboard/new-application" : `/userdashboard/applications/${app.id}`)}
                  className="text-[#7ED957] text-sm font-semibold hover:opacity-80 transition-opacity"
                >
                  {app.status === "Draft" ? "Continue application" : "View application"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Applications;



