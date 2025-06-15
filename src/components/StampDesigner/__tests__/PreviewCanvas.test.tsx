
import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PreviewCanvas from "../PreviewCanvas";

describe("PreviewCanvas", () => {
  it("renders with correct dimensions and guides", () => {
    const { container } = render(
      <PreviewCanvas
        previewImage={null}
        widthMm={40}
        heightMm={20}
        productSize="40x20mm"
        zoomLevel={1}
      />
    );
    expect(container).toMatchSnapshot();
  });

  it("renders preview image if provided", () => {
    const { getByAltText } = render(
      <PreviewCanvas
        previewImage="data:image/png;base64,asdf1234"
        widthMm={38}
        heightMm={14}
        productSize="38x14mm"
        zoomLevel={1}
      />
    );
    expect(getByAltText(/stamp design/i)).toBeInTheDocument();
  });

  it('shows dragging overlay when isDragging is true', () => {
    const { container } = render(
      <PreviewCanvas
        previewImage={null}
        widthMm={38}
        heightMm={14}
        isDragging={true}
      />
    );
    expect(container.querySelector('.bg-blue-200\\/10')).toBeTruthy();
  });
});
