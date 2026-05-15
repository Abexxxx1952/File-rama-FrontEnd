import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Registration } from "..";
import { registerUser } from "../../model/registerUser";

const router = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock("next/navigation", () => ({
  useRouter: () => router,
}));

vi.mock("../../model/registerUser", () => ({
  registerUser: vi.fn(),
}));

describe("Registration", () => {
  describe("when user submits valid registration form", () => {
    it("should call register action with form values", async () => {
      // Given
      const user = userEvent.setup();
      const mockedRegisterUser = vi.mocked(registerUser);

      render(<Registration />);

      // When
      await user.type(screen.getByPlaceholderText(/email/i), "user@example.com");
      await user.type(screen.getByPlaceholderText(/^password$/i), "secret");
      await user.type(screen.getByPlaceholderText(/repeat password/i), "secret");
      await user.click(screen.getByRole("button", { name: /registration/i }));

      // Then
      await waitFor(() =>
        expect(mockedRegisterUser).toHaveBeenCalledWith(
          {
            email: "user@example.com",
            password: "secret",
            passwordRepeat: "secret",
          },
          expect.any(Function),
          router,
        ),
      );
    });
  });

  describe("when passwords do not match", () => {
    it("should show password match error", async () => {
      // Given
      const user = userEvent.setup();
      const mockedRegisterUser = vi.mocked(registerUser);

      render(<Registration />);

      // When
      await user.type(screen.getByPlaceholderText(/email/i), "user@example.com");
      await user.type(screen.getByPlaceholderText(/^password$/i), "secret");
      await user.type(screen.getByPlaceholderText(/repeat password/i), "another");
      await user.click(screen.getByRole("button", { name: /registration/i }));

      // Then
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Passwords do not match",
      );
      expect(mockedRegisterUser).not.toHaveBeenCalled();
    });
  });
});
