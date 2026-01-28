"use client";

import styles from "./styles.module.css";

export function DashboardTableHeader() {
  return (
    <div className={styles.tableHeader}>
      <span
        className={`${styles.tableHeader__name} ${styles.tableHeader__column}`}
      >
        Name
      </span>

      <span
        className={`${styles.tableHeader__size} ${styles.tableHeader__column}`}
      >
        Size
      </span>
      <span
        className={`${styles.tableHeader__uploadDate} ${styles.tableHeader__column}`}
      >
        Upload Date
      </span>
      <span
        className={`${styles.tableHeader__public} ${styles.tableHeader__column}`}
      >
        Public
      </span>
    </div>
  );
}
