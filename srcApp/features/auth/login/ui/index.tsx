"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isUserFromServer } from "@/srcApp/entities/user/model/isUserFromServer";
import { User } from "@/srcApp/entities/user/model/types/user";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { Button } from "@/srcApp/shared/ui/button";
import { ButtonLink } from "@/srcApp/shared/ui/button-link";
import { Icon } from "@/srcApp/shared/ui/icon";
import { Input } from "@/srcApp/shared/ui/input";
import { toast } from "react-toastify";
import { validationSchema } from "../lib/schema";
import { loginUser } from "../model/login-user";
import { transformZodErrors } from "../model/transformZodErrors";
import { UserLoginFormData } from "../model/types";
import styles from "./styles.module.css";

export function Login() {
  const [isMounted, _] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<UserLoginFormData>>({});

  const router = useRouter();

  const abortControllerRef = useRef<AbortController | null>(null);

  const googleLoginUrl: string = process.env.NEXT_PUBLIC_LOGIN_GOOGLE || "";
  const githubLoginUrl: string = process.env.NEXT_PUBLIC_LOGIN_GITHUB || "";

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.type === "email") {
      setEmail(e.currentTarget.value);
      setErrors((prevErrors) => ({ ...prevErrors, email: undefined }));
    }
    if (e.currentTarget.type === "password") {
      setPassword(e.currentTarget.value);
      setErrors((prevErrors) => ({ ...prevErrors, password: undefined }));
    }
  }

  async function handleLoginUser(email: string, password: string) {
    const validationResult = validationSchema.safeParse({ email, password });

    if (!validationResult.success) {
      setErrors(
        transformZodErrors(validationResult.error.formErrors.fieldErrors),
      );

      return;
    }

    setLoading(true);

    try {
      const response = await loginUser(email, password, abortControllerRef);

      notifyResponse<User>(response, `Successfully logged ${response.email}`);

      if (isUserFromServer(response)) {
        router.push("/dashboard");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.", {
        position: "top-right",
      });
    }

    setLoading(false);
  }

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
            onChange={handleInput}
            error={errors.email}
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
            onChange={handleInput}
            error={errors.password}
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
        <Button
          onClick={() => handleLoginUser(email, password)}
          text="Login"
          type="button"
          loading={loading}
          backgroundColor="rgba(118, 87, 230, 0.5)"
        />
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
          href={googleLoginUrl}
          text="Sign in with Google"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          iconSvg="svg/auth-sprite.svg#google"
        />
        <ButtonLink
          href={githubLoginUrl}
          text="Sign in with Git Hub"
          backgroundColor="rgba(255, 255, 255, 0.2)"
          iconSvg="svg/auth-sprite.svg#git_hub"
        />
      </div>
    </form>
  );
}
