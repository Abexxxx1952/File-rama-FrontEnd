"use client";

import Image from "next/image";
import { Icon } from "../icon";
import styles from "./styles.module.css";

type ButtonProps = {
  text: string;
  icon?: string;
  iconSvg?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "submit" | "button" | "reset" | undefined;
  onClick?: () => void;
  className?: string;
  iconSvgClassName?: string;
  textColor?: string;
  backgroundColor?: string;
  border?: string;
  focusTextColor?: string;
  focusBackgroundColor?: string;
  boxShadow?: string;
};

export function Button({
  text,
  icon,
  iconSvg,
  iconSvgClassName,
  loading = false,
  disabled = false,
  type,
  onClick,
  className,
  textColor,
  backgroundColor,
  border,
  focusTextColor,
  focusBackgroundColor,
  boxShadow,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonStyle = {
    "--bg-color": backgroundColor,
    "--text-color": textColor,
    "--border": border,
    "--focus-bg-color": focusBackgroundColor,
    "--focus-text-color": focusTextColor,
    "--box-shadow": boxShadow,
  } as React.CSSProperties;
  return (
    <button
      className={`${styles.button} ${className || ""}`}
      style={buttonStyle}
      disabled={isDisabled}
      onClick={onClick}
      type={type ? type : undefined}
      aria-label={loading ? "Loading" : undefined}
      aria-disabled={disabled}
      aria-busy={loading}
    >
      {icon && <Image src={icon} className={styles.icon} alt="Icon" />}
      {iconSvg && (
        <Icon
          link={iconSvg}
          className={`${styles.svgIcon} ${iconSvgClassName || ""}`}
        />
      )}
      {loading ? (
        <div className={styles.spinner} aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"></circle>
          </svg>
        </div>
      ) : (
        text
      )}
    </button>
  );
}
