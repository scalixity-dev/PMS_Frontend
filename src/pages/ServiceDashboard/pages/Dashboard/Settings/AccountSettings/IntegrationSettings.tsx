import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ServiceBreadCrumb from "../../../../components/ServiceBreadCrumb";
import ServiceTabs from "../../../../components/ServiceTabs";
import DashboardButton from "../../../../components/DashboardButton";
import {
    useGetGoogleCalendarStatus,
    useGetGoogleCalendarConnectUrl,
    useDisconnectGoogleCalendar,
    useSyncGoogleCalendarEvents,
} from "../../../../../../hooks/useGoogleCalendarQueries";

const IntegrationSettings = () => {
    const navigate = useNavigate();
    const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useGetGoogleCalendarStatus();
    const connectUrlMutation = useGetGoogleCalendarConnectUrl();
    const disconnectMutation = useDisconnectGoogleCalendar();
    const syncMutation = useSyncGoogleCalendarEvents();

    const [activeTab, setActiveTab] = useState('integrations');
    const [isConnecting, setIsConnecting] = useState(false);

    const handleTabChange = (val: string) => {
        setActiveTab(val);
        if (val === 'profile') navigate('/service-dashboard/settings/profile');
        if (val === 'security') navigate('/service-dashboard/settings/security');
        if (val === 'notifications') navigate('/service-dashboard/settings/notifications');
    };

    const handleConnect = async () => {
        try {
            setIsConnecting(true);
            const result = await connectUrlMutation.mutateAsync(undefined);

            if (result && typeof result.authUrl === 'string' && result.authUrl.trim() !== '') {
                // Redirect to Google OAuth
                window.location.href = result.authUrl;
            } else {
                throw new Error("Invalid authentication URL received");
            }
        } catch (error: any) {
            console.error("Failed to get connect URL:", error);
            alert(error.message || "Failed to connect Google Calendar");
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (!confirm("Are you sure you want to disconnect Google Calendar?")) {
            return;
        }

        try {
            await disconnectMutation.mutateAsync();
            refetchStatus();
        } catch (error: any) {
            console.error("Failed to disconnect:", error);
            alert(error.message || "Failed to disconnect Google Calendar");
        }
    };

    const handleSync = async () => {
        try {
            const result = await syncMutation.mutateAsync({});
            alert(`Successfully synced ${result.count} calendar event${result.count !== 1 ? 's' : ''} from Google Calendar`);
            refetchStatus(); // Refresh status to update lastSyncedAt
        } catch (error: any) {
            console.error("Failed to sync calendar:", error);
            alert(error.message || "Failed to sync Google Calendar events");
        }
    };

    // Check for OAuth callback
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const success = urlParams.get("success");
        const message = urlParams.get("message");
        const error = urlParams.get("error");

        if (success === "true") {
            // Show success message
            if (message) {
                alert(`Success: ${message}`);
            }
            refetchStatus();
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (error) {
            alert(`Connection failed: ${error}`);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [refetchStatus]);

    const isConnected = status?.connected || false;
    const isLoading = statusLoading || connectUrlMutation.isPending || disconnectMutation.isPending || syncMutation.isPending;

    return (
        <div className="min-h-screen font-sans w-full max-w-full overflow-x-hidden">
            <div className="w-full">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <ServiceBreadCrumb
                        items={[
                            { label: 'Dashboard', to: '/service-dashboard' },
                            { label: 'Settings', to: '/service-dashboard/settings' },
                            { label: 'Integrations', active: true }
                        ]}
                    />
                </div>

                {/* Main Content Card */}
                <div className="bg-[#F6F6F6] rounded-[20px] shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
                        <h1 className="text-2xl font-semibold text-gray-800">Account settings</h1>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200 px-4 sm:px-6 pt-2">
                        <ServiceTabs
                            tabs={[
                                { label: 'Profile', value: 'profile' },
                                { label: 'Security', value: 'security' },
                                { label: 'Integrations', value: 'integrations' },
                                { label: 'Notifications', value: 'notifications' }
                            ]}
                            activeTab={activeTab}
                            onTabChange={handleTabChange}
                            className="border-none"
                        />
                    </div>

                    <div className="p-4 sm:p-8 space-y-8 sm:space-y-10">
                        <section className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-900">Connected apps</h2>
                            <p className="text-sm text-gray-600">
                                Connect property management tools, accounting platforms, and communication apps to keep everything in sync.
                            </p>
                        </section>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                            <div className="border border-[#E8E8E8] rounded-2xl bg-white shadow-lg px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-3">
                                <div className="space-y-1 sm:space-y-2">
                                    <div className="flex flex-wrap items-center gap-2 mb-1 sm:mb-2">
                                        <p className="text-base font-bold text-gray-900">Google Calendar</p>
                                        {isConnected && (
                                            <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded-full border border-green-100">
                                                Connected
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-[400px]">
                                        Sync tasks and reminders with your Google Calendar to stay on top of your schedule.
                                    </p>
                                    <div className="pt-2 sm:pt-3 space-y-1">
                                        {isConnected && status?.email && (
                                            <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                                                Connected as: <span className="text-gray-600 font-semibold">{status.email}</span>
                                            </p>
                                        )}
                                        {isConnected && status?.lastSyncedAt && (
                                            <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                                Last synced: <span className="text-gray-600 font-semibold">{new Date(status.lastSyncedAt).toLocaleString()}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto flex-shrink-0 flex flex-row sm:flex-col gap-2 border-t sm:border-t-0 pt-4 sm:pt-0 border-gray-50">
                                    {isConnected ? (
                                        <>
                                            <DashboardButton
                                                onClick={handleSync}
                                                disabled={isLoading}
                                                className="flex-1 sm:flex-none h-9 px-4 text-xs font-bold"
                                            >
                                                {syncMutation.isPending ? "Syncing..." : "Sync Now"}
                                            </DashboardButton>
                                            <button
                                                onClick={handleDisconnect}
                                                disabled={isLoading}
                                                className="flex-1 sm:flex-none h-9 px-4 text-xs font-bold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-red-200"
                                            >
                                                {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                                            </button>
                                        </>
                                    ) : (
                                        <DashboardButton
                                            onClick={handleConnect}
                                            disabled={isLoading || isConnecting}
                                            className="w-full sm:w-auto h-10 px-6 text-xs font-bold shadow-lg shadow-[#7BD747]/20"
                                        >
                                            {isConnecting ? "Connecting..." : "Connect"}
                                        </DashboardButton>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntegrationSettings;
