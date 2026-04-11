import { useEffect, useState } from "react";
import Button from "../../../../components/common/Button";
import { AccountSettingsLayout } from "../../../../components/common/AccountSettingsLayout";
import { useGetSecuritySessions, useGetSettingsSection, useUpdateSettingsSection } from "../../../../hooks/useSettingsQueries";

interface LoginSession {
  id: string;
  location: string;
  device: string;
  ipAddress: string;
  lastActivity: string;
}

interface AccountSecuritySettingsValues {
  idVerificationStatus: "IN_PROGRESS" | "VERIFIED" | "REJECTED";
  twoStepAuthenticationEnabled: boolean;
  exportDataRequestedAt: string | null;
}

export default function SecuritySettings() {
  const { data: securityData, isLoading: isLoadingSecurity } = useGetSettingsSection<AccountSecuritySettingsValues>("account_security");
  const { data: sessionsData, isLoading: isLoadingSessions } = useGetSecuritySessions();
  const updateSecurity = useUpdateSettingsSection<AccountSecuritySettingsValues>("account_security");

  const [localValues, setLocalValues] = useState<AccountSecuritySettingsValues>({
    idVerificationStatus: "IN_PROGRESS",
    twoStepAuthenticationEnabled: false,
    exportDataRequestedAt: null,
  });

  useEffect(() => {
    if (securityData?.values) {
      setLocalValues({
        idVerificationStatus: (securityData.values.idVerificationStatus ?? "IN_PROGRESS") as AccountSecuritySettingsValues["idVerificationStatus"],
        twoStepAuthenticationEnabled: Boolean(securityData.values.twoStepAuthenticationEnabled),
        exportDataRequestedAt: (securityData.values.exportDataRequestedAt as string | null) ?? null,
      });
    }
  }, [securityData]);

  const sessions: LoginSession[] = sessionsData?.sessions ?? [];

  const handleEnable2FA = () => {
    const nextValues = {
      ...localValues,
      twoStepAuthenticationEnabled: !localValues.twoStepAuthenticationEnabled,
    };
    setLocalValues(nextValues);
    updateSecurity.mutate(nextValues);
  };

  const handleExportData = () => {
    const nextValues = {
      ...localValues,
      exportDataRequestedAt: new Date().toISOString(),
    };
    setLocalValues(nextValues);
    updateSecurity.mutate(nextValues);
  };

  const isBusy = isLoadingSecurity || updateSecurity.isPending;

  return (
    <AccountSettingsLayout activeTab="security">
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900">ID Verification</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold text-[#7CD947] bg-[#F0FAE8] border border-[#D7F0C2]">
                {localValues.idVerificationStatus.replace("_", " ")}
              </span>
            </div>
            <p className="text-xs text-gray-600">
              Identity verification is required to prevent fraud and increase security. TenantCloud works with Stripe
              to conduct identity verification online.
            </p>
            <a href="#" className="text-xs font-medium text-[#1E88E5] hover:underline inline-block">
              Learn more
            </a>
          </div>
          <Button type="button" variant="primary" className="w-full sm:w-auto whitespace-nowrap bg-[#3D7475] border-none">
            Continue
          </Button>
        </div>
      </section>

      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Export Data</h2>
            <p className="text-xs text-gray-600">
              Export your account data from all settings sections. Last export request is saved in your account settings.
            </p>
            {localValues.exportDataRequestedAt ? (
              <p className="text-xs text-gray-500">
                Last requested: {new Date(localValues.exportDataRequestedAt).toLocaleString()}
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
            Export
          </Button>
        </div>
      </section>

      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-4 sm:px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Two Steps Authentication</h2>
            <p className="text-xs text-gray-600">Enable or disable 2-step authentication for your account.</p>
            <p className="text-xs font-medium text-[#486370]">
              Status: {localValues.twoStepAuthenticationEnabled ? "Enabled" : "Disabled"}
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            className="w-full sm:w-auto whitespace-nowrap bg-[#3D7475] border-none"
            onClick={handleEnable2FA}
            disabled={isBusy}
          >
            {localValues.twoStepAuthenticationEnabled ? "Disable" : "Enable"}
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
    </AccountSettingsLayout>
  );
}
