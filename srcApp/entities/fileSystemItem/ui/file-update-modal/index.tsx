"use client";

import { useState } from "react";
import { fileUpdateSchema } from "@/srcApp/entities/fileSystemItem/model/lib/schemas/fileUpdateSchema";
import { FetchUpdateFileForm } from "@/srcApp/entities/fileSystemItem/model/types/fetchUpdateFile";
import { updateFile } from "@/srcApp/entities/fileSystemItem/model/updateFile";
import { Button } from "@/srcApp/shared/ui/button";
import { Input } from "@/srcApp/shared/ui/input";
import { Modal } from "@/srcApp/shared/ui/modal";
import { Switch } from "@/srcApp/shared/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import styles from "./styles.module.css";

type FileUpdateModalProps = {
  fileId: string;
  fileName: string;
  isPublic: boolean;
  setUpdateFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
};

export function FileUpdateModal({
  fileId,
  fileName,
  isPublic,
  setUpdateFileModalOpen,
  forceUpdate,
}: FileUpdateModalProps) {
  const [loading, setLoading] = useState(false);

  const defaultValues = { fileName: fileName, isPublic: isPublic };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FetchUpdateFileForm>({
    resolver: zodResolver(fileUpdateSchema),
    defaultValues,
  });

  function handleUpdateFile(
    data: FetchUpdateFileForm,
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) {
    if (data.fileName !== fileName) {
      (async () => {
        await updateFile({ fileId, fileName: data.fileName }, setLoading);
      })();
    }
    if (data.isPublic !== isPublic) {
    }
    setModalOpen(false);
    forceUpdate();
  }

  return (
    <Modal
      title="Edit file"
      setModalOpen={setUpdateFileModalOpen}
      width="60%"
      height="60%"
    >
      {({ setModalOpen }) => (
        <form
          className={styles.updateFile__form}
          onSubmit={handleSubmit((data) => {
            handleUpdateFile(data, setModalOpen);
          })}
        >
          <div className={styles.updateFile__input}>
            <Controller
              name="fileName"
              control={control}
              render={({ field }) => (
                <Input
                  text="File Name"
                  placeholder="Enter file name"
                  backgroundColor="var(--main-header-background-color)"
                  focusBackgroundColor="var(--main-header-background-color)"
                  border="none"
                  textColor="var(--secondary-font-color)"
                  labelTextColor="var(--main-page-font-color)"
                  error={errors.fileName?.message}
                  {...field}
                />
              )}
            />
          </div>
          <div className={styles.updateFile__switch}>
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
          <div className={styles.updateFile__button}>
            <Button
              text="Update file"
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
