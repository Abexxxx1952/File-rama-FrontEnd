import { useCallback, useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { getFileSystemCacheTags } from "../getFileSystemCacheTags";
import { getFolderPathCacheTags } from "../getFolderPathCacheTags";
import { splitSortRules } from "../splitSortRules";
import {
  FileSystemSortKey,
  SORT_ORDER,
  type SortOrder,
  type SortRules,
} from "../types/sort";

const path = "/dashboard";

const initialSort: SortRules = {
  key: FileSystemSortKey.name,
  order: SORT_ORDER.ASC,
};
export function useDashboardNavigation(ids: string[]) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [sort, sortRules] = useMemo(() => {
    const fromPath = getSortFromPath();
    const resolvedSort = fromPath.length > 0 ? fromPath : [initialSort];
    return [resolvedSort, splitSortRules(resolvedSort)] as const;
  }, [searchParams.toString()]);

  const setSortToPath = useCallback(
    (sort: SortRules[]) => {
      const params = new URLSearchParams(searchParams);
      params.delete("sort");
      params.delete("order");

      for (const rule of sort) {
        params.append("sort", rule.key);
        params.append("order", rule.order);
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams.toString(), router, pathname]
  );

  const upsertSortRule = useCallback(
    (newRule: SortRules) => {
      const current = getSortFromPath();
      const filtered = current.filter((r) => r.key !== newRule.key);
      setSortToPath([newRule, ...filtered]);
    },
    [setSortToPath]
  );

  function getSortFromPath(): SortRules[] {
    const VALID_SORT_KEYS = [...Object.values(FileSystemSortKey)] as const;
    const VALID_ORDERS = [...Object.values(SORT_ORDER)] as const;

    const sortParams = searchParams.getAll("sort");
    const orderParams = searchParams.getAll("order");

    const result: {
      key: (typeof VALID_SORT_KEYS)[number];
      order: (typeof VALID_ORDERS)[number];
    }[] = [];

    for (let i = 0; i < sortParams.length; i++) {
      const rawKey = sortParams[i];
      const rawOrder = orderParams[i];

      if (!rawKey || !rawOrder) {
        continue;
      }

      if (
        VALID_SORT_KEYS.includes(rawKey as any) &&
        VALID_ORDERS.includes(rawOrder as any)
      ) {
        result.push({
          key: rawKey as FileSystemSortKey,
          order: rawOrder as SortOrder,
        });
      }
    }

    return result;
  }

  const currentParentFolderId = ids.at(-1) ?? null;
  const grandParentId = ids.at(-2) ?? null;

  const fileSystemItemsCurrentTag = useMemo(() => {
    return getFileSystemCacheTags(currentParentFolderId, sortRules);
  }, [currentParentFolderId, sortRules]);

  const folderPathTag = useMemo(() => {
    return getFolderPathCacheTags(currentParentFolderId);
  }, [currentParentFolderId]);

  const routerForward = useCallback(
    (param: string) => {
      router.push(`${path}/${[...ids, param].join("/")}`);
    },
    [ids, router]
  );

  const routerBack = useCallback(() => {
    const nextIds = ids.slice(0, -1);
    router.push(
      nextIds.length > 1 ? `${path}/${nextIds.join("/")}` : `${path}/null`
    );
  }, [ids, router]);

  return {
    routerForward,
    routerBack,
    currentParentFolderId,
    grandParentId,
    fileSystemItemsCurrentTag,
    folderPathTag,
    sort,
    upsertSortRule,
    sortRules,
  };
}
