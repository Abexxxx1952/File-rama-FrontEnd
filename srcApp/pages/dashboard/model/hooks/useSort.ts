import { useMemo, useState } from "react";

import { splitSortRules } from "../splitSortRules";
import {
  FileSystemSortKey,
  SORT_ORDER,
  type SortFileSystemRules,
  type SortRules,
} from "../types/sort";

export function useSort() {
  const initialSort: SortRules = {
    key: FileSystemSortKey.name,
    order: SORT_ORDER.ASC,
  };

  const [sort, setSort] = useState<SortRules[]>([initialSort]);

  const sortRules: SortFileSystemRules = useMemo(() => {
    return splitSortRules(sort);
  }, [sort]);

  function upsertSortRule(newRule: SortRules) {
    setSort((prev) => {
      const index = prev.findIndex((r) => r.key === newRule.key);

      if (index === -1) {
        return [newRule, ...prev];
      }

      return [newRule, ...prev.slice(0, index), ...prev.slice(index + 1)];
    });
  }

  return { sort, upsertSortRule, sortRules };
}
