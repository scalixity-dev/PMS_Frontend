import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { computePopoverPosition } from '../src/components/ui/popoverPosition.ts';

/**
 * The calendar popover used to be absolutely positioned inside the field.
 *
 * That works until the field sits in a scroll container, which every modal in
 * this app is (`max-h-[90vh] overflow-y-auto`). Overflow clips its descendants
 * no matter what z-index they carry, so the Edit lease terms calendar was cut
 * off at the modal's bottom edge with only the first row of days reachable.
 * Clicking any day below that row landed outside the clip box, the picker's
 * outside-click handler closed it, and the field kept its old value. The user
 * saw an end date that would not change.
 *
 * The fix puts the popover in a portal at `position: fixed`, so these are the
 * numbers that decide where it lands.
 */
const VIEWPORT = { width: 1280, height: 800 };
const POPOVER = { width: 320, height: 360 };

describe('computePopoverPosition', () => {
  test('sits just below the trigger when there is room', () => {
    const pos = computePopoverPosition({
      trigger: { top: 100, left: 200, width: 300, height: 50 },
      popover: POPOVER,
      viewport: VIEWPORT,
      gap: 8,
    });

    assert.equal(pos.placement, 'bottom');
    assert.equal(pos.top, 158); // trigger bottom (150) + gap
    assert.equal(pos.left, 200); // left-aligned with the trigger
  });

  test('flips above the trigger when the space below is too small', () => {
    // The reported case: an End Date field near the bottom of a tall modal.
    const pos = computePopoverPosition({
      trigger: { top: 700, left: 200, width: 300, height: 50 },
      popover: POPOVER,
      viewport: VIEWPORT,
      gap: 8,
    });

    assert.equal(pos.placement, 'top');
    assert.equal(pos.top, 332); // trigger top (700) - gap - popover height
  });

  test('keeps the taller side when neither side fits', () => {
    // A popover taller than the viewport has to overflow somewhere. Pick the
    // side with more room so the most days stay reachable.
    const pos = computePopoverPosition({
      trigger: { top: 300, left: 200, width: 300, height: 50 },
      popover: { width: 320, height: 900 },
      viewport: VIEWPORT,
      gap: 8,
    });

    // 450px below vs 300px above, so below wins.
    assert.equal(pos.placement, 'bottom');
  });

  test('never lets the popover run off the right edge', () => {
    const pos = computePopoverPosition({
      trigger: { top: 100, left: 1100, width: 300, height: 50 },
      popover: POPOVER,
      viewport: VIEWPORT,
      gap: 8,
    });

    assert.ok(pos.left + POPOVER.width <= VIEWPORT.width - 8, 'stays inside the right edge');
  });

  test('never lets the popover run off the left edge', () => {
    const pos = computePopoverPosition({
      trigger: { top: 100, left: -40, width: 300, height: 50 },
      popover: POPOVER,
      viewport: VIEWPORT,
      gap: 8,
    });

    assert.ok(pos.left >= 8, 'stays inside the left edge');
  });

  test('never lets the popover run off the top edge', () => {
    // Flipping above a trigger near the top would otherwise give a negative top,
    // putting the month header out of reach.
    const pos = computePopoverPosition({
      trigger: { top: 20, left: 200, width: 300, height: 50 },
      popover: { width: 320, height: 700 },
      viewport: { width: 1280, height: 300 },
      gap: 8,
    });

    assert.ok(pos.top >= 8, `top was ${pos.top}`);
  });

  test('reports the trigger width so the popover can match the field', () => {
    const pos = computePopoverPosition({
      trigger: { top: 100, left: 200, width: 300, height: 50 },
      popover: POPOVER,
      viewport: VIEWPORT,
      gap: 8,
    });

    assert.equal(pos.minWidth, 300);
  });
});
