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
            <div className="px-8 py-6">
                {/* Two Steps Authentication */}
                <div className="flex justify-between items-start mb-12 mr-20">
                    <div className="max-w-2xl">
                        <h2 className="text-xl font-medium text-[#1A1A1A] mb-2">Two Steps Authentication</h2>
                        <p className="text-[14px] text-[#4B5563] leading-relaxed mb-0">
                            Identity verification is required to prevent fraud and increase security.
                            <br />
                            TenantCloud works with Stripe to conduct identity verification online.
                        </p>
                        <a href="#" className="text-[#3D7475] text-sm font-medium hover:underline">Learn more</a>
                    </div>
                    <PrimaryActionButton
                        text="Enable"
                        onClick={() => { }}
                        className="bg-[#407B88] hover:bg-[#32616B] !rounded-lg font-medium text-sm !px-10 py-2 shadow-sm text-white"
                    />
                </div>

                {/* Login sessions */}
                <div>
                    <h2 className="text-xl font-medium text-[#1A1A1A] mb-6">Login sessions</h2>
                    <div className="w-full border border-[#E5E7EB] rounded-lg overflow-hidden shadow-[0px_4px_4px_0px_#00000040] bg-[#F9FAFB]">
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
                </div>
            </div>
        </UserAccountSettingsLayout>
    );
};

export default Security;
