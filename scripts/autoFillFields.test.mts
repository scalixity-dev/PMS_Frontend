import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  AUTO_FILL_FIELDS,
  fieldForLabel,
  tokenForLabel,
  LEGACY_LABELS,
} from '../src/pages/Dashboard/features/Documents/autoFillFields.ts';

/**
 * Auto fill elements did not auto fill anything.
 *
 * A dropped pill serialised as `<span class="auto-fill-pill">Lease Start
 * Date</span>` — the label as plain text. The renderer only substitutes
 * `{{token}}` patterns, so the finished lease said the words "Lease Start
 * Date" where the date belonged, and there was no sign anything was wrong
 * until the document went out.
 *
 * This catalogue is the one place a label is tied to its token, so the chips,
 * the editor node and the renderer cannot drift apart.
 */
describe('AUTO_FILL_FIELDS', () => {
  test('labels and tokens are both unique', () => {
    const labels = AUTO_FILL_FIELDS.map((f) => f.label);
    const tokens = AUTO_FILL_FIELDS.map((f) => f.token);

    assert.equal(new Set(labels).size, labels.length, 'duplicate label');
    assert.equal(new Set(tokens).size, tokens.length, 'duplicate token');
  });

  test('tokens are plain identifiers', () => {
    // The renderer splices the token into a RegExp. It escapes metacharacters,
    // but a token with a brace or a space would still never match the
    // `{{token}}` the editor writes.
    for (const { token } of AUTO_FILL_FIELDS) {
      assert.match(token, /^[A-Za-z][A-Za-z0-9]*$/, `${token} is not a plain identifier`);
    }
  });

  test('covers the fields a lease actually needs', () => {
    // The set that was missing: a lease cannot be completed without them.
    const byLabel = new Map(AUTO_FILL_FIELDS.map((f) => [f.label, f.token]));

    assert.equal(byLabel.get('Lease Start Date'), 'startDate');
    assert.equal(byLabel.get('Lease End Date'), 'endDate');
    assert.equal(byLabel.get('Prorated Rent'), 'proratedRent');
    assert.equal(byLabel.get("Today's Date"), 'todayDate');
    assert.equal(byLabel.get('Tenant Full Name'), 'tenantName');
  });

  test('marks which fields the server fills on its own', () => {
    // The rest still work, but the user has to type them in the wizard, so the
    // UI has to be able to say which is which.
    const auto = AUTO_FILL_FIELDS.filter((f) => f.resolvedFromLease).map((f) => f.token);

    for (const token of [
      'startDate',
      'endDate',
      'tenantName',
      'propertyAddress',
      'monthlyRent',
      'proratedRent',
      'todayDate',
    ]) {
      assert.ok(auto.includes(token), `${token} should be filled from the lease`);
    }
  });

  test('every field carries a description, so a chip can explain itself', () => {
    for (const field of AUTO_FILL_FIELDS) {
      assert.ok(field.description && field.description.length > 0, `${field.label} has no description`);
    }
  });
});

describe('tokenForLabel', () => {
  test('resolves a known label', () => {
    assert.equal(tokenForLabel('Lease End Date'), 'endDate');
  });

  test('returns undefined for something it does not know', () => {
    assert.equal(tokenForLabel('Not A Field'), undefined);
  });

  test('still resolves every label the old chip list used', () => {
    // Templates saved before this change carry those labels as plain text.
    // Keeping them resolvable is what lets an old template heal when it is
    // opened and saved again.
    for (const label of LEGACY_LABELS) {
      assert.ok(tokenForLabel(label), `legacy label "${label}" no longer resolves`);
    }
  });
});

describe('fieldForLabel', () => {
  test('gives back the whole field, not just the token', () => {
    const field = fieldForLabel('Prorated Rent');
    assert.equal(field?.token, 'proratedRent');
    assert.ok(field?.description.length);
  });
});
