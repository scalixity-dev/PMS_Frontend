import { test, describe, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { printConversation } from '../src/utils/conversationPrint.ts';

/**
 * The transcript is printed from a hidden iframe, not the page.
 *
 * index.css carries `@media print { body * { visibility: hidden } }` scoped to
 * `#printable-request`, so calling window.print() on a chat page blanked the
 * sheet. An iframe is its own document and that rule cannot reach into it.
 *
 * A real print dialog blocks the renderer, so the lifecycle is pinned here with
 * a stub document rather than in a browser.
 */
type Recorded = {
  written: string;
  printed: number;
  focused: number;
  appended: unknown[];
  removed: unknown[];
  opened: number;
  closed: number;
};

let rec: Recorded;
const originals = {
  document: (globalThis as Record<string, unknown>).document,
  window: (globalThis as Record<string, unknown>).window,
};

function install({ withContentWindow = true } = {}) {
  rec = { written: '', printed: 0, focused: 0, appended: [], removed: [], opened: 0, closed: 0 };

  const makeIframe = () => {
    const el: Record<string, unknown> = {
      style: {},
      parentNode: null as unknown,
      setAttribute: () => {},
    };
    el.contentWindow = withContentWindow
      ? {
          document: {
            open: () => { rec.opened += 1; },
            write: (html: string) => { rec.written += html; },
            close: () => { rec.closed += 1; },
          },
          focus: () => { rec.focused += 1; },
          print: () => { rec.printed += 1; },
        }
      : null;
    return el;
  };

  const body = {
    appendChild: (el: Record<string, unknown>) => {
      el.parentNode = body;
      rec.appended.push(el);
      return el;
    },
    removeChild: (el: Record<string, unknown>) => {
      el.parentNode = null;
      rec.removed.push(el);
      return el;
    },
  };

  const timers: Array<() => void> = [];
  (globalThis as Record<string, unknown>).document = {
    createElement: () => makeIframe(),
    body,
  };
  (globalThis as Record<string, unknown>).window = {
    // Run timers immediately so the test does not have to wait on real delays.
    setTimeout: (fn: () => void) => { timers.push(fn); fn(); return 0; },
  };
}

afterEach(() => {
  (globalThis as Record<string, unknown>).document = originals.document;
  (globalThis as Record<string, unknown>).window = originals.window;
});

const input = {
  title: 'Conversation with Priya Nair',
  subtitle: 'Landlord',
  messages: [{ senderName: 'You', text: 'hello there', timestamp: '2026-08-20T12:00:00.000Z' }],
  printedAt: new Date('2026-08-20T12:00:00.000Z'),
};

describe('printConversation', () => {
  test('writes the transcript into its own iframe and prints it', () => {
    install();
    printConversation(input);

    assert.equal(rec.appended.length, 1, 'one iframe appended');
    assert.equal(rec.opened, 1);
    assert.equal(rec.closed, 1);
    assert.ok(rec.written.includes('hello there'), 'the message reaches the iframe');
    assert.ok(rec.written.includes('Conversation with Priya Nair'));
    assert.equal(rec.printed, 1, 'print is called on the iframe, not on window');
    assert.equal(rec.focused, 1);
  });

  test('cleans the iframe back off the page', () => {
    install();
    printConversation(input);

    assert.equal(rec.removed.length, 1, 'the iframe does not linger in the DOM');
    assert.equal(rec.removed[0], rec.appended[0]);
  });

  test('removes the iframe and gives up when it has no document', () => {
    // Never leave an orphan iframe behind if the browser refuses the frame.
    install({ withContentWindow: false });
    printConversation(input);

    assert.equal(rec.appended.length, 1);
    assert.equal(rec.removed.length, 1, 'cleaned up even on the bail-out path');
    assert.equal(rec.printed, 0);
  });
});
