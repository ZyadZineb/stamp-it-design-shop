
import React from "react";
import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StampPreview from "../StampPreview";

describe("StampPreview", () => {
  it("renders basic preview and controls", () => {
    const { getByText } = render(
      <StampPreview
        previewImage={null}
        productSize="38x14mm"
        previewRef={React.createRef()}
        isDragging={false}
        activeLineIndex={null}
        includeLogo={false}
        downloadAsPng={() => {}}
        onMouseDown={() => {}}
        onMouseMove={() => {}}
        onMouseUp={() => {}}
        onTouchStart={() => {}}
        onTouchMove={() => {}}
      />
    );
    expect(getByText(/Stamp Preview/i)).toBeInTheDocument();
    expect(getByText(/Physical size/i)).toBeInTheDocument();
  });

  it("renders a preview image if present", () => {
    const { getByAltText } = render(
      <StampPreview
        previewImage="data:image/png;base64,asdf123"
        productSize="38x14mm"
        previewRef={React.createRef()}
        isDragging={false}
        activeLineIndex={null}
        includeLogo={false}
        downloadAsPng={() => {}}
        onMouseDown={() => {}}
        onMouseMove={() => {}}
        onMouseUp={() => {}}
        onTouchStart={() => {}}
        onTouchMove={() => {}}
      />
    );
    expect(getByAltText(/stamp design/i)).toBeInTheDocument();
  });
});
