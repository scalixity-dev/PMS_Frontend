import React, { useState } from "react";
import { AccountingSettingsLayout } from "../../../../components/common/AccountingSettingsLayout";
import Button from "../../../../components/common/Button";
import Toggle from "../../../../components/Toggle";
import { ChevronDown } from "lucide-react";

const InvoiceSettings: React.FC = () => {
  const [recurringDays, setRecurringDays] = useState("Days");
  const [oneTimeLateFee, setOneTimeLateFee] = useState(true);
  const [dailyLateFee, setDailyLateFee] = useState(false);
  const [gracePeriod, setGracePeriod] = useState("Grace Period");
  const [graceTime, setGraceTime] = useState("Time");

  return (
    <AccountingSettingsLayout activeTab="invoice">
      {/* Recurring invoice settings */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5">
        <h2 className="text-lg font-semibold text-gray-900">Recurring invoice settings</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          Set the default number of days early to post the recurring transactions before the
          invoice due date.
        </p>
        <button className="text-[#486370] text-sm font-medium mt-1 mb-4 hover:underline">
          Learn more
        </button>

        <div className="relative max-w-[200px] mb-6">
          <select
            value={recurringDays}
            onChange={(event) => setRecurringDays(event.target.value)}
            className="w-full appearance-none bg-white border border-[#E8E8E8] text-gray-500 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#7BD747]"
          >
            <option>Days</option>
            <option>1 Day</option>
            <option>2 Days</option>
            <option>3 Days</option>
            <option>7 Days</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>

        <Button className="bg-[#486370] hover:bg-[#3a505b] text-white px-8 py-2 rounded-lg font-medium text-sm">
          Update
        </Button>
      </section>

      {/* Global Rent Late Fee Settings */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 mt-4">
        <h2 className="text-lg font-semibold text-gray-900">Global Rent Late Fee Settings</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          The system will automatically generate the following late fee once the tenant&apos;s
          grace period has expired. Both fees may be simultaneously enabled which will cause the
          daily fee to begin including on the day following the monthly fee.
        </p>
        <button className="text-[#486370] text-sm font-medium mt-1 mb-4 hover:underline">
          Learn more
        </button>

        <div className="space-y-4 mb-2">
          <div className="flex items-center gap-3">
            <Toggle checked={oneTimeLateFee} onChange={setOneTimeLateFee} />
            <span className="text-sm font-semibold text-gray-700">One Time Rent Late Fee</span>
          </div>
          <div className="flex items-center gap-3">
            <Toggle checked={dailyLateFee} onChange={setDailyLateFee} />
            <span className="text-sm font-semibold text-gray-700">Daily Rent Late Fee</span>
          </div>
        </div>
      </section>

      {/* Grace period settings */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 mt-4">
        <h2 className="text-lg font-semibold text-gray-900">Grace period settings</h2>
        <p className="text-sm text-gray-500 mt-1 max-w-3xl">
          The system will automatically generate the following late fee once the tenant&apos;s
          grace period has expired. Both fees may be simultaneously enabled which will cause the
          daily fee to begin including on the day following the monthly fee.
        </p>
        <button className="text-[#486370] text-sm font-medium mt-1 mb-4 hover:underline">
          Learn more
        </button>

        <div className="flex gap-4 mb-6 mt-2">
          {/* Grace period days dropdown - same style as recurring invoice settings */}
          <div className="relative max-w-[200px] w-full">
            <select
              value={gracePeriod}
              onChange={(event) => setGracePeriod(event.target.value)}
              className="w-full appearance-none bg-white border border-[#E8E8E8] text-gray-500 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#7BD747]"
            >
              <option>Grace Period</option>
              <option>No grace period</option>
              <option>1 Day</option>
              <option>2 Days</option>
              <option>3 Days</option>
              <option>5 Days</option>
              <option>7 Days</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>

          {/* Grace period time dropdown - same visual style */}
          <div className="relative max-w-[200px] w-full">
            <select
              value={graceTime}
              onChange={(event) => setGraceTime(event.target.value)}
              className="w-full appearance-none bg-white border border-[#E8E8E8] text-gray-500 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#7BD747]"
            >
              <option>Time</option>
              <option>Start of day</option>
              <option>End of day</option>
              <option>12:00 PM</option>
              <option>11:59 PM</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        <Button className="bg-[#486370] hover:bg-[#3a505b] text-white px-8 py-2 rounded-lg font-medium text-sm">
          Update
        </Button>
      </section>
    </AccountingSettingsLayout>
  );
};

export default InvoiceSettings;
