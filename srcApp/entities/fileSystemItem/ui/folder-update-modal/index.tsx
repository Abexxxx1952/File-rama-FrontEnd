"use client";

import { useState } from "react";
import { folderUpdateSchema } from "@/srcApp/entities/fileSystemItem/model/lib/schemas/folderUpdateSchema";
import { FetchUpdateFolderForm } from "@/srcApp/entities/fileSystemItem/model/types/fetchUpdateFolder";
import { updateFolder } from "@/srcApp/entities/fileSystemItem/model/updateFolder";
import { Button } from "@/srcApp/shared/ui/button";
import { Input } from "@/srcApp/shared/ui/input";
import { Modal } from "@/srcApp/shared/ui/modal";
import { Switch } from "@/srcApp/shared/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import styles from "./styles.module.css";

type FolderUpdateModalProps = {
  folderId: string;
  folderName: string;
  isPublic: boolean;
  setUpdateFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
};

export function FolderUpdateModal({
  folderId,
  folderName,
  isPublic,
  setUpdateFolderModalOpen,
  forceUpdate,
}: FolderUpdateModalProps) {
  const [loading, setLoading] = useState(false);

  const defaultValues = { folderName: folderName, isPublic: isPublic };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FetchUpdateFolderForm>({
    resolver: zodResolver(folderUpdateSchema),
    defaultValues,
  });

  function handleUpdateFolder(
    data: FetchUpdateFolderForm,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    if (data.folderName !== folderName) {
      (async () => {
        await updateFolder(
          { folderId, folderName: data.folderName },
          setLoading,
        );
      })();
    }
    if (data.isPublic !== isPublic) {
    }
    setModalOpen(false);
    forceUpdate();
  }

  return (
    <Modal
      title="Edit folder"
      setModalOpen={setUpdateFolderModalOpen}
      width="60%"
      height="60%"
    >
      {({ setModalOpen }) => (
        <form
          className={styles.updateFolder__form}
          onSubmit={handleSubmit((data) => {
            handleUpdateFolder(data, setModalOpen);
          })}
        >
          <div className={styles.updateFolder__input}>
            <Controller
              name="folderName"
              control={control}
              render={({ field }) => (
                <Input
                  text="Folder Name"
                  placeholder="Enter folder name"
                  backgroundColor="var(--main-header-background-color)"
                  focusBackgroundColor="var(--main-header-background-color)"
                  border="none"
                  textColor="var(--secondary-font-color)"
                  labelTextColor="var(--main-page-font-color)"
                  error={errors.folderName?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className={styles.updateFolder__switch}>
            <Controller
              name="isPublic"
              control={control}
              render={({ field }) => (
                <Switch
                  text="Is Public"
                  focusBoxShadow="0 0 10px white"
                  error={errors.isPublic?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className={styles.updateFolder__buttonContainer}>
            <Button
              text="Update folder"
              backgroundColor="var(--primary-logo-color)"
              type="submit"
              loading={loading}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
