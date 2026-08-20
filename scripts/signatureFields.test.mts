import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import {
  SIGNATURE_FIELDS,
  signatureAnchor,
  signatureLabel,
} from '../src/pages/Dashboard/features/Documents/signatureFields.ts';

/**
 * Signature fields have to say whose signature they are.
 *
 * Dragging "Signature" used to insert the plain text " [Signature] ", which
 * DocuSign never sees and nobody ever signs. DocuSign places its tabs by
 * anchor string, and the recipients are fixed: the landlord is recipient 0 and
 * the tenant recipient 1 (DocusignService.createEmbeddedEnvelope). So the
 * field has to carry the anchor for the party it belongs to.
 */
describe('signatureAnchor', () => {
  test('uses the anchors DocuSign is configured to look for', () => {
    assert.equal(signatureAnchor('signature', 'landlord'), '**signature_0**');
    assert.equal(signatureAnchor('signature', 'tenant'), '**signature_1**');
    assert.equal(signatureAnchor('date', 'landlord'), '**date_0**');
    assert.equal(signatureAnchor('date', 'tenant'), '**date_1**');
    assert.equal(signatureAnchor('initial', 'landlord'), '**initial_0**');
    assert.equal(signatureAnchor('initial', 'tenant'), '**initial_1**');
  });

  test('never gives two parties the same anchor', () => {
    // Colliding anchors would drop both parties' tabs in the same spot.
    const all = SIGNATURE_FIELDS.flatMap((f) => [
      signatureAnchor(f.kind, 'landlord'),
      signatureAnchor(f.kind, 'tenant'),
    ]);

    assert.equal(new Set(all).size, all.length);
  });

  test('landlord is recipient 0 and tenant recipient 1, always', () => {
    // Swapping these would send the tenant's tabs to the landlord.
    for (const field of SIGNATURE_FIELDS) {
      assert.match(signatureAnchor(field.kind, 'landlord'), /_0\*\*$/);
      assert.match(signatureAnchor(field.kind, 'tenant'), /_1\*\*$/);
    }
  });
});

describe('signatureLabel', () => {
  test('says whose field it is, so the author can see it at a glance', () => {
    assert.equal(signatureLabel('signature', 'landlord'), 'Landlord Signature');
    assert.equal(signatureLabel('signature', 'tenant'), 'Tenant Signature');
    assert.equal(signatureLabel('initial', 'tenant'), 'Tenant Initials');
    assert.equal(signatureLabel('date', 'landlord'), 'Landlord Date Signed');
  });
});

describe('SIGNATURE_FIELDS', () => {
  test('covers signature, initials and date signed', () => {
    assert.deepEqual(
      SIGNATURE_FIELDS.map((f) => f.kind).sort(),
      ['date', 'initial', 'signature'],
    );
  });

  test('every field explains itself and asks for a party', () => {
    for (const field of SIGNATURE_FIELDS) {
      assert.ok(field.label.length > 0, `${field.kind} has no label`);
      assert.ok(field.description.length > 0, `${field.kind} has no description`);
      assert.equal(field.needsParty, true);
    }
  });
});
