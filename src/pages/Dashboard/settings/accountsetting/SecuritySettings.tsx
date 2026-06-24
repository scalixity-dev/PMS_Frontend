import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import { AccountSettingsLayout } from "../../../../components/common/AccountSettingsLayout";
import { useGetSecuritySessions, useGetSettingsSection, useUpdateSettingsSection } from "../../../../hooks/useSettingsQueries";
import TwoFactorModal from "../../../../components/common/TwoFactorModal";
import { twoFactorService } from "../../../../services/two-factor.service";
import { exportUserData } from "../../../../utils/export-user-data";
import { useToast } from "../../../../components/common/Toast";

interface LoginSession {
  id: string;
  location: string;
  device: string;
  ipAddress: string;
  lastActivity: string;
}

interface AccountSecuritySettingsValues {
  twoStepAuthenticationEnabled: boolean;
  exportDataRequestedAt: string | null;
}

export default function SecuritySettings() {
  const toast = useToast();
  const { data: securityData, isLoading: isLoadingSecurity } = useGetSettingsSection<AccountSecuritySettingsValues>("account_security");
  const { data: sessionsData, isLoading: isLoadingSessions } = useGetSecuritySessions();
  const updateSecurity = useUpdateSettingsSection<AccountSecuritySettingsValues>("account_security");

  const [localValues, setLocalValues] = useState<AccountSecuritySettingsValues>({
    twoStepAuthenticationEnabled: false,
    exportDataRequestedAt: null,
  });

  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (securityData?.values) {
      setLocalValues({
        twoStepAuthenticationEnabled: Boolean(securityData.values.twoStepAuthenticationEnabled),
        exportDataRequestedAt: (securityData.values.exportDataRequestedAt as string | null) ?? null,
      });
    }
  }, [securityData]);

  const sessions: LoginSession[] = sessionsData?.sessions ?? [];

  // Real TOTP 2FA status (source of truth is /2fa/status, not the settings blob).
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    twoFactorService.status().then((s) => setTwoFaEnabled(s.enabled)).catch(() => { /* ignore initial status failures */ });
  }, []);

  const refreshStatus = async () => {
    try {
      const s = await twoFactorService.status();
      setTwoFaEnabled(s.enabled);
      // Keep legacy settings blob in sync for existing consumers.
      const nextValues = { ...localValues, twoStepAuthenticationEnabled: s.enabled };
      setLocalValues(nextValues);
      updateSecurity.mutate(nextValues);
    } catch {
      /* noop */
    }
  };

  const handleEnable2FA = () => {
    setIsModalOpen(true);
  };

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      await exportUserData();
      const nextValues = { ...localValues, exportDataRequestedAt: new Date().toISOString() };
      setLocalValues(nextValues);
      updateSecurity.mutate(nextValues);
    } catch (err: any) {
      toast.error(err?.message || "Failed to export data");
    } finally {
      setIsExporting(false);
    }
  };

  const isBusy = isLoadingSecurity || updateSecurity.isPending || isExporting;

  return (
    <AccountSettingsLayout activeTab="security">
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
            <p className="text-xs text-gray-600">
              Download your account data as an Excel file (one sheet per section). Images are excluded.
            </p>
            {localValues.exportDataRequestedAt ? (
              <p className="text-xs text-gray-500">
                Last exported: {new Date(localValues.exportDataRequestedAt).toLocaleString()}
              </p>
            ) : null}
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto whitespace-nowrap bg-[#3D7475] border-none"
            onClick={handleExportData}
            disabled={isBusy}
          >
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </section>

      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Two Steps Authentication</h2>
            <p className="text-xs text-gray-600">Enable or disable 2-step authentication for your account.</p>
            <p className="text-xs font-medium text-[#486370]">
              Status: {twoFaEnabled ? "Enabled" : "Disabled"}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto whitespace-nowrap bg-[#3D7475] border-none"
            onClick={handleEnable2FA}
          >
            {twoFaEnabled ? "Disable" : "Enable"}
          </Button>
        </div>
      </section>

      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-4">
        <h2 className="text-lg font-semibold text-gray-900">Login sessions</h2>
        {(isLoadingSessions || isLoadingSecurity) ? (
          <p className="text-sm text-gray-600">Loading sessions...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E8E8E8]" style={{ backgroundColor: "#7CD947" }}>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white rounded-tl-lg">Location</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">Device</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white">IP Address</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-white rounded-tr-lg">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {sessions.length > 0 ? (
                  sessions.map((session) => (
                    <tr key={session.id} className="border-b border-[#E8E8E8]">
                      <td className="px-4 py-3 text-sm text-gray-600">{session.location}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{session.device}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{session.ipAddress}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{new Date(session.lastActivity).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-sm text-gray-500 text-center">No active sessions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
      <TwoFactorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={refreshStatus}
        currentlyEnabled={twoFaEnabled}
      />
    </AccountSettingsLayout>
  );
}
