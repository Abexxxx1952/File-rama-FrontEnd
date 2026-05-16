import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Input } from "..";

describe("Input", () => {
  describe("when input has a label", () => {
    it("should render accessible input by label", () => {
      // Given
      render(
        <Input text="Email" value="user@example.com" onChange={vi.fn()} />
      );

      // When
      const input = screen.getByLabelText(/email/i);

      // Then
      expect(input).toHaveValue("user@example.com");
    });
  });

  describe("when user types into input", () => {
    it("should call change handler", async () => {
      // Given
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Input placeholder="Email" onChange={onChange} />);

      // When
      await user.type(screen.getByPlaceholderText(/email/i), "a");

      // Then
      expect(onChange).toHaveBeenCalled();
    });
  });

  describe("when input has an error", () => {
    it("should expose invalid state and render alert", () => {
      // Given
      render(<Input text="Email" error="Invalid email address" />);

      // When
      const input = screen.getByLabelText(/email/i);

      // Then
      expect(input).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Invalid email address"
      );
    });
  });
});
