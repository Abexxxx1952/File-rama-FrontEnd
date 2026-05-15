import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Login } from "..";
import { loginUser } from "../../model/loginUser";

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

vi.mock("../../model/loginUser", () => ({
  loginUser: vi.fn(),
}));

describe("Login", () => {
  describe("when user fills credentials and submits form", () => {
    it("should call login action with form values", async () => {
      // Given
      const user = userEvent.setup();
      const mockedLoginUser = vi.mocked(loginUser);

      render(<Login />);

      // When
      await user.type(screen.getByPlaceholderText(/email/i), "user@example.com");
      await user.type(screen.getByPlaceholderText(/password/i), "secret");
      await user.click(screen.getByRole("button", { name: /login/i }));

      // Then
      expect(mockedLoginUser).toHaveBeenCalledWith(
        "user@example.com",
        "secret",
        expect.any(Function),
        expect.any(Function),
        router,
      );
    });
  });
});
