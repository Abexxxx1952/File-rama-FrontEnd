import { afterEach, describe, expect, it, vi } from "vitest";
import { cookies } from "next/headers";
import { COOKIES_NAME } from "../../constant/cookies-name";
import { clearCookies } from ".././clearCookies";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("clearCookies", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when cookie store is available", () => {
    it("should expire auth cookies", async () => {
      // Given
      const set = vi.fn();
      vi.mocked(cookies).mockResolvedValue({ set } as any);

      // When
      await clearCookies();

      // Then
      expect(set).toHaveBeenCalledWith({
        name: COOKIES_NAME.AUTHENTICATION_ACCESS_TOKEN,
        value: "",
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      });
      expect(set).toHaveBeenCalledWith({
        name: COOKIES_NAME.AUTHENTICATION_REFRESH_TOKEN,
        value: "",
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      });
    });
  });

  describe("when clearing cookies fails", () => {
    it("should log and rethrow error", async () => {
      // Given
      const error = new Error("Cookie store error");
      vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(cookies).mockRejectedValue(error);

      // When / Then
      await expect(clearCookies()).rejects.toThrow(error);
      expect(console.error).toHaveBeenCalledWith(
        "Failed to clear cookies:",
        error,
      );
    });
  });
});
