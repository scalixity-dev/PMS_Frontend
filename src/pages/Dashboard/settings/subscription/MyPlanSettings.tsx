import React, { useState, useEffect } from "react";
import Button from "../../../../components/common/Button";
import { Check } from "lucide-react";
import { SubscriptionSettingsLayout } from "../../../../components/common/SubscriptionSettingsLayout";
import { subscriptionService, type Subscription, type BillingHistoryItem } from "../../../../services/subscription.service";
import ChangePlanModal from "./components/ChangePlanModal";

import DatePicker from "../../../../components/ui/DatePicker";

const MyPlanSettings: React.FC = () => {
  const [accountMode, setAccountMode] = useState<"Landlord" | "Property Manager">("Landlord");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate: Date | undefined; endDate: Date | undefined }>({
    startDate: undefined,
    endDate: undefined,
  });
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateForApi = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Check if subscription is expired
  const isSubscriptionExpired = (sub: Subscription | null): boolean => {
    if (!sub) return false;
    const now = new Date();
    const endDate = sub.endDate ? new Date(sub.endDate) : null;
    const isExpiredByDate = endDate && endDate < now;
    const isExpiredByStatus = sub.status === "EXPIRED" || sub.status === "PAST_DUE";
    return isExpiredByDate || isExpiredByStatus;
  };

  // Fetch subscription data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [subData, billingData] = await Promise.all([
          subscriptionService.getCurrent(),
          subscriptionService.getBillingHistory(),
        ]);
        setSubscription(subData);
        setBillingHistory(billingData.items);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load subscription data");
        console.error("Error fetching subscription:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle billing history date filter
  const handleDateFilter = async () => {
    setIsLoading(true);
    try {
      const billingData = await subscriptionService.getBillingHistory(
        formatDateForApi(dateRange.startDate),
        formatDateForApi(dateRange.endDate)
      );
      setBillingHistory(billingData.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load billing history");
      console.error("Error fetching billing history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle switch to yearly/monthly
  const handleSwitchBilling = async () => {
    if (!subscription) return;
    setIsUpdating(true);
    try {
      const updated = await subscriptionService.update({
        isYearly: !subscription.isYearly,
      });
      setSubscription(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update subscription");
      console.error("Error updating subscription:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle change plan modal
  const handleChangePlan = () => {
    setIsChangePlanModalOpen(true);
  };

  // Handle plan changed callback
  const handlePlanChanged = (updatedSubscription: Subscription) => {
    setSubscription(updatedSubscription);
    // Refresh billing history
    subscriptionService.getBillingHistory().then((data) => {
      setBillingHistory(data.items);
    });
  };

  // Handle renew subscription
  const handleRenew = async () => {
    if (!subscription) return;
    setIsRenewing(true);
    setError(null);
    try {
      const renewed = await subscriptionService.renew({
        isYearly: subscription.isYearly,
      });
      setSubscription(renewed);
      // Refresh billing history
      const billingData = await subscriptionService.getBillingHistory();
      setBillingHistory(billingData.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to renew subscription");
      console.error("Error renewing subscription:", err);
    } finally {
      setIsRenewing(false);
    }
  };

  return (
    <SubscriptionSettingsLayout
      activeTab="my-plan"
      headerActions={
        <>
          <Button
            variant="primary"
            onClick={handleChangePlan}
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
        {isLoading ? (
          <div className="text-center py-4">Loading subscription data...</div>
        ) : error ? (
          <div className="text-red-500 py-4">{error}</div>
        ) : subscription ? (
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-xl font-bold text-gray-900">{subscription.planName}</h2>
                {isSubscriptionExpired(subscription) && (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Expired
                  </span>
                )}
                {subscription.status === "TRIALING" && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Trial
                  </span>
                )}
              </div>
              <p className="text-gray-600 mb-4 max-w-lg text-sm">
                {isSubscriptionExpired(subscription) ? (
                  <>
                    <span className="text-red-600 font-semibold">Your subscription has expired.</span>
                    <br />
                    Renew now to continue using all features. Your plan: ${subscription.amount.toFixed(2)} ({subscription.isYearly ? "yearly" : "monthly"})
                    <br />
                    {subscription.endDate && (
                      <>
                        Expired on: {formatDate(subscription.endDate)}
                        <br />
                      </>
                    )}
                  </>
                ) : subscription.nextBillingDate ? (
                  <>
                    Next payment of ${subscription.amount.toFixed(2)} ({subscription.isYearly ? "yearly" : "monthly"}) occurs on {formatDate(subscription.nextBillingDate)}
                    <br />
                  </>
                ) : (
                  <>
                    Current plan: ${subscription.amount.toFixed(2)} ({subscription.isYearly ? "yearly" : "monthly"})
                    <br />
                  </>
                )}
                {!isSubscriptionExpired(subscription) && (
                  <>you can upgrade or modify your account subscription at any time</>
                )}
              </p>
            </div>
            <div className="flex flex-col gap-2 w-full md:w-auto">
              {isSubscriptionExpired(subscription) ? (
                <Button
                  onClick={handleRenew}
                  disabled={isRenewing}
                  className="bg-[#7BD747] hover:bg-[#6bc238] text-white px-6 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {isRenewing ? "Renewing..." : "Renew Subscription"}
                </Button>
              ) : (
                <Button
                  onClick={handleSwitchBilling}
                  disabled={isUpdating}
                  className="bg-[#486370] hover:bg-[#3a505b] text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : `Switch to ${subscription.isYearly ? "monthly" : "yearly"}`}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 py-4">No subscription found</div>
        )}
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
              <div className={`mt-1 h-6 w-6 shrink-0 rounded flex items-center justify-center transition-colors ${accountMode === "Landlord" ? "bg-[#7BD747]" : "border-2 border-gray-500"
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
              <div className={`mt-1 h-6 w-6 shrink-0 rounded flex items-center justify-center transition-colors ${accountMode === "Property Manager" ? "bg-[#7BD747]" : "border-2 border-gray-500"
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Billing history</h2>
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-40">
              <DatePicker
                placeholder="Start date"
                value={dateRange.startDate}
                onChange={(date) => setDateRange({ ...dateRange, startDate: date })}
                className="w-full border border-gray-200 shadow-sm"
                popoverClassName="min-w-[300px]"
              />
            </div>
            <span className="text-gray-400 rotate-90 sm:rotate-0">⇄</span>
            <div className="w-full sm:w-40">
              <DatePicker
                placeholder="End date"
                value={dateRange.endDate}
                onChange={(date) => setDateRange({ ...dateRange, endDate: date })}
                className="w-full border border-gray-200 shadow-sm"
                popoverClassName="min-w-[300px] right-0"
              />
            </div>

            {(dateRange.startDate || dateRange.endDate) && (
              <button
                onClick={handleDateFilter}
                className="text-[#486370] text-sm font-medium hover:underline sm:ml-2 mt-2 sm:mt-0"
              >
                Filter
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[#E8E8E8]">
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading billing history...</div>
          ) : billingHistory.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No billing history found</div>
          ) : (
            <table className="w-full min-w-[700px]">
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
                {billingHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className={`py-4 px-4 text-sm font-medium ${row.status === "Paid" || row.status === "Trial"
                      ? "text-green-600"
                      : "text-red-500"
                      }`}>
                      {row.status}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{formatDate(row.date)}</td>
                    <td className="py-4 px-4 text-sm text-gray-900 font-medium">${row.amount.toFixed(2)}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{row.plan}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{row.billingPeriod}</td>
                    <td className="py-4 px-4">
                      <button className="text-gray-900 font-bold text-sm hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Change Plan Modal */}
      <ChangePlanModal
        isOpen={isChangePlanModalOpen}
        onClose={() => setIsChangePlanModalOpen(false)}
        currentSubscription={subscription}
        onPlanChanged={handlePlanChanged}
      />
    </SubscriptionSettingsLayout>
  );
};

export default MyPlanSettings;
