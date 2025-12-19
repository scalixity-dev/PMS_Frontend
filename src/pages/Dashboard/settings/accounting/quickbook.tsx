import type { FC } from "react";
import { AccountingSettingsLayout } from "../../../../components/common/AccountingSettingsLayout";

const QuickbookSettings: FC = () => {
  return (
    <AccountingSettingsLayout activeTab="quickbook">
      <section>
        <div className="max-w-2xl space-y-3">
          <h2 className="text-xl font-semibold text-gray-900">QuickBooks Online</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            If you use QuickBooks Online, PMS can export your data (customers and vendors,
            invoices and payments) into your QuickBooks account. You need to authorize to connect
            to your QuickBooks Online account.
          </p>
          <button
            type="button"
            className="text-sm font-medium text-[#486370] hover:underline focus:outline-none"
          >
            Learn more
          </button>
        </div>
      </section>
    </AccountingSettingsLayout>
  );
};

export default QuickbookSettings;


