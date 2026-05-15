import { describe, it, expect } from "vitest";
import { formatBytes } from "../formatBytes";

describe("formatBytes", () => {
  it("should format bytes correctly", () => {
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(500)).toBe("500 Bytes");
    expect(formatBytes(1023)).toBe("1023 Bytes");
  });

  it("should format kilobytes correctly", () => {
    expect(formatBytes(1024)).toBe("1 Kb");
    expect(formatBytes(1536)).toBe("1.5 Kb");
    expect(formatBytes(10240)).toBe("10 Kb");
  });

  it("should format megabytes correctly", () => {
    expect(formatBytes(1048576)).toBe("1 Mb");
    expect(formatBytes(1572864)).toBe("1.5 Mb");
    expect(formatBytes(10485760)).toBe("10 Mb");
  });

  it("should format gigabytes correctly", () => {
    expect(formatBytes(1073741824)).toBe("1 Gb");
    expect(formatBytes(1610612736)).toBe("1.5 Gb");
    expect(formatBytes(10737418240)).toBe("10 Gb");
  });

  it("should round to 2 decimal places", () => {
    expect(formatBytes(1234567)).toBe("1.18 Mb");
    expect(formatBytes(123456789)).toBe("117.74 Mb");
  });

  it("should not exceed Gb unit", () => {
    expect(formatBytes(10995116277760)).toBe("10240 Gb");
  });
});
