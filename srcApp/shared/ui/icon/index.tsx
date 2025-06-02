import styles from "./styles.module.css";

interface IconProps {
  link: string;
  className?: string;
  style?: React.CSSProperties;
  viewBox?: string;
  onClick?: () => void;
}

export function Icon({ link, className, style, viewBox, onClick }: IconProps) {
  return (
    <svg
      className={className}
      onClick={onClick}
      style={style}
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      <use className={styles.use} href={link} viewBox={viewBox} />
    </svg>
  );
}
