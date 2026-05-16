"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { folderUpdateSchema } from "@/srcApp/entities/fileSystemItem/model/lib/schemas/folderUpdateSchema";
import { type FetchUpdateFolderForm } from "@/srcApp/entities/fileSystemItem/model/types/fetchUpdateFolder";
import { updateFolder } from "@/srcApp/entities/fileSystemItem/model/updateFolder";
import { Button } from "@/srcApp/shared/ui/button";
import { Input } from "@/srcApp/shared/ui/input";
import { Modal } from "@/srcApp/shared/ui/modal";

import styles from "./styles.module.css";

type FolderUpdateModalProps = {
  folderId: string;
  folderName: string;
  setUpdateFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
  fileSystemItemsCurrentTag: string;
};

export function FolderUpdateModal({
  folderId,
  folderName,
  setUpdateFolderModalOpen,
  forceUpdate,
  fileSystemItemsCurrentTag,
}: FolderUpdateModalProps) {
  const [loading, setLoading] = useState(false);

  const defaultValues = { folderName };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FetchUpdateFolderForm>({
    resolver: zodResolver(folderUpdateSchema),
    defaultValues,
  });

  function handleUpdateFolder(data: FetchUpdateFolderForm) {
    if (data.folderName !== folderName) {
      (async () => {
        await updateFolder(
          { folderId, folderName: data.folderName },
          [fileSystemItemsCurrentTag],
          setLoading
        );
      })();
    }
    setUpdateFolderModalOpen(false);
    forceUpdate();
  }

  return (
    <Modal
      title="Edit folder"
      setModalOpen={setUpdateFolderModalOpen}
      width="50%"
      height="50%"
    >
      <form
        className={styles.updateFolder__form}
        onSubmit={handleSubmit(handleUpdateFolder)}
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
        <div className={styles.updateFolder__buttonContainer}>
          <Button
            text="Update folder"
            backgroundColor="var(--primary-logo-color)"
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </Modal>
  );
}
