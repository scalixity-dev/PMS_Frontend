/**
 * Formats a phone number string to US format: XXX-XXX-XXXX
 * Works well for as-you-type formatting.
 * @param value The phone number string to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (value: string | null | undefined): string => {
  if (!value) return '';
  
  // Strip all non-digits
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  
  if (phoneNumberLength < 4) return phoneNumber;
  
  if (phoneNumberLength < 7) {
    return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
  }
  
  // Anything past the 10th digit used to be dropped on the floor, so typing an
  // international number silently lost its tail. Keep the rest in the last
  // group instead - the backend accepts up to 15 digits.
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 15)}`;
};

/**
 * Pulls the dialling code out of the country-code selector value.
 *
 * The selector stores `${isoCode}|${phonecode}` (e.g. "IN|91") because it needs
 * the ISO code to render the flag. Only the second half is a phone country
 * code; sending the whole value - or splitting it into the country-code and
 * number fields, which is what this used to do - is rejected by the backend.
 *
 * @param selectorValue Raw selector value, or a bare dialling code
 * @returns Normalised code such as "+91", or undefined when nothing was chosen
 */
export const extractDialCode = (
  selectorValue: string | null | undefined,
): string | undefined => {
  if (!selectorValue) return undefined;
  const raw = selectorValue.includes('|')
    ? selectorValue.split('|')[1]
    : selectorValue;
  const digits = (raw ?? '').replace(/\D/g, '');
  return digits ? `+${digits}` : undefined;
};

/**
 * Strips display formatting so only digits reach the API.
 *
 * The phone input formats as you type (XXX-XXX-XXXX), but the backend requires
 * bare digits, so the hyphens have to come off before the request.
 *
 * @param value Formatted or raw phone number
 * @returns Digits only, or undefined when empty
 */
export const toPhoneDigits = (
  value: string | null | undefined,
): string | undefined => {
  const digits = (value ?? '').replace(/\D/g, '');
  return digits || undefined;
};
