import { toast } from "react-toastify";
import { afterEach, describe, expect, it, vi } from "vitest";

import { notifyResponse } from ".././notifyResponse";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe("notifyResponse", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("when response is error data", () => {
    it("should show error toast with error details", () => {
      // Given / When
      notifyResponse({
        isError: true,
        responseResult: {
          error: "Forbidden",
          message: "Access denied",
          statusCode: 403,
        },
      });

      // Then
      expect(toast.error).toHaveBeenCalledWith(
        "Error:  Forbidden. Massage: Access denied",
        { position: "top-right" }
      );
    });
  });

  describe("when response is unexpected error with fallback message", () => {
    it("should show provided error message", () => {
      // Given / When
      notifyResponse({ isError: true, responseResult: null }, "Try again");

      // Then
      expect(toast.error).toHaveBeenCalledWith("Try again", {
        position: "top-right",
      });
    });
  });

  describe("when response is successful", () => {
    it("should show success toast", () => {
      // Given / When
      notifyResponse({
        isError: false,
        successMessage: "Saved",
      });

      // Then
      expect(toast.success).toHaveBeenCalledWith("Saved", {
        position: "top-right",
      });
    });
  });
});
