import { memo } from "react";

import {
  FileSystemSortKey,
  SORT_ORDER,
  type SortRules,
} from "@/srcApp/pages/dashboard/model/types/sort";

import { areDashboardTableHeaderEqual } from "../model/areDashboardTableHeaderEqual";
import { buildSortMap } from "../model/buildSortMap";
import { ArrowIcon } from "./arrow-icon/arrow-Icon";
import styles from "./styles.module.css";

export type DashboardTableHeaderProps = {
  sort: SortRules[];
  upsertSortRule: (newRule: SortRules) => void;
};
export const DashboardTableHeader = memo(function DashboardTableHeader({
  sort,
  upsertSortRule,
}: DashboardTableHeaderProps) {
  const sortMap = buildSortMap(sort);

  function columnClickHandler(columnName: SortRules["key"]) {
    const currentSortRule = sortMap.get(columnName);
    if (currentSortRule) {
      upsertSortRule({
        key: columnName,
        order:
          currentSortRule.order === SORT_ORDER.ASC
            ? SORT_ORDER.DESC
            : SORT_ORDER.ASC,
      });

      return;
    }
    upsertSortRule({ key: columnName, order: SORT_ORDER.ASC });
  }

  return (
    <div className={styles.tableHeader}>
      <span
        className={`${styles.tableHeader__name} ${styles.tableHeader__column} ${styles.tableHeader__column_hover}`}
        onClick={() => columnClickHandler(FileSystemSortKey.name)}
      >
        Name
        <ArrowIcon sortItem={sortMap.get(FileSystemSortKey.name)} />
      </span>

      <span
        className={`${styles.tableHeader__size} ${styles.tableHeader__column} ${styles.tableHeader__column_hover}`}
        onClick={() => columnClickHandler(FileSystemSortKey.size)}
      >
        Size
        <ArrowIcon sortItem={sortMap.get(FileSystemSortKey.size)} />
      </span>
      <span
        className={`${styles.tableHeader__uploadDate} ${styles.tableHeader__column} ${styles.tableHeader__column_hover}`}
        onClick={() => columnClickHandler(FileSystemSortKey.upload_date)}
      >
        Upload Date
        <ArrowIcon sortItem={sortMap.get(FileSystemSortKey.upload_date)} />
      </span>
      <span
        className={`${styles.tableHeader__publicRead} ${styles.tableHeader__column}`}
      >
        R
      </span>
      <span
        className={`${styles.tableHeader__publicWrite} ${styles.tableHeader__column}`}
      >
        W
      </span>
      <span
        className={`${styles.tableHeader__buttons} ${styles.tableHeader__column}`}
      >
        Controls
      </span>
    </div>
  );
}, areDashboardTableHeaderEqual);
