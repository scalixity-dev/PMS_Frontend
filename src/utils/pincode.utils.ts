import * as isPostalCodeNs from 'validator/lib/isPostalCode.js';

type PostalCodeCheck = (value: string, locale: string) => boolean;

/**
 * validator ships CommonJS, and the two bundlers disagree about its shape.
 *
 * Vite hands `default` back as the function itself. Node wraps module.exports,
 * so `default` is the object and the function is one level further down. Both
 * put `locales` on the namespace. Reading it wrong is quiet rather than loud:
 * an empty locale list sends every country down the 'any' path and the
 * country-specific check silently does nothing, which is exactly what happened
 * in the browser while the Node tests passed.
 */
const ns = isPostalCodeNs as unknown as {
  default?: unknown;
  locales?: string[];
};

const unwrap = (value: unknown): PostalCodeCheck => {
  let current = value;
  for (let depth = 0; depth < 3 && typeof current !== 'function'; depth += 1) {
    current = (current as { default?: unknown } | undefined)?.default;
  }
  if (typeof current !== 'function') {
    throw new Error('validator isPostalCode export could not be resolved');
  }
  return current as PostalCodeCheck;
};

const isPostalCode = unwrap(ns.default ?? ns);

/** ISO-3166-1 alpha-2 codes validator.js has a postal-code pattern for. */
const SUPPORTED = new Set<string>(ns.locales ?? []);

/**
 * Display name for an ISO-3166-1 alpha-2 code, or null if it is not one.
 *
 * Lets the error say "valid zip code for United Kingdom" rather than "valid
 * zip code", which is the difference between the user understanding why 90210
 * was rejected and thinking the form is broken. Uses Intl, already in every
 * browser we support, rather than shipping another country table.
 */
export const countryName = (country?: string | null): string | null => {
  const code = (country ?? '').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return null;

  try {
    const name = new Intl.DisplayNames(['en'], { type: 'region' }).of(code);
    // Intl echoes the input back when it does not recognise the region.
    return name && name !== code ? name : null;
  } catch {
    return null;
  }
};

/**
 * Validates a postal code, against its country when one is known.
 *
 * `country` is an ISO-3166-1 alpha-2 code, the same value the address forms
 * already hold (they source it from country-state-city). Pass it whenever the
 * form has it. Checking against 'any' instead means accepting a code valid in
 * any of validator's 70 countries, which let "0000000" and "123" through as US
 * ZIP codes on the Add Property form.
 *
 * Countries validator has no pattern for fall back to 'any', so the ~125 it
 * does not cover can still save an address. Garbage is still rejected there,
 * since it has to match some real country's format.
 */
export const isValidPincode = (
  value: string | null | undefined,
  country?: string | null,
): boolean => {
  const trimmed = (value ?? '').trim();
  if (!trimmed) return false;

  const code = (country ?? '').trim().toUpperCase();
  const locale = SUPPORTED.has(code) ? code : 'any';

  return isPostalCode(trimmed, locale);
};
