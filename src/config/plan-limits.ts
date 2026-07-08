export type PlanId = 'starter' | 'growth' | 'pro' | 'business';

export const PLAN_HIERARCHY: Record<PlanId, number> = {
  starter: 0,
  growth: 1,
  pro: 2,
  business: 3,
};

export function meetsMinPlan(userPlan: string, requiredPlan: PlanId): boolean {
  const userLevel = PLAN_HIERARCHY[userPlan.toLowerCase() as PlanId] ?? -1;
  return userLevel >= PLAN_HIERARCHY[requiredPlan];
}

const UNLIMITED = Infinity;

export const PLAN_LIMITS = {
  starter: {
    leases: 10,
    keysAndLocks: 5,
    equipment: 10,
    recurringRequests: 10,
    storageBytes: 1 * 1024 * 1024 * 1024,
    teamMembers: 0,
  },
  growth: {
    leases: 30,
    keysAndLocks: 15,
    equipment: 25,
    recurringRequests: 20,
    storageBytes: 10 * 1024 * 1024 * 1024,
    teamMembers: 1,
  },
  pro: {
    leases: 60,
    keysAndLocks: 100,
    equipment: 100,
    recurringRequests: 100,
    storageBytes: 25 * 1024 * 1024 * 1024,
    teamMembers: 3,
  },
  business: {
    leases: UNLIMITED,
    keysAndLocks: UNLIMITED,
    equipment: UNLIMITED,
    recurringRequests: UNLIMITED,
    storageBytes: UNLIMITED,
    teamMembers: UNLIMITED,
  },
} satisfies Record<PlanId, Record<string, number>>;

export type PlanLimitKey = keyof (typeof PLAN_LIMITS)['starter'];

export function getLimitForPlan(planId: string, resource: PlanLimitKey): number {
  const key = planId.toLowerCase() as PlanId;
  return PLAN_LIMITS[key]?.[resource] ?? UNLIMITED;
}

export const PLAN_LIMIT_DISPLAY: Record<PlanLimitKey, (limit: number) => string> = {
  leases: (n) => (isFinite(n) ? `${n} leases` : 'Unlimited leases'),
  keysAndLocks: (n) => (isFinite(n) ? `${n} keys & locks` : 'Unlimited keys & locks'),
  equipment: (n) => (isFinite(n) ? `${n} equipment items` : 'Unlimited equipment'),
  recurringRequests: (n) => (isFinite(n) ? `${n} recurring requests` : 'Unlimited recurring requests'),
  storageBytes: (n) => {
    if (!isFinite(n)) return 'Unlimited storage';
    const gb = n / (1024 * 1024 * 1024);
    return `${gb} GB storage`;
  },
  teamMembers: (n) => (isFinite(n) ? `${n} team member${n === 1 ? '' : 's'}` : 'Unlimited team members'),
};
