import { useEffect, useState } from "react";
import { SortRule } from "../types/sort";

export function useSort(forceUpdate: () => void) {
  const initialSort: SortRule = {
    key: "name",
    order: "asc",
  };

  const [sort, setSort] = useState<SortRule[]>([initialSort]);

  useEffect(() => {
    forceUpdate();
  }, [sort]);

  return { setSort };
}
