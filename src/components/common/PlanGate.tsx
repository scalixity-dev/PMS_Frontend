import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { usePlanFeatures } from '../../hooks/usePlanFeatures';
import UpgradeModal from './UpgradeModal';
import type { PlanId } from '../../config/plan-limits';

interface PlanGateProps {
  feature: string;
  children: React.ReactNode;
  /** Content to render when locked (overrides default locked overlay) */
  fallback?: React.ReactNode;
  /** If true, renders children blurred with an overlay instead of replacing them */
  overlay?: boolean;
}

const LockedBadge: React.FC<{ featureLabel: string; requiredPlan: PlanId; requiredPlanName: string }> = ({
  featureLabel,
  requiredPlan,
  requiredPlanName,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-3 py-10 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
          <Lock size={20} className="text-gray-400" />
        </div>
        <p className="text-sm text-gray-500 max-w-xs">
          <span className="font-semibold text-gray-700">{featureLabel}</span> requires the{' '}
          <span className="font-semibold">{requiredPlanName}</span> plan.
        </p>
        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-[#3A6D6C] text-white text-sm font-semibold rounded-lg hover:bg-[#2e5857] transition-colors"
        >
          Upgrade to {requiredPlanName}
        </button>
      </div>
      <UpgradeModal
        isOpen={open}
        onClose={() => setOpen(false)}
        requiredPlan={requiredPlan}
        featureLabel={featureLabel}
      />
    </>
  );
};

const LockedOverlay: React.FC<{ featureLabel: string; requiredPlan: PlanId; requiredPlanName: string }> = ({
  featureLabel,
  requiredPlan,
  requiredPlanName,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm rounded-lg cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <Lock size={18} className="text-gray-500" />
        </div>
        <p className="text-xs text-gray-500 font-medium">
          {featureLabel} · {requiredPlanName}+
        </p>
      </div>
      <UpgradeModal
        isOpen={open}
        onClose={() => setOpen(false)}
        requiredPlan={requiredPlan}
        featureLabel={featureLabel}
      />
    </>
  );
};

/**
 * Conditionally renders children only when the current subscription plan
 * meets the minimum requirement for `feature`. When locked, shows a
 * fallback or a default locked state with an upgrade prompt.
 *
 * Usage:
 *   <PlanGate feature="team-management">...</PlanGate>
 *   <PlanGate feature="ai-assistant" overlay>...</PlanGate>
 */
const PlanGate: React.FC<PlanGateProps> = ({ feature, children, fallback, overlay }) => {
  const { planGateInfo, isLoading } = usePlanFeatures();

  if (isLoading) return null;

  const { allowed, requiredPlan, requiredPlanName, featureLabel } = planGateInfo(feature);

  if (allowed) return <>{children}</>;

  if (fallback !== undefined) return <>{fallback}</>;

  if (overlay) {
    return (
      <div className="relative">
        <div className="pointer-events-none select-none opacity-40">{children}</div>
        <LockedOverlay
          featureLabel={featureLabel}
          requiredPlan={requiredPlan!}
          requiredPlanName={requiredPlanName!}
        />
      </div>
    );
  }

  return (
    <LockedBadge
      featureLabel={featureLabel}
      requiredPlan={requiredPlan!}
      requiredPlanName={requiredPlanName!}
    />
  );
};

export default PlanGate;
