import { Button } from "@/srcApp/shared/ui/button";
import styles from "./styles.module.css";

export function EmailConfirmation() {
  return (
    <div className={styles.userEmailConfirmation}>
      <h2 className={styles.userEmailConfirmation__title}>
        Email confirmation
      </h2>
      <p className={styles.userEmailConfirmation__text}>
        Send email to your email address to confirm your email
      </p>
      <div className={styles.userEmailConfirmation__button}>
        <Button text="Send email" backgroundColor="var(--primary-logo-color)" />
      </div>
    </div>
  );
}
