import { describe, it, expect } from "vitest";
import { getFileIconUrl } from "../getFileIconUrl";

describe("getFileIconUrl", () => {
  it("should return correct icon for document formats", () => {
    expect(getFileIconUrl("pdf")).toBe("pdf.png");
    expect(getFileIconUrl("doc")).toBe("doc.png");
    expect(getFileIconUrl("docx")).toBe("doc.png");
    expect(getFileIconUrl("txt")).toBe("txt.png");
  });

  it("should return correct icon for spreadsheet formats", () => {
    expect(getFileIconUrl("xls")).toBe("xls.png");
    expect(getFileIconUrl("xlsx")).toBe("xls.png");
    expect(getFileIconUrl("csv")).toBe("csv.png");
  });

  it("should return correct icon for image formats", () => {
    expect(getFileIconUrl("jpg")).toBe("jpg.png");
    expect(getFileIconUrl("png")).toBe("png.png");
    expect(getFileIconUrl("gif")).toBe("gif.png");
    expect(getFileIconUrl("svg")).toBe("svg.png");
    expect(getFileIconUrl("avif")).toBe("avif.png");
  });

  it("should return correct icon for video formats", () => {
    expect(getFileIconUrl("mp4")).toBe("video.png");
    expect(getFileIconUrl("avi")).toBe("video.png");
    expect(getFileIconUrl("mkv")).toBe("video.png");
    expect(getFileIconUrl("mpeg")).toBe("video.png");
    expect(getFileIconUrl("wmv")).toBe("video.png");
    expect(getFileIconUrl("flv")).toBe("video.png");
    expect(getFileIconUrl("mpg")).toBe("mpg.png");
  });

  it("should return correct icon for audio formats", () => {
    expect(getFileIconUrl("mp3")).toBe("mp3.png");
  });

  it("should return correct icon for archive formats", () => {
    expect(getFileIconUrl("zip")).toBe("zip.png");
    expect(getFileIconUrl("rar")).toBe("rar.png");
  });

  it("should return correct icon for code formats", () => {
    expect(getFileIconUrl("js")).toBe("js.png");
    expect(getFileIconUrl("html")).toBe("html.png");
    expect(getFileIconUrl("json")).toBe("json.png");
  });

  it("should return correct icon for executable formats", () => {
    expect(getFileIconUrl("exe")).toBe("exe.png");
    expect(getFileIconUrl("apk")).toBe("apk.png");
  });

  it("should be case insensitive", () => {
    expect(getFileIconUrl("PDF")).toBe("pdf.png");
    expect(getFileIconUrl("Jpg")).toBe("jpg.png");
    expect(getFileIconUrl("MP4")).toBe("video.png");
  });

  it("should return default icon for unknown extensions", () => {
    expect(getFileIconUrl("unknown")).toBe("unknown.png");
    expect(getFileIconUrl("xyz")).toBe("unknown.png");
    expect(getFileIconUrl("")).toBe("unknown.png");
  });
});
