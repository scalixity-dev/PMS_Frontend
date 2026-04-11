import type { FC } from "react";
import { AccountingSettingsLayout } from "../../../../components/common/AccountingSettingsLayout";
import Button from "../../../../components/common/Button";
import { useGetSettingsSection, useUpdateSettingsSection } from "../../../../hooks/useSettingsQueries";

interface QuickbookSettingsValues {
  isConnected: boolean;
  companyName: string;
  lastSyncedAt: string | null;
}

const QuickbookSettings: FC = () => {
  const { data, isLoading } = useGetSettingsSection<QuickbookSettingsValues>("accounting_quickbook");
  const updateSettings = useUpdateSettingsSection<QuickbookSettingsValues>("accounting_quickbook");

  const values = data?.values ?? {
    isConnected: false,
    companyName: "",
    lastSyncedAt: null,
  };

  const toggleConnection = () => {
    const nextValues = {
      ...values,
      isConnected: !values.isConnected,
      lastSyncedAt: values.isConnected ? values.lastSyncedAt : new Date().toISOString(),
    };
    updateSettings.mutate(nextValues);
  };

  return (
    <AccountingSettingsLayout activeTab="quickbook">
      <section>
        <div className="max-w-2xl space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">QuickBooks Online</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            If you use QuickBooks Online, SmartTenantAI can export your data (customers and vendors,
            invoices and payments) into your QuickBooks account. You need to authorize to connect
            to your QuickBooks Online account.
          </p>
          <p className="text-sm text-gray-500">
            Status: <span className="font-semibold">{values.isConnected ? "Connected" : "Not Connected"}</span>
          </p>
          {values.lastSyncedAt ? (
            <p className="text-sm text-gray-500">Last synced: {new Date(values.lastSyncedAt).toLocaleString()}</p>
          ) : null}
          <Button
            type="button"
            className="bg-[#486370] hover:bg-[#3a505b] text-white px-6 py-2 rounded-lg font-medium text-sm"
            onClick={toggleConnection}
            disabled={isLoading || updateSettings.isPending}
          >
            {values.isConnected ? "Disconnect" : "Connect"}
          </Button>
        </div>
      </section>
    </AccountingSettingsLayout>
  );
};

export default QuickbookSettings;
