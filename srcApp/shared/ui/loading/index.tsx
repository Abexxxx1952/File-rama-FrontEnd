import { Icon } from "../icon";
import styles from "./styles.module.css";

type LoadingProps = {
  position?: "fixed" | "absolute";
  size?: string;
  backgroundColor?: string;
  ariaLabel?: string;
};

export function Loading({
  position = "fixed",
  size = "3rem",
  backgroundColor = "rgba(0, 0, 0, 0.25)",
  ariaLabel = "Loading",
}: LoadingProps) {
  const loadingStyle = {
    "--loading-position": position,
    "--loading-size": size,
    "--loading-bg-color": backgroundColor,
  } as React.CSSProperties;

  return (
    <div
      className={styles.loading}
      style={loadingStyle}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <Icon
        link="/svg/settings-sprite.svg#loading"
        className={styles.loading__icon}
      />
    </div>
  );
}
