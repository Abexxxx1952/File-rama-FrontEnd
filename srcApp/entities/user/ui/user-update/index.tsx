"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { UserUpdateFormData } from "@/srcApp/entities/user/model/types/userUpdateFormData";
import { Button } from "@/srcApp/shared/ui/button";
import { Input } from "@/srcApp/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { userUpdateSchema } from "../../model/lib/schemas/userUpdateSchema";
import { User } from "../../model/types/user";
import { updateUserSubmitHandler } from "../../model/updateUserSubmitHandler";
import styles from "./styles.module.css";

type UserUpdateProps = {
  user: User;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export function UserUpdate({ user, setUser }: UserUpdateProps) {
  const [loading, setLoading] = useState(false);

  const defaultValues = { name: user.name, password: "", repeatPassword: "" };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserUpdateFormData>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues,
  });

  return (
    <div className={styles.userUpdate}>
      <h2 className={styles.userUpdate__title}>User update</h2>
      <form
        className={styles.userUpdate__form}
        onSubmit={handleSubmit((data) => {
          updateUserSubmitHandler(data, setLoading, setUser);
          reset();
        })}
      >
        <div className={styles.userUpdate__input}>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                text="Name"
                textColor="var(--secondary-font-color)"
                placeholder="Change your name"
                focusBackgroundColor="transparent"
                border="none"
                error={errors.name?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className={styles.userUpdate__input}>
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                text="Password"
                textColor="var(--secondary-font-color)"
                type="password"
                placeholder="Change your Password"
                focusBackgroundColor="transparent"
                border="none"
                error={errors.password?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className={styles.userUpdate__input}>
          <Controller
            name="repeatPassword"
            control={control}
            render={({ field }) => (
              <Input
                text="Repeat Password"
                textColor="var(--secondary-font-color)"
                type="password"
                placeholder="Repeat Password"
                focusBackgroundColor="transparent"
                border="none"
                error={errors.repeatPassword?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className={styles.userUpdate__button}>
          <Button
            text="Update"
            backgroundColor="var(--primary-logo-color)"
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </div>
  );
}
