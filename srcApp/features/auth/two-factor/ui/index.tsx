import { Button } from "@/srcApp/shared/ui/button";
import styles from "./styles.module.css";

export function TwoFactorAuth({
  isTwoFactorEnabled,
}: {
  isTwoFactorEnabled: boolean;
}) {
  return (
    <div className={styles.twoFactor}>
      <h2 className={styles.twoFactor__title}>
        Two factor authorization settings
      </h2>
      <p className={styles.twoFactor__text}>
        Enable/Disable two factor authorization
      </p>
      <div className={styles.twoFactor__button}>
        <Button
          text={isTwoFactorEnabled ? "Disable" : "Enable"}
          backgroundColor="var(--primary-logo-color)"
        />
      </div>
    </div>
  );
}
