import { afterEach, describe, expect, it, vi } from "vitest";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { COOKIES_NAME } from "../../constant/cookies-name";
import { setCookies } from ".././setCookies";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("jsonwebtoken", () => ({
  default: {
    decode: vi.fn(),
  },
}));

describe("setCookies", () => {
  afterEach(() => {
    delete process.env.MODE;
    delete process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME;
    delete process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME;
    vi.restoreAllMocks();
  });

  describe("when tokens contain expiration claims", () => {
    it("should set auth cookies with decoded expiration dates", async () => {
      // Given
      const set = vi.fn();
      vi.mocked(cookies).mockResolvedValue({ set } as any);
      vi.mocked(jwt.decode)
        .mockReturnValueOnce({ exp: 100 })
        .mockReturnValueOnce({ exp: 200 });

      // When
      await setCookies("access-token", "refresh-token");

      // Then
      expect(set).toHaveBeenCalledWith({
        name: COOKIES_NAME.AUTHENTICATION_ACCESS_TOKEN,
        value: "access-token",
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        path: "/",
        expires: 100000,
      });
      expect(set).toHaveBeenCalledWith({
        name: COOKIES_NAME.AUTHENTICATION_REFRESH_TOKEN,
        value: "refresh-token",
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        path: "/",
        expires: 200000,
      });
    });
  });

  describe("when token cannot be decoded", () => {
    it("should use configured fallback expiration values", async () => {
      // Given
      process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME = "1000";
      process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME = "2000";
      process.env.MODE = "production";
      const set = vi.fn();
      vi.mocked(cookies).mockResolvedValue({ set } as any);
      vi.mocked(jwt.decode).mockReturnValue(null);

      // When
      await setCookies("access-token", "refresh-token");

      // Then
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: COOKIES_NAME.AUTHENTICATION_ACCESS_TOKEN,
          secure: true,
          expires: 1000,
        }),
      );
      expect(set).toHaveBeenCalledWith(
        expect.objectContaining({
          name: COOKIES_NAME.AUTHENTICATION_REFRESH_TOKEN,
          secure: true,
          expires: 2000,
        }),
      );
    });
  });
});
