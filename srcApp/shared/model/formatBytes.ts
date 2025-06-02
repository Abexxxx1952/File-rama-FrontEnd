export function formatBytes(bytes: number): string {
  const units = ["Bytes", "Kb", "Mb", "Gb"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }

  value = parseFloat(value.toFixed(2));

  return `${value} ${units[unitIndex]}`;
}
