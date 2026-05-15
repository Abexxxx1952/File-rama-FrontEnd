"use client";

import { useEffect, useState } from "react";
import type { User } from "@/srcApp/entities/user";
import {
  UserDelete,
  UserDriveUpdate,
  UserInfo,
  UserUpdate,
} from "@/srcApp/entities/user";
import { getUser } from "@/srcApp/entities/user/model/getUser";
import { EmailConfirmation } from "@/srcApp/features/auth/email-confirmation/ui";
import { TwoFactorAuth } from "@/srcApp/features/auth/two-factor/ui";
import { Loading } from "@/srcApp/shared/ui/loading";
import styles from "./styles.module.css";

export function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const user: User | null = await getUser();

      setUser(user);
    })();
  }, []);

  if (!user) return <Loading />;

  return (
    <section className={styles.settings} aria-labelledby="settings-title">
      <header className={styles.header}>
        <span className={styles.eyebrow}>Account control center</span>
        <h1 className={styles.title} id="settings-title">
          Settings
        </h1>
        <p className={styles.description}>
          Manage your profile, security, connected drives and account lifecycle
          in one place.
        </p>
      </header>

      <div className={styles.content}>
        <UserInfo user={user} />
        <UserUpdate user={user} setUser={setUser} />
        <section
          className={styles.securityGrid}
          aria-label="Security settings"
        >
          <EmailConfirmation />
          <TwoFactorAuth
            isTwoFactorEnabled={user.isTwoFactorEnabled}
            setUser={setUser}
          />
        </section>
        <UserDriveUpdate
          googleServiceAccounts={user.googleServiceAccounts}
          setUser={setUser}
        />
        <UserDelete />
      </div>
    </section>
  );
}
