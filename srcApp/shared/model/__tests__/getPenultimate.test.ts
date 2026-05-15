import { describe, it, expect } from "vitest";
import { getPenultimate } from "../getPenultimate";

describe("getPenultimate", () => {
  it("should return null for empty array", () => {
    expect(getPenultimate([])).toBe(null);
  });

  it("should return null for array with one element", () => {
    expect(getPenultimate(["single"])).toBe(null);
  });

  it("should return penultimate element for array with two elements", () => {
    expect(getPenultimate(["first", "second"])).toBe("first");
  });

  it("should return penultimate element for array with multiple elements", () => {
    expect(getPenultimate(["a", "b", "c", "d"])).toBe("c");
  });

  it("should work with different string values", () => {
    expect(getPenultimate(["path", "to", "folder"])).toBe("to");
  });

  it("should handle array with numeric strings", () => {
    expect(getPenultimate(["1", "2", "3"])).toBe("2");
  });
});
