"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/srcApp/shared/ui/button";
import { ButtonLink } from "@/srcApp/shared/ui/button-link";
import { Icon } from "@/srcApp/shared/ui/icon";
import { Input } from "@/srcApp/shared/ui/input";
import styles from "./styles.module.css";

export function Login() {
  const [isMounted, _] = useState(true);

  return (
    <form className={`${styles.loginForm} ${isMounted ? styles.visible : ""} `}>
      <div className={styles.loginForm__title}>Sign In</div>
      <div className={styles.loginForm__inputs}>
        <div className={styles.loginForm__input}>
          <Input
            placeholder="Email"
            backgroundColor="rgba(255, 255, 255, 0.2)"
            focusTextColor="var(--main-page-font-color)"
            focusBackgroundColor="transparent"
            border="none"
            placeholderColor="var(--main-page-font-color)"
            type="email"
            required={true}
          />
          <Icon
            link="svg/auth-sprite.svg#login"
            className={styles.logo__icon}
          />
        </div>
        <div className={styles.loginForm__input}>
          <Input
            placeholder="Password"
            type="password"
            backgroundColor="rgba(255, 255, 255, 0.2)"
            focusTextColor="var(--main-page-font-color)"
            focusBackgroundColor="transparent"
            border="none"
            placeholderColor="var(--main-page-font-color)"
            required={true}
          />
          <Icon
            link="svg/auth-sprite.svg#password"
            className={styles.logo__icon}
          />
        </div>
      </div>
      <div className={styles.loginForm__forgottenPassword}>
        <Link href="/resetPassword">Forgot password?</Link>
      </div>
      <div className={styles.loginForm__submit}>
        <Button text="Login" backgroundColor="rgba(118, 87, 230, 0.5)" />
        <Icon
          link="svg/auth-sprite.svg#arrow"
          className={styles.logo__submitIcon}
        />
      </div>
      <div className={styles.loginForm__divider}>
        <span>-or-</span>
      </div>
      <div className={styles.loginForm__oAuth}>
        <ButtonLink
          href="#"
          text="Sign in with Google"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          iconSvg="svg/auth-sprite.svg#google"
        />
        <ButtonLink
          href="#"
          text="Sign in with Git Hub"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          iconSvg="svg/auth-sprite.svg#git_hub"
        />
      </div>
    </form>
  );
}
