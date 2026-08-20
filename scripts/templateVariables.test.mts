import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { extractTemplateVariables } from '../src/pages/Dashboard/features/Documents/templateVariables.ts';

/**
 * The placeholder list a template carries.
 *
 * The Use-template wizard builds its "fill in the variables" form from this,
 * so a placeholder missing here is one the author can never supply and which
 * renders as a raw `{{token}}` in the finished document.
 *
 * Two things were wrong. The create wizard derived labels by splitting the
 * token on capitals, so `startDate` became "Start Date" rather than the "Lease
 * Start Date" on the chip that produced it. And EditTemplate never extracted
 * variables at all, so pills added while editing an existing template were
 * never registered.
 */
describe('extractTemplateVariables', () => {
  test('finds each placeholder once, in the order it appears', () => {
    const vars = extractTemplateVariables(
      '<p>{{tenantName}} rents from {{landlordName}}. Signed {{tenantName}}.</p>',
    );

    assert.deepEqual(
      vars.map((v) => v.key),
      ['tenantName', 'landlordName'],
    );
  });

  test('labels a known token the way its chip does', () => {
    // Splitting on capitals gives "Start Date", which is not what the author
    // dragged in and reads as a different field.
    const vars = extractTemplateVariables('{{startDate}} {{proratedRent}}');

    assert.equal(vars[0].label, 'Lease Start Date');
    assert.equal(vars[1].label, 'Prorated Rent');
  });

  test('still labels a token nobody has a chip for', () => {
    // Hand-typed placeholders are legitimate and must not come out blank.
    const vars = extractTemplateVariables('{{myCustomClause}}');

    assert.equal(vars[0].key, 'myCustomClause');
    assert.equal(vars[0].label, 'My Custom Clause');
  });

  test('marks the ones the lease fills in', () => {
    const vars = extractTemplateVariables('{{startDate}} {{petCharge}}');
    const byKey = new Map(vars.map((v) => [v.key, v]));

    assert.equal(byKey.get('startDate')?.autoFilled, true);
    assert.equal(byKey.get('petCharge')?.autoFilled, false);
  });

  test('does not demand a value for something the lease supplies', () => {
    // Marking an auto-filled field required would make the author retype the
    // lease start date into a form to satisfy a red asterisk.
    const vars = extractTemplateVariables('{{startDate}} {{petCharge}}');
    const byKey = new Map(vars.map((v) => [v.key, v]));

    assert.equal(byKey.get('startDate')?.required, false);
    assert.equal(byKey.get('petCharge')?.required, true);
  });

  test('types a date field as a date and a money field as a number', () => {
    const vars = extractTemplateVariables('{{endDate}} {{monthlyRent}} {{tenantName}}');
    const byKey = new Map(vars.map((v) => [v.key, v]));

    assert.equal(byKey.get('endDate')?.type, 'date');
    assert.equal(byKey.get('monthlyRent')?.type, 'number');
    assert.equal(byKey.get('tenantName')?.type, 'text');
  });

  test('ignores malformed placeholders', () => {
    const vars = extractTemplateVariables('{{ spaced }} {{}} {single} {{ok}}');

    assert.deepEqual(
      vars.map((v) => v.key),
      ['ok'],
    );
  });

  test('reads placeholders out of pill markup, not just bare text', () => {
    // This is how the editor actually saves them.
    const html =
      '<span data-auto-fill-pill="true" data-token="startDate" class="auto-fill-pill">{{startDate}}</span>';

    assert.deepEqual(
      extractTemplateVariables(html).map((v) => v.key),
      ['startDate'],
    );
  });

  test('returns nothing for content with no placeholders', () => {
    assert.deepEqual(extractTemplateVariables('<p>Plain text.</p>'), []);
    assert.deepEqual(extractTemplateVariables(''), []);
  });
});
