import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { pricingPlans } from "../../../../../pages/basewebsite/pricing/sections/PricingAndTableData";
import { subscriptionService } from "../../../../../services/subscription.service";
import type { Subscription } from "../../../../../services/subscription.service";

interface ChangePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: Subscription | null;
  onPlanChanged: (updatedSubscription: Subscription) => void;
}

interface FeatureItemProps {
  text: string;
  isDark?: boolean;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ text, isDark = false }) => (
  <div className="flex items-center space-x-1">
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8.10077" cy="8.10077" r="8.10077" fill={isDark ? 'white' : '#20CC95'} />
      <path d="M12.1878 5.05403C12.1273 4.99297 12.0552 4.9445 11.9758 4.91143C11.8964 4.87836 11.8113 4.86133 11.7253 4.86133C11.6393 4.86133 11.5541 4.87836 11.4748 4.91143C11.3954 4.9445 11.3233 4.99297 11.2628 5.05403L6.40948 9.91383L4.37044 7.86828C4.30757 7.80754 4.23334 7.75978 4.152 7.72773C4.07067 7.69567 3.98381 7.67995 3.8964 7.68146C3.80899 7.68298 3.72273 7.70169 3.64255 7.73654C3.56237 7.77139 3.48984 7.82169 3.4291 7.88457C3.36836 7.94745 3.3206 8.02167 3.28855 8.10301C3.25649 8.18435 3.24077 8.2712 3.24229 8.35861C3.2438 8.44602 3.26251 8.53228 3.29736 8.61246C3.33221 8.69264 3.38251 8.76517 3.44539 8.82591L5.94695 11.3275C6.00751 11.3885 6.07956 11.437 6.15894 11.4701C6.23833 11.5031 6.32348 11.5202 6.40948 11.5202C6.49548 11.5202 6.58062 11.5031 6.66001 11.4701C6.73939 11.437 6.81144 11.3885 6.872 11.3275L12.1878 6.01165C12.2539 5.95065 12.3067 5.87661 12.3428 5.7942C12.3789 5.7118 12.3975 5.62281 12.3975 5.53284C12.3975 5.44287 12.3789 5.35388 12.3428 5.27147C12.3067 5.18907 12.2539 5.11503 12.1878 5.05403Z" fill={!isDark ? 'white' : '#20CC95'} />
    </svg>
    <span className={isDark ? "text-white text-sm md:text-base" : "text-gray-600 text-sm md:text-base"}>
      {text}
    </span>
  </div>
);

const ChangePlanModal: React.FC<ChangePlanModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  onPlanChanged,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize with current subscription if available
  React.useEffect(() => {
    if (currentSubscription && isOpen) {
      setSelectedPlan(currentSubscription.planId);
      setIsYearly(currentSubscription.isYearly);
      setError(null);
    }
  }, [currentSubscription, isOpen]);

  if (!isOpen) return null;

  // Helper function to extract price from annualBillingText
  const extractAnnualPrice = (text: string): string => {
    const match = text.match(/\$[\d,]+\.?\d*/);
    if (match) {
      return match[0];
    }
    return text;
  };

  // Calculate monthly equivalent from annual price
  const getMonthlyEquivalent = (annualText: string): string => {
    const match = annualText.match(/\$[\d,]+\.?\d*/);
    if (match) {
      const annualPrice = parseFloat(match[0].replace('$', '').replace(',', ''));
      const monthlyPrice = (annualPrice / 12).toFixed(2);
      return `$${monthlyPrice} /m`;
    }
    return "";
  };

  const handlePlanChange = async () => {
    if (!selectedPlan) {
      setError("Please select a plan");
      return;
    }

    // Don't change if it's the same plan and billing cycle
    if (
      currentSubscription &&
      currentSubscription.planId.toLowerCase() === selectedPlan.toLowerCase() &&
      currentSubscription.isYearly === isYearly
    ) {
      onClose();
      return;
    }

    setIsChanging(true);
    setError(null);

    try {
      const updated = await subscriptionService.changePlan({
        planId: selectedPlan.toLowerCase(),
        isYearly,
      });
      onPlanChanged(updated);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change plan");
      console.error("Error changing plan:", err);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="bg-[#486370] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Change Subscription Plan</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Billing Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 rounded-lg p-1 flex gap-2">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  !isYearly
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  isYearly
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Plans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {pricingPlans.map((plan) => {
              const planId = plan.plan.toLowerCase();
              const isSelected = selectedPlan?.toLowerCase() === planId;
              const isCurrentPlan =
                currentSubscription?.planId.toLowerCase() === planId;
              const isDark = plan.isPro || false;
              const isCustomPricing = plan.priceText.toLowerCase() === "custom";

              const displayPrice = isYearly
                ? isCustomPricing
                  ? plan.annualBillingText.replace(" / mo", " /year")
                  : extractAnnualPrice(plan.annualBillingText) + " /year"
                : plan.priceText;

              const displaySubPrice = isYearly
                ? isCustomPricing
                  ? "Contact us for annual pricing"
                  : getMonthlyEquivalent(plan.annualBillingText) + " per month"
                : plan.annualBillingText;

              const cardBgClass = isSelected
                ? isDark
                  ? "bg-[#20CC95] text-white border-3 border-[#486370] shadow-md shadow-[#20CC95]"
                  : "bg-[#D7FFF2] border-3 border-[#486370] shadow-md"
                : isDark
                ? "bg-[#20CC95] text-white border-3 border-white shadow-md shadow-[#20CC95] hover:bg-[#006B49]"
                : "bg-[#D7FFF2] hover:shadow-md hover:shadow-[#20CC95] border-2 border-transparent";

              const textColorClass = isDark ? "text-white" : "text-gray-800";
              const descColorClass = isDark ? "text-white opacity-80" : "text-gray-600";
              const priceColorClass = isDark ? "text-white" : "text-gray-900";
              const subPriceColorClass = isDark ? "text-white opacity-80" : "text-gray-500";
              const includesColorClass = isDark ? "text-white" : "text-gray-900";

              return (
                <div
                  key={plan.plan}
                  onClick={() => setSelectedPlan(planId)}
                  className={`relative flex flex-col p-6 rounded-2xl transition-all duration-300 ${cardBgClass} h-full cursor-pointer ${
                    isCurrentPlan ? "ring-2 ring-[#7BD747]" : ""
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute top-2 right-2 bg-[#7BD747] text-white text-xs px-2 py-1 rounded-full font-semibold">
                      Current
                    </div>
                  )}

                  {isSelected && (
                    <div className="absolute top-2 left-2">
                      <div className="bg-[#486370] rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="min-h-28">
                    <div className="flex items-start justify-between">
                      <h3 className={`text-xl font-bold mb-2 ${textColorClass}`}>
                        {plan.plan}
                      </h3>
                      {plan.isPopular && (
                        <span className="bg-[#FEC74E] text-white text-xs px-2 py-1 font-semibold whitespace-nowrap shadow-md">
                          Popular
                        </span>
                      )}
                    </div>

                    <p className={`text-sm ${descColorClass}`}>{plan.description}</p>
                  </div>

                  <div className="min-h-20 mb-4">
                    <p className={`text-2xl font-bold ${priceColorClass} mb-1`}>
                      {displayPrice}
                    </p>
                    <p className={`text-xs ${subPriceColorClass}`}>{displaySubPrice}</p>
                  </div>

                  <div className="min-h-10 mb-4">
                    <p className={`text-base font-semibold ${includesColorClass}`}>
                      {plan.includesTitle}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {plan.features.slice(0, 3).map((feature, index) => (
                      <FeatureItem key={index} text={feature} isDark={isDark} />
                    ))}
                    {plan.features.length > 3 && (
                      <p className={`text-xs ${descColorClass}`}>
                        +{plan.features.length - 3} more features
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex gap-4 justify-end pt-4 border-t">
            <button
              onClick={onClose}
              disabled={isChanging}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handlePlanChange}
              disabled={isChanging || !selectedPlan}
              className="px-6 py-2 bg-[#486370] text-white rounded-lg font-medium hover:bg-[#3a505b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isChanging && (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isChanging ? "Changing Plan..." : "Change Plan"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePlanModal;

