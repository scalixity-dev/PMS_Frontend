export type SignatureKind = 'signature' | 'initial' | 'date';
export type SignatureParty = 'landlord' | 'tenant';

export type SignatureField = {
  kind: SignatureKind;
  label: string;
  description: string;
  /** Every one of these belongs to a specific party, so the author is asked. */
  needsParty: true;
};

export const SIGNATURE_FIELDS: SignatureField[] = [
  {
    kind: 'signature',
    label: 'Signature',
    description: 'A place for one party to sign.',
    needsParty: true,
  },
  {
    kind: 'initial',
    label: 'Initials',
    description: 'Initials on a clause you want acknowledged.',
    needsParty: true,
  },
  {
    kind: 'date',
    label: 'Date Signed',
    description: 'The date that party signs, filled in by DocuSign.',
    needsParty: true,
  },
];

/**
 * DocuSign places recipient tabs by anchor string, and the recipients are
 * fixed: the landlord signs as recipient 0 and the tenant as recipient 1
 * (DocusignService.createEmbeddedEnvelope). The suffix is what routes the tab
 * to the right person, so swapping them would send the tenant's signature box
 * to the landlord.
 */
export function signatureAnchor(
  kind: SignatureKind,
  party: SignatureParty,
): string {
  const index = party === 'landlord' ? 0 : 1;
  return `**${kind}_${index}**`;
}

const PARTY_LABEL: Record<SignatureParty, string> = {
  landlord: 'Landlord',
  tenant: 'Tenant',
};

const KIND_LABEL: Record<SignatureKind, string> = {
  signature: 'Signature',
  initial: 'Initials',
  date: 'Date Signed',
};

/** "Landlord Signature", so the author can see whose field it is. */
export function signatureLabel(
  kind: SignatureKind,
  party: SignatureParty,
): string {
  return `${PARTY_LABEL[party]} ${KIND_LABEL[kind]}`;
}
