
import { describe, it, expect } from "vitest";
import { mmToPx } from "../dimensions";

describe("mmToPx", () => {
  it("converts mm to px accurately", () => {
    expect(mmToPx(0)).toBe(0);
    expect(mmToPx(1)).toBe(10);
    expect(mmToPx(10)).toBe(100);
    expect(mmToPx(25.4)).toBeCloseTo(254, 0);
  });
});
