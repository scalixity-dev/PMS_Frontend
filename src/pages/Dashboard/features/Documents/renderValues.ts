/**
 * The `values` map to post with a render request.
 *
 * Only fields the user actually filled in are sent. renderTemplate merges
 * `{ ...autoValues, ...values }`, so a caller-supplied key always wins — which
 * meant the wizard's empty form boxes were overriding everything the server had
 * resolved from the lease, and the document rendered blank where the start
 * date, prorated rent or tenant name belonged.
 *
 * Dropping the blanks is what lets the lease fill them instead, while a value
 * the user did type still overrides, which is the point of the form.
 */
export function buildRenderValues(
  values: Record<string, string | null | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};

  for (const [key, raw] of Object.entries(values)) {
    if (raw === null || raw === undefined) continue;
    const trimmed = String(raw).trim();
    // "0" is a real answer for a pet charge or a late fee, so test the length
    // rather than the truthiness.
    if (trimmed.length === 0) continue;
    out[key] = trimmed;
  }

  return out;
}
