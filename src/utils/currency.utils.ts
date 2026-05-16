/**
 * Get currency symbol based on country code
 * @param countryCode - ISO country code (e.g., 'US', 'IN', 'GB')
 * @returns Currency symbol string
 */
export const getCurrencySymbol = (_countryCode?: string): string => {
  return '$';
};

/**
 * Format amount with currency
 * @param amount - The numeric amount to format
 * @param currency - The currency code (unused, always USD)
 * @returns Formatted money string
 */
export const formatMoney = (amount: number, _currency?: string): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
