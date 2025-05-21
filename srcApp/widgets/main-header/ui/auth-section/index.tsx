"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/srcApp/entities/user/model/getUser";
import { User } from "@/srcApp/entities/user/model/types/user";
import { ButtonLink } from "@/srcApp/shared/ui/button-link";
import styles from "./styles.module.css";

export function AuthSection() {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const user: User | null = await getUser();

      if (user !== null) {
        router.replace("/dashboard");
      }
    })();
  }, []);
  return (
    <>
      <div className={styles.signIn}>
        <ButtonLink
          text="Sign In"
          textColor="var(--secondary-font-color)"
          href="/login"
        />
      </div>
      <div className={styles.signUp}>
        <ButtonLink
          href="/register"
          text="Create an account"
          backgroundColor="var(--secondary-logo-color)"
        />
      </div>
    </>
  );
}
