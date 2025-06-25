import { Input } from "@/srcApp/shared/ui/input";
import { Logo } from "@/srcApp/shared/ui/logo";
import styles from "./styles.module.css";

export function Search() {
  return (
    <div className={styles.storage__search}>
      <div className={styles.storage__logo}>
        <Logo />
      </div>

      <div className={styles.storage__searchInput}>
        <Input
          placeholder="Search"
          backgroundColor="rgb(255, 255, 255)"
          focusBackgroundColor="rgb(255, 255, 255)"
          border="none"
          placeholderPaddingLeft="1.5rem"
          iconSvg="svg/dashboard-page-sprite.svg#search"
          iconSvgWidth="17px"
          iconSvgHeight="16px"
        />
      </div>
    </div>
  );
}
