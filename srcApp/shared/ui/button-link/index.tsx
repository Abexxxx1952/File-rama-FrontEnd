"use client";

import Image from "next/image";
import Link from "next/link";
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
  href: string;
};

export function ButtonLink({
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
  href,
}: ButtonProps) {
  const linkStyle = {
    "--bg-color": backgroundColor,
    "--text-color": textColor,
    "--border": border,
    "--focus-bg-color": focusBackgroundColor,
    "--focus-text-color": focusTextColor,
    "--box-shadow": boxShadow,
  } as React.CSSProperties;
  return (
    <Link
      href={href}
      style={linkStyle}
      className={styles.link}
      aria-label={`Go to ${href}`}
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
    </Link>
  );
}
