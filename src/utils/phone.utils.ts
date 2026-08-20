import { isValidPhoneNumber as libIsValidPhoneNumber } from 'libphonenumber-js';

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

/**
 * Validates a phone number against the numbering-plan rules of its own
 * dialling code, rather than a fixed digit count. "10 digits" is only true
 * for +1 (US/Canada) - other countries range from 7 to 15 digits, so a
 * single length check either rejects real numbers or accepts garbage.
 *
 * @param dialCode Selector value ("IN|91") or a bare dialling code ("+91")
 * @param nationalNumber The subscriber number, formatted or raw
 */
export const isValidPhoneNumber = (
  dialCode: string | null | undefined,
  nationalNumber: string | null | undefined,
): boolean => {
  const code = extractDialCode(dialCode);
  const digits = toPhoneDigits(nationalNumber);
  if (!code || !digits) return false;
  try {
    return libIsValidPhoneNumber(`${code}${digits}`);
  } catch {
    return false;
  }
};

/**
 * Validates a single free-text phone field that has no paired country-code
 * selector (e.g. a plain "Phone Number" input). Mirrors the backend's
 * IsValidPhoneNumber fallback: a leading "+" is validated as full E.164,
 * otherwise there's no country to check numbering-plan rules against, so
 * this only enforces the generic E.164 digit-count range (7-15).
 */
export const isValidPhoneNumberLoose = (
  value: string | null | undefined,
): boolean => {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return false;
  if (trimmed.startsWith('+')) {
    try {
      return libIsValidPhoneNumber(trimmed);
    } catch {
      return false;
    }
  }
  const digits = trimmed.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

/**
 * Builds the canonical E.164 string ("+919876543210") for storage/display,
 * or undefined when either half is missing.
 */
export const toE164 = (
  dialCode: string | null | undefined,
  nationalNumber: string | null | undefined,
): string | undefined => {
  const code = extractDialCode(dialCode);
  const digits = toPhoneDigits(nationalNumber);
  return code && digits ? `${code}${digits}` : undefined;
};
