import { cookies } from "next/headers";

import { afterEach, describe, expect, it, vi } from "vitest";

import { COOKIES_NAME } from "../../constant/cookies-name";
import { getCookies } from ".././getCookies";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("getCookies", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when auth cookies exist", () => {
    it("should return access and refresh token values", async () => {
      // Given
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn((name: string) => {
          if (name === COOKIES_NAME.AUTHENTICATION_ACCESS_TOKEN) {
            return { value: "access-token" };
          }
          if (name === COOKIES_NAME.AUTHENTICATION_REFRESH_TOKEN) {
            return { value: "refresh-token" };
          }
          return undefined;
        }),
      } as any);

      // When
      const result = await getCookies();

      // Then
      expect(result).toEqual({
        access_token: "access-token",
        refresh_token: "refresh-token",
      });
    });
  });

  describe("when auth cookies are missing", () => {
    it("should return undefined token values", async () => {
      // Given
      vi.mocked(cookies).mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      } as any);

      // When
      const result = await getCookies();

      // Then
      expect(result).toEqual({
        access_token: undefined,
        refresh_token: undefined,
      });
    });
  });
});
