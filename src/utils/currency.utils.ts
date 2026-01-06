/**
 * Get currency symbol based on country code
 * @param countryCode - ISO country code (e.g., 'US', 'IN', 'GB')
 * @returns Currency symbol string
 */
export const getCurrencySymbol = (countryCode?: string): string => {
  if (!countryCode) return '$'; // Default to USD

  const currencyMap: Record<string, string> = {
    // Major currencies
    'US': '$',      // United States - USD
    'CA': 'C$',     // Canada - CAD
    'GB': '£',      // United Kingdom - GBP
    'AU': 'A$',     // Australia - AUD
    'NZ': 'NZ$',    // New Zealand - NZD
    'IN': '₹',      // India - INR
    'JP': '¥',      // Japan - JPY
    'CN': '¥',      // China - CNY
    'KR': '₩',      // South Korea - KRW
    'SG': 'S$',     // Singapore - SGD
    'HK': 'HK$',    // Hong Kong - HKD
    'MY': 'RM',     // Malaysia - MYR
    'TH': '฿',      // Thailand - THB
    'ID': 'Rp',     // Indonesia - IDR
    'PH': '₱',      // Philippines - PHP
    'VN': '₫',      // Vietnam - VND
    'BD': '৳',      // Bangladesh - BDT
    'PK': '₨',      // Pakistan - PKR
    'LK': 'Rs',     // Sri Lanka - LKR
    'AE': 'د.إ',    // UAE - AED
    'SA': '﷼',      // Saudi Arabia - SAR
    'EG': 'E£',     // Egypt - EGP
    'ZA': 'R',      // South Africa - ZAR
    'NG': '₦',      // Nigeria - NGN
    'KE': 'KSh',    // Kenya - KES
    'BR': 'R$',     // Brazil - BRL
    'MX': '$',      // Mexico - MXN
    'AR': '$',      // Argentina - ARS
    'CL': '$',      // Chile - CLP
    'CO': '$',      // Colombia - COP
    'PE': 'S/',     // Peru - PEN
    'EU': '€',      // Eurozone - EUR
    'DE': '€',      // Germany - EUR
    'FR': '€',      // France - EUR
    'IT': '€',      // Italy - EUR
    'ES': '€',      // Spain - EUR
    'NL': '€',      // Netherlands - EUR
    'BE': '€',      // Belgium - EUR
    'AT': '€',      // Austria - EUR
    'PT': '€',      // Portugal - EUR
    'IE': '€',      // Ireland - EUR
    'FI': '€',      // Finland - EUR
    'GR': '€',      // Greece - EUR
    'PL': 'zł',     // Poland - PLN
    'CZ': 'Kč',     // Czech Republic - CZK
    'HU': 'Ft',     // Hungary - HUF
    'RO': 'lei',    // Romania - RON
    'SE': 'kr',     // Sweden - SEK
    'NO': 'kr',     // Norway - NOK
    'DK': 'kr',     // Denmark - DKK
    'CH': 'CHF',    // Switzerland - CHF
    'RU': '₽',      // Russia - RUB
    'TR': '₺',      // Turkey - TRY
    'IL': '₪',      // Israel - ILS
  };

  return currencyMap[countryCode] || '$'; // Default to USD if country not found
};


/**
 * Format amount with currency
 * @param amount - The numeric amount to format
 * @param currency - The currency code (e.g. 'USD', 'INR', 'EUR')
 * @returns Formatted money string
 */
export const formatMoney = (amount: number, currency: string) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(amount);
