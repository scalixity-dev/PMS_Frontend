import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { landlordIcon as logo } from "../../utils/roleIcon";
import { pricingPlans, allFeatureTables } from "../basewebsite/pricing/sections/PricingAndTableData";
import { AppfolioPricingTable } from "../basewebsite/pricing/sections/FeaturesTable";
import RequestDemoCard from "../basewebsite/pricing/sections/RequestDemo";

const CheckIcon = ({ dark }: { dark?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 17 17" fill="none">
    <circle cx="8.1" cy="8.1" r="8.1" fill={dark ? "white" : "#20CC95"} />
    <path
      d="M12.19 5.05a1 1 0 00-1.41 0L6.41 9.91 4.37 7.87a1 1 0 00-1.41 1.41l2.5 2.5a1 1 0 001.41 0l5.32-5.32a1 1 0 000-1.41z"
      fill={dark ? "#20CC95" : "white"}
    />
  </svg>
);

interface PlanCardProps {
  plan: (typeof pricingPlans)[number];
  isYearly: boolean;
  onSelect: (planId: string) => void;
  loading: boolean;
  selectedPlan: string | null;
  isHighlighted: boolean;
  onHighlight: (planId: string) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isYearly,
  onSelect,
  loading,
  selectedPlan,
  isHighlighted,
  onHighlight,
}) => {
  const isPro = isHighlighted;
  const isCustom = plan.priceText.toLowerCase() === "custom";
  const isThisLoading = loading && selectedPlan === plan.plan.toLowerCase();

  // Yearly plans are discounted 20% off the list price (12 x monthly)
  const YEARLY_DISCOUNT = 0.2;

  const parsePrice = (text: string): number => {
    const match = text.match(/[\d,]+\.?\d*/);
    return match ? parseFloat(match[0].replace(/,/g, "")) : 0;
  };

  const formatPrice = (num: number): string => {
    const rounded = Math.round(num * 100) / 100;
    return `$${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(2)}`;
  };

  const monthlyPrice = parsePrice(plan.priceText);
  const listYearlyPrice = monthlyPrice * 12;
  const discountedYearlyPrice = listYearlyPrice * (1 - YEARLY_DISCOUNT);
  const discountedMonthlyEquivalent = discountedYearlyPrice / 12;

  const displayPrice = isYearly && isCustom
    ? plan.annualBillingText.replace(" / mo", " /yr")
    : plan.priceText;

  const displaySub = isYearly && isCustom
    ? "Contact us for annual pricing"
    : plan.annualBillingText;

  return (
    <div
      onClick={() => onHighlight(plan.plan.toLowerCase())}
      className={`relative flex flex-col rounded-2xl p-6 transition-all duration-200 border-2 cursor-pointer ${
        isPro
          ? "bg-[#20CC95] border-white shadow-xl shadow-[#20CC95]/30 text-white"
          : "bg-white border-gray-100 hover:border-[#20CC95] hover:shadow-lg shadow-sm"
      }`}
    >
      {plan.isPopular && (
        <span className="absolute -top-3 right-5 bg-[#FEC74E] text-white text-xs font-bold px-3 py-1 rounded-full shadow">
          Most Popular
        </span>
      )}

      <h3 className={`text-xl font-bold mb-1 ${isPro ? "text-white" : "text-gray-900"}`}>
        {plan.plan}
      </h3>
      <p className={`text-sm mb-5 ${isPro ? "text-white/80" : "text-gray-500"}`}>
        {plan.description}
      </p>

      <div className="mb-6">
        {isYearly && !isCustom ? (
          <>
            <div className="flex items-center flex-wrap gap-2">
              <p className={`text-3xl font-bold ${isPro ? "text-white" : "text-gray-900"}`}>
                {formatPrice(discountedYearlyPrice)}
              </p>
              <span className={`text-sm font-medium ${isPro ? "text-white/70" : "text-gray-400"}`}>/yr</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full text-[11px] font-bold px-2.5 py-1 shadow-sm ${
                  isPro ? "bg-white text-[#0f7a56]" : "bg-gradient-to-r from-[#FEC74E] to-[#FFA53E] text-white"
                }`}
              >
                <svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 9V3a1 1 0 011-1h6l9 9-8 8-9-9z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <circle cx="6" cy="6" r="1" fill="currentColor" />
                </svg>
                SAVE 20%
              </span>
            </div>
            <div className="flex items-baseline flex-wrap gap-x-2 mt-1">
              <span className={`text-xs line-through decoration-2 ${isPro ? "text-white/70" : "text-gray-400"}`}>
                {formatPrice(listYearlyPrice)}
              </span>
              <span className={`text-xs ${isPro ? "text-white/70" : "text-gray-400"}`}>
                {formatPrice(discountedMonthlyEquivalent)}/mo billed annually
              </span>
            </div>
          </>
        ) : (
          <>
            <p className={`text-3xl font-bold ${isPro ? "text-white" : "text-gray-900"}`}>
              {displayPrice}
            </p>
            <p className={`text-xs mt-1 ${isPro ? "text-white/70" : "text-gray-400"}`}>
              {displaySub}
            </p>
          </>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onSelect(plan.plan.toLowerCase());
        }}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 mb-6 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          isPro
            ? "bg-white text-gray-900 hover:bg-gray-100"
            : isCustom
            ? "bg-[#1a3a2f] text-white hover:bg-[#243d33]"
            : "bg-[#20CC95] text-white hover:bg-[#17a877]"
        }`}
      >
        {isThisLoading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span>Activating...</span>
          </>
        ) : isCustom ? (
          "Contact Sales"
        ) : (
          "Start 14-day free trial →"
        )}
      </button>

      <p className={`text-xs font-semibold mb-3 ${isPro ? "text-white" : "text-gray-700"}`}>
        {plan.includesTitle}
      </p>
      <ul className="space-y-2">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-sm">
            <CheckIcon dark={isPro} />
            <span className={isPro ? "text-white" : "text-gray-600"}>{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function SelectPlanPage() {
  const [isYearly, setIsYearly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [highlightedPlan, setHighlightedPlan] = useState<string>(
    () => pricingPlans.find((p) => p.isPopular)?.plan.toLowerCase() ?? pricingPlans[0].plan.toLowerCase()
  );
  const [isTableOpen, setIsTableOpen] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const userId = searchParams.get("userId") ?? "";
  const email = searchParams.get("email") ?? "";
  const isOAuth = searchParams.get("oauth") === "true";

  // Params are how the page is normally reached, but they do not survive a
  // refresh, a bookmark, or a link shared out of the address bar. Falling back
  // to the signed-in user keeps activation working from anywhere; without it
  // activateAccount posts an empty userId and fails with a confusing error.
  const resolveAccount = async (): Promise<{ userId: string; email: string }> => {
    if (userId) return { userId, email };
    const current = await authService.getCurrentUser();
    return { userId: current.userId, email: current.email };
  };

  const handleSelect = async (planId: string) => {
    if (planId === "business") {
      window.location.href = "mailto:support@smarttenantai.com?subject=Business Plan Inquiry";
      return;
    }

    setLoading(true);
    setSelectedPlan(planId);
    setError(null);

    try {
      const account = await resolveAccount();
      const result = await authService.activateAccount(account.userId, { planId, isYearly });

      // The cached /auth/me answer still says requiresPlanSelection, so the
      // guards would bounce the user straight back to this page. Drop it so the
      // next check sees the subscription that was just created.
      authService.invalidateCurrentUserCache();

      if (isOAuth || !result.requiresEmailVerification) {
        navigate("/dashboard", { replace: true });
      } else {
        navigate(
          `/otp?userId=${account.userId}&email=${encodeURIComponent(account.email)}&role=PROPERTY_MANAGER&activated=true`,
          { replace: true }
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to activate account. Please try again.");
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f7fdf9]">
      {/* Minimal header — logo only */}
      <header className="flex items-center justify-center py-6 border-b border-gray-100 bg-white">
        <img src={logo} alt="SmartTenantAI" className="h-8 w-8 rounded-md object-cover" />
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {/* Heading */}
        <div className="text-center mb-10">
          <p className="text-sm font-semibold text-[#20CC95] uppercase tracking-widest mb-2">
            Step 2 of 2
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Choose your plan
          </h1>
          <p className="text-gray-500 text-base">
            Start free for 14 days. No credit card required.
          </p>
        </div>

        {/* Monthly / Yearly toggle */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm font-medium ${!isYearly ? "text-gray-900" : "text-gray-400"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly((v) => !v)}
            className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
              isYearly ? "bg-[#20CC95]" : "bg-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
                isYearly ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? "text-gray-900" : "text-gray-400"}`}>
            Yearly
          </span>
        </div>

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm text-center">
            {error}
          </div>
        )}

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {pricingPlans.map((plan) => (
            <PlanCard
              key={plan.plan}
              plan={plan}
              isYearly={isYearly}
              onSelect={handleSelect}
              loading={loading}
              selectedPlan={selectedPlan}
              isHighlighted={highlightedPlan === plan.plan.toLowerCase()}
              onHighlight={setHighlightedPlan}
            />
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-10">
          You can upgrade, downgrade, or cancel anytime. By selecting a plan you agree to our{" "}
          <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>.
        </p>
      </main>

      <AppfolioPricingTable
        categories={allFeatureTables}
        isOpen={isTableOpen}
        onToggle={() => setIsTableOpen((v) => !v)}
        showTrialButtons={false}
      />

      <div className="mt-12 pb-16">
        <RequestDemoCard />
      </div>
    </div>
  );
}
