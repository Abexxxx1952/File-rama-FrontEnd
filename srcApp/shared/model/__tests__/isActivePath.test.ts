import { describe, expect, it, vi } from "vitest";

import { isActivePath } from "../isActivePath";

vi.mock("@/srcApp/shared/constants/header-list", () => ({
  HEADER_ITEMS: [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/settings", label: "Settings" },
    { path: "/about", label: "About" },
  ],
}));

describe("isActivePath", () => {
  it("should return true when pathname starts with elemPath", () => {
    expect(isActivePath("/dashboard/files", "/dashboard")).toBe(true);
    expect(isActivePath("/settings/profile", "/settings")).toBe(true);
  });

  it("should return false when pathname does not start with elemPath", () => {
    expect(isActivePath("/dashboard", "/settings")).toBe(false);
    expect(isActivePath("/about", "/dashboard")).toBe(false);
  });

  it("should handle root path correctly when pathname is a header item path", () => {
    expect(isActivePath("/dashboard", "/")).toBe(false);
    expect(isActivePath("/settings", "/")).toBe(false);
    expect(isActivePath("/about", "/")).toBe(false);
  });

  it("should return true for root path when pathname is not a header item", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/unknown", "/")).toBe(true);
  });

  it("should handle null pathname", () => {
    expect(isActivePath(null, "/dashboard")).toBe(false);
    expect(isActivePath(null, "/")).toBe(false);
  });

  it("should handle exact path match", () => {
    expect(isActivePath("/dashboard", "/dashboard")).toBe(true);
    expect(isActivePath("/settings", "/settings")).toBe(true);
  });

  it("should handle nested paths", () => {
    expect(isActivePath("/dashboard/files/folder1", "/dashboard")).toBe(true);
    expect(isActivePath("/dashboard/files/folder1", "/dashboard/files")).toBe(
      true
    );
  });

  it("should be case sensitive", () => {
    expect(isActivePath("/Dashboard", "/dashboard")).toBe(false);
  });
});
