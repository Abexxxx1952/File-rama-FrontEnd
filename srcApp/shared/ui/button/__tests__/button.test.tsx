import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "..";

describe("Button", () => {
  describe("when user clicks enabled button", () => {
    it("should call click handler", async () => {
      // Given
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<Button text="Save" onClick={onClick} />);

      // When
      await user.click(screen.getByRole("button", { name: /save/i }));

      // Then
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("when button is loading", () => {
    it("should disable the button and expose loading state", () => {
      // Given
      render(<Button text="Save" loading />);

      // When
      const button = screen.getByRole("button", { name: /loading/i });

      // Then
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-busy", "true");
    });
  });

  describe("when button is disabled", () => {
    it("should not call click handler", async () => {
      // Given
      const user = userEvent.setup();
      const onClick = vi.fn();

      render(<Button text="Save" disabled onClick={onClick} />);

      // When
      await user.click(screen.getByRole("button", { name: /save/i }));

      // Then
      expect(onClick).not.toHaveBeenCalled();
    });
  });
});
