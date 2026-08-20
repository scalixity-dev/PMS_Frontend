export type PrintableAttachment = { name: string };

export type PrintableMessage = {
  senderName: string;
  text: string;
  /** ISO string, or an already-formatted display string like "10:32 AM". */
  timestamp?: string;
  isPending?: boolean;
  attachments?: PrintableAttachment[];
};

export type ConversationPrintInput = {
  title: string;
  subtitle?: string;
  messages: PrintableMessage[];
  printedAt: Date;
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/**
 * Renders a timestamp, leaving anything that is not a date alone.
 *
 * The three dashboards disagree about this field: the landlord chat stores a
 * display string ("10:32 AM") while the tenant and service chats store an ISO
 * string. Rather than normalise at four call sites, take either.
 */
const formatStamp = (timestamp?: string): string => {
  if (!timestamp) return '';

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return timestamp;

  return parsed.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * A self-contained HTML document for one conversation.
 *
 * Built from the message data rather than the on-screen DOM for two reasons.
 * The transcript is rendered in an `overflow-y-auto` column, so the DOM only
 * ever holds what has been scrolled into view. And index.css carries a global
 * `@media print` rule that hides everything outside `#printable-request`,
 * written for maintenance requests, which turned window.print() on any chat
 * page into a blank sheet.
 *
 * The result is written into a blank iframe, so it carries its own styles and
 * every interpolated value is escaped.
 */
export function buildConversationPrintHtml({
  title,
  subtitle,
  messages,
  printedAt,
}: ConversationPrintInput): string {
  // A message that never sent may still fail, so it is not part of the record.
  const sent = messages.filter((message) => !message.isPending);

  const body = sent.length
    ? sent
        .map((message) => {
          const stamp = formatStamp(message.timestamp);
          const attachments = message.attachments?.length
            ? `<p class="attachments">Attachments: ${message.attachments
                .map((a) => escapeHtml(a.name))
                .join(', ')}</p>`
            : '';

          return `
        <article class="message">
          <p class="meta">
            <span class="sender">${escapeHtml(message.senderName)}</span>
            ${stamp ? `<span class="stamp">${escapeHtml(stamp)}</span>` : ''}
          </p>
          <p class="text">${escapeHtml(message.text)}</p>
          ${attachments}
        </article>`;
        })
        .join('')
    : '<p class="empty">No messages in this conversation yet.</p>';

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(title)}</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap');
      * { box-sizing: border-box; }
      body {
        /* Named families to the end of the stack: the iframe is a blank
           document, so a generic-only fallback lands on whatever the browser
           defaults to, which prints the transcript in monospace. */
        font-family: 'Outfit', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #1f2937;
        margin: 0;
        padding: 32px;
        line-height: 1.5;
      }
      header {
        border-bottom: 2px solid #3D7475;
        padding-bottom: 12px;
        margin-bottom: 24px;
      }
      h1 { font-size: 20px; margin: 0 0 4px; color: #14504f; }
      .subtitle { margin: 0; color: #4b5563; font-size: 13px; }
      .printed { margin: 4px 0 0; color: #6b7280; font-size: 11px; }
      .message {
        padding: 10px 0;
        border-bottom: 1px solid #e5e7eb;
        page-break-inside: avoid;
      }
      .meta {
        margin: 0 0 4px;
        font-size: 12px;
        display: flex;
        justify-content: space-between;
        gap: 16px;
      }
      .sender { font-weight: 700; color: #14504f; }
      .stamp { color: #6b7280; }
      .text { margin: 0; white-space: pre-wrap; word-break: break-word; }
      .attachments { margin: 6px 0 0; font-size: 12px; color: #4b5563; font-style: italic; }
      .empty { color: #6b7280; font-style: italic; }
      @page { margin: 16mm; }
    </style>
  </head>
  <body>
    <header>
      <h1>${escapeHtml(title)}</h1>
      ${subtitle ? `<p class="subtitle">${escapeHtml(subtitle)}</p>` : ''}
      <p class="printed">Printed ${escapeHtml(formatStamp(printedAt.toISOString()))}</p>
    </header>
    ${body}
  </body>
</html>`;
}

/**
 * Prints one conversation via a hidden iframe.
 *
 * The iframe keeps the app's own print stylesheet out of the way, so the
 * global `#printable-request` visibility rule cannot blank the page.
 */
export function printConversation(input: ConversationPrintInput): void {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(buildConversationPrintHtml(input));
  doc.close();

  const cleanup = () => {
    if (iframe.parentNode) document.body.removeChild(iframe);
  };

  // Give the document a beat to lay out before the dialog opens, otherwise
  // Safari prints an empty first page.
  window.setTimeout(() => {
    iframe.contentWindow?.focus();
    iframe.contentWindow?.print();
    window.setTimeout(cleanup, 1000);
  }, 250);
}
