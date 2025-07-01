export function getLastAndSecondLastFromMap<K, V>(
  map: Map<K, V>,
): {
  secondLast: { key: K; index: V };
  last: { key: K; index: V };
} | null {
  if (map.size < 2) {
    return null;
  }

  const entries = Array.from(map.entries());

  const last = {
    key: entries[entries.length - 1][0],
    index: entries[entries.length - 1][1],
  };

  const secondLast = {
    key: entries[entries.length - 2][0],
    index: entries[entries.length - 2][1],
  };

  return { secondLast, last };
}
