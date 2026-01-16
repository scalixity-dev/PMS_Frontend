import { useState, useEffect } from "react";
import Button from "../../../../components/common/Button";
import { AccountSettingsLayout } from "../../../../components/common/AccountSettingsLayout";
import {
  useGetGoogleCalendarStatus,
  useGetGoogleCalendarConnectUrl,
  useDisconnectGoogleCalendar,
  useSyncGoogleCalendarEvents,
} from "../../../../hooks/useGoogleCalendarQueries";

export default function IntegrationSettings() {
  const { data: status, isLoading: statusLoading, refetch: refetchStatus } = useGetGoogleCalendarStatus();
  const connectUrlMutation = useGetGoogleCalendarConnectUrl();
  const disconnectMutation = useDisconnectGoogleCalendar();
  const syncMutation = useSyncGoogleCalendarEvents();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      const result = await connectUrlMutation.mutateAsync(undefined);
      // Redirect to Google OAuth
      window.location.href = result.authUrl;
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
        alert(`Success: ${decodeURIComponent(message)}`);
      }
      refetchStatus();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error) {
      alert(`Connection failed: ${decodeURIComponent(error)}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [refetchStatus]);

  const isConnected = status?.connected || false;
  const isLoading = statusLoading || connectUrlMutation.isPending || disconnectMutation.isPending || syncMutation.isPending;

  return (
    <AccountSettingsLayout activeTab="integrations">
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Connected apps</h2>
        <p className="text-xs text-gray-600">
          Connect property management tools, accounting platforms, and communication apps to keep everything in sync.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-4 flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-semibold text-gray-900">Google Calendar</p>
              {isConnected && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Connected
                </span>
              )}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Sync tasks and reminders with your Google Calendar.
            </p>
            {isConnected && status?.email && (
              <p className="text-xs text-gray-500 mt-2">
                Connected as: {status.email}
              </p>
            )}
            {isConnected && status?.lastSyncedAt && (
              <p className="text-xs text-gray-500 mt-1">
                Last synced: {new Date(status.lastSyncedAt).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 flex flex-col gap-2">
            {isConnected ? (
              <>
                <Button
                  type="button"
                  variant="Active"
                  size="sm"
                  onClick={handleSync}
                  disabled={isLoading}
                  className="rounded-full !bg-[#3A6D6C] text-xs shadow-[0_4px_10px_rgba(58,109,108,0.45)] border-none hover:bg-[#2c5251] disabled:opacity-50"
                >
                  {syncMutation.isPending ? "Syncing..." : "Sync Now"}
                </Button>
                <Button
                  type="button"
                  variant="Active"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={isLoading}
                  className="rounded-full !bg-red-500 text-xs shadow-[0_4px_10px_rgba(239,68,68,0.45)] border-none hover:bg-red-600 disabled:opacity-50"
                >
                  {disconnectMutation.isPending ? "Disconnecting..." : "Disconnect"}
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="Active"
                size="sm"
                onClick={handleConnect}
                disabled={isLoading || isConnecting}
                className="mt-1 rounded-full !bg-[#7CD947] text-xs shadow-[0_4px_10px_rgba(124,217,71,0.45)] border-none hover:bg-[#6BC53B] disabled:opacity-50"
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </AccountSettingsLayout>
  );
}


