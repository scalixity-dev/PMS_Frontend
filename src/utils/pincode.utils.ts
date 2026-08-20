import isPostalCodeLib from 'validator/lib/isPostalCode';

/**
 * Validates a pincode/zip/postal code against every country's format in
 * validator.js's pattern table, the same check the backend DTOs run
 * (`@IsPostalCode('any')`). A single generic regex either rejects real
 * codes (UK's "SW1A 1AA", Canada's "K1A 0B1") or accepts garbage, since
 * formats vary by country far more than phone numbers do.
 */
export const isValidPincode = (value: string | null | undefined): boolean => {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return false;
  return isPostalCodeLib(trimmed, 'any');
};
