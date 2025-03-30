"use client";

import { useRouter } from "next/navigation";
import { useGetUser } from "@/srcApp/app/providers/withContext";
import { UserDelete } from "@/srcApp/entities/user/ui/user-delete/ui";
import { UserDriveUpdate } from "@/srcApp/entities/user/ui/user-drive-update";
import { UserInfo } from "@/srcApp/entities/user/ui/user-info";
import { EmailConfirmation } from "@/srcApp/features/auth/email-confirmation/ui";
import { TwoFactorAuth } from "@/srcApp/features/auth/two-factor/ui";
import { UserUpdate } from "./../../../entities/user/ui/user-update/index";
import styles from "./styles.module.css";

export function SettingsPage() {
  const router = useRouter();
  const user = useGetUser();
  if (!user) {
    router.replace("/");
  }
  if (user)
    return (
      <>
        <h1 className={styles.title}>Settings</h1>
        <UserInfo user={user} />
        <UserUpdate />
        <EmailConfirmation />
        <TwoFactorAuth isTwoFactorEnabled={user.isTwoFactorEnabled} />
        <UserDriveUpdate googleServiceAccounts={user.googleServiceAccounts} />
        <UserDelete />
      </>
    );
}
