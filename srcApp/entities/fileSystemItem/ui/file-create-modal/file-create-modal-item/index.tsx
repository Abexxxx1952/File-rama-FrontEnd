"use client";

import { memo, useEffect, useRef, useState } from "react";
import { createFile } from "@/srcApp/entities/fileSystemItem/model/createFile";
import { useUploadProgress } from "@/srcApp/entities/fileSystemItem/model/hooks/useUploadProgress";
import { FileUploadEvent } from "@/srcApp/entities/fileSystemItem/model/types/fileUploadEvent";
import { StatusUpload } from "@/srcApp/entities/fileSystemItem/model/types/fileUploadResult";
import {
  FileWithOptions,
  UploadStatus,
} from "@/srcApp/entities/fileSystemItem/model/types/fileWithId";
import type { UploadStatusViewType } from "@/srcApp/entities/fileSystemItem/model/types/uploadStatus";
import { UploadStatusView } from "@/srcApp/entities/fileSystemItem/model/types/uploadStatus";
import { updateFileUploadStatus } from "@/srcApp/entities/fileSystemItem/model/updateFileUploadStatus";
import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { Icon } from "@/srcApp/shared/ui/icon";
import { areFileCreateModalItemEqual } from "../../../model/areFileCreateModalItemEqual";
import styles from "./styles.module.css";

export type FileCreateModalItemProps = {
  fileWith: FileWithOptions;
  parentFolderId: string | null;
  setFiles: React.Dispatch<React.SetStateAction<FileWithOptions[]>>;
  setCompletedFiles: React.Dispatch<React.SetStateAction<number>>;
  availableToUpload: number;
  setAvailableToUpload: React.Dispatch<React.SetStateAction<number>>;
  forceUpdate: () => void;
  fileSystemItemsCurrentTag: string;
};

export const FileCreateModalItem = memo(function FileCreateModalItem({
  fileWith,
  parentFolderId,
  setFiles,
  setCompletedFiles,
  availableToUpload,
  setAvailableToUpload,
  forceUpdate,
  fileSystemItemsCurrentTag,
}: FileCreateModalItemProps) {
  const [version, setVersion] = useState(0);
  const [completedSize, setCompletedSize] = useState(0);
  const [uploadStatusView, setUploadStatusView] =
    useState<UploadStatusViewType>(UploadStatusView.uploading);
  const hasCompletedUploadRef = useRef(false);
  const abortControllerRef = useRef(new AbortController());

  const { id, file, uploadStatus } = fileWith;

  const fileExtension = file.name.split(".").pop();
  let progressBarStyle = {
    "--progress-bar-size": (completedSize / file.size) * 100 + "%",
  } as React.CSSProperties;
  useUploadProgress(
    id,
    handleUploadStatusChange,
    handleUploadComplete,
    handleUploadError,
  );

  function handleUploadStatusChange(data: FileUploadEvent) {
    setCompletedSize(data.progress);
    if (data.progress === file.size) {
      handleUploadComplete(data);
    }
  }

  function handleUploadComplete(data: FileUploadEvent) {
    if (hasCompletedUploadRef.current === true) return;
    setCompletedSize(data.progress);
    setUploadStatusView(UploadStatusView.completed);
    setCompletedFiles((prev) => prev + 1);

    setFiles((prevFiles) => {
      return updateFileUploadStatus(
        prevFiles,
        id,
        UploadStatus.completed,
        setAvailableToUpload,
      );
    });

    hasCompletedUploadRef.current = true;
    forceUpdate();
  }

  function handleUploadError(err: any) {
    if (err.error) {
      notifyResponse(
        {
          isError: true,
          responseResult: null,
        },
        err.error,
      );
    }

    if (err.message) {
      notifyResponse(
        {
          isError: true,
          responseResult: null,
        },
        err.message,
      );
    }

    notifyResponse({
      isError: true,
      responseResult: null,
    });

    setUploadStatusView(UploadStatusView.cancelled);

    setFiles((prevFiles) => {
      return updateFileUploadStatus(
        prevFiles,
        id,
        UploadStatus.error,
        setAvailableToUpload,
      );
    });

    hasCompletedUploadRef.current = false;
  }

  function handleCancelUpload() {
    abortControllerRef.current.abort();
    setUploadStatusView(UploadStatusView.cancelled);

    setFiles((prevFiles) => {
      return updateFileUploadStatus(
        prevFiles,
        id,
        UploadStatus.queued,
        setAvailableToUpload,
      );
    });

    hasCompletedUploadRef.current = false;
  }

  function handleRefreshUpload() {
    if (availableToUpload > 0) {
      setUploadStatusView(UploadStatusView.uploading);
      setFiles((prevFiles) =>
        prevFiles.map((item) =>
          item.id === id
            ? { ...item, uploadStatus: UploadStatus.uploading }
            : item,
        ),
      );
      setVersion((v) => v + 1);
    }
  }

  useEffect(() => {
    if (!(uploadStatus === UploadStatus.uploading)) return;

    const formData = new FormData();
    if (parentFolderId) {
      formData.append("parentFolderId", parentFolderId);
    }
    formData.append("file", file);

    (async () => {
      const result = await createFile(
        formData,
        id,
        fileSystemItemsCurrentTag,
        abortControllerRef,
      );

      if (result === null) {
        return;
      }

      if (result.status === StatusUpload.COMPLETED) {
        handleUploadComplete({
          fileName: result.file.fileName,
          progress: file.size,
          status: StatusUpload.COMPLETED,
          error: null,
        });
        forceUpdate();
      }
    })();
  }, [uploadStatus, file, id, version]);

  return (
    <li className={styles.file}>
      <div className={styles.file__extension}>{fileExtension}</div>
      <div className={styles.file__container}>
        <div className={styles.file__wrapper}>
          <div className={styles.file__details}>
            <h5 className={styles.file__name}>{file.name}</h5>
            <div className={styles.file__info}>
              <small className={styles.file__size}>
                {formatBytes(completedSize)} / {formatBytes(file.size)}
              </small>
              <small className={styles.file__divider}>•</small>
              <small
                className={`${
                  uploadStatusView === UploadStatusView.completed
                    ? styles.file__statusCompleted
                    : uploadStatusView === UploadStatusView.cancelled
                      ? styles.file__statusCancelled
                      : styles.file__statusUploading
                }`}
              >
                {uploadStatus}
              </small>
            </div>
          </div>
          {uploadStatusView === UploadStatusView.uploading && (
            <button
              type="button"
              className={styles.file__cancelButton}
              onClick={handleCancelUpload}
            >
              <Icon
                link={`/svg/settings-sprite.svg#cross`}
                className={styles.file__crossIcon}
              />
            </button>
          )}
          {uploadStatusView === UploadStatusView.cancelled && (
            <button
              type="button"
              className={styles.file__refreshButton}
              onClick={handleRefreshUpload}
            >
              <Icon
                link={`/svg/settings-sprite.svg#refresh`}
                className={styles.file__refreshIcon}
              />
            </button>
          )}
        </div>
        <div className={styles.file__progressBarContainer}>
          <div
            className={styles.file__progressBar}
            style={progressBarStyle}
          ></div>
        </div>
      </div>
    </li>
  );
}, areFileCreateModalItemEqual);
