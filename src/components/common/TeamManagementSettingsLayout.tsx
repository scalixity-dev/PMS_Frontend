import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";

type TeamManagementSettingsTab =
    | "roles-permissions"
    | "property-permissions";

interface TeamManagementSettingsLayoutProps {
    activeTab: TeamManagementSettingsTab;
    children: ReactNode;
    headerActions?: ReactNode;
    onSearchChange?: (query: string) => void;
    searchPlaceholder?: string;
}

const primaryColor = "#7CD947";

export function TeamManagementSettingsLayout(
    props: TeamManagementSettingsLayoutProps
) {
    const { activeTab, children, headerActions, onSearchChange, searchPlaceholder = "Search Anything..." } = props;
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const getTabLabel = (tab: TeamManagementSettingsTab) => {
        if (tab === "roles-permissions") {
            return "Roles & Permissions";
        }
        return "Property Permissions";
    };

    const handleTabClick = (tab: TeamManagementSettingsTab) => {
        if (tab === "roles-permissions") {
            navigate("/dashboard/settings/team-management/roles-permissions");
            return;
        }
        navigate("/dashboard/settings/team-management/property-permissions");
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (onSearchChange) {
            onSearchChange(query);
        }
    };

    const handleSearchClick = () => {
        if (onSearchChange) {
            onSearchChange(searchQuery);
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
                            <h1 className="text-2xl font-semibold text-gray-900">
                                Team Management
                            </h1>
                            <div className="flex gap-3 items-center">
                                {headerActions}
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder={searchPlaceholder}
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="pl-4 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#7CD947] focus:border-transparent w-64"
                                        aria-label="Search"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleSearchClick}
                                        className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-900 hover:bg-gray-800 transition-colors"
                                        aria-label="Search button"
                                    >
                                        <Search className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 bg-[#F5F7FB] rounded-full p-1.5 w-fit">
                            {(
                                [
                                    "roles-permissions",
                                    "property-permissions",
                                ] as TeamManagementSettingsTab[]
                            ).map((tab) => {
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
                                        style={
                                            isActive ? { backgroundColor: primaryColor } : undefined
                                        }
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
