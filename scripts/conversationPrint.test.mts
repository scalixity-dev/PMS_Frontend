import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buildConversationPrintHtml } from '../src/utils/conversationPrint.ts';

/**
 * "Print conversation" printed a blank page.
 *
 * The button was wired on all three dashboards, but it called window.print(),
 * and index.css carries a global print rule written for maintenance requests:
 *
 *   @media print { body * { visibility: hidden }
 *                  #printable-request, #printable-request * { visibility: visible } }
 *
 * No chat page has a #printable-request, so every element on the page was
 * hidden and the sheet came out empty. Even without that rule the transcript
 * lives in an `overflow-y-auto` column, so only the scrolled-into-view messages
 * would have printed.
 *
 * So the transcript is built from the message data rather than the DOM, which
 * is what these cases pin down.
 */
const AT = '2026-08-20T12:00:00.000Z'; // midday UTC, so the date is stable in any timezone

const base = {
  title: 'Conversation with Priya Nair',
  subtitle: 'Landlord - 12 Oak Street',
  printedAt: new Date(AT),
};

describe('buildConversationPrintHtml', () => {
  test('includes every message in order, not just the ones on screen', () => {
    // The bug this replaces printed whatever happened to be scrolled into view.
    const messages = Array.from({ length: 60 }, (_, i) => ({
      senderName: i % 2 ? 'Priya Nair' : 'You',
      text: `message number ${i}`,
      timestamp: AT,
    }));

    const html = buildConversationPrintHtml({ ...base, messages });

    for (let i = 0; i < 60; i += 1) {
      assert.ok(html.includes(`message number ${i}`), `missing message ${i}`);
    }
    assert.ok(
      html.indexOf('message number 0') < html.indexOf('message number 59'),
      'messages should keep their order',
    );
  });

  test('escapes message text so a message cannot inject markup', () => {
    // This string is written into a fresh document, so it has to be inert.
    const html = buildConversationPrintHtml({
      ...base,
      messages: [
        {
          senderName: '<img src=x onerror=alert(1)>',
          text: '<script>alert("xss")</script> & "quoted"',
          timestamp: AT,
        },
      ],
    });

    assert.ok(!html.includes('<script>'), 'raw script tag must not survive');
    assert.ok(!html.includes('<img src=x'), 'raw img tag must not survive');
    assert.ok(html.includes('&lt;script&gt;'), 'text should be escaped, not dropped');
    assert.ok(html.includes('&amp;'), 'ampersands should be escaped');
  });

  test('escapes the title and subtitle too', () => {
    const html = buildConversationPrintHtml({
      title: '<b>Bold</b>',
      subtitle: '<i>Italic</i>',
      printedAt: new Date(AT),
      messages: [],
    });

    assert.ok(!html.includes('<b>Bold</b>'));
    assert.ok(html.includes('&lt;b&gt;Bold&lt;/b&gt;'));
    assert.ok(!html.includes('<i>Italic</i>'));
  });

  test('names the conversation and who it is with', () => {
    const html = buildConversationPrintHtml({
      ...base,
      messages: [{ senderName: 'You', text: 'hello', timestamp: AT }],
    });

    assert.ok(html.includes('Conversation with Priya Nair'));
    assert.ok(html.includes('Landlord - 12 Oak Street'));
    assert.ok(html.includes('<title>'), 'needs a document title for the print header');
  });

  test('formats an ISO timestamp and passes a display string through', () => {
    const html = buildConversationPrintHtml({
      ...base,
      messages: [
        { senderName: 'You', text: 'iso stamped', timestamp: AT },
        { senderName: 'You', text: 'already formatted', timestamp: '10:32 AM' },
      ],
    });

    assert.ok(html.includes('2026'), 'an ISO timestamp should render a real date');
    assert.ok(html.includes('10:32 AM'), 'a display string should survive as written');
  });

  test('leaves out messages that never sent', () => {
    // A pending message may still fail. It is not part of the record.
    const html = buildConversationPrintHtml({
      ...base,
      messages: [
        { senderName: 'You', text: 'delivered', timestamp: AT },
        { senderName: 'You', text: 'still sending', timestamp: AT, isPending: true },
      ],
    });

    assert.ok(html.includes('delivered'));
    assert.ok(!html.includes('still sending'));
  });

  test('lists attachment names, since the files cannot print themselves', () => {
    const html = buildConversationPrintHtml({
      ...base,
      messages: [
        {
          senderName: 'Priya Nair',
          text: 'signed copy attached',
          timestamp: AT,
          attachments: [{ name: 'lease-signed.pdf' }, { name: 'meter.jpg' }],
        },
      ],
    });

    assert.ok(html.includes('lease-signed.pdf'));
    assert.ok(html.includes('meter.jpg'));
  });

  test('says so plainly when there is nothing to print', () => {
    // Better than handing the user a blank sheet, which is the bug being fixed.
    const html = buildConversationPrintHtml({ ...base, messages: [] });

    assert.ok(/no messages/i.test(html), 'should state the conversation is empty');
  });

  test('stamps when it was printed', () => {
    const html = buildConversationPrintHtml({
      ...base,
      messages: [{ senderName: 'You', text: 'hi', timestamp: AT }],
    });

    assert.ok(/printed/i.test(html));
    assert.ok(html.includes('2026'));
  });

  test('produces a standalone document with its own styles', () => {
    // It renders in a blank iframe, so no app CSS is available to it.
    const html = buildConversationPrintHtml({
      ...base,
      messages: [{ senderName: 'You', text: 'hi', timestamp: AT }],
    });

    assert.ok(html.trim().toLowerCase().startsWith('<!doctype html>'));
    assert.ok(html.includes('<style>'), 'needs inline styles to look like anything');
    assert.ok(html.includes('</html>'));
  });
});
