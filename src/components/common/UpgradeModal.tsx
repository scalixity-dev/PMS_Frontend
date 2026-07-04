import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import BaseModal from './modals/BaseModal';
import type { PlanId } from '../../config/plan-limits';

const PLAN_DISPLAY: Record<PlanId, { name: string; price: string; highlights: string[] }> = {
  starter: {
    name: 'Starter',
    price: '$15/mo',
    highlights: [
      'Online Rent Payments',
      'Maintenance Requests',
      'Listings & Applications',
      'Tenant Portal',
      'Property & Unit Management',
      'Basic Reports (Rent Roll)',
    ],
  },
  growth: {
    name: 'Growth',
    price: '$32/mo',
    highlights: [
      'Income & Expense Accounting',
      'Recurring Transactions',
      'AI Assistants',
      'Custom Document Templates',
      'Invoice Customization & Tags',
      'Advanced Reports',
      'Google Calendar Integration',
    ],
  },
  pro: {
    name: 'Pro',
    price: '$55/mo',
    highlights: [
      'Everything in Growth',
      'Custom Application Forms',
      'Auto-assign Maintenance',
      'Team Management & Permissions',
      'Property-level Permissions',
      'Document Inspector',
    ],
  },
  business: {
    name: 'Business',
    price: 'Custom pricing',
    highlights: [
      'Everything in Pro',
      'Unlimited Leases & Storage',
      'Dedicated Account Manager',
      'Priority Support',
      'Custom Integrations',
      'SLA Guarantees',
    ],
  },
};

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** The plan required to unlock the feature */
  requiredPlan: PlanId;
  /** Human-readable feature label e.g. "Team Management" */
  featureLabel: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ isOpen, onClose, requiredPlan, featureLabel }) => {
  const navigate = useNavigate();
  const plan = PLAN_DISPLAY[requiredPlan];

  const handleUpgrade = () => {
    onClose();
    navigate('/dashboard/settings/subscription/my-plan');
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title=""
      showCloseIcon
      headerBorder={false}
      footerBorder={false}
      maxWidth="max-w-lg"
      padding="px-6 pb-6 pt-2"
    >
      {/* Icon + heading */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[#E0EFEE] flex items-center justify-center mb-4">
          <Sparkles className="text-[#3A6D6C]" size={26} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-1">Upgrade to unlock this feature</h3>
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{featureLabel}</span> is available on the{' '}
          <span className="font-semibold text-[#3A6D6C]">{plan.name}</span> plan and above.
        </p>
      </div>

      {/* Plan card */}
      <div className="border border-[#3A6D6C]/20 rounded-xl p-4 mb-6 bg-[#F5FAF9]">
        <div className="flex items-center justify-between mb-3">
          <span className="font-bold text-gray-900 text-base">{plan.name} Plan</span>
          <span className="text-[#3A6D6C] font-bold text-base">{plan.price}</span>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
          {plan.highlights.map((item) => (
            <li key={item} className="flex items-start gap-1.5 text-sm text-gray-600">
              <Check size={13} className="text-[#3A6D6C] flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2">
        <button
          onClick={handleUpgrade}
          className="w-full flex items-center justify-center gap-2 bg-[#3A6D6C] text-white font-semibold py-3 rounded-xl hover:bg-[#2e5857] transition-colors text-sm"
        >
          Upgrade to {plan.name}
          <ArrowRight size={16} />
        </button>
        <button
          onClick={onClose}
          className="w-full text-gray-500 font-medium py-2 rounded-xl hover:bg-gray-50 transition-colors text-sm"
        >
          Maybe later
        </button>
      </div>
    </BaseModal>
  );
};

export default UpgradeModal;
