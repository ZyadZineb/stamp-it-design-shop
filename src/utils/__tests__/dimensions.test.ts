
import { describe, it, expect } from 'vitest';
import { mmToPx } from '../dimensions';

describe('mmToPx', () => {
  it('converts millimeters to pixels (basic)', () => {
    expect(mmToPx(1)).toBe(10);
    expect(mmToPx(0)).toBe(0);
    expect(mmToPx(38)).toBe(380);
  });
  it('converts decimal values correctly', () => {
    expect(mmToPx(2.5)).toBe(25);
    expect(mmToPx(14.2)).toBe(142);
  });
  it('handles negative and edge values', () => {
    expect(mmToPx(-1)).toBe(-10);
    expect(mmToPx(NaN)).toBeNaN();
  });
});
