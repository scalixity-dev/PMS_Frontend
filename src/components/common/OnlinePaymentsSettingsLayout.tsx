import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface OnlinePaymentsSettingsLayoutProps {
    children: ReactNode;
    headerActions?: ReactNode;
}

const primaryColor = "#7CD947";

export function OnlinePaymentsSettingsLayout(props: OnlinePaymentsSettingsLayoutProps) {
    const { children, headerActions } = props;
    const navigate = useNavigate();

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
                    / <span style={{ color: "#273F3B" }}>Online Payments</span>
                </div>

                <div className="bg-[#DFE6DD] rounded-2xl shadow-[0_18px_45px_rgba(0,0,0,0.06)] border border-[#E4E4E4]">
                    <div className="px-8 pt-7 pb-6 border-b border-[#E8E8E8]">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold text-gray-900">Online Payments</h1>
                            {headerActions && <div className="flex gap-3">{headerActions}</div>}
                        </div>
                    </div>

                    <div className="px-8 pb-8 pt-6 space-y-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
