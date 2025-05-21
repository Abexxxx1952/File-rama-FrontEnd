"use client";

import Image from "next/image";
import { Icon } from "../icon";
import styles from "./styles.module.css";

type ButtonProps = {
  text: string;
  textColor?: string;
  backgroundColor?: string;
  border?: string;
  icon?: string;
  iconSvg?: string;
  focusTextColor?: string;
  focusBackgroundColor?: string;
  boxShadow?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "submit" | "button" | "reset" | undefined;
  onClick?: () => void;
};

export function Button({
  text,
  textColor,
  backgroundColor,
  border,
  icon,
  iconSvg,
  focusTextColor,
  focusBackgroundColor,
  boxShadow,
  loading = false,
  disabled = false,
  type,
  onClick,
}: ButtonProps) {
  const buttonStyle = {
    "--bg-color": backgroundColor,
    "--text-color": textColor,
    "--border": border,
    "--focus-bg-color": focusBackgroundColor,
    "--focus-text-color": focusTextColor,
    "--box-shadow": boxShadow,
  } as React.CSSProperties;

  const isDisabled = disabled || loading;
  return (
    <button
      className={styles.button}
      disabled={isDisabled}
      style={buttonStyle}
      onClick={onClick}
      type={type ? type : undefined}
      aria-label={loading ? "Loading" : undefined}
      aria-disabled={disabled}
      aria-busy={loading}
    >
      {icon && <Image src={icon} className={styles.icon} alt="Icon" />}
      {iconSvg && <Icon link={iconSvg} className={styles.svgIcon} />}
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
