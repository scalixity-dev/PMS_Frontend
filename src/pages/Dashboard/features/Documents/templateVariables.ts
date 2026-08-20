import { fieldForLabel, AUTO_FILL_FIELDS } from './autoFillFields.ts';

export type TemplateVariable = {
  key: string;
  label: string;
  required: boolean;
  type: 'text' | 'date' | 'number';
  /** The lease supplies this one, so the author is not asked for it. */
  autoFilled: boolean;
};

const BY_TOKEN = new Map(AUTO_FILL_FIELDS.map((f) => [f.token, f]));

const DATE_TOKENS = new Set([
  'startDate',
  'endDate',
  'moveInDate',
  'todayDate',
  'vacateDate',
  'effectiveDate',
  'inspectionDate',
]);

const NUMBER_TOKENS = new Set([
  'monthlyRent',
  'proratedRent',
  'depositAmount',
  'holdingDeposit',
  'petCharge',
  'lateFeeAmount',
  'dailyRentLateFees',
  'lateFeeGracePeriod',
  'nsfFee',
  'noticePeriodDays',
  'numberOfBeds',
  'numberOfBaths',
  'numberOfOccupants',
  'squareFeet',
  'leaseTermMonths',
  'oldRent',
  'newRent',
  'amountDue',
  'daysLate',
]);

/** "myCustomClause" -> "My Custom Clause", for placeholders typed by hand. */
const humanise = (token: string): string =>
  token
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .trim();

/**
 * The placeholders a template body contains.
 *
 * The Use-template wizard builds its variable form from this list, so anything
 * missing here is a value the author can never supply and which ships as a raw
 * `{{token}}`. Both the create wizard and the edit screen run it, because
 * editing used to save content without ever refreshing the variable list.
 *
 * A token that matches a chip takes that chip's label, so the form names the
 * field the same way the author picked it. Auto-filled tokens are marked and
 * not required: the lease provides them, and demanding them would mean
 * retyping the lease into a form to clear a red asterisk.
 */
export function extractTemplateVariables(content: string): TemplateVariable[] {
  const seen = new Set<string>();
  const vars: TemplateVariable[] = [];

  // \w+ only, so `{{ spaced }}` and `{{}}` are left alone rather than becoming
  // variables the renderer will never match.
  const regex = /\{\{(\w+)\}\}/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    const key = match[1];
    if (seen.has(key)) continue;
    seen.add(key);

    const field = BY_TOKEN.get(key);
    const autoFilled = Boolean(field?.resolvedFromLease);

    vars.push({
      key,
      label: field?.label ?? humanise(key),
      autoFilled,
      required: !autoFilled,
      type: DATE_TOKENS.has(key)
        ? 'date'
        : NUMBER_TOKENS.has(key)
          ? 'number'
          : 'text',
    });
  }

  return vars;
}

/** Kept for callers that only need the label lookup. */
export { fieldForLabel };
