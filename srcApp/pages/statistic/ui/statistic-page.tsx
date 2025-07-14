"use client";

import { useEffect, useState } from "react";
import { DriverInfo, PieChartGeneral } from "@/srcApp/entities/stats/";
import { getStat } from "@/srcApp/entities/stats/model/getStat";
import { Stat } from "@/srcApp/entities/stats/model/types/stat";
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
    return null;
  }

  const availableSize = stat.totalSize - stat.usedSize;

  return (
    <>
      <h1 className={styles.stats__title}>General Statistic</h1>
      <div className={styles.stats__general}>
        <div className={styles.pieChart}>
          <PieChartGeneral
            data={[
              { name: "Used Space", value: stat.usedSize },
              { name: "Available Space", value: availableSize },
            ]}
          />
        </div>
        <div className={styles.stats__fileSystemStats}>
          <span className={styles.stats__folderStats}>
            Folders: {stat.folderCount}
          </span>
          <span className={styles.stats__fileStats}>
            File: {stat.fileCount}
          </span>
        </div>
      </div>
      <h2 className={styles.stats__title}>Drive Info</h2>
      <div className={styles.stats__driveInfo}>
        {stat.driveInfoResult.map((drive) => {
          return (
            <div className={styles.stats__driveInfoItem} key={drive.driveEmail}>
              <DriverInfo drive={drive} />
            </div>
          );
        })}
      </div>
    </>
  );
}
