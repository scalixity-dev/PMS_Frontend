export type Rect = { top: number; left: number; width: number; height: number };
export type Size = { width: number; height: number };

export type PopoverPosition = {
  top: number;
  left: number;
  minWidth: number;
  placement: 'top' | 'bottom';
};

/**
 * Viewport coordinates for a popover anchored to a trigger.
 *
 * Anything absolutely positioned inside a scroll container gets clipped by it,
 * and no z-index changes that. Every modal here is a scroll container, so a
 * popover that wants to escape one has to be portalled to the body and placed
 * at `position: fixed`, which means working out its coordinates by hand.
 *
 * All inputs and outputs are viewport coordinates, the same space
 * getBoundingClientRect and `position: fixed` use, so nothing here has to know
 * about scroll offsets.
 */
export function computePopoverPosition({
  trigger,
  popover,
  viewport,
  gap = 8,
  margin = 8,
}: {
  trigger: Rect;
  popover: Size;
  viewport: Size;
  gap?: number;
  margin?: number;
}): PopoverPosition {
  const spaceBelow = viewport.height - (trigger.top + trigger.height) - gap;
  const spaceAbove = trigger.top - gap;

  // Below unless it does not fit and above is genuinely roomier. When neither
  // side fits, the roomier one still shows the most rows.
  const placement =
    popover.height <= spaceBelow || spaceBelow >= spaceAbove ? 'bottom' : 'top';

  const rawTop =
    placement === 'bottom'
      ? trigger.top + trigger.height + gap
      : trigger.top - gap - popover.height;

  // Clamp to the viewport, but keep the top edge reachable: a popover taller
  // than the viewport should overflow off the bottom, never off the top, or
  // the month and year controls end up out of reach.
  const maxTop = Math.max(margin, viewport.height - popover.height - margin);
  const top = Math.min(Math.max(rawTop, margin), maxTop);

  const maxLeft = Math.max(margin, viewport.width - popover.width - margin);
  const left = Math.min(Math.max(trigger.left, margin), maxLeft);

  return { top, left, minWidth: trigger.width, placement };
}
