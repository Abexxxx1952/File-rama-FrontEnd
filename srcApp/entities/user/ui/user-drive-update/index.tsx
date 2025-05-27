import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { Input } from "@/srcApp/shared/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPortal } from "react-dom";
import { Controller, useForm } from "react-hook-form";
import { addGoogleServiceAccount } from "../../model/addGoogleServiceAccounts";
import { deleteGoogleServiceAccount } from "../../model/deleteGoogleServiceAccounts copy";
import { googleServiceAccountsAddSchema } from "../../model/lib/schemas/googleServiceAccountsAddSchema";
import {
  GoogleServiceAccountsRequest,
  GoogleServiceAccountsResponse,
  User,
} from "../../model/types/user";
import { GoogleServiceAccountUpdateModal } from "../googleServiceAccount-update-modal";
import styles from "./styles.module.css";

type UserDriveUpdateProps = {
  googleServiceAccounts: GoogleServiceAccountsResponse[];
  setUser: Dispatch<SetStateAction<User | null>>;
};

export function UserDriveUpdate({
  googleServiceAccounts,
  setUser,
}: UserDriveUpdateProps) {
  const [loading, setLoading] = useState(false);
  const [updateGoogleServiceAccountItem, setUpdateGoogleServiceAccountItem] =
    useState<GoogleServiceAccountsResponse>();
  const [updateModalOpen, setUpdateModalOpen] = useState<boolean>(false);
  const portalRef = useRef<HTMLElement | null>(null);
  const defaultValues = { clientEmail: "", privateKey: "", rootFolderId: "" };

  useEffect(() => {
    portalRef.current = document.getElementById("portal");
  }, []);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GoogleServiceAccountsRequest>({
    resolver: zodResolver(googleServiceAccountsAddSchema),
    defaultValues,
  });

  function handleUpdateGoogleServiceAccount(
    googleServiceAccount: GoogleServiceAccountsResponse,
  ) {
    setUpdateGoogleServiceAccountItem(googleServiceAccount);
    setUpdateModalOpen(true);
  }

  return (
    <div className={styles.userDriveUpdate}>
      <h2 className={styles.userDriveUpdate__title}>Drive update</h2>
      <form
        className={styles.userDriveUpdate__form}
        onSubmit={handleSubmit(async (data) => {
          await addGoogleServiceAccount(data, setLoading, setUser);
          reset();
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
                focusBackgroundColor="transparent"
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
                focusBackgroundColor="transparent"
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
                focusBackgroundColor="transparent"
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
            text="Add drive"
            backgroundColor="var(--primary-logo-color)"
            loading={loading}
          />
        </div>
      </form>
      <h2 className={styles.userDriveUpdate__title}>Yours drives</h2>
      <div className={styles.userDriveUpdate__drives}>
        {googleServiceAccounts.map((item: GoogleServiceAccountsResponse) => {
          return (
            <div
              key={item.clientEmail}
              className={styles.userDriveUpdate__drive}
            >
              <span className={styles.userDriveUpdate__driveEmail}>
                {item.clientEmail}
              </span>
              <Icon
                link="/svg/settings-sprite.svg#update"
                className={styles.userDriveUpdate__driveUpdate}
                onClick={() => handleUpdateGoogleServiceAccount(item)}
              />
              <Icon
                link="/svg/settings-sprite.svg#delete"
                className={styles.userDriveUpdate__driveDelete}
                onClick={() =>
                  deleteGoogleServiceAccount(
                    item.clientEmail,
                    setLoading,
                    setUser,
                  )
                }
              />
            </div>
          );
        })}
      </div>
      {portalRef.current &&
        updateModalOpen &&
        createPortal(
          <GoogleServiceAccountUpdateModal
            setUpdateModalOpen={setUpdateModalOpen}
            updateGoogleServiceAccountItem={updateGoogleServiceAccountItem}
            setUser={setUser}
          />,
          portalRef.current,
        )}
    </div>
  );
}
