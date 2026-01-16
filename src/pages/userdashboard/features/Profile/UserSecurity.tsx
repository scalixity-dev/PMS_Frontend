import React from "react";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";

const Security: React.FC = () => {

    const loginSessions = [
        {
            location: "Indore, India",
            device: "Chrome on Mac OS X",
            ipAddress: "223.178.208.182",
            lastActivity: "Current Session",
            isCurrent: true
        },
        {
            location: "Indore, India",
            device: "Chrome on Mac OS X",
            ipAddress: "223.178.208.182",
            lastActivity: "22 hours ago",
            isCurrent: false
        }
    ];

    return (
        <UserAccountSettingsLayout activeTab="Security">
            <div className="px-3 sm:px-4 md:px-8 py-4 sm:py-5 md:py-6">
                {/* Two Steps Authentication */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-4 lg:gap-0 mb-8 sm:mb-10 lg:mb-12 lg:mr-20">
                    <div className="max-w-2xl">
                        <h2 className="text-lg sm:text-xl font-medium text-[#1A1A1A] mb-2">Two Steps Authentication</h2>
                        <p className="text-xs sm:text-[14px] text-[#4B5563] leading-relaxed mb-2">
                            Identity verification is required to prevent fraud and increase security.
                            <br className="hidden sm:block" />
                            <span className="sm:inline block mt-1 sm:mt-0">TenantCloud works with Stripe to conduct identity verification online.</span>
                        </p>
                        <a href="#" className="text-[#3D7475] text-xs sm:text-sm font-medium hover:underline">Learn more</a>
                    </div>
                    <PrimaryActionButton
                        text="Enable"
                        onClick={() => { }}
                        className="bg-[#407B88] hover:bg-[#32616B] !rounded-lg font-medium text-xs sm:text-sm !px-8 sm:!px-10 py-2 shadow-sm text-white w-full lg:w-auto"
                    />
                </div>

                {/* Login sessions */}
                <div>
                    <h2 className="text-lg sm:text-xl font-medium text-[#1A1A1A] mb-4 sm:mb-6">Login sessions</h2>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block w-full border border-[#E5E7EB] rounded-lg overflow-hidden shadow-[0px_4px_4px_0px_#00000040] bg-[#F9FAFB]">
                        <div className="grid grid-cols-4 bg-[#84CC16] text-white py-4 px-8 font-medium text-[16px]">
                            <div>Location</div>
                            <div>Device</div>
                            <div>IP Address</div>
                            <div>Last Activity</div>
                        </div>
                        <div className="bg-[#F9FAFB]">
                            {loginSessions.map((session, index) => (
                                <div key={index} className="grid grid-cols-4 border-b border-[#E5E7EB] py-4 px-8 text-sm text-[#4B5563] last:border-b-0 hover:bg-gray-50 transition-colors">
                                    <div className="font-medium text-[#1A1A1A]">{session.location}</div>
                                    <div>{session.device}</div>
                                    <div>{session.ipAddress}</div>
                                    <div className="flex items-center gap-2">
                                        {session.lastActivity}
                                        {session.isCurrent && (
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile/Tablet Card View */}
                    <div className="lg:hidden space-y-3 sm:space-y-4">
                        {loginSessions.map((session, index) => (
                            <div key={index} className="border border-[#E5E7EB] rounded-lg bg-white p-4 shadow-sm">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-[#1A1A1A] text-sm sm:text-base">{session.location}</h3>
                                        <p className="text-xs sm:text-sm text-[#4B5563] mt-1">{session.device}</p>
                                    </div>
                                    {session.isCurrent && (
                                        <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Current
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs sm:text-sm text-[#6B7280] font-medium">IP Address:</span>
                                        <span className="text-xs sm:text-sm text-[#1A1A1A]">{session.ipAddress}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs sm:text-sm text-[#6B7280] font-medium">Last Activity:</span>
                                        <span className="text-xs sm:text-sm text-[#1A1A1A]">{session.lastActivity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </UserAccountSettingsLayout>
    );
};

export default Security;
