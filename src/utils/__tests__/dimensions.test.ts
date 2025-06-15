
import { describe, it, expect } from "vitest";
import { mmToPx } from "../dimensions";

describe("mmToPx", () => {
  it("converts millimeters to pixels", () => {
    expect(mmToPx(1)).toBe(10);
    expect(mmToPx(0)).toBe(0);
    expect(mmToPx(5.5)).toBe(55);
  });
});
