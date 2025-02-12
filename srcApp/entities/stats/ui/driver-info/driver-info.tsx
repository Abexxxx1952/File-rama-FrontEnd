import { formatBytes } from "@/srcApp/shared/model/fornatBytes";
import styles from "./styles.module.css";

type DriverInfoProps = {
  email: string;
  totalValue: number;
  usageValue: number;
};

export function DriverInfo({ email, totalValue, usageValue }: DriverInfoProps) {
  const usageValueStyle = {
    "--usage-value-size": (usageValue / totalValue) * 100 + "%",
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
      >{`${formatBytes(usageValue)} / ${formatBytes(totalValue)}`}</span>
    </div>
  );
}
