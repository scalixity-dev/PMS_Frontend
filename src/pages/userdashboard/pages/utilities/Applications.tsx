import React from "react";
import { Link } from "react-router-dom";
import { Bell, User } from "lucide-react";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";

interface ApplicationItem {
  id: number;
  name: string;
  phone: string;
}

const Applications: React.FC = () => {
  const applications: ApplicationItem[] = [
    {
      id: 1,
      name: "Shawn James",
      phone: "+1 569 349 495",
    },
  ];

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-md font-medium">
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
            <li className="text-[#1A1A1A] font-lg font-medium" aria-current="page">
              Application
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-10">
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">Application</h1>
            <span className="text-[#A1A1AA] text-lg font-medium">Total 0</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <div className="w-10 h-10 bg-[#7ED957] rounded-full  flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity shadow-sm">
                <Bell size={22} fill="white" strokeWidth={1.5} />
              </div>
              <div className="absolute top-0 right-0 w-3 h-3 bg-[#FF3B30] border-2 border-white rounded-full"></div>
            </div>

            {/* Find a Place Button */}
            <PrimaryActionButton
              text="Find a Place"
              className="bg-[#7ED957] hover:bg-[#6BC847] !px-6 !py-2.5"
            />
          </div>
        </div>
        <div className="border-t border-[#E5E7EB]"></div>

        {/* Application List */}
        <div className="space-y-4 pt-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 flex items-center justify-between shadow-[0px_4px_4px_0px_#00000040] border border-gray-100/50 max-w-xl"
            >
              <div className="flex items-center gap-6">
                {/* Avatar */}
                <div className="w-16 h-16 bg-[#1A1A1A] rounded-full flex items-center justify-center text-white">
                  <User size={40} strokeWidth={1.5} />
                </div>

                {/* User Info */}
                <div className="space-y-1">
                  <h3 className="text-[22px] font-semibold text-[#1A1A1A]">{app.name}</h3>
                  <p className="text-[#71717A] text-md font-medium">{app.phone}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-10 mr-4">
                <button className="text-[#7ED957] text-md font-semibold hover:opacity-80 transition-opacity">
                  View
                </button>
                <button className="text-[#A1A1AA] text-md font-semibold hover:text-gray-600 transition-colors">
                  Ignore
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



