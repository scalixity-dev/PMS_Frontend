import React, { useState } from 'react';
import { AlertTriangle, XCircle, ArrowRight } from 'lucide-react';
import { usePlanFeatures } from '../../hooks/usePlanFeatures';
import UpgradeModal from './UpgradeModal';
import type { PlanLimitKey } from '../../config/plan-limits';

const RESOURCE_LABELS: Record<PlanLimitKey, string> = {
  leases: 'leases',
  keysAndLocks: 'keys & locks',
  equipment: 'equipment items',
  recurringRequests: 'recurring maintenance requests',
  storageBytes: 'storage',
};

const UPGRADE_FEATURE: Record<PlanLimitKey, string> = {
  leases: 'recurring-transactions', // nearest upgrade tier; business = unlimited
  keysAndLocks: 'recurring-transactions',
  equipment: 'recurring-transactions',
  recurringRequests: 'maintenance-board',
  storageBytes: 'recurring-transactions',
};

interface PlanLimitBannerProps {
  resource: PlanLimitKey;
  /** The number of existing records already created */
  currentCount: number;
  className?: string;
}

/**
 * Shows a warning banner when the user is at ≥80% of their plan limit,
 * or an error banner when they are at 100%. Returns null below 80%.
 */
const PlanLimitBanner: React.FC<PlanLimitBannerProps> = ({ resource, currentCount, className = '' }) => {
  const { checkLimit, planId } = usePlanFeatures();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const info = checkLimit(resource, currentCount);

  if (info.isUnlimited || (!info.isNearLimit && info.withinLimit)) return null;

  const isAtLimit = !info.withinLimit;
  const label = RESOURCE_LABELS[resource];
  const limitDisplay = info.limit === -1 ? 'Unlimited' : String(info.limit);

  const upgradeFeature = UPGRADE_FEATURE[resource];
  // Determine the required plan for the next tier
  const nextPlanId = planId === 'starter' ? 'growth' : planId === 'growth' ? 'pro' : 'business';
  const nextPlanName = nextPlanId.charAt(0).toUpperCase() + nextPlanId.slice(1);

  return (
    <>
      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${
          isAtLimit
            ? 'bg-red-50 border border-red-200 text-red-800'
            : 'bg-amber-50 border border-amber-200 text-amber-800'
        } ${className}`}
      >
        <div className="flex-shrink-0 mt-0.5">
          {isAtLimit
            ? <XCircle size={16} className="text-red-500" />
            : <AlertTriangle size={16} className="text-amber-500" />
          }
        </div>
        <div className="flex-1 min-w-0">
          {isAtLimit ? (
            <p>
              You've reached your <strong>{limitDisplay} {label}</strong> limit on the{' '}
              <strong className="capitalize">{planId}</strong> plan. Upgrade to add more.
            </p>
          ) : (
            <p>
              You're using <strong>{currentCount} of {limitDisplay} {label}</strong> on your{' '}
              <strong className="capitalize">{planId}</strong> plan ({info.percentUsed}% used).
            </p>
          )}
        </div>
        <button
          onClick={() => setUpgradeOpen(true)}
          className={`flex-shrink-0 flex items-center gap-1 font-semibold whitespace-nowrap ${
            isAtLimit ? 'text-red-700 hover:text-red-900' : 'text-amber-700 hover:text-amber-900'
          }`}
        >
          Upgrade to {nextPlanName}
          <ArrowRight size={14} />
        </button>
      </div>

      <UpgradeModal
        isOpen={upgradeOpen}
        onClose={() => setUpgradeOpen(false)}
        requiredPlan={nextPlanId as any}
        featureLabel={`More ${label}`}
      />
    </>
  );
};

export default PlanLimitBanner;
