import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "..";

describe("Switch", () => {
  describe("when switch is checked", () => {
    it("should render checked state", () => {
      // Given
      render(<Switch text="Two factor authorization" value />);

      // When
      const switchInput = screen.getByLabelText(/two factor authorization/i);

      // Then
      expect(switchInput).toBeChecked();
    });
  });

  describe("when user clicks switch", () => {
    it("should call change handler", async () => {
      // Given
      const user = userEvent.setup();
      const onChange = vi.fn();

      render(<Switch text="Two factor authorization" onChange={onChange} />);

      // When
      await user.click(screen.getByLabelText(/two factor authorization/i));

      // Then
      expect(onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("when switch has an error", () => {
    it("should expose invalid state and render alert", () => {
      // Given
      render(<Switch text="Two factor authorization" error="Cannot update" />);

      // When
      const switchInput = screen.getByLabelText(/two factor authorization/i);

      // Then
      expect(switchInput).toHaveAttribute("aria-invalid", "true");
      expect(screen.getByRole("alert")).toHaveTextContent("Cannot update");
    });
  });
});
