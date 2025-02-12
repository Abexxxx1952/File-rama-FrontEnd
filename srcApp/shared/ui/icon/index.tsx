import styles from "./styles.module.css";

interface IconProps {
  link: string;
  className?: string;
  style?: React.CSSProperties;
}

export function Icon({ link, className, style }: IconProps) {
  return (
    <svg className={className} style={style}>
      <use className={styles.use} href={link} />
    </svg>
  );
}
