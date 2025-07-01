"use client";

import { Icon } from "../icon";
import styles from "./styles.module.css";

type ButtonIconProps = {
  iconUrl: string;
  onClick: () => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  border?: string;
  borderRadius?: string;
};

export function ButtonIcon({
  iconUrl,
  onClick,
  loading = false,
  disabled = false,
  className,
  border,
  borderRadius,
}: ButtonIconProps) {
  const isDisabled = disabled || loading;

  const buttonStyle = {
    "--border": border,
    "--border-radius": borderRadius,
  } as React.CSSProperties;

  return (
    <button
      className={`${styles.button} ${className || ""}`}
      style={buttonStyle}
      disabled={isDisabled}
      onClick={onClick}
      aria-label={loading ? "Loading" : undefined}
      aria-disabled={disabled}
      aria-busy={loading}
    >
      <Icon
        link={loading ? "/svg/settings-sprite.svg#loading" : iconUrl}
        className={`${styles.icon} ${loading && styles.button__loading}`}
      />
    </button>
  );
}
