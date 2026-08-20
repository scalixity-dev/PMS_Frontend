export type LeaseTermsDraft = {
  startDate?: Date | string;
  endDate?: Date | string;
};

export type LeaseTermsPayload = {
  startDate?: string;
  endDate?: string;
  notes?: string;
};

const toIso = (value: Date | string | undefined): string | undefined => {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString();
  if (typeof value === 'string' && value.trim()) return value;
  return undefined;
};

/**
 * Checks the only two fields Edit lease terms can actually save.
 *
 * Property, Lease and Lease Type used to be required here as well, which was
 * both pointless and harmful: the leases table has no lease-type or lease-name
 * column, and neither call site forwards them, so they were required inputs
 * whose values were thrown away. A lease whose property name did not resolve
 * could not have its dates edited at all.
 */
export function validateLeaseTerms(draft: LeaseTermsDraft): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!draft.startDate) errors.startDate = 'Start date is required';
  if (!draft.endDate) errors.endDate = 'End date is required';

  if (draft.startDate && draft.endDate) {
    const start = new Date(draft.startDate);
    const end = new Date(draft.endDate);
    if (end < start) errors.endDate = 'End date cannot be before start date';
  }

  return errors;
}

/**
 * Builds the PATCH /leases/:id body.
 *
 * Dates go as ISO strings because UpdateLeaseDto validates them with
 * `@IsDateString`, and the global ValidationPipe runs with
 * `forbidNonWhitelisted`, so a display string is a 400 rather than a silent
 * drop.
 */
export function buildLeaseTermsPayload(
  draft: LeaseTermsDraft,
  notes?: string,
): LeaseTermsPayload {
  return {
    startDate: toIso(draft.startDate),
    endDate: toIso(draft.endDate),
    notes,
  };
}
