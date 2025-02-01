"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HEADER_ITEMS } from "@/srcApp/shared/constants/header-list";
import { isActivePath } from "../../../../shared/model/isActivePath";
import styles from "./styles.module.css";

export function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  function handleMenuClick() {
    setMenuOpen(!menuOpen);
  }

  return (
    <>
      <button
        className={styles.burgerMenu}
        onClick={handleMenuClick}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span
          className={`${menuOpen && styles.active} ${styles.burgerMenu__line}`}
          aria-hidden="true"
        ></span>
        <span
          className={`${menuOpen && styles.active} ${styles.burgerMenu__line}`}
          aria-hidden="true"
        ></span>
        <span
          className={`${menuOpen && styles.active} ${styles.burgerMenu__line}`}
          aria-hidden="true"
        ></span>
      </button>
      {menuOpen && (
        <nav
          className={styles.menuDropdown}
          role="navigation"
          aria-label="Main menu"
        >
          <ul className={styles.navigationContent} role="list">
            {HEADER_ITEMS.map((elem) => {
              return (
                <li
                  key={elem.value}
                  className={`${styles.navigationContent__item} ${
                    isActivePath(pathname, elem.path) && styles.active
                  }`}
                  role="listitem"
                  aria-current={
                    isActivePath(pathname, elem.path) ? "page" : undefined
                  }
                >
                  <Link
                    href={elem.path}
                    onClick={() => setMenuOpen(false)}
                    aria-label={`Go to ${elem.value}`}
                  >
                    {elem.value}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
}
