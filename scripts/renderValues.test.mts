import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildRenderValues } from '../src/pages/Dashboard/features/Documents/renderValues.ts';

/**
 * Blank form fields were wiping out the values the server had just resolved.
 *
 * The wizard seeds every detected variable with '' so the form renders a box
 * for each, then posts the whole map as `values`. renderTemplate merges
 * `{ ...autoValues, ...values }`, so a field the user left alone arrived as an
 * empty string and won, and the lease rendered with nothing where the start
 * date, the prorated rent or the tenant name should have been.
 *
 * It looked like the auto fill had failed. It had, but on the way out, not on
 * the way in.
 */
describe('buildRenderValues', () => {
  test('drops a value the user never filled in', () => {
    const values = buildRenderValues({
      tenantName: '',
      proratedRent: '',
      petCharge: '50',
    });

    assert.deepEqual(values, { petCharge: '50' });
  });

  test('drops whitespace-only values too', () => {
    // A stray space is still "the user did not fill this in".
    const values = buildRenderValues({ startDate: '   ', petCharge: '50' });

    assert.deepEqual(values, { petCharge: '50' });
  });

  test('keeps what the user actually typed, so it overrides the lease', () => {
    // Overriding is the point of the form: a one-off document may need a
    // different name or rent than the lease carries.
    const values = buildRenderValues({
      tenantName: 'Ada Lovelace',
      monthlyRent: '1200',
    });

    assert.equal(values.tenantName, 'Ada Lovelace');
    assert.equal(values.monthlyRent, '1200');
  });

  test('keeps a legitimate zero', () => {
    // "0" is a real answer for a pet charge or a late fee, and it is falsy.
    const values = buildRenderValues({ petCharge: '0' });

    assert.equal(values.petCharge, '0');
  });

  test('trims surrounding whitespace off a real value', () => {
    const values = buildRenderValues({ tenantName: '  Ada Lovelace  ' });

    assert.equal(values.tenantName, 'Ada Lovelace');
  });

  test('survives an empty map', () => {
    assert.deepEqual(buildRenderValues({}), {});
  });

  test('ignores null and undefined entries', () => {
    const values = buildRenderValues({
      a: undefined as unknown as string,
      b: null as unknown as string,
      c: 'kept',
    });

    assert.deepEqual(values, { c: 'kept' });
  });
});
