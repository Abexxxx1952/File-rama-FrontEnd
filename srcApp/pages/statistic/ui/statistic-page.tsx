"use client";

import { useEffect, useState } from "react";

import { DriverInfo, PieChartGeneral } from "@/srcApp/entities/stats/";
import { getStat } from "@/srcApp/entities/stats/model/getStat";
import { isDriveInfoErrorResult } from "@/srcApp/entities/stats/model/isDriveInfoErrorResult";
import { isDriveInfoSuccessResult } from "@/srcApp/entities/stats/model/isDriveInfoSuccessResult";
import { type Stat } from "@/srcApp/entities/stats/model/types/stat";
import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { Loading } from "@/srcApp/shared/ui/loading";

import styles from "./styles.module.css";

export function StatisticPage() {
  const [stat, setStat] = useState<Stat | null>();

  useEffect(() => {
    (async () => {
      const stat = await getStat();

      setStat(stat);
    })();
  }, []);

  if (!stat) {
    return <Loading />;
  }

  const availableSize = stat.totalSize - stat.usedSize;
  const usagePercent = stat.totalSize
    ? Math.round((stat.usedSize / stat.totalSize) * 100)
    : 0;
  const connectedDriveCount = stat.driveInfoResult.filter(
    isDriveInfoSuccessResult
  ).length;
  const driveErrorCount = stat.driveInfoResult.filter(
    isDriveInfoErrorResult
  ).length;

  return (
    <section className={styles.stats} aria-labelledby="statistic-title">
      <header className={styles.header}>
        <span className={styles.eyebrow}>Storage overview</span>
        <h1 className={styles.stats__title} id="statistic-title">
          General Statistic
        </h1>
        <p className={styles.description}>
          Track how much space your files use and check every connected drive at
          a glance.
        </p>
      </header>

      <section className={styles.overview} aria-label="Storage usage overview">
        <div className={styles.chartCard}>
          <div className={styles.chartCard__header}>
            <div>
              <span className={styles.cardLabel}>Total storage</span>
              <strong className={styles.cardValue}>
                {formatBytes(stat.totalSize)}
              </strong>
            </div>
            <span className={styles.usageBadge}>{usagePercent}% used</span>
          </div>
          <div className={styles.pieChart}>
            <PieChartGeneral
              data={[
                { name: "Used Space", value: stat.usedSize },
                { name: "Available Space", value: availableSize },
              ]}
            />
          </div>
        </div>

        <dl className={styles.metricGrid}>
          <div className={styles.metricCard}>
            <dt className={styles.cardLabel}>Used space</dt>
            <dd className={styles.cardValue}>{formatBytes(stat.usedSize)}</dd>
          </div>
          <div className={styles.metricCard}>
            <dt className={styles.cardLabel}>Available space</dt>
            <dd className={styles.cardValue}>{formatBytes(availableSize)}</dd>
          </div>
          <div className={styles.metricCard}>
            <dt className={styles.cardLabel}>Folders</dt>
            <dd className={styles.cardValue}>{stat.folderCount}</dd>
          </div>
          <div className={styles.metricCard}>
            <dt className={styles.cardLabel}>Files</dt>
            <dd className={styles.cardValue}>{stat.fileCount}</dd>
          </div>
        </dl>
      </section>

      <section
        className={styles.driveSection}
        aria-labelledby="drive-info-title"
      >
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle} id="drive-info-title">
            Drive Info
          </h2>
          <div className={styles.driveStatusGroup}>
            <span className={styles.driveCount}>
              {connectedDriveCount} connected
            </span>
            {driveErrorCount > 0 && (
              <span className={styles.driveErrorCount}>
                {driveErrorCount} error
              </span>
            )}
          </div>
        </div>
        <ul className={styles.stats__driveInfo}>
          {stat.driveInfoResult.map((drive) => {
            return (
              <li
                className={styles.stats__driveInfoItem}
                key={drive.driveEmail}
              >
                <DriverInfo drive={drive} />
              </li>
            );
          })}
        </ul>
      </section>
    </section>
  );
}
