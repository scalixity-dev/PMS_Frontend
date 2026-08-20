export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'Active';
export type ButtonSize = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center rounded-lg font-medium transition-colors';

const sizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-[var(--color-primary)] text-white hover:opacity-90',
  secondary: 'bg-[var(--color-secondary)] text-white hover:opacity-90',
  outline:
    'border border-[var(--color-active)] text-[var(--color-heading)] hover:bg-[var(--color-header-bg)]',
  ghost: 'text-[var(--color-heading)] hover:bg-[var(--color-header-bg)]',
  destructive: 'bg-red-500 text-white hover:bg-red-600',
  Active: 'bg-[var(--color-active)] text-white hover:opacity-90',
};

/** `text-white`, `text-gray-700`, `text-[#486370]` - but not `text-sm`. */
const TEXT_COLOUR =
  /^(hover:|focus:|active:|disabled:)?text-(?!(?:xs|sm|base|lg|xl|\d?xl|left|right|center|justify|balance|pretty|wrap|nowrap|clip|ellipsis)$)/;
const BG_COLOUR = /^(hover:|focus:|active:|disabled:)?bg-/;
/** `border-gray-300`, `border-[#eee]` - but not `border`, `border-2`, `border-t`. */
const BORDER_COLOUR =
  /^(hover:|focus:|active:|disabled:)?border-(?!\d|[trblxy]($|-)|solid|dashed|dotted|double|hidden|none|collapse|separate|spacing)/;

const family = (token: string): 'text' | 'bg' | 'border' | null => {
  if (TEXT_COLOUR.test(token)) return 'text';
  if (BG_COLOUR.test(token)) return 'bg';
  if (BORDER_COLOUR.test(token)) return 'border';
  return null;
};

/**
 * Build a Button's class list, letting the call site's colours win outright.
 *
 * The variant used to be concatenated with the call site's className and both
 * kept their colour utilities, so an element could carry `text-white` and
 * `text-gray-700` at once and Tailwind's output order decided which applied.
 * "Change plan" lost that coin toss and rendered white text on its near-white
 * hover background.
 *
 * A colour the call site sets now removes the variant's counterpart of the
 * same family and state, so there is only ever one rule to apply. Layout and
 * size utilities are untouched.
 */
export function buttonClasses(
  variant: ButtonVariant = 'primary',
  size: ButtonSize = 'md',
  className?: string,
): string {
  const own = (className ?? '').split(/\s+/).filter(Boolean);

  // Which colour families the call site has taken over, per state prefix.
  const overridden = new Set<string>();
  for (const token of own) {
    const kind = family(token);
    if (!kind) continue;
    const state = token.includes(':') ? token.slice(0, token.indexOf(':') + 1) : '';
    overridden.add(`${state}${kind}`);
  }

  const kept = variants[variant]
    .split(/\s+/)
    .filter((token) => {
      const kind = family(token);
      if (!kind) return true;
      const state = token.includes(':') ? token.slice(0, token.indexOf(':') + 1) : '';
      // `hover:opacity-90` is not a colour, but it reads as one on a button
      // whose background the call site has replaced, so drop it alongside.
      return !overridden.has(`${state}${kind}`);
    })
    .filter((token) => !(token === 'hover:opacity-90' && overridden.has('hover:bg')));

  return [base, sizes[size], ...kept, ...own].join(' ').trim();
}
