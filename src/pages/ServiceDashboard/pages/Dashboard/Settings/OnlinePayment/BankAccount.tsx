import { Building2, CheckCircle2, AlertCircle, ExternalLink, Loader2, HelpCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    useConnectStatus,
    useCreateConnectOnboarding,
    useDisconnectConnect,
} from '../../../../../../hooks/usePaymentsQueries';
import { useToast } from '../../../../../../components/common/Toast';
import DeleteConfirmationModal from '../../../../../../components/common/modals/DeleteConfirmationModal';

/**
 * Stripe Connect (Express) — service pro receives payouts directly to bank.
 * No bank/IFSC/account info stored locally — Stripe collects + secures it.
 */
const BankAccount = () => {
    const { data: status, isLoading, refetch, isFetching } = useConnectStatus();
    const onboardingMut = useCreateConnectOnboarding();
    const disconnectMut = useDisconnectConnect();
    const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);
    const toast = useToast();

    const handleConnect = async () => {
        const returnUrl = `${window.location.origin}/service-dashboard/settings/bank-account?stripe=success`;
        const refreshUrl = `${window.location.origin}/service-dashboard/settings/bank-account?stripe=refresh`;

        try {
            const res = await onboardingMut.mutateAsync({ returnUrl, refreshUrl });
            // Redirect to Stripe-hosted onboarding
            window.location.href = res.onboardingUrl;
        } catch (err: any) {
            alert(err?.message || 'Failed to start onboarding');
        }
    };

    const handleDisconnect = () => {
        setShowDisconnectConfirm(true);
    };

    const confirmDisconnect = async () => {
        try {
            await disconnectMut.mutateAsync();
            setShowDisconnectConfirm(false);
            await refetch();
        } catch (err: any) {
            toast.error(err?.message || 'Failed to disconnect');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-[#7CD947]" />
                <span className="ml-3 text-gray-600">Loading Stripe status...</span>
            </div>
        );
    }

    // ===== NOT CONNECTED =====
    if (!status?.connected) {
        return (
            <div className="space-y-8">
                <div className="flex flex-col items-center justify-center py-8 md:py-16 bg-white rounded-xl border border-gray-100 shadow-sm text-center">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                        <Building2 className="text-[#7CD947]" size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Connect Bank to Receive Payouts</h2>
                    <p className="text-gray-500 max-w-md mb-2">
                        We use <strong className="text-[#635BFF]">Stripe</strong> to securely process your payouts.
                        Stripe holds the bank details — we never see them.
                    </p>
                    <p className="text-xs text-gray-400 mb-8">Powered by Stripe Connect. PCI-DSS Level 1 certified.</p>
                    <button
                        onClick={handleConnect}
                        disabled={onboardingMut.isPending}
                        className="flex items-center gap-2 bg-[#635BFF] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#5048d4] transition-all transform hover:scale-105 shadow-md disabled:opacity-50"
                    >
                        {onboardingMut.isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Redirecting to Stripe...
                            </>
                        ) : (
                            <>
                                <ExternalLink size={20} strokeWidth={2.5} />
                                Connect with Stripe
                            </>
                        )}
                    </button>
                </div>

                <HelpSection />
            </div>
        );
    }

    // ===== CONNECTED =====
    const allReady = status.chargesEnabled && status.payoutsEnabled && status.detailsSubmitted;

    return (
        <>
        <DeleteConfirmationModal
            isOpen={showDisconnectConfirm}
            onClose={() => setShowDisconnectConfirm(false)}
            onConfirm={confirmDisconnect}
            isLoading={disconnectMut.isPending}
            title="Disconnect Stripe"
            message="Disconnect Stripe? You will not receive payouts until reconnected."
            confirmText="Disconnect"
            confirmButtonClass="bg-orange-500 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-orange-600 transition-colors"
            headerClassName="bg-orange-500"
        />
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm shrink-0">
                        <Building2 className="text-gray-900" size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Stripe Account</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Connected to Stripe — manage payouts directly</p>
                    </div>
                </div>

                <div className="flex gap-3 self-start sm:self-center">
                    <button
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw size={16} className={isFetching ? 'animate-spin' : ''} />
                        <span className="hidden sm:inline">Refresh</span>
                    </button>
                    <button
                        onClick={handleDisconnect}
                        disabled={disconnectMut.isPending}
                        className="flex items-center gap-2 bg-white border border-red-100 text-red-500 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        <Trash2 size={18} strokeWidth={2} />
                        <span className="hidden sm:inline">Disconnect</span>
                    </button>
                </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-xl p-4 md:p-8 shadow-sm border border-gray-100 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <StatusRow label="Account ID" value={status.accountId || ''} />
                    <StatusItem label="Onboarding Complete" enabled={status.detailsSubmitted} />
                    <StatusItem label="Charges Enabled" enabled={status.chargesEnabled} />
                    <StatusItem label="Payouts Enabled" enabled={status.payoutsEnabled} />
                </div>

                {!allReady && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="text-yellow-600 shrink-0" size={20} />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-yellow-900 mb-1">Onboarding incomplete</p>
                            <p className="text-xs text-yellow-700 mb-3">
                                Stripe needs more info before payouts can be enabled. Click below to continue onboarding.
                            </p>
                            <button
                                onClick={handleConnect}
                                disabled={onboardingMut.isPending}
                                className="flex items-center gap-2 bg-[#635BFF] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#5048d4] transition-colors disabled:opacity-50"
                            >
                                {onboardingMut.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink size={14} />}
                                Continue Onboarding
                            </button>
                        </div>
                    </div>
                )}

                {allReady && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                        <CheckCircle2 className="text-green-600 shrink-0" size={20} />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-green-900 mb-1">All set</p>
                            <p className="text-xs text-green-700">
                                Your account is fully verified. Payouts will arrive in your bank in 2–3 business days after each completed job.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <HelpSection />
        </div>
        </>
    );
};

const StatusRow = ({ label, value }: { label: string; value: string }) => (
    <div>
        <p className="text-xs font-semibold text-gray-900 mb-1.5">{label}</p>
        <p className="text-sm text-gray-600 font-mono truncate">{value || '-'}</p>
    </div>
);

const StatusItem = ({ label, enabled }: { label: string; enabled: boolean }) => (
    <div>
        <p className="text-xs font-semibold text-gray-900 mb-1.5">{label}</p>
        <p className={`text-sm font-medium flex items-center gap-1.5 ${enabled ? 'text-green-600' : 'text-orange-600'}`}>
            {enabled ? (
                <>
                    <CheckCircle2 size={16} />
                    Enabled
                </>
            ) : (
                <>
                    <AlertCircle size={16} />
                    Not yet
                </>
            )}
        </p>
    </div>
);

const HelpSection = () => (
    <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-5 items-start mt-8">
        <div className="w-10 h-10 rounded-full bg-[#7CD947] flex items-center justify-center shrink-0 shadow-sm shadow-green-200">
            <HelpCircle className="text-white" size={20} />
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-gray-900 mb-1 text-sm">Questions About Getting Paid?</h3>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed max-w-3xl">
                Stripe handles all bank verification and KYC. Payouts arrive in 2–3 business days after each completed job.
                Bank details are stored on Stripe's PCI-DSS Level 1 servers — we never see them.
            </p>
            <div className="flex gap-3">
                <a
                    href="https://stripe.com/connect/express"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#635BFF] text-white px-5 py-2 rounded-lg text-xs font-bold hover:bg-[#5048d4] transition-colors shadow-sm"
                >
                    Learn about Stripe Connect
                </a>
                <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                    Contact Support
                </button>
            </div>
        </div>
    </div>
);

export default BankAccount;
