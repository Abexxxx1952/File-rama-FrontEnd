export function getPenultimate(arr: string[]): string | null {
  if (arr.length < 2) return null;
  return arr[arr.length - 2];
}
