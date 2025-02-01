import Link from "next/link";
import { HEADER_ITEMS } from "@/srcApp/shared/constants/header-list";
import { Logo } from "@/srcApp/shared/ui/logo";
import { AuthSection } from "./auth-section";
import { Menu } from "./menu";
import styles from "./styles.module.css";

export function MainHeader() {
  return (
    <header className={styles.headerMain}>
      <Logo />
      <Menu />
      <nav>
        <ul className={styles.headerMain__list}>
          {HEADER_ITEMS.map((elem) => {
            return (
              <li
                key={elem.value}
                className={styles.headerMain__listItem}
                role="listitem"
              >
                <Link href={elem.path} aria-label={`Go to ${elem.value}`}>
                  {elem.value}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className={styles.headerMain__auth}>
        <AuthSection />
      </div>
    </header>
  );
}
