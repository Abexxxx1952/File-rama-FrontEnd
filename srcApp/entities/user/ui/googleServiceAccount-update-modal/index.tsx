"use client";

import { useState } from "react";
import { googleServiceAccountsAddSchema } from "@/srcApp/entities/user/model/lib/schemas/googleServiceAccountsAddSchema";
import type {
  GoogleServiceAccountsRequest,
  GoogleServiceAccountsResponse,
  User,
} from "@/srcApp/entities/user/model/types/user";
import { updateGoogleServiceAccount } from "@/srcApp/entities/user/model/updateGoogleServiceAccounts";
import { useImperativeDisableScroll } from "@/srcApp/shared/hooks/useImperativeDisableScroll";
import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { Button } from "@/srcApp/shared/ui/button";
import { Input } from "@/srcApp/shared/ui/input";
import { Modal } from "@/srcApp/shared/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
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

  async function handleUpdateGoogleServiceAccount(
    data: GoogleServiceAccountsRequest,
  ) {
    updateGoogleServiceAccount(data, setLoading, setUser, setUpdateModalOpen);
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<GoogleServiceAccountsRequest>({
    resolver: zodResolver(googleServiceAccountsAddSchema),
    defaultValues,
  });

  return (
    <Modal
      title="Update your google service account"
      setModalOpen={setUpdateModalOpen}
    >
      <form
        className={styles.userDriveUpdate__form}
        onSubmit={handleSubmit(handleUpdateGoogleServiceAccount)}
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
                labelTextColor="var(--main-page-font-color)"
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
                labelTextColor="var(--main-page-font-color)"
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
                labelTextColor="var(--main-page-font-color)"
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
    </Modal>
  );
}
