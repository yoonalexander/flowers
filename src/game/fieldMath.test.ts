import { describe, expect, it } from 'vitest';
import {
  BUNNY_SPEED,
  FIELD_MARGIN,
  FIELD_SIZE,
  cameraOffset,
  directionVector,
  isWithinPickupRange,
  keyToDirection,
  stepPosition,
} from './fieldMath';
import { phaseAfterCardClose, restoredPhase } from './experienceState';

describe('field movement', () => {
  it('maps WASD and arrow keys to the same directions', () => {
    expect(keyToDirection('w')).toBe('up');
    expect(keyToDirection('ArrowUp')).toBe('up');
    expect(keyToDirection('D')).toBe('right');
    expect(keyToDirection('Escape')).toBeNull();
  });

  it('normalizes diagonal movement', () => {
    const vector = directionVector(new Set(['up', 'right']));
    expect(Math.hypot(vector.x, vector.y)).toBeCloseTo(1);
    const next = stepPosition({ x: 500, y: 500 }, new Set(['up', 'right']), 1);
    const distance = Math.hypot(next.x - 500, next.y - 500);
    expect(distance).toBeCloseTo(BUNNY_SPEED * 0.05);
  });

  it('clamps the bunny inside the meadow', () => {
    expect(stepPosition({ x: FIELD_MARGIN, y: FIELD_MARGIN }, new Set(['up', 'left']), 1))
      .toEqual({ x: FIELD_MARGIN, y: FIELD_MARGIN });
    expect(stepPosition(
      { x: FIELD_SIZE.width - FIELD_MARGIN, y: FIELD_SIZE.height - FIELD_MARGIN },
      new Set(['down', 'right']),
      1,
    )).toEqual({
      x: FIELD_SIZE.width - FIELD_MARGIN,
      y: FIELD_SIZE.height - FIELD_MARGIN,
    });
  });
});

describe('field discovery and camera', () => {
  it('detects only flowers inside pickup range', () => {
    expect(isWithinPickupRange({ x: 100, y: 100 }, { x: 140, y: 130 })).toBe(true);
    expect(isWithinPickupRange({ x: 100, y: 100 }, { x: 160, y: 100 })).toBe(false);
  });

  it('clamps the camera at every world edge', () => {
    expect(cameraOffset({ x: 0, y: 0 }, { width: 390, height: 844 })).toEqual({ x: 0, y: 0 });
    expect(cameraOffset(
      { x: FIELD_SIZE.width, y: FIELD_SIZE.height },
      { width: 390, height: 844 },
    )).toEqual({ x: FIELD_SIZE.width - 390, y: FIELD_SIZE.height - 844 });
  });
});

describe('experience phases', () => {
  it('restores completed sessions at the bouquet', () => {
    expect(restoredPhase(6, 7)).toBe('field');
    expect(restoredPhase(7, 7)).toBe('bouquet');
  });

  it('waits for the final card to close before transitioning', () => {
    expect(phaseAfterCardClose('field', false)).toBe('field');
    expect(phaseAfterCardClose('field', true)).toBe('transition');
    expect(phaseAfterCardClose('bouquet', true)).toBe('bouquet');
  });
});
