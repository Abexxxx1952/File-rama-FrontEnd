import { afterEach, describe, expect, it, vi } from "vitest";

import { fetchWithAuth } from "@/srcApp/shared/model/fetchWithAuth";

import { emailConfirmation } from ".././emailConfirmation";

vi.mock("@/srcApp/shared/model/fetchWithAuth", () => ({
  fetchWithAuth: vi.fn(),
}));

describe("emailConfirmation", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("when fetchWithAuth succeeds", () => {
    it("should call fetchWithAuth with correct parameters and return result", async () => {
      // Given
      const setLoading = vi.fn();
      const mockResult = { message: "Confirmation email sent" };
      vi.mocked(fetchWithAuth).mockResolvedValue(mockResult);

      // When
      const result = await emailConfirmation(setLoading);

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        { abortControllerRef: undefined },
        expect.any(Function),
        setLoading
      );
      expect(result).toEqual(mockResult);
    });

    it("should pass abortControllerRef when provided", async () => {
      // Given
      const setLoading = vi.fn();
      const abortControllerRef = { current: new AbortController() };
      vi.mocked(fetchWithAuth).mockResolvedValue({ message: "Success" });

      // When
      await emailConfirmation(setLoading, abortControllerRef);

      // Then
      expect(fetchWithAuth).toHaveBeenCalledWith(
        expect.any(Function),
        { abortControllerRef },
        expect.any(Function),
        setLoading
      );
    });
  });

  describe("when fetchWithAuth returns null", () => {
    it("should return null", async () => {
      // Given
      const setLoading = vi.fn();
      vi.mocked(fetchWithAuth).mockResolvedValue(null);

      // When
      const result = await emailConfirmation(setLoading);

      // Then
      expect(result).toBeNull();
    });
  });
});
