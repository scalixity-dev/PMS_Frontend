import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  validateLeaseTerms,
  buildLeaseTermsPayload,
} from '../src/pages/Dashboard/features/Leases/leaseTerms.ts';

/**
 * Edit lease terms only ever saved two fields.
 *
 * Both call sites send startDate, endDate and notes and nothing else, and the
 * leases table has no lease-type or lease-name column at all, so Property,
 * Lease and Lease Type were inputs that discarded whatever was typed into
 * them. Worse, they were required: the modal refused to save until they looked
 * filled, on data the user had no way to correct.
 *
 * This is the logic behind the two fields that do save.
 */
const jan1 = new Date('2026-01-01T00:00:00.000Z');
const dec31 = new Date('2026-12-31T00:00:00.000Z');

describe('validateLeaseTerms', () => {
  test('accepts a start and end date in order', () => {
    assert.deepEqual(validateLeaseTerms({ startDate: jan1, endDate: dec31 }), {});
  });

  test('accepts a lease that starts and ends the same day', () => {
    assert.deepEqual(validateLeaseTerms({ startDate: jan1, endDate: jan1 }), {});
  });

  test('requires a start date', () => {
    const errors = validateLeaseTerms({ endDate: dec31 });
    assert.ok(errors.startDate, 'should flag the missing start date');
    assert.ok(!errors.endDate);
  });

  test('requires an end date', () => {
    const errors = validateLeaseTerms({ startDate: jan1 });
    assert.ok(errors.endDate);
  });

  test('rejects an end date before the start date', () => {
    const errors = validateLeaseTerms({ startDate: dec31, endDate: jan1 });
    assert.match(errors.endDate, /before start date/i);
  });

  test('does not block on fields this form cannot save', () => {
    // The regression guard. Property, lease name and lease type used to be
    // required here, so a lease whose property name did not resolve could not
    // have its dates edited at all.
    assert.deepEqual(validateLeaseTerms({ startDate: jan1, endDate: dec31 }), {});
  });
});

describe('buildLeaseTermsPayload', () => {
  test('sends dates as ISO strings, which is what the API accepts', () => {
    // The DTO validates with @IsDateString, so a display string is a 400.
    const payload = buildLeaseTermsPayload({ startDate: jan1, endDate: dec31 });

    assert.equal(payload.startDate, '2026-01-01T00:00:00.000Z');
    assert.equal(payload.endDate, '2026-12-31T00:00:00.000Z');
  });

  test('carries the end date the user picked, not the one it opened with', () => {
    // The reported bug: the payload kept arriving with the original end date.
    const picked = new Date('2026-12-07T00:00:00.000Z');
    const payload = buildLeaseTermsPayload({ startDate: jan1, endDate: picked });

    assert.equal(payload.endDate, '2026-12-07T00:00:00.000Z');
    assert.notEqual(payload.endDate, dec31.toISOString());
  });

  test('passes an existing ISO string straight through', () => {
    const payload = buildLeaseTermsPayload({
      startDate: '2026-01-01T00:00:00.000Z',
      endDate: '2026-12-31T00:00:00.000Z',
    });

    assert.equal(payload.startDate, '2026-01-01T00:00:00.000Z');
  });

  test('omits a date it cannot make sense of rather than sending junk', () => {
    const payload = buildLeaseTermsPayload({ startDate: undefined, endDate: dec31 });

    assert.ok(!('startDate' in payload) || payload.startDate === undefined);
    assert.equal(payload.endDate, '2026-12-31T00:00:00.000Z');
  });

  test('carries notes through untouched', () => {
    const payload = buildLeaseTermsPayload(
      { startDate: jan1, endDate: dec31 },
      'renewed for a year',
    );

    assert.equal(payload.notes, 'renewed for a year');
  });
});
