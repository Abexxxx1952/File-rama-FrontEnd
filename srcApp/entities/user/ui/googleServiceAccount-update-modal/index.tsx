"use client";

import { useState } from "react";
import { useImperativeDisableScroll } from "@/srcApp/shared/hooks/useImperativeDisableScroll";
import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { Input } from "@/srcApp/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { googleServiceAccountsAddSchema } from "../../model/lib/schemas/googleServiceAccountsAddSchema";
import {
  GoogleServiceAccountsRequest,
  GoogleServiceAccountsResponse,
  User,
} from "../../model/types/user";
import { updateGoogleServiceAccount } from "../../model/updateGoogleServiceAccounts";
import styles from "./styles.module.css";

type GoogleServiceAccountUpdateModalProps = {
  setUpdateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateGoogleServiceAccountItem?: GoogleServiceAccountsResponse;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

export function GoogleServiceAccountUpdateModal({
  setUpdateModalOpen,
  updateGoogleServiceAccountItem,
  setUser,
}: GoogleServiceAccountUpdateModalProps) {
  const [loading, setLoading] = useState(false);
  const body = document.querySelector("body");
  const defaultValues = { ...updateGoogleServiceAccountItem, privateKey: "" };
  useImperativeDisableScroll(body, true);

  useKeyboardHandler(body, [["Escape", () => setUpdateModalOpen(false)]]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GoogleServiceAccountsRequest>({
    resolver: zodResolver(googleServiceAccountsAddSchema),
    defaultValues,
  });

  return (
    <div className={styles.modal}>
      <div
        className={styles.overlay}
        onClick={() => setUpdateModalOpen(false)}
      ></div>

      <div className={styles.userDriveUpdate}>
        <Icon
          link="/svg/settings-sprite.svg#delete"
          onClick={() => setUpdateModalOpen(false)}
          className={styles.userDriveUpdate__close}
        />
        <h2 className={styles.userDriveUpdate__title}>
          Update your google service account
        </h2>
        <form
          className={styles.userDriveUpdate__form}
          onSubmit={handleSubmit((data) => {
            updateGoogleServiceAccount(
              data,
              setLoading,
              setUser,
              setUpdateModalOpen,
            );
          })}
        >
          <div className={styles.userDriveUpdate__input}>
            <Controller
              name="clientEmail"
              control={control}
              render={({ field }) => (
                <Input
                  text="Drive Email"
                  placeholder="Enter your Drive Email"
                  backgroundColor="var(--main-header-background-color)"
                  focusBackgroundColor="var(--main-header-background-color)"
                  border="none"
                  textColor="var(--secondary-font-color)"
                  error={errors.clientEmail?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className={styles.userDriveUpdate__input}>
            <Controller
              name="privateKey"
              control={control}
              render={({ field }) => (
                <Input
                  text="Private Key"
                  placeholder="Enter your Private Key"
                  backgroundColor="var(--main-header-background-color)"
                  focusBackgroundColor="var(--main-header-background-color)"
                  border="none"
                  textColor="var(--secondary-font-color)"
                  type="password"
                  error={errors.privateKey?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className={styles.userDriveUpdate__input}>
            <Controller
              name="rootFolderId"
              control={control}
              render={({ field }) => (
                <Input
                  text="Root Folder Id"
                  placeholder="Enter your Root Folder Id (optional)"
                  backgroundColor="var(--main-header-background-color)"
                  focusBackgroundColor="var(--main-header-background-color)"
                  border="none"
                  textColor="var(--secondary-font-color)"
                  error={errors.rootFolderId?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className={styles.userDriveUpdate__button}>
            <Button
              text="Update drive"
              backgroundColor="var(--primary-logo-color)"
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
