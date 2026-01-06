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
 * Get appropriate locale for a currency code
 * @param currency - The currency code (e.g. 'USD', 'INR', 'EUR')
 * @returns Locale string for proper number formatting
 */
const getLocaleForCurrency = (currency: string): string => {
  const currencyLocaleMap: Record<string, string> = {
    'INR': 'en-IN',  // Indian Rupee - uses lakhs/crores
    'BDT': 'en-IN',  // Bangladesh Taka - uses Indian number system
    'PKR': 'en-IN',  // Pakistan Rupee - uses Indian number system
    'LKR': 'en-IN',  // Sri Lankan Rupee - uses Indian number system
    'NPR': 'en-IN',  // Nepalese Rupee - uses Indian number system
    'USD': 'en-US',  // US Dollar
    'CAD': 'en-CA',  // Canadian Dollar
    'GBP': 'en-GB',  // British Pound
    'EUR': 'en-GB',  // Euro - using en-GB for consistent formatting
    'AUD': 'en-AU',  // Australian Dollar
    'NZD': 'en-NZ',  // New Zealand Dollar
    'JPY': 'ja-JP',  // Japanese Yen
    'CNY': 'zh-CN',  // Chinese Yuan
    'KRW': 'ko-KR',  // Korean Won
    'SGD': 'en-SG',  // Singapore Dollar
    'HKD': 'en-HK',  // Hong Kong Dollar
    'MYR': 'en-MY',  // Malaysian Ringgit
    'THB': 'th-TH',  // Thai Baht
    'IDR': 'id-ID',  // Indonesian Rupiah
    'PHP': 'en-PH',  // Philippine Peso
    'VND': 'vi-VN',  // Vietnamese Dong
    'AED': 'ar-AE',  // UAE Dirham
    'SAR': 'ar-SA',  // Saudi Riyal
    'ZAR': 'en-ZA',  // South African Rand
    'BRL': 'pt-BR',  // Brazilian Real
    'MXN': 'es-MX',  // Mexican Peso
    'CHF': 'de-CH',  // Swiss Franc
    'SEK': 'sv-SE',  // Swedish Krona
    'NOK': 'nb-NO',  // Norwegian Krone
    'DKK': 'da-DK',  // Danish Krone
    'PLN': 'pl-PL',  // Polish Zloty
    'RUB': 'ru-RU',  // Russian Ruble
    'TRY': 'tr-TR',  // Turkish Lira
  };

  return currencyLocaleMap[currency.toUpperCase()] || 'en-US'; // Default to en-US for Western-style formatting
};

/**
 * Format amount with currency
 * @param amount - The numeric amount to format
 * @param currency - The currency code (e.g. 'USD', 'INR', 'EUR')
 * @returns Formatted money string
 */
export const formatMoney = (amount: number, currency: string): string => {
  const locale = getLocaleForCurrency(currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};
