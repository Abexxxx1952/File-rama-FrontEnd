"use client";

import { useState } from "react";
import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { Input } from "@/srcApp/shared/ui/input";
import styles from "./styles.module.css";

export function Registration() {
  const [isMounted, _] = useState(true);
  return (
    <form
      className={`${styles.registerForm} ${isMounted ? styles.visible : ""} `}
    >
      <div className={styles.registerForm__title}>
        <span>Registration</span>
      </div>
      <div className={styles.registerForm__inputs}>
        <div className={styles.registerForm__input}>
          <Input
            placeholder="Email"
            backgroundColor="rgba(255, 255, 255, 0.2)"
            focusTextColor="var(--main-page-font-color)"
            focusBackgroundColor="transparent"
            border="none"
            placeholderColor="var(--main-page-font-color)"
          />
          <Icon
            link="svg/auth-sprite.svg#login"
            className={styles.logo__icon}
          />
        </div>
        <div className={styles.registerForm__input}>
          <Input
            placeholder="Password"
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
        <div className={styles.registerForm__input}>
          <Input
            placeholder="Repeat password"
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
      <div className={styles.registerForm__submit}>
        <Button text="Registration" backgroundColor="rgba(118, 87, 230, 0.5)" />
        <Icon
          link="svg/auth-sprite.svg#register"
          className={styles.logo__submitIcon}
        />
      </div>
    </form>
  );
}
