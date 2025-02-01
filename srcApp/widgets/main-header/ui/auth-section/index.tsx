import { ButtonLink } from "@/srcApp/shared/ui/button-link";
import styles from "./styles.module.css";

export function AuthSection() {
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
