import {
  type SortOrder,
  type SortRules,
} from "@/srcApp/pages/dashboard/model/types/sort";

export function buildSortMap(
  sort: SortRules[]
): Map<SortRules["key"], { order: SortOrder; index: number }> {
  return new Map<SortRules["key"], { order: SortOrder; index: number }>(
    sort.map((rule, index) => [rule.key, { order: rule.order, index }])
  );
}
