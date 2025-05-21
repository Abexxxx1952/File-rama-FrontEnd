import { Dispatch, SetStateAction, useState } from "react";
import { User } from "@/srcApp/entities/user/model/types/user";
import { updateTwoFactorAuthorization } from "@/srcApp/entities/user/model/updateTwoFactorAuthorization";
import { Button } from "@/srcApp/shared/ui/button";
import styles from "./styles.module.css";

export function TwoFactorAuth({
  isTwoFactorEnabled,
  setUser,
}: {
  isTwoFactorEnabled: boolean;
  setUser: Dispatch<SetStateAction<User | null | undefined>>;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <div className={styles.twoFactor}>
      <h2 className={styles.twoFactor__title}>
        Two factor authorization settings
      </h2>
      <p className={styles.twoFactor__text}>
        Enable/Disable two factor authorization
      </p>
      <p className={styles.twoFactor__text}>
        Two factor authorization is: {isTwoFactorEnabled ? "Enable" : "Disable"}
      </p>
      <div className={styles.twoFactor__button}>
        <Button
          text={isTwoFactorEnabled ? "Disable" : "Enable"}
          backgroundColor="var(--primary-logo-color)"
          onClick={() => {
            updateTwoFactorAuthorization(
              isTwoFactorEnabled,
              setLoading,
              setUser,
            );
          }}
        />
      </div>
    </div>
  );
}
