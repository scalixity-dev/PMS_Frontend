import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type AccountSettingsTab = "profile" | "security" | "integrations" | "notifications";

interface AccountSettingsLayoutProps {
  activeTab: AccountSettingsTab;
  children: ReactNode;
}

const primaryColor = "#7CD947";

export function AccountSettingsLayout(props: AccountSettingsLayoutProps) {
  const { activeTab, children } = props;
  const navigate = useNavigate();

  const getTabLabel = (tab: AccountSettingsTab) => {
    if (tab === "profile") {
      return "Profile";
    }
    if (tab === "security") {
      return "Security";
    }
    if (tab === "integrations") {
      return "Integrations";
    }
    return "Notifications";
  };

  const handleTabClick = (tab: AccountSettingsTab) => {
    if (tab === "profile") {
      navigate("/dashboard/settings/profile");
    } else if (tab === "security") {
      navigate("/dashboard/settings/security");
    } else if (tab === "integrations") {
      navigate("/dashboard/settings/integrations");
    } else {
      navigate("/dashboard/settings/notifications");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-5">
        <div className="text-sm text-gray-700 font-medium">
          <span
            className="cursor-pointer"
            style={{ color: primaryColor }}
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </span>{" "}
          /{" "}
          <span
            className="cursor-pointer"
            style={{ color: primaryColor }}
            onClick={() => navigate("/dashboard/settings")}
          >
            Settings
          </span>{" "}
          / <span style={{ color: "#273F3B" }}>{getTabLabel(activeTab)}</span>
        </div>

        <div className="bg-[#DFE6DD] rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.06)] border border-[#E4E4E4]">
          <div className="px-8 pt-7 pb-4 border-b border-[#E8E8E8]">
            <h1 className="text-2xl font-semibold text-gray-900 mb-5">Account settings</h1>

            <div className="flex flex-wrap gap-2 bg-[#F5F7FB] rounded-full p-1.5 w-fit">
              {(["profile", "security", "integrations", "notifications"] as AccountSettingsTab[]).map((tab) => {
                const isActive = activeTab === tab;

                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => handleTabClick(tab)}
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold ${isActive
                        ? "text-white shadow-[0_6px_14px_rgba(124,217,71,0.45)]"
                        : "text-gray-700 hover:bg-white"
                      }`}
                    style={isActive ? { backgroundColor: primaryColor } : undefined}
                  >
                    {getTabLabel(tab)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="px-8 pb-8 pt-6 space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}


