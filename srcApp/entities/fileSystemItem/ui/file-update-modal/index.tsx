"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { fileUpdateSchema } from "@/srcApp/entities/fileSystemItem/model/lib/schemas/fileUpdateSchema";
import { type FetchUpdateFileForm } from "@/srcApp/entities/fileSystemItem/model/types/fetchUpdateFile";
import { updateFile } from "@/srcApp/entities/fileSystemItem/model/updateFile";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { Input } from "@/srcApp/shared/ui/input";
import { Modal } from "@/srcApp/shared/ui/modal";
import { Switch } from "@/srcApp/shared/ui/switch";

import { createFilePermissions } from "../../model/createFilePermissions";
import { deleteFilePermissions } from "../../model/deleteFilePermissions";
import { FileSystemItemPermissions } from "../../model/types/fileSystemItemPermissions";
import { type publicAccessRole } from "../../model/types/publicAccessRole";
import styles from "./styles.module.css";

type FileUpdateModalProps = {
  fileId: string;
  fileName: string;
  fileExtension: string;
  publicAccessRole: publicAccessRole | null;
  fileUrl: string;
  setUpdateFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
  fileSystemItemsCurrentTag: string;
};

export function FileUpdateModal({
  fileId,
  fileName,
  fileExtension,
  publicAccessRole,
  fileUrl,
  setUpdateFileModalOpen,
  forceUpdate,
  fileSystemItemsCurrentTag,
}: FileUpdateModalProps) {
  const [loading, setLoading] = useState(false);

  const isPublic =
    publicAccessRole === FileSystemItemPermissions.READER ||
    publicAccessRole === FileSystemItemPermissions.WRITER;
  const canRewritten = publicAccessRole === FileSystemItemPermissions.WRITER;

  const fileStaticUrl: string = `${process.env.NEXT_PUBLIC_DOWNLOAD_FILE_URL}${fileId}`;

  const defaultValues = {
    fileName,
    fileExtension,
    isPublic,
    canRewritten,
    fileGDriveUrl: fileUrl,
    fileStaticUrl,
  };

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FetchUpdateFileForm>({
    resolver: zodResolver(fileUpdateSchema),
    defaultValues,
  });

  const isPublicValue = watch("isPublic");

  async function handleUpdateFile(data: FetchUpdateFileForm) {
    if (data.fileName !== fileName || data.fileExtension !== fileExtension) {
      await updateFile(
        { fileId, fileName: `${data.fileName}.${data.fileExtension}` },
        [fileSystemItemsCurrentTag],
        setLoading
      );
    }
    if (data.isPublic !== isPublic || data.canRewritten !== canRewritten) {
      if (data.isPublic === true) {
        await createFilePermissions(
          { fileId, role: data.canRewritten ? "writer" : "reader" },
          fileSystemItemsCurrentTag,
          setLoading
        );
      } else {
        await deleteFilePermissions(
          fileId,
          fileSystemItemsCurrentTag,
          setLoading
        );
      }
    }

    setUpdateFileModalOpen(false);
    forceUpdate();
  }

  async function copyToClipboard(value: string, isStaticUrl: boolean) {
    if (!value) {
      return;
    }
    const notifyText = isStaticUrl
      ? "File static URL"
      : "File Google Drive URL";
    await navigator.clipboard.writeText(value);
    notifyResponse({
      isError: false,
      successMessage: `${notifyText} ${fileName} coped to clipboard`,
    });
  }

  return (
    <Modal
      title="Edit file"
      setModalOpen={setUpdateFileModalOpen}
      width="60%"
      height="auto"
    >
      <form
        className={styles.updateFile__form}
        onSubmit={handleSubmit(handleUpdateFile)}
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
                focusBoxShadow="0 0 10px white"
                border="none"
                textColor="var(--secondary-font-color)"
                labelTextColor="var(--main-page-font-color)"
                error={errors.fileName?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className={styles.updateFile__input}>
          <Controller
            name="fileExtension"
            control={control}
            render={({ field }) => (
              <Input
                text="File Extension"
                placeholder="Enter file extension"
                backgroundColor="var(--main-header-background-color)"
                focusBackgroundColor="var(--main-header-background-color)"
                focusBoxShadow="0 0 10px white"
                border="none"
                textColor="var(--secondary-font-color)"
                labelTextColor="var(--main-page-font-color)"
                error={errors.fileExtension?.message}
                {...field}
              />
            )}
          />
        </div>
        <div className={styles.updateFile__switchRow}>
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
          {isPublicValue && (
            <div className={styles.updateFile__switch}>
              <Controller
                name="canRewritten"
                control={control}
                render={({ field }) => (
                  <Switch
                    text="Can rewritten"
                    focusBoxShadow="0 0 10px white"
                    error={errors.isPublic?.message}
                    {...field}
                  />
                )}
              />
            </div>
          )}
        </div>
        {isPublicValue && (
          <div className={styles.updateFile__input}>
            <Controller
              name="fileGDriveUrl"
              control={control}
              render={({ field }) => (
                <Input
                  text="File Google Drive URL"
                  backgroundColor="var(--input-disabled-color)"
                  focusBackgroundColor="var(--input-disabled-color)"
                  focusBoxShadow="0 0 10px white"
                  border="none"
                  textColor="var(--secondary-font-color)"
                  labelTextColor="var(--main-page-font-color)"
                  readOnly
                  error={errors.fileName?.message}
                  {...field}
                />
              )}
            />
            <Icon
              link="/svg/isPublic-sprite.svg#copyToClipboard"
              className={styles.updateFile__copyToClipboard}
              onClick={() => copyToClipboard(fileUrl, false)}
            />
          </div>
        )}
        {isPublicValue && (
          <div className={styles.updateFile__input}>
            <Controller
              name="fileStaticUrl"
              control={control}
              render={({ field }) => (
                <Input
                  text="File Static URL"
                  backgroundColor="var(--input-disabled-color)"
                  focusBackgroundColor="var(--input-disabled-color)"
                  focusBoxShadow="0 0 10px white"
                  border="none"
                  textColor="var(--secondary-font-color)"
                  labelTextColor="var(--main-page-font-color)"
                  readOnly
                  error={errors.fileName?.message}
                  {...field}
                />
              )}
            />
            <Icon
              link="/svg/isPublic-sprite.svg#copyToClipboard"
              className={styles.updateFile__copyToClipboard}
              onClick={() => copyToClipboard(fileStaticUrl, true)}
            />
          </div>
        )}
        <div
          className={`${styles.updateFile__buttonContainer} ${isPublicValue && styles.updateFile__buttonContainer_public}`}
        >
          <Button
            text="Update file"
            backgroundColor="var(--primary-logo-color)"
            type="submit"
            loading={loading}
          />
        </div>
      </form>
    </Modal>
  );
}
