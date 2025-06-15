
import { describe, it, expect } from "vitest";
import { usePreviewLayout } from "../usePreviewLayout";

describe("usePreviewLayout", () => {
  it("returns pixel dimensions and line heights", () => {
    const result = usePreviewLayout({
      widthMm: 40,
      heightMm: 20,
      lines: [{ fontSize: 16 }, { fontSize: 20 }]
    });
    expect(result.widthPx).toBe(400);
    expect(result.heightPx).toBe(200);
    expect(result.lineHeightsPx).toEqual([16, 20]);
  });
});
