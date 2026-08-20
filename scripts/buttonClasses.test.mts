import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { buttonClasses } from '../src/components/common/buttonClasses.ts';

const tokens = (s: string) => s.split(/\s+/).filter(Boolean);
const has = (s: string, token: string) => tokens(s).includes(token);

describe('buttonClasses', () => {
  test('uses the variant colours when the call site sets none', () => {
    const out = buttonClasses('primary', 'md');
    assert.ok(has(out, 'bg-[var(--color-primary)]'));
    assert.ok(has(out, 'text-white'));
  });

  // The bug: "Change plan" carried text-white and text-gray-700 at once.
  test('a call-site text colour removes the variant text colour', () => {
    const out = buttonClasses('primary', 'md', 'text-gray-700');
    assert.ok(has(out, 'text-gray-700'));
    assert.ok(!has(out, 'text-white'), 'variant text colour should be gone');
  });

  test('a call-site background removes the variant background', () => {
    const out = buttonClasses('primary', 'md', 'bg-[#486370]');
    assert.ok(has(out, 'bg-[#486370]'));
    assert.ok(!has(out, 'bg-[var(--color-primary)]'));
  });

  test('a call-site hover background removes the variant hover effect', () => {
    const out = buttonClasses('primary', 'md', 'hover:bg-gray-50');
    assert.ok(has(out, 'hover:bg-gray-50'));
    assert.ok(!has(out, 'hover:opacity-90'), 'variant hover should not fight it');
  });

  test('the exact broken combination yields one text colour only', () => {
    const out = buttonClasses(
      'primary',
      'md',
      'border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50',
    );
    const textColours = tokens(out).filter(
      (t) => t.startsWith('text-') && !/^text-(xs|sm|base|lg|xl)$/.test(t),
    );
    assert.deepEqual(textColours, ['text-gray-700'], `got: ${textColours.join(', ')}`);
  });

  test('size and typography utilities are not mistaken for colours', () => {
    const out = buttonClasses('primary', 'lg', 'text-sm');
    assert.ok(has(out, 'text-white'), 'text-sm must not strip the variant colour');
    assert.ok(has(out, 'text-sm'));
  });

  test('a call site repeating the variant colour is left alone', () => {
    const out = buttonClasses('primary', 'md', 'bg-[#486370] hover:bg-[#3a505b] text-white');
    assert.ok(has(out, 'text-white'));
    assert.ok(!has(out, 'bg-[var(--color-primary)]'));
  });

  test('a call-site border colour removes the variant border colour', () => {
    const out = buttonClasses('outline', 'md', 'border border-gray-300');
    assert.ok(has(out, 'border-gray-300'));
    assert.ok(!has(out, 'border-[var(--color-active)]'), 'variant border colour should be gone');
    assert.ok(has(out, 'border'), 'the border width must survive');
  });

  test('border width and side utilities are not mistaken for colours', () => {
    const out = buttonClasses('outline', 'md', 'border-2');
    assert.ok(has(out, 'border-[var(--color-active)]'), 'border-2 must not strip the colour');
    assert.ok(has(out, 'border-2'));
  });

  // The full "Change plan" intent: an outline button in greys.
  test('the outline call site keeps exactly one colour per family', () => {
    const out = buttonClasses(
      'outline',
      'md',
      'border border-gray-300 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50',
    );
    const t = tokens(out);
    assert.deepEqual(t.filter((x) => /^text-/.test(x) && !/^text-(xs|sm|base|lg|xl)$/.test(x)), ['text-gray-700']);
    assert.deepEqual(t.filter((x) => /^border-/.test(x)), ['border-gray-300']);
    assert.deepEqual(t.filter((x) => /^hover:bg-/.test(x)), ['hover:bg-gray-50']);
    assert.ok(!t.some((x) => /^bg-/.test(x)), 'outline must not add a background');
  });

  test('layout classes from the call site always survive', () => {
    const out = buttonClasses('outline', 'md', 'px-6 py-2.5 rounded-lg font-medium');
    for (const t of ['px-6', 'py-2.5', 'rounded-lg', 'font-medium']) {
      assert.ok(has(out, t), `${t} missing`);
    }
  });
});
