import { SelectedMap } from "./types/selectedMap";

export function getLastAndSecondLastFromMap(map: SelectedMap): {
  secondLast: number;
  last: number;
} | null {
  if (map.size < 2) {
    return null;
  }

  const values = Array.from(map.values());

  const last = values[values.length - 1]["index"];

  const secondLast = values[values.length - 2]["index"];

  return { secondLast, last };
}
