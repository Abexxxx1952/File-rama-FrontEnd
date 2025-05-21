import styles from "./styles.module.css";

interface IconProps {
  link: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function Icon({ link, className, style, onClick }: IconProps) {
  return (
    <svg className={className} onClick={onClick} style={style}>
      <use className={styles.use} href={link} />
    </svg>
  );
}
