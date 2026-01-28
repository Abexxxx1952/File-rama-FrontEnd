import { useCallback, useState } from "react";
import { SelectedMap } from "../types/selectedMap";

export function useSelection() {
  const [selected, setSelected] = useState<SelectedMap>(new Map());

  const isSelected = useCallback(
    (id?: string) => (id ? selected.has(id) : selected.size > 0),
    [selected],
  );

  const toggle = useCallback((id: string, isFile: boolean, index: number) => {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.set(id, isFile ? { index, fileId: id } : { index, folderId: id });
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => setSelected(new Map()), []);

  return { selected, setSelected, isSelected, toggle, clear };
}
