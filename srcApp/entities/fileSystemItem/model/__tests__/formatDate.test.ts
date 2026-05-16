import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { formatDate } from "../formatDate";

describe("formatDate", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should format ISO date string to Russian locale", () => {
    const isoDate = "2026-05-15T10:30:00.000Z";
    const result = formatDate(isoDate);

    expect(result).toMatch(/\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}/);
  });

  it("should format date with correct time", () => {
    const isoDate = "2026-01-01T00:00:00.000Z";
    const result = formatDate(isoDate);

    expect(result).toContain("01.01.2026");
  });

  it("should format time with 2-digit hour and minute", () => {
    const isoDate = "2026-05-15T09:05:00.000Z";
    const result = formatDate(isoDate);

    const timePart = result.split(" ")[1];
    expect(timePart).toMatch(/\d{2}:\d{2}/);
  });

  it("should handle different dates correctly", () => {
    const dates = [
      "2026-12-31T23:59:59.000Z",
      "2026-01-01T00:00:00.000Z",
      "2026-06-15T12:30:45.000Z",
    ];

    dates.forEach((date) => {
      const result = formatDate(date);
      expect(result).toMatch(/\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}/);
    });
  });
});
