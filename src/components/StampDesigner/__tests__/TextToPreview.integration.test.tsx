/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StampDesigner from "../index";
import { Product } from "@/types";
import { products } from "@/data/products";

describe("Integration: Text entry updates preview", () => {
  it("typing in the text area updates the live preview", async () => {
    // Use a real product with enough lines/room for realistic test
    const product: Product = products[0];
    render(<StampDesigner product={product} />);
    // Find the text input for the first line (might need to customize to your actual TextEditor UI)
    const input = screen.getByLabelText(/text line/i) || screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: "Integration Test" } });
    // Expect the preview to update. This assumes the preview area echos text.
    // You might have to adjust selector depending on how preview renders text.
    expect(await screen.findByText(/Integration Test/)).toBeInTheDocument();
  });
});
