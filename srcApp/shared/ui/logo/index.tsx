import Link from "next/link";
import { Icon } from "../icon";
import styles from "./styles.module.css";
export function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label="Website Logo">
      <Icon
        link="svg/main-page-sprite.svg#logo"
        className={styles.logo__icon}
      />
      <span className={styles.logo__text}>File-rama</span>
    </Link>
  );
}
