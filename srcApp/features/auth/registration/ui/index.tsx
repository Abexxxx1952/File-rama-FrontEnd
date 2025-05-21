"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { Input } from "@/srcApp/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { userRegistrationSchema } from "../lib/userRegistrationSchema";
import { registerUser } from "../model/registerUser";
import { CreateUser } from "../model/types/createUser";
import styles from "./styles.module.css";

export function Registration() {
  const [isMounted, _] = useState(true);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const defaultValues = { name: "", password: "", repeatPassword: "" };
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUser>({
    resolver: zodResolver(userRegistrationSchema),
    defaultValues,
  });

  return (
    <form
      className={`${styles.registerForm} ${isMounted ? styles.visible : ""} `}
      onSubmit={handleSubmit((data) => registerUser(data, setLoading, router))}
    >
      <div className={styles.registerForm__title}>Registration</div>
      <div className={styles.registerForm__inputs}>
        <div className={styles.registerForm__input}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Email"
                type="email"
                backgroundColor="rgba(255, 255, 255, 0.2)"
                focusTextColor="var(--main-page-font-color)"
                focusBackgroundColor="transparent"
                border="none"
                placeholderColor="var(--main-page-font-color)"
                required={true}
                error={errors.email?.message}
                {...field}
              />
            )}
          />
          <Icon
            link="svg/auth-sprite.svg#login"
            className={styles.logo__icon}
          />
        </div>
        <div className={styles.registerForm__input}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Password"
                type="password"
                backgroundColor="rgba(255, 255, 255, 0.2)"
                focusTextColor="var(--main-page-font-color)"
                focusBackgroundColor="transparent"
                border="none"
                placeholderColor="var(--main-page-font-color)"
                required={true}
                error={errors.password?.message}
                {...field}
              />
            )}
          />
          <Icon
            link="svg/auth-sprite.svg#password"
            className={styles.logo__icon}
          />
        </div>
        <div className={styles.registerForm__input}>
          <Controller
            name="passwordRepeat"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Repeat password"
                type="password"
                backgroundColor="rgba(255, 255, 255, 0.2)"
                focusTextColor="var(--main-page-font-color)"
                focusBackgroundColor="transparent"
                border="none"
                placeholderColor="var(--main-page-font-color)"
                required={true}
                error={errors.passwordRepeat?.message}
                {...field}
              />
            )}
          />
          <Icon
            link="svg/auth-sprite.svg#password"
            className={styles.logo__icon}
          />
        </div>
      </div>
      <div className={styles.registerForm__submit}>
        <Button
          text="Registration"
          backgroundColor="rgba(118, 87, 230, 0.5)"
          type="submit"
          loading={loading}
        />
        <Icon
          link="svg/auth-sprite.svg#register"
          className={styles.logo__submitIcon}
        />
      </div>
    </form>
  );
}
