import { mmToPx } from '@/utils/dimensions';

export const DEFAULT_SAFE_MM = 1.0;
export const strokePx = (mm: number) => mmToPx(mm);
export const safePx = (mm: number) => mmToPx(mm);
export function clamp(val: number, min: number, max: number) {
  return Math.min(max, Math.max(min, val));
}
