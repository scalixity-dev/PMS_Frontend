import React, { useState } from "react";
import UserAccountSettingsLayout from "../../components/layout/UserAccountSettingsLayout";
import PrimaryActionButton from "../../../../components/common/buttons/PrimaryActionButton";
import { useGet2FAStatus, useSend2FACode, useVerify2FACode } from "../../../../hooks/useTwoFactorQueries";
import BaseModal from "../../../../components/common/modals/BaseModal";

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

    const { data: statusData } = useGet2FAStatus();
    const is2FAEnabled: boolean = statusData?.enabled ?? false;

    const [showModal, setShowModal] = useState(false);
    const [intent, setIntent] = useState<'enable' | 'disable'>('enable');
    const [code, setCode] = useState('');
    const [modalError, setModalError] = useState('');
    const [codeSent, setCodeSent] = useState(false);

    const sendCode = useSend2FACode();
    const verifyCode = useVerify2FACode();

    const handleToggle = async () => {
        // Guard: prevent intent mismatch
        const newIntent: 'enable' | 'disable' = is2FAEnabled ? 'disable' : 'enable';
        if (newIntent === 'enable' && is2FAEnabled) {
            setModalError('Two-factor authentication is already enabled.');
            setShowModal(true);
            return;
        }
        if (newIntent === 'disable' && !is2FAEnabled) {
            setModalError('Two-factor authentication is already disabled.');
            setShowModal(true);
            return;
        }
        setIntent(newIntent);
        setCode('');
        setModalError('');
        setCodeSent(false);
        setShowModal(true);
        try {
            await sendCode.mutateAsync();
            setCodeSent(true);
        } catch (e: any) {
            setModalError(e.message || 'Failed to send code');
        }
    };

    const handleVerify = async () => {
        if (!code.trim()) {
            setModalError('Please enter the code');
            return;
        }
        // Validate intent still matches current state before submitting
        const expectedIntent: 'enable' | 'disable' = is2FAEnabled ? 'disable' : 'enable';
        if (intent !== expectedIntent) {
            setModalError('Action is no longer valid. Please close and try again.');
            return;
        }
        try {
            await verifyCode.mutateAsync({ code: code.trim(), intent });
            setShowModal(false);
            setCode('');
        } catch (e: any) {
            setModalError(e.message || 'Invalid code');
        }
    };

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
                        <a href="/privacy-policy" className="text-[#3D7475] text-xs sm:text-sm font-medium hover:underline">Learn more</a>
                    </div>
                    <PrimaryActionButton
                        text={is2FAEnabled ? "Disable 2FA" : "Enable 2FA"}
                        onClick={handleToggle}
                        disabled={sendCode.isPending || verifyCode.isPending}
                        className={`${is2FAEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-[#3D7475] hover:bg-[#2c5251]'} cursor-pointer !rounded-lg font-medium text-xs sm:text-sm !px-8 sm:!px-10 py-2 shadow-sm text-white w-full lg:w-auto`}
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

            {/* 2FA verification modal */}
            <BaseModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={intent === 'enable' ? 'Enable Two-Factor Authentication' : 'Disable Two-Factor Authentication'}
                footerButtons={[
                    { label: 'Cancel', onClick: () => setShowModal(false), variant: 'ghost' as const },
                    {
                        label: verifyCode.isPending ? 'Verifying...' : 'Confirm',
                        onClick: handleVerify,
                        variant: 'primary' as const,
                        className: 'border border-white shadow-md !bg-[#7CD947]',
                    },
                ]}
                maxWidth="max-w-sm"
                padding="px-6 py-6"
                titleSize="text-lg"
            >
                {sendCode.isPending && (
                    <p className="text-sm text-gray-500 mb-3">Sending code to your email...</p>
                )}
                {codeSent && (
                    <p className="text-sm text-gray-600 mb-3">A verification code has been sent to your email.</p>
                )}
                {modalError && (
                    <div className="mb-3 bg-red-50 border border-red-200 rounded-md p-2 text-xs text-red-700">{modalError}</div>
                )}
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Verification Code</label>
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:border-[#7CD947] focus:ring-1 focus:ring-[#7CD947]"
                        maxLength={6}
                    />
                </div>
            </BaseModal>
        </UserAccountSettingsLayout>
    );
};

export default Security;
