export type AutoFillField = {
  /** What the chip says, and what an older saved template carries as text. */
  label: string;
  /** The `{{token}}` written into the template body. */
  token: string;
  description: string;
  group: 'Lease' | 'Tenant' | 'Property' | 'Money' | 'Utilities' | 'General';
  /**
   * True when DocumentsService.renderTemplate resolves this from the lease on
   * its own. The rest are still real placeholders; the wizard collects them
   * from the user before rendering.
   */
  resolvedFromLease?: boolean;
};

/**
 * Every auto fill element, tied to the token it writes.
 *
 * One list on purpose. The chips, the editor node and the renderer all read
 * from here, so a label can never drift away from the token it is supposed to
 * produce — which is how "Lease Start Date" ended up in finished leases as
 * those three words instead of a date.
 */
export const AUTO_FILL_FIELDS: AutoFillField[] = [
  // Lease
  {
    label: 'Lease Start Date',
    token: 'startDate',
    description: 'Date the tenancy begins.',
    group: 'Lease',
    resolvedFromLease: true,
  },
  {
    label: 'Lease End Date',
    token: 'endDate',
    description: 'Date the tenancy ends.',
    group: 'Lease',
    resolvedFromLease: true,
  },
  {
    label: 'Lease Number',
    token: 'leaseNumber',
    description: 'Reference number for this lease.',
    group: 'Lease',
    resolvedFromLease: true,
  },
  {
    label: "Today's Date",
    token: 'todayDate',
    description: 'Date the document is generated.',
    group: 'General',
    resolvedFromLease: true,
  },

  // Tenant
  {
    label: 'Tenant Full Name',
    token: 'tenantName',
    description: 'Tenant name, including any joint tenants on the lease.',
    group: 'Tenant',
    resolvedFromLease: true,
  },
  {
    label: 'Tenant Email',
    token: 'tenantEmail',
    description: 'Email address on the tenancy.',
    group: 'Tenant',
    resolvedFromLease: true,
  },
  {
    label: 'Emergency Contact Email',
    token: 'emergencyContactEmail',
    description: 'Emergency contact for the tenant.',
    group: 'Tenant',
  },

  // Property
  {
    label: 'Property Address',
    token: 'propertyAddress',
    description: 'Full address of the let property.',
    group: 'Property',
    resolvedFromLease: true,
  },
  {
    label: 'Property Name',
    token: 'propertyName',
    description: 'Name the property is listed under.',
    group: 'Property',
    resolvedFromLease: true,
  },
  {
    label: 'Number of Baths',
    token: 'numberOfBaths',
    description: 'Bathroom count for the property.',
    group: 'Property',
  },
  {
    label: 'List of Equipment',
    token: 'listOfEquipment',
    description: 'Appliances and equipment included.',
    group: 'Property',
  },

  // Money
  {
    label: 'Monthly Rent',
    token: 'monthlyRent',
    description: 'Full monthly rent amount.',
    group: 'Money',
    resolvedFromLease: true,
  },
  {
    label: 'Prorated Rent',
    token: 'proratedRent',
    description: 'Rent for the part-month the tenancy starts in.',
    group: 'Money',
    resolvedFromLease: true,
  },
  {
    label: 'Security Deposit',
    token: 'depositAmount',
    description: 'Deposit held for the tenancy.',
    group: 'Money',
    resolvedFromLease: true,
  },
  {
    label: 'Holding Deposit',
    token: 'holdingDeposit',
    description: 'Deposit taken to hold the property.',
    group: 'Money',
  },
  {
    label: 'Daily Rent Late Fees',
    token: 'dailyRentLateFees',
    description: 'Amount charged per day once rent is late.',
    group: 'Money',
  },
  {
    label: 'Pet Charge',
    token: 'petCharge',
    description: 'Pet rent or one-off pet fee.',
    group: 'Money',
  },

  // Utilities
  {
    label: 'Electricity Provider',
    token: 'electricityProvider',
    description: 'Supplier for electricity.',
    group: 'Utilities',
  },
  {
    label: 'Gas Provider',
    token: 'gasProvider',
    description: 'Supplier for gas.',
    group: 'Utilities',
  },
  {
    label: 'Internet Provider',
    token: 'internetProvider',
    description: 'Supplier for internet.',
    group: 'Utilities',
  },
  {
    label: 'Landlord Utilities',
    token: 'landlordUtilities',
    description: 'Utilities the landlord pays for.',
    group: 'Utilities',
  },
];

/**
 * The labels the original chip list offered.
 *
 * Templates saved before tokens existed carry these as plain text, so they
 * have to keep resolving for an old template to heal when it is reopened.
 */
export const LEGACY_LABELS = [
  'Emergency Contact Email',
  'Daily Rent Late Fees',
  'Electricity Provider',
  'Gas Provider',
  'Holding Deposit',
  'Internet Provider',
  'Landlord Utilities',
  'Lease Number',
  'Lease Start Date',
  'List of Equipment',
  'Number of Baths',
  'Pet Charge',
];

const BY_LABEL = new Map(AUTO_FILL_FIELDS.map((f) => [f.label, f]));

export function fieldForLabel(label: string): AutoFillField | undefined {
  return BY_LABEL.get(label);
}

export function tokenForLabel(label: string): string | undefined {
  return BY_LABEL.get(label)?.token;
}

const BY_TOKEN = new Map(AUTO_FILL_FIELDS.map((f) => [f.token, f]));

export function labelForToken(token: string): string | undefined {
  return BY_TOKEN.get(token)?.label;
}
