import React, { useState } from "react";
import Button from "../../../../components/common/Button";
import { Check } from "lucide-react";
import { SubscriptionSettingsLayout } from "../../../../components/common/SubscriptionSettingsLayout";

const MyPlanSettings: React.FC = () => {
  const [accountMode, setAccountMode] = useState<"Landlord" | "Property Manager">("Landlord");

  return (
      <SubscriptionSettingsLayout
      activeTab="my-plan"
      headerActions={
        <>
          <Button
            variant="primary"
            className="bg-[#486370] hover:bg-[#486370] text-white px-5 py-2 rounded-lg font-medium"
          >
            Change Plan
          </Button>
          <Button className="bg-[#7BD747] hover:bg-[#6bc238] text-white px-8 py-2 rounded-lg font-medium">
            Action
          </Button>
        </>
      }
    >
      {/* Current Plan Section */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Starter</h2>
            <p className="text-gray-600 mb-4 max-w-lg text-sm">
              Next payment of $18.00 (monthly) occurs on 21 Dec, 2025<br />
              you can upgrade or modify your account subscription at any time
            </p>
          </div>
          <Button className="bg-[#486370] hover:bg-[#3a505b] text-white px-5 py-2.5 rounded-lg text-sm font-medium">
            Switch to yearly
          </Button>
        </div>
      </section>

      {/* Account Mode Section */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Account mode</h3>
          <p className="text-gray-500 text-sm mt-1">
            Choose the mode of your account either "Landlord" or "Property Manager". You
            can switch between account modes at any time.
          </p>
          <button className="text-[#486370] text-sm font-medium mt-1 hover:underline">
            Learn more
          </button>
        </div>

        <div className="space-y-3">
          {/* Landlord Option */}
          <div
            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${accountMode === "Landlord"
              ? "bg-white border-[#7BD747]"
              : "bg-[#E6E6E6] border-gray-300"
              }`}
            onClick={() => setAccountMode("Landlord")}
          >
            <div className="flex gap-4">
              <div className={`mt-1 h-6 w-6 rounded flex items-center justify-center transition-colors ${accountMode === "Landlord" ? "bg-[#7BD747]" : "border-2 border-gray-500"
                }`}>
                {accountMode === "Landlord" && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">Landlord</h4>
                <p className="text-gray-500 text-sm mt-1 max-w-2xl">
                  For landlords who manage their own properties. This mode will assume you are the owner of all properties and will assist in managing your properties in an easy to use manner.
                </p>
              </div>
            </div>
          </div>

          {/* Property Manager Option */}
          <div
            className={`relative p-5 rounded-xl border-2 cursor-pointer transition-all ${accountMode === "Property Manager"
              ? "bg-white border-[#7BD747]"
              : "bg-[#E6E6E6] border-gray-300"
              }`}
            onClick={() => setAccountMode("Property Manager")}
          >
            <div className="flex gap-4">
              <div className={`mt-1 h-6 w-6 rounded flex items-center justify-center transition-colors ${accountMode === "Property Manager" ? "bg-[#7BD747]" : "border-2 border-gray-500"
                }`}>
                {accountMode === "Property Manager" && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
              </div>
              <div>
                <h4 className="font-bold text-gray-600 text-lg">Property Manager</h4>
                <p className="text-gray-500 text-sm mt-1 max-w-2xl">
                  For landlords who manage their own properties. This mode will assume you are the owner of all properties and will assist in managing your properties in an easy to use manner.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Button className="bg-[#486370] hover:bg-[#3a505b] text-white px-8 py-2 rounded-lg font-medium">
            Update
          </Button>
        </div>
      </section>

      {/* Billing History Section */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-900">Billing history</h2>
          <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-700">6/12/2025</span>
            <span className="text-gray-400">⇄</span>
            <span className="text-sm font-medium text-gray-700">6/12/2025</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#E8E8E8]">
          <table className="w-full">
            <thead>
              <tr className="bg-[#7CD947] text-white">
                <th className="py-3 px-4 text-left font-semibold text-sm">Status</th>
                <th className="py-3 px-4 text-left font-semibold text-sm">Date</th>
                <th className="py-3 px-4 text-left font-semibold text-sm">Amount</th>
                <th className="py-3 px-4 text-left font-semibold text-sm">Plan</th>
                <th className="py-3 px-4 text-left font-semibold text-sm">Billing period</th>
                <th className="py-3 px-4 text-left font-semibold text-sm">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {[
                { status: "Paid", date: "Nov 22, 2025", amount: "$18.00", plan: "Subscription: Starter", period: "Monthly" },
                { status: "Failed", date: "Nov 21, 2025", amount: "$18.00", plan: "Subscription: Starter", period: "Monthly" },
                { status: "Failed", date: "Nov 19, 2025", amount: "$18.00", plan: "Subscription: Starter", period: "Monthly" },
              ].map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className={`py-4 px-4 text-sm font-medium ${row.status === "Paid" ? "text-green-600" : "text-red-500"}`}>
                    {row.status}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-600">{row.date}</td>
                  <td className="py-4 px-4 text-sm text-gray-900 font-medium">{row.amount}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{row.period}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{row.plan}</td>
                  <td className="py-4 px-4">
                    <button className="text-gray-900 font-bold text-sm hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SubscriptionSettingsLayout>
  );
};

export default MyPlanSettings;
