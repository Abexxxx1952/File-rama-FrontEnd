"use client";

import { useState } from "react";
import { createFolder } from "@/srcApp/entities/fileSystemItem/model/createFolder";
import { folderAddSchema } from "@/srcApp/entities/fileSystemItem/model/lib/schemas/folderAddSchema";
import type { FetchAddFolderForm } from "@/srcApp/entities/fileSystemItem/model/types/fetchAddFolder";
import { Button } from "@/srcApp/shared/ui/button";
import { Input } from "@/srcApp/shared/ui/input";
import { Modal } from "@/srcApp/shared/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import styles from "./styles.module.css";

type FolderCreateModalProps = {
  setAddFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
  parentFolderId: string | null;
};

export function FolderCreateModal({
  setAddFolderModalOpen,
  forceUpdate,
  parentFolderId,
}: FolderCreateModalProps) {
  const [loading, setLoading] = useState(false);

  const defaultValues = { folderName: "" };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FetchAddFolderForm>({
    resolver: zodResolver(folderAddSchema),
    defaultValues,
  });

  function handleCreateFolder(
    data: FetchAddFolderForm,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    (async () => {
      await createFolder({ ...data, parentFolderId }, setLoading, setModalOpen);

      forceUpdate();
    })();
  }

  return (
    <Modal
      title="Add folder"
      setModalOpen={setAddFolderModalOpen}
      width="60%"
      height="60%"
    >
      {({ setModalOpen }) => (
        <form
          className={styles.addFolder__form}
          onSubmit={handleSubmit((data) => {
            handleCreateFolder(data, setModalOpen);
          })}
        >
          <div className={styles.addFolder__input}>
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
                  error={errors.folderName?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className={styles.addFolder__button}>
            <Button
              text="Add folder"
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
