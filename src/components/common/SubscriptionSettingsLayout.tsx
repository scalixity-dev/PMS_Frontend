import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type SubscriptionSettingsTab = "my-plan" | "my-card";

interface SubscriptionSettingsLayoutProps {
  activeTab: SubscriptionSettingsTab;
  children: ReactNode;
  headerActions?: ReactNode;
}

const primaryColor = "#7CD947";

export function SubscriptionSettingsLayout(props: SubscriptionSettingsLayoutProps) {
  const { activeTab, children, headerActions } = props;
  const navigate = useNavigate();

  const getTabLabel = (tab: SubscriptionSettingsTab) => {
    if (tab === "my-plan") {
      return "My plan";
    }
    return "My cards";
  };

  const handleTabClick = (tab: SubscriptionSettingsTab) => {
    if (tab === "my-plan") {
      navigate("/dashboard/settings/subscription/my-plan");
    } else {
      navigate("/dashboard/settings/subscription/my-card");
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
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-2xl font-semibold text-gray-900">Subscription</h1>
              {headerActions && (
                <div className="flex gap-3">
                  {headerActions}
                </div>
              )}
            </div>

            <div className="flex gap-2 bg-[#F5F7FB] rounded-full p-1.5 w-fit">
              {(["my-plan", "my-card"] as SubscriptionSettingsTab[]).map((tab) => {
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
                    {tab === "my-plan" ? "My Plan" : "My cards"}
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

