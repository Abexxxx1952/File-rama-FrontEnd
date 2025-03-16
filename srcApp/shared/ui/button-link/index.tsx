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
  iconSvgWidth?: string;
  iconSvgHeight?: string;
  iconSvgFill?: string;
  iconSvgFocusFill?: string;
  iconSvgTop?: string;
  iconSvgLeft?: string;
  iconSvgRight?: string;
  iconSvgTransform?: string;
  focusTextColor?: string;
  focusBackgroundColor?: string;
  boxShadow?: string;
  padding?: string;
  loading?: boolean;
  href: string;
  onClick?: (
    e: React.SyntheticEvent<HTMLAnchorElement>,
  ) => void | Promise<void>;
};

export function ButtonLink({
  text,
  textColor,
  backgroundColor,
  border,
  icon,
  iconSvg,
  iconSvgWidth,
  iconSvgHeight,
  iconSvgTop,
  iconSvgLeft,
  iconSvgRight,
  iconSvgTransform,
  focusTextColor,
  focusBackgroundColor,
  boxShadow,
  padding,
  loading = false,
  href,
  onClick,
}: ButtonProps) {
  const linkStyle = {
    "--bg-color": backgroundColor,
    "--text-color": textColor,
    "--border": border,
    "--focus-bg-color": focusBackgroundColor,
    "--focus-text-color": focusTextColor,
    "--box-shadow": boxShadow,
    "--padding": padding,
  } as React.CSSProperties;
  const iconSvgStyle = {
    "--icon-svg-width": iconSvgWidth,
    "--icon-svg-height": iconSvgHeight,
    "--icon-svg-top": iconSvgTop,
    "--icon-svg-left": iconSvgLeft,
    "--icon-svg-right": iconSvgRight,
    "--icon-svg-transform": iconSvgTransform,
  } as React.CSSProperties;
  return (
    <Link
      href={href}
      onClick={onClick}
      style={linkStyle}
      className={styles.link}
      aria-label={`Go to ${href}`}
    >
      {icon && <Image src={icon} className={styles.icon} alt="Icon" />}
      {iconSvg && (
        <Icon link={iconSvg} className={styles.svgIcon} style={iconSvgStyle} />
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
