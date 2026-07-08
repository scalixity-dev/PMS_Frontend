import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/common/Button";
import { Check, ChevronDown, XCircle, RefreshCw } from "lucide-react";
import { SubscriptionSettingsLayout } from "../../../../components/common/SubscriptionSettingsLayout";
import { subscriptionService, type Subscription, type BillingHistoryItem } from "../../../../services/subscription.service";
import ChangePlanModal from "./components/ChangePlanModal";
import DeleteConfirmationModal from "../../../../components/common/modals/DeleteConfirmationModal";
import { useToast } from "../../../../components/common/Toast";
import { API_ENDPOINTS } from "../../../../config/api.config";
import { useSubscription } from "../../../../context/SubscriptionContext";

import DatePicker from "../../../../components/ui/DatePicker";

const MyPlanSettings: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isTrialing, isExpired, daysLeftInTrial, trialEndsAt } = useSubscription();
  const [accountMode, setAccountMode] = useState<"Landlord" | "Property Manager">("Landlord");
  const [isModeUpdating, setIsModeUpdating] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [dateRange, setDateRange] = useState<{ startDate: Date | undefined; endDate: Date | undefined }>({
    startDate: undefined,
    endDate: undefined,
  });
  const [isChangePlanModalOpen, setIsChangePlanModalOpen] = useState(false);
  const [isActionDropdownOpen, setIsActionDropdownOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isSwitchBillingModalOpen, setIsSwitchBillingModalOpen] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isFiltered, setIsFiltered] = useState(false);
  const actionDropdownRef = useRef<HTMLDivElement>(null);

  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatDateTime = (dateString: string | null): string => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  // Format date for API (YYYY-MM-DD)
  const formatDateForApi = (date: Date | undefined): string | undefined => {
    if (!date) return undefined;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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

  // Load saved account mode
  useEffect(() => {
    fetch(API_ENDPOINTS.SETTINGS.GET_SECTION('subscription_account_mode'), { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => {
        const saved = data?.values?.accountMode;
        if (saved === 'Landlord' || saved === 'Property Manager') setAccountMode(saved);
      })
      .catch(() => {});
  }, []);

  const handleAccountModeUpdate = async () => {
    setIsModeUpdating(true);
    try {
      await fetch(API_ENDPOINTS.SETTINGS.UPDATE_SECTION('subscription_account_mode'), {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ values: { accountMode } }),
      });
      toast.success('Account mode updated');
    } catch {
      toast.error('Failed to update account mode');
    } finally {
      setIsModeUpdating(false);
    }
  };

  // Handle billing history date filter
  const handleDateFilter = async () => {
    setIsLoading(true);
    try {
      const billingData = await subscriptionService.getBillingHistory(
        formatDateForApi(dateRange.startDate),
        formatDateForApi(dateRange.endDate)
      );
      setBillingHistory(billingData.items);
      setIsFiltered(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load billing history");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearFilter = async () => {
    setDateRange({ startDate: undefined, endDate: undefined });
    setIsFiltered(false);
    setIsLoading(true);
    try {
      const billingData = await subscriptionService.getBillingHistory();
      setBillingHistory(billingData.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load billing history");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle switch to yearly/monthly — goes through changePlan so Stripe updates the price
  const handleSwitchBilling = async () => {
    if (!subscription) return;
    setIsUpdating(true);
    try {
      const updated = await subscriptionService.changePlan({
        planId: subscription.planId,
        isYearly: !subscription.isYearly,
      });
      setSubscription(updated);
      toast.success(
        !subscription.isYearly
          ? 'Switched to yearly billing. A prorated charge has been applied.'
          : 'Switched to monthly billing.'
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to switch billing cycle");
    } finally {
      setIsUpdating(false);
      setIsSwitchBillingModalOpen(false);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (actionDropdownRef.current && !actionDropdownRef.current.contains(e.target as Node)) {
        setIsActionDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const updated = await subscriptionService.cancel();
      setSubscription(updated);
      toast.success('Subscription cancelled. Access continues until the end of your billing period.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setIsCancelling(false);
      setIsCancelModalOpen(false);
    }
  };

  const handleReactivate = async () => {
    setIsReactivating(true);
    try {
      const updated = await subscriptionService.renew();
      setSubscription(updated);
      toast.success('Subscription reactivated successfully.');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to reactivate subscription');
    } finally {
      setIsReactivating(false);
      setIsActionDropdownOpen(false);
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


  return (
    <SubscriptionSettingsLayout
      activeTab="my-plan"
      headerActions={
        // While trialing/expired, the plan card already shows its own
        // "Change plan" / "Choose a plan" button — don't duplicate it here.
        subscription && !isTrialing && !isExpired && (
          <>
            <Button
              variant="primary"
              onClick={handleChangePlan}
              className="bg-[#486370] hover:bg-[#486370] text-white px-5 py-2 rounded-lg font-medium"
            >
              Change Plan
            </Button>
            <div className="relative" ref={actionDropdownRef}>
              <Button
                onClick={() => setIsActionDropdownOpen((o) => !o)}
                className="bg-[#7BD747] hover:bg-[#6bc238] text-white px-5 py-2 rounded-lg font-medium flex items-center gap-1"
              >
                Action <ChevronDown className="w-4 h-4" />
              </Button>
              {isActionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  {subscription.cancelledAt ? (
                    <button
                      onClick={handleReactivate}
                      disabled={isReactivating}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 text-left"
                    >
                      <RefreshCw className="w-4 h-4 text-green-600 shrink-0" />
                      {isReactivating ? 'Reactivating...' : 'Reactivate Subscription'}
                    </button>
                  ) : (
                    <button
                      onClick={() => { setIsActionDropdownOpen(false); setIsCancelModalOpen(true); }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                      Cancel Subscription
                    </button>
                  )}
                </div>
              )}
            </div>
          </>
        )
      }
    >
      {/* Current Plan Section */}
      <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5">
        {isLoading ? (
          <div className="text-center py-4 text-gray-500 text-sm">Loading subscription data...</div>
        ) : error ? (
          <div className="text-red-500 py-4 text-sm">{error}</div>
        ) : subscription ? (
          <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h2 className="text-xl font-bold text-gray-900">{subscription.planName}</h2>
                {isExpired ? (
                  <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-semibold">Trial Ended</span>
                ) : isTrialing ? (
                  <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Free Trial · {daysLeftInTrial === 0 ? 'Ends today' : `${daysLeftInTrial}d left`}
                  </span>
                ) : (
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">Active</span>
                )}
              </div>

              {/* Trial state */}
              {isTrialing && trialEndsAt && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Your free trial ends on{' '}
                    <span className="font-semibold text-gray-900">{formatDateTime(trialEndsAt)}</span>
                    {daysLeftInTrial > 0 && (
                      <> · <span className="text-amber-600 font-semibold">{daysLeftInTrial} day{daysLeftInTrial === 1 ? '' : 's'} remaining</span></>
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Add a payment method before your trial ends to continue without interruption.
                  </p>
                </div>
              )}

              {/* Expired state */}
              {isExpired && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-700 mb-1">Your trial has ended</p>
                  <p className="text-xs text-red-600">
                    Subscribe to a plan to restore access to all features. Your data is safe.
                  </p>
                </div>
              )}

              {/* Active paid subscription */}
              {!isTrialing && !isExpired && subscription.nextBillingDate && (
                subscription.cancelledAt ? (
                  <div className="mb-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <p className="text-sm font-semibold text-amber-800 mb-1">Cancellation scheduled</p>
                    <p className="text-xs text-amber-700">
                      Your subscription ends on <span className="font-semibold">{formatDate(subscription.nextBillingDate)}</span>.
                      {' '}You keep full access until then. Reactivate any time to continue.
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 mb-4 max-w-lg text-sm">
                    Next payment of <span className="font-semibold">${subscription.amount.toFixed(2)}</span>{' '}
                    ({subscription.isYearly ? "yearly" : "monthly"}) occurs on {formatDate(subscription.nextBillingDate)}
                    <br />
                    <span className="text-gray-400">you can upgrade or modify your account subscription at any time</span>
                  </p>
                )
              )}
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto shrink-0">
              {isExpired ? (
                <>
                  <Button
                    onClick={() => navigate('/dashboard/settings/subscription/my-card')}
                    className="bg-[#7BD747] hover:bg-[#6bc238] text-white px-6 py-2.5 rounded-lg text-sm font-semibold"
                  >
                    Add payment method
                  </Button>
                  <Button
                    onClick={handleChangePlan}
                    className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Choose a plan
                  </Button>
                </>
              ) : isTrialing ? (
                <>
                  <Button
                    onClick={() => navigate('/dashboard/settings/subscription/my-card')}
                    className="bg-[#7BD747] hover:bg-[#6bc238] text-white px-6 py-2.5 rounded-lg text-sm font-semibold"
                  >
                    Add payment method
                  </Button>
                  <Button
                    onClick={handleChangePlan}
                    className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50"
                  >
                    Change plan
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsSwitchBillingModalOpen(true)}
                  disabled={isUpdating}
                  className="bg-[#486370] hover:bg-[#3a505b] text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
                >
                  {isUpdating ? "Updating..." : `Switch to ${subscription.isYearly ? "monthly" : "yearly"}`}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-gray-500 py-4 text-sm">No subscription found</div>
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
          <Button
            className="bg-[#486370] hover:bg-[#3a505b] text-white px-8 py-2 rounded-lg font-medium disabled:opacity-50"
            onClick={handleAccountModeUpdate}
            disabled={isModeUpdating}
          >
            {isModeUpdating ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </section>

      {/* Billing History Section — hidden during trial (no real payments yet) */}
      {!isTrialing && <section className="border border-[#E8E8E8] rounded-2xl bg-[#FBFBFB] px-6 py-5 space-y-4">
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

            {(dateRange.startDate || dateRange.endDate) && !isFiltered && (
              <button
                onClick={handleDateFilter}
                className="text-[#486370] text-sm font-medium hover:underline sm:ml-2 mt-2 sm:mt-0"
              >
                Filter
              </button>
            )}
            {isFiltered && (
              <button
                onClick={handleClearFilter}
                className="text-red-500 text-sm font-medium hover:underline sm:ml-2 mt-2 sm:mt-0"
              >
                Clear filter
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
                    <td className="py-4 px-4 flex items-center gap-3">
                      {row.hostedInvoiceUrl ? (
                        <a
                          href={row.hostedInvoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-900 font-bold text-sm hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                      {row.invoicePdfUrl && (
                        <a
                          href={row.invoicePdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#486370] font-medium text-sm hover:underline"
                        >
                          PDF
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>}

      {/* Change Plan Modal */}
      <ChangePlanModal
        isOpen={isChangePlanModalOpen}
        onClose={() => setIsChangePlanModalOpen(false)}
        currentSubscription={subscription}
        onPlanChanged={handlePlanChanged}
      />

      {/* Cancel Subscription Confirmation */}
      <DeleteConfirmationModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleCancelSubscription}
        isLoading={isCancelling}
        title="Cancel Subscription"
        headerClassName="bg-[#486370]"
        confirmText="Yes, Cancel"
        confirmButtonClass="bg-red-600 text-white px-4 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm"
        message={
          <p className="text-gray-600 text-sm">
            Your subscription will be cancelled at the end of the current billing period.{' '}
            <span className="font-semibold text-gray-800">
              You'll keep access until {formatDate(subscription?.nextBillingDate ?? null)}.
            </span>
            <br /><br />
            You can reactivate at any time before that date.
          </p>
        }
      />

      {/* Switch Billing Cycle Confirmation */}
      <DeleteConfirmationModal
        isOpen={isSwitchBillingModalOpen}
        onClose={() => setIsSwitchBillingModalOpen(false)}
        onConfirm={handleSwitchBilling}
        isLoading={isUpdating}
        title={subscription?.isYearly ? "Switch to Monthly Billing" : "Switch to Yearly Billing"}
        headerClassName="bg-[#486370]"
        confirmText={subscription?.isYearly ? "Yes, Switch to Monthly" : "Yes, Switch to Yearly"}
        confirmButtonClass="bg-[#486370] text-white px-4 py-2.5 rounded-lg font-bold hover:bg-[#3a505b] transition-colors shadow-sm"
        message={
          <p className="text-gray-600 text-sm">
            {subscription?.isYearly ? (
              <>
                You'll be switched from yearly to monthly billing for your{' '}
                <span className="font-semibold text-gray-800">{subscription?.planName}</span> plan.
              </>
            ) : (
              <>
                You'll be switched from monthly to yearly billing for your{' '}
                <span className="font-semibold text-gray-800">{subscription?.planName}</span> plan.
                <br /><br />
                A prorated charge will be applied to your card on file immediately.
              </>
            )}
          </p>
        }
      />
    </SubscriptionSettingsLayout>
  );
};

export default MyPlanSettings;
