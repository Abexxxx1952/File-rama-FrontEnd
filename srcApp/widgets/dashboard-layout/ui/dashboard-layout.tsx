"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useGetSetUser } from "@/srcApp/app/providers/withContext";
import { fetchUserData } from "@/srcApp/entities/user/api/fetchUserData";
import { isUserFromServer } from "@/srcApp/entities/user/model/isUserFromServer";
import { User } from "@/srcApp/entities/user/model/types/user";
import { clearCookies } from "@/srcApp/features/cookies/model/clearCookies";
import { DASHBOARD_ITEMS } from "@/srcApp/shared/constants/dashboard-nav-list";
import { ErrorData } from "@/srcApp/shared/model/types";
import { Button } from "@/srcApp/shared/ui/button";
import { ButtonLink } from "@/srcApp/shared/ui/button-link";
import { Icon } from "@/srcApp/shared/ui/icon";
import { toast } from "react-toastify";
import styles from "./styles.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const abortControllerRef = useRef<AbortController | null>(null);
  const setUser = useGetSetUser();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const userOrError: User | ErrorData | null =
          await fetchUserData(abortControllerRef);

        if (!isUserFromServer(userOrError)) {
          router.replace("/");
        }
        if (isUserFromServer(userOrError) && setUser) {
          setUser(userOrError);
        }
      } catch (error) {
        toast.error("An unexpected error occurred.", {
          position: "top-right",
        });
      }
    })();
  }, []);

  async function logout(e: React.SyntheticEvent<HTMLAnchorElement>) {
    e.preventDefault();

    try {
      await clearCookies();
      router.replace("/");
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        position: "top-right",
      });
    }
  }

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
              let onClickHandler;
              if (item.path === "/logout") {
                onClickHandler = logout;
              }

              return (
                <div className={styles.dashboard__navItem} key={item.value}>
                  <Icon
                    link={`/svg/dashboard-page-sprite.svg#${item.icon}`}
                    className={styles.dashboard__navItemIcon}
                  />

                  <ButtonLink
                    href={item.path}
                    onClick={onClickHandler}
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
