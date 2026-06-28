import { useSubscription } from '../context/SubscriptionContext';
import { canAccessFeature, requiredPlanFor, PLAN_FEATURE_LABELS } from '../config/plan-features';
import { getLimitForPlan, meetsMinPlan, type PlanId, type PlanLimitKey } from '../config/plan-limits';

const PLAN_DISPLAY_NAMES: Record<PlanId, string> = {
  starter: 'Starter',
  growth: 'Growth',
  pro: 'Pro',
  business: 'Business',
};

const PLAN_PRICES: Record<PlanId, string> = {
  starter: '$15/mo',
  growth: '$32/mo',
  pro: '$55/mo',
  business: 'Custom',
};

export interface PlanGateInfo {
  /** Whether the current plan has access */
  allowed: boolean;
  /** Minimum plan required (null if no gate) */
  requiredPlan: PlanId | null;
  /** Display name of the required plan e.g. "Pro" */
  requiredPlanName: string | null;
  /** Price string e.g. "$55/mo" */
  requiredPlanPrice: string | null;
  /** Human readable feature label */
  featureLabel: string;
}

export interface LimitInfo {
  /** Whether the current count is within the plan limit */
  withinLimit: boolean;
  /** The numeric limit (-1 = unlimited) */
  limit: number;
  /** True if the limit is Infinity */
  isUnlimited: boolean;
  /** Percentage used (0–100), capped at 100 */
  percentUsed: number;
  /** Whether the user is close to the limit (≥ 80 %) */
  isNearLimit: boolean;
}

export function usePlanFeatures() {
  const { planId, planName, isLoading } = useSubscription();

  function canAccess(feature: string): boolean {
    return canAccessFeature(planId, feature);
  }

  function planGateInfo(feature: string): PlanGateInfo {
    const required = requiredPlanFor(feature);
    const allowed = required ? meetsMinPlan(planId, required) : true;
    return {
      allowed,
      requiredPlan: required,
      requiredPlanName: required ? PLAN_DISPLAY_NAMES[required] : null,
      requiredPlanPrice: required ? PLAN_PRICES[required] : null,
      featureLabel: PLAN_FEATURE_LABELS[feature] ?? feature,
    };
  }

  function checkLimit(resource: PlanLimitKey, currentCount: number): LimitInfo {
    const limit = getLimitForPlan(planId, resource);
    const isUnlimited = !isFinite(limit);
    const percentUsed = isUnlimited ? 0 : Math.min(100, Math.round((currentCount / limit) * 100));
    return {
      withinLimit: isUnlimited || currentCount < limit,
      limit: isUnlimited ? -1 : limit,
      isUnlimited,
      percentUsed,
      isNearLimit: !isUnlimited && percentUsed >= 80,
    };
  }

  return {
    planId,
    planName,
    isLoading,
    canAccess,
    planGateInfo,
    checkLimit,
  };
}
