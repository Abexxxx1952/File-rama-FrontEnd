import { describe, it, expect } from "vitest";
import { isErrorData } from "../isErrorData";

describe("isErrorData", () => {
  it("should return true for valid ErrorData object", () => {
    const error = {
      message: "Something went wrong",
      statusCode: 500,
      error: "Internal Server Error",
    };

    expect(isErrorData(error)).toBe(true);
  });

  it("should return false for null", () => {
    expect(isErrorData(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isErrorData(undefined)).toBe(false);
  });

  it("should return false for primitive types", () => {
    expect(isErrorData("error")).toBe(false);
    expect(isErrorData(123)).toBe(false);
    expect(isErrorData(true)).toBe(false);
  });

  it("should return false for object missing message field", () => {
    const error = {
      statusCode: 500,
      error: "Internal Server Error",
    };

    expect(isErrorData(error)).toBe(false);
  });

  it("should return false for object missing statusCode field", () => {
    const error = {
      message: "Something went wrong",
      error: "Internal Server Error",
    };

    expect(isErrorData(error)).toBe(false);
  });

  it("should return false for object missing error field", () => {
    const error = {
      message: "Something went wrong",
      statusCode: 500,
    };

    expect(isErrorData(error)).toBe(false);
  });

  it("should return false for empty object", () => {
    expect(isErrorData({})).toBe(false);
  });

  it("should return true for object with extra fields", () => {
    const error = {
      message: "Something went wrong",
      statusCode: 500,
      error: "Internal Server Error",
      extraField: "extra",
    };

    expect(isErrorData(error)).toBe(true);
  });

  it("should handle Error instances", () => {
    const error = new Error("Test error");
    expect(isErrorData(error)).toBe(false);
  });
});
