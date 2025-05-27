"use client";

import { useState } from "react";
import { Button } from "@/srcApp/shared/ui/button";
import { Input } from "@/srcApp/shared/ui/input";
import { Modal } from "@/srcApp/shared/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { addFolder } from "../../model/addFolder";
import { folderAddSchema } from "../../model/lib/schemas/folderAddSchema";
import { FetchAddFolderForm } from "../../model/types/fetchAddFolder";
import styles from "./styles.module.css";

type FolderCreateModalProps = {
  setAddFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
};

export function FolderCreateModal({
  setAddFolderModalOpen,
  forceUpdate,
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

  return (
    <Modal title="Add folder" setModalOpen={setAddFolderModalOpen}>
      {({ setModalOpen }) => (
        <form
          className={styles.addFolder__form}
          onSubmit={handleSubmit(async (data) => {
            await addFolder(
              { ...data, parentFolderId: null },
              setLoading,
              setModalOpen,
            );
            forceUpdate();
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
