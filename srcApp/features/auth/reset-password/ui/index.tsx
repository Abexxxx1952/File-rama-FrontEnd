"use client";

import { useState } from "react";
import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { Input } from "@/srcApp/shared/ui/input";
import styles from "./styles.module.css";

export function ResetPassword() {
  const [isMounted, _] = useState(true);

  return (
    <form
      className={`${styles.resetPasswordForm} ${isMounted ? styles.visible : ""} `}
    >
      <div className={styles.resetPasswordForm__title}>
        <span>Reset password</span>
      </div>
      <div className={styles.resetPasswordForm__inputs}>
        <div className={styles.resetPasswordForm__input}>
          <Input
            placeholder="New password"
            type="password"
            backgroundColor="rgba(255, 255, 255, 0.2)"
            focusTextColor="var(--main-page-font-color)"
            focusBackgroundColor="transparent"
            border="none"
            placeholderColor="var(--main-page-font-color)"
          />
          <Icon
            link="svg/auth-sprite.svg#password"
            className={styles.logo__icon}
          />
        </div>
        <div className={styles.resetPasswordForm__input}>
          <Input
            placeholder="Repeat new password"
            type="password"
            backgroundColor="rgba(255, 255, 255, 0.2)"
            focusTextColor="var(--main-page-font-color)"
            focusBackgroundColor="transparent"
            border="none"
            placeholderColor="var(--main-page-font-color)"
          />
          <Icon
            link="svg/auth-sprite.svg#password"
            className={styles.logo__icon}
          />
        </div>
      </div>
      <div className={styles.resetPasswordForm__submit}>
        <Button text="Reset" backgroundColor="rgba(118, 87, 230, 0.5)" />
        <Icon
          link="svg/auth-sprite.svg#arrow"
          className={styles.logo__submitIcon}
        />
      </div>
    </form>
  );
}
