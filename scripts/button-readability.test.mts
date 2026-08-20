import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { buttonClasses } from '../src/components/common/buttonClasses.ts';
import type { ButtonVariant, ButtonSize } from '../src/components/common/buttonClasses.ts';

/**
 * Every <Button> in the app must be readable in its resting and hover states.
 *
 * This resolves each call site through the real buttonClasses(), so it checks
 * what the browser will actually apply rather than the raw class string. The
 * bug it exists for: "Change plan" ended up with white text on a near-white
 * hover background and the label vanished under the cursor.
 */

const SRC = new URL('../src/', import.meta.url).pathname;

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

/** Relative luminance of the colours these buttons actually use. */
const LUMINANCE: Record<string, number> = {
  'text-white': 1, 'bg-white': 1,
  'text-gray-700': 0.16, 'text-gray-800': 0.11, 'text-gray-900': 0.05,
  'bg-gray-50': 0.97, 'bg-gray-100': 0.94, 'bg-gray-200': 0.87,
  'bg-red-500': 0.25, 'bg-red-600': 0.2,
  'text-[var(--color-heading)]': 0.05,          // #1F2937
  'bg-[var(--color-primary)]': 0.17,            // #3D7475
  'bg-[var(--color-secondary)]': 0.17,
  'bg-[var(--color-active)]': 0.6,              // #20CC95
  'bg-[var(--color-header-bg)]': 0.75,          // #D8E0D5
  'bg-[#486370]': 0.13, 'bg-[#3a505b]': 0.09,
  'bg-[#7BD747]': 0.62, 'bg-[#6bc238]': 0.5, 'bg-[#6bc03d]': 0.5,
};

const luminance = (token: string | undefined): number | null =>
  token === undefined ? null : (LUMINANCE[token] ?? null);

const sites = () => {
  const out: Array<{ file: string; line: number; tag: string }> = [];
  for (const file of walk(SRC).filter((f) => f.endsWith('.tsx'))) {
    if (file.endsWith('/components/common/Button.tsx')) continue;
    const source = readFileSync(file, 'utf8');
    for (const m of source.matchAll(/<Button\b[\s\S]*?>/g)) {
      out.push({ file: file.replace(SRC, ''), line: source.slice(0, m.index).split('\n').length, tag: m[0] });
    }
  }
  return out;
};

const attr = (tag: string, name: string) =>
  tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`))?.[1];

describe('Button readability', () => {
  test('no button renders low-contrast text in its resting or hover state', () => {
    const problems: string[] = [];

    for (const site of sites()) {
      const resolved = buttonClasses(
        (attr(site.tag, 'variant') as ButtonVariant) ?? 'primary',
        (attr(site.tag, 'size') as ButtonSize) ?? 'md',
        attr(site.tag, 'className'),
      ).split(/\s+/);

      const text = resolved.find((t) => /^text-/.test(t) && !/^text-(xs|sm|base|lg|xl)$/.test(t));
      const bg = resolved.find((t) => /^bg-/.test(t));
      const hoverBg = resolved.find((t) => /^hover:bg-/.test(t))?.replace('hover:', '');

      const lText = luminance(text);
      if (lText === null) continue;                       // unknown colour, skip

      // A button with no background sits on the page, which is light here.
      for (const [state, token] of [['resting', bg ?? 'bg-white'], ['hover', hoverBg ?? bg ?? 'bg-white']] as const) {
        const lBg = luminance(token);
        if (lBg === null) continue;
        const contrast = (Math.max(lText, lBg) + 0.05) / (Math.min(lText, lBg) + 0.05);
        // 1.5:1 is an invisibility gate, not a WCAG bar. White on the brand
        // green sits at ~1.6:1 and is a deliberate, legible choice; white on
        // a near-white hover background sits at ~1.03:1 and cannot be read at
        // all. This catches the second without quietly restyling the first.
        if (contrast < 1.5) {
          problems.push(`${site.file}:${site.line} ${state}: ${text} on ${token} (contrast ${contrast.toFixed(1)}:1)`);
        }
      }
    }

    assert.deepEqual(problems, [], `unreadable buttons:\n  ${problems.join('\n  ')}`);
  });
});
