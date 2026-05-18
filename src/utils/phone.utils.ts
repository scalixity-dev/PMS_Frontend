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
  
  return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

