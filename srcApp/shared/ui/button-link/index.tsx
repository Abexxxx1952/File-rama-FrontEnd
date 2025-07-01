"use client";

import Image from "next/image";
import Link from "next/link";
import { Icon } from "../icon";
import styles from "./styles.module.css";

type ButtonLinkProps = {
  text: string;
  textColor?: string;
  backgroundColor?: string;
  border?: string;
  focusTextColor?: string;
  focusBackgroundColor?: string;
  boxShadow?: string;
  padding?: string;
  icon?: string;
  iconSvg?: string;
  loading?: boolean;
  href: string;
  className?: string;
  classNameSvg?: string;
  onClick?: (
    e: React.SyntheticEvent<HTMLAnchorElement>,
  ) => void | Promise<void>;
};

export function ButtonLink({
  text,
  textColor,
  backgroundColor,
  border,
  focusTextColor,
  focusBackgroundColor,
  boxShadow,
  padding,
  icon,
  iconSvg,
  loading = false,
  href,
  onClick,
  className,
  classNameSvg,
}: ButtonLinkProps) {
  const linkStyle = {
    "--bg-color": backgroundColor,
    "--text-color": textColor,
    "--border": border,
    "--focus-bg-color": focusBackgroundColor,
    "--focus-text-color": focusTextColor,
    "--box-shadow": boxShadow,
    "--padding": padding,
  } as React.CSSProperties;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${styles.link} ${className || ""}`}
      style={linkStyle}
      aria-label={`Go to ${href}`}
    >
      {icon && <Image src={icon} className={styles.icon} alt="Icon" />}
      {iconSvg && (
        <Icon
          link={iconSvg}
          className={`${styles.svgIcon} ${classNameSvg || ""}`}
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
    </Link>
  );
}
