"use client";

import { DASHBOARD_ITEMS } from "@/srcApp/shared/constants/dashboard-nav-list";
import { Button } from "@/srcApp/shared/ui/button";
import { ButtonLink } from "@/srcApp/shared/ui/button-link";
import { Icon } from "@/srcApp/shared/ui/icon";
import styles from "./styles.module.css";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.dashboard} id="portal">
      <div className={styles.dashboard__container}>
        <section className={styles.dashboard__bar}>
          <span className={styles.dashboard__profile}>
            <Icon
              link="/svg/dashboard-page-sprite.svg#profile"
              className={styles.dashboard__profileIcon}
            />
            <span className={styles.dashboard__name}>User</span>
          </span>

          <nav className={styles.dashboard__nav}>
            {DASHBOARD_ITEMS.map((item) => {
              return (
                <div className={styles.dashboard__navItem} key={item.value}>
                  <Icon
                    link={`/svg/dashboard-page-sprite.svg#${item.icon}`}
                    className={styles.dashboard__navItemIcon}
                  />
                  <ButtonLink
                    href={item.path}
                    text={item.value}
                    boxShadow="none"
                    border="none"
                    focusBackgroundColor="none"
                  />
                </div>
              );
            })}
          </nav>
          <div className={styles.dashboard__extraItem}>
            <div className={styles.dashboard__addButton}>
              <Button
                text="+ Add File"
                backgroundColor="rgba(116, 181, 227,0.5)"
              />
            </div>
            <div className={styles.dashboard__addButton}>
              <Button
                text="+ Add Folder"
                backgroundColor="rgba(116, 181, 227,0.5)"
              />
            </div>
            <div className={styles.dashboard__usageSize}>
              <div className={styles.dashboard__usageSizeHeader}>
                <Icon
                  link="/svg/dashboard-page-sprite.svg#cloud"
                  className={styles.dashboard__cloudIcon}
                />
                <span className={styles.dashboard__usageSizeTitle}>
                  My Storage
                </span>
              </div>
              <div className={styles.dashboard__usageSizeValue}>
                <span className={styles.dashboard__totalValue}></span>
                <span className={styles.dashboard__usageValue}></span>
              </div>
              <span className={styles.dashboard__usageSizeText}>
                Used 5 GB out of 15 GB.
              </span>
            </div>
          </div>
        </section>

        <section className={styles.dashboard__content}>{children}</section>
      </div>
    </main>
  );
}
