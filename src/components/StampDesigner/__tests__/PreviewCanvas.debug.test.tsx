
/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render } from "@testing-library/react";
import PreviewCanvas from "../PreviewCanvas";

describe("PreviewCanvas debug overlays", () => {
  it("renders grid, rulers, bounding boxes, and baselines when debug is enabled", () => {
    const mockBlocks = [
      { x: 10, y: 20, width: 80, height: 32, baseline: 46, key: "line1" },
      { x: 12, y: 60, width: 120, height: 32, baseline: 84, key: "line2" }
    ];
    const { container } = render(
      <PreviewCanvas
        previewImage={null}
        widthMm={40}
        heightMm={20}
        productSize="40x20mm"
        debug={{
          grid: true,
          rulers: true,
          boundingBoxes: true,
          baseline: true
        }}
        textBlocks={mockBlocks}
      />
    );
    // Grid lines (vertical & horizontal, at least a few)
    expect(container.querySelectorAll('line[stroke="#b3e1ff"]').length).toBeGreaterThan(10);
    // Ruler ticks (blue)
    expect(container.querySelectorAll('line[stroke="#3182ce"]').length).toBeGreaterThan(4);
    // Bounding boxes (rects)
    expect(container.querySelectorAll('rect[stroke="#ec4899"]').length).toBe(2);
    // Baselines
    expect(
      Array.from(container.querySelectorAll('line[stroke="#3b82f6"]')).filter(line => line.getAttribute("stroke-dasharray") === "4 4").length
    ).toBe(2);
    // Bounding box labels
    expect(container).toHaveTextContent("line1");
    expect(container).toHaveTextContent("line2");
  });
});
