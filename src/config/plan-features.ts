import type { PlanId } from './plan-limits';
import { meetsMinPlan } from './plan-limits';

export const PLAN_FEATURE_REQUIREMENTS: Record<string, PlanId> = {
  // Growth+ features
  'ai-assistant':               'growth',
  'ai-property-assistant':      'growth',
  'ai-application-assistant':   'growth',
  'recurring-transactions':     'growth',
  'bulk-payments':              'growth',
  'invoice-customization':      'growth',
  'custom-document-templates':  'growth',
  'service-pro-invoicing':      'growth',
  'maintenance-board':          'growth',
  'report-export':              'growth',
  'report-rentability':         'growth',
  'report-income-expense':      'growth',
  'report-tenant-statements':   'growth',
  'report-renters-insurance':   'growth',
  'report-maintenance':         'growth',
  'integrations':               'growth',
  'lead-ai-assistant':          'growth',

  // Pro+ features
  'custom-application-forms':   'pro',
  'auto-assign-maintenance':    'pro',
  'team-management':            'pro',
  'property-level-permissions': 'pro',
  'document-inspector':         'pro',
};

export const PLAN_FEATURE_LABELS: Record<string, string> = {
  'ai-assistant':               'AI Assistant',
  'ai-property-assistant':      'AI Property Assistant',
  'ai-application-assistant':   'AI Application Assistant',
  'recurring-transactions':     'Recurring Transactions',
  'bulk-payments':              'Bulk Payments',
  'invoice-customization':      'Invoice Customization & Tags',
  'custom-document-templates':  'Custom Document Templates',
  'service-pro-invoicing':      'Service Pro Invoicing & Statements',
  'maintenance-board':          'Maintenance Board',
  'report-export':              'Report Export',
  'report-rentability':         'Rentability Report',
  'report-income-expense':      'Income & Expense Reports',
  'report-tenant-statements':   'Property & Tenant Statements',
  'report-renters-insurance':   'Renters Insurance Report',
  'report-maintenance':         'Maintenance Requests Report',
  'integrations':               'Integrations',
  'lead-ai-assistant':          'AI Lead Assistant',
  'custom-application-forms':   'Custom Application Forms',
  'auto-assign-maintenance':    'Auto-assign Maintenance Requests',
  'team-management':            'Team Management & Permissions',
  'property-level-permissions': 'Property-level Permissions',
  'document-inspector':         'Document Inspector',
};

export function canAccessFeature(planId: string, feature: string): boolean {
  const required = PLAN_FEATURE_REQUIREMENTS[feature];
  if (!required) return true;
  return meetsMinPlan(planId, required);
}

export function requiredPlanFor(feature: string): PlanId | null {
  return PLAN_FEATURE_REQUIREMENTS[feature] ?? null;
}
