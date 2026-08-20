import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { isValidPincode, countryName } from '../src/utils/pincode.utils.ts';

/**
 * A postal code is only meaningful next to its country.
 *
 * The check used to run against validator's 'any' locale, which passes a code
 * that is valid in *any* of 70 countries. So the Add Property form, which
 * already knows the country, happily accepted "0000000" and "123" for a US
 * address. Validating against the selected country is the whole point.
 */
describe('isValidPincode', () => {
  test('rejects empty input', () => {
    for (const v of ['', '   ', null, undefined]) {
      assert.equal(isValidPincode(v as string, 'US'), false, `${JSON.stringify(v)} should be invalid`);
    }
  });

  describe('validates against the given country', () => {
    const cases: Array<[string, string, boolean]> = [
      // country, value, expected
      ['US', '90210', true],
      ['US', '12345-6789', true],
      ['US', '123', false],        // the reported bug
      ['US', '1234', false],       // the reported bug
      ['US', '0000000', false],    // the reported bug
      ['US', 'ABCDE', false],
      ['US', '!!!!!', false],

      ['GB', 'SW1A 1AA', true],
      ['GB', '90210', false],      // a US ZIP is not a UK postcode

      ['CA', 'K1A 0B1', true],
      ['CA', '90210', false],

      ['IN', '560001', true],
      ['IN', '123', false],

      ['DE', '10115', true],
      ['DE', 'SW1A 1AA', false],
    ];

    for (const [country, value, expected] of cases) {
      test(`${country}: ${JSON.stringify(value)} -> ${expected}`, () => {
        assert.equal(isValidPincode(value, country), expected);
      });
    }
  });

  test('falls back to any-country when validator has no rules for that country', () => {
    // Validator covers 70 countries. Someone in the other ~125 must still be
    // able to save an address, so an unknown country accepts any recognised
    // format rather than rejecting everything.
    assert.equal(isValidPincode('90210', 'ZW'), true);
    assert.equal(isValidPincode('SW1A 1AA', 'ZW'), true);
    assert.equal(isValidPincode('!!!!!', 'ZW'), false, 'garbage is still garbage');
  });

  test('falls back to any-country when no country is given', () => {
    // Call sites that have no country field to hand keep working.
    assert.equal(isValidPincode('90210'), true);
    assert.equal(isValidPincode('SW1A 1AA'), true);
    assert.equal(isValidPincode('abcdef'), false);
  });

  test('accepts a lowercase or padded country code', () => {
    assert.equal(isValidPincode('SW1A 1AA', 'gb'), true);
    assert.equal(isValidPincode('90210', ' us '), true);
  });

  test('trims the value before checking', () => {
    assert.equal(isValidPincode('  90210  ', 'US'), true);
  });
});

describe('countryName', () => {
    test('names the country so the error can say which format is expected', () => {
      assert.equal(countryName('US'), 'United States');
      assert.equal(countryName('GB'), 'United Kingdom');
      assert.equal(countryName('in'), 'India');
    });

    test('returns null when the code is unknown or missing', () => {
      for (const v of ['', '  ', 'ZZZ', null, undefined]) {
        assert.equal(countryName(v as string), null, `${JSON.stringify(v)} should have no name`);
      }
    });
  });
