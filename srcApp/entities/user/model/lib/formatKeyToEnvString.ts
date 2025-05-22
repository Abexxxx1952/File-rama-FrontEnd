export function formatKeyToEnvString(key: string): string {
  const trimmed = key.trim().replace(/^["']|["']$/g, "");

  if (trimmed.includes("\\n")) {
    return trimmed.replace(/\r+?\n+/g, "\\n");
  }

  let withoutHeaderFooter = trimmed
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .trim();

  const bodyLines = withoutHeaderFooter.split(/\s+/).filter(Boolean);

  const formattedKey = [
    "-----BEGIN PRIVATE KEY-----",
    ...bodyLines,
    "-----END PRIVATE KEY-----",
  ].join("\\n");

  return formattedKey;
}
