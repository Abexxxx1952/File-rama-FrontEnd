import { DriverInfo, PieChartGeneral } from "@/srcApp/entities/stats/";
import styles from "./styles.module.css";

export function StatisticPage() {
  const data = {
    id: "813fwfd-cd82-4ebc-8447-8d2a59d66f95",
    userId: "813e0c7d-cd82-4ebc-8447-8d2a59d66f95",
    fileCount: 2,
    folderCount: 1,
    totalSize: 4515165165,
    usedSize: 165165156,
    driveInfoResult: [
      {
        driveEmail: "dwfwf@fsfwf.com",
        totalSpace: 48145151,
        usedSpace: 45151451,
        availableSpace: 4511458148,
      },
      {
        driveEmail: "bnrrjfw2345fwf.com",
        totalSpace: 4122151134,
        usedSpace: 451341145,
        availableSpace: 451313138148,
      },
    ],
  };
  const availableSize = data.totalSize - data.usedSize;

  return (
    <>
      <h1 className={styles.stats__title}>General Statistic</h1>
      <div className={styles.stats__general}>
        <div className={styles.pieChart}>
          <PieChartGeneral
            data={[
              { name: "Used Space", value: data.usedSize },
              { name: "Available Space", value: availableSize },
            ]}
          />
        </div>
        <div className={styles.stats__fileSystemStats}>
          <span className={styles.stats__folderStats}>
            Folders: {data.folderCount}
          </span>
          <span className={styles.stats__fileStats}>
            File: {data.fileCount}
          </span>
        </div>
      </div>
      <h2 className={styles.stats__title}>Drive Info</h2>
      <div className={styles.stats__driveInfo}>
        {data.driveInfoResult.map((drive) => {
          return (
            <div className={styles.stats__driveInfoItem} key={drive.driveEmail}>
              <DriverInfo
                totalValue={drive.totalSpace}
                usageValue={drive.usedSpace}
                email={drive.driveEmail}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}
