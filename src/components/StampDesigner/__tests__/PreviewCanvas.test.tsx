
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
      />
    );
    expect(container).toMatchSnapshot();
  });
});
