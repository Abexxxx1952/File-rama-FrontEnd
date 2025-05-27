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
import styles from "./styles.module.css";

export function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const user: User | null = await getUser();

      setUser(user);
    })();
  }, []);

  if (user)
    return (
      <>
        <h1 className={styles.title}>Settings</h1>
        <UserInfo user={user} />
        <UserUpdate user={user} setUser={setUser} />
        <EmailConfirmation />
        <TwoFactorAuth
          isTwoFactorEnabled={user.isTwoFactorEnabled}
          setUser={setUser}
        />
        <UserDriveUpdate
          googleServiceAccounts={user.googleServiceAccounts}
          setUser={setUser}
        />
        <UserDelete />
      </>
    );
}
