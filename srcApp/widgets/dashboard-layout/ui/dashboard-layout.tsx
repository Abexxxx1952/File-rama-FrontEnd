"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/srcApp/entities/user/model/getUser";
import { User } from "@/srcApp/entities/user/model/types/user";
import { clearCookies } from "@/srcApp/features/cookies/model/clearCookies";
import { DASHBOARD_ITEMS } from "@/srcApp/shared/constants/dashboard-nav-list";
import { ButtonLink } from "@/srcApp/shared/ui/button-link";
import { Icon } from "@/srcApp/shared/ui/icon";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.css";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<User | null>();

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const user: User | null = await getUser();

      if (user === null) {
        router.replace("/");
      }

      setUser(user);
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
      <ToastContainer autoClose={5000} />
      <div className={styles.dashboard__container}>
        <section className={styles.dashboard__bar}>
          <span className={styles.dashboard__profile}>
            <Icon
              link="/svg/dashboard-page-sprite.svg#profile"
              className={styles.dashboard__profileIcon}
              viewBox="0 0 45.532 45.532"
            />
            <span className={styles.dashboard__name}>
              {user?.name || user?.email}
            </span>
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
        </section>
        <section className={styles.dashboard__content}>{children}</section>
      </div>
    </main>
  );
}
