import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { isDriveInfoErrorResult } from "../../model/isDriveInfoErrorResult";
import { isDriveInfoSuccessResult } from "../../model/isDriveInfoSuccessResult";
import { DriveInfoErrorResult } from "../../model/types/driveInfoErrorResult";
import { DriveInfoSuccessResult } from "../../model/types/driveInfoSuccessResult";
import styles from "./styles.module.css";

export function DriverInfo({
  drive,
}: {
  drive: DriveInfoSuccessResult | DriveInfoErrorResult;
}) {
  if (isDriveInfoSuccessResult(drive)) {
    const { driveEmail: email, totalSpace, usedSpace } = drive;
    const usageValueStyle = {
      "--usage-value-size": (usedSpace / totalSpace) * 100 + "%",
    } as React.CSSProperties;
    return (
      <div className={styles.driverInfo}>
        <span className={styles.driverInfo__email}>{email}</span>
        <div className={styles.driverInfo__usageSizeValue}>
          <span className={styles.driverInfo__totalValue}></span>
          <span
            style={usageValueStyle}
            className={styles.driverInfo__usageValue}
          ></span>
        </div>
        <span
          className={styles.driverInfo__text}
        >{`${formatBytes(usedSpace)} / ${formatBytes(totalSpace)}`}</span>
      </div>
    );
  }
  if (isDriveInfoErrorResult(drive)) {
    const { driveEmail: email, error, errorMessage } = drive;

    return (
      <div className={styles.driverInfo}>
        <span className={styles.driverInfo__email}>{email}</span>
        <div className={styles.driverInfo__usageSizeValue}>{`${error}`}</div>
        <span className={styles.driverInfo__text}>{`${errorMessage}`}</span>
      </div>
    );
  }
}
