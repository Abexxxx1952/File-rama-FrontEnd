"use client";

import { useEffect, useRef, useState } from "react";
import { createFile } from "@/srcApp/entities/fileSystemItem/model/createFile";
import { useUploadProgress } from "@/srcApp/entities/fileSystemItem/model/hooks/useUploadProgress";
import { FileUploadEvent } from "@/srcApp/entities/fileSystemItem/model/types/fileUploadEvent";
import { FileWithOptions } from "@/srcApp/entities/fileSystemItem/model/types/fileWithId";
import type { UploadStatusType } from "@/srcApp/entities/fileSystemItem/model/types/uploadStatus";
import { UploadStatus } from "@/srcApp/entities/fileSystemItem/model/types/uploadStatus";
import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { notifyResponse } from "@/srcApp/shared/model/notifyResponse";
import { Icon } from "@/srcApp/shared/ui/icon";
import styles from "./styles.module.css";

type FileCreateModalItemProps = {
  fileWith: FileWithOptions;

  setFiles: React.Dispatch<React.SetStateAction<FileWithOptions[]>>;
  setCompletedFiles: React.Dispatch<React.SetStateAction<number>>;
  forceUpdate: () => void;
};

export function FileCreateModalItem({
  fileWith,

  setFiles,
  setCompletedFiles,
  forceUpdate,
}: FileCreateModalItemProps) {
  const [version, setVersion] = useState(0);
  const [completedSize, setCompletedSize] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<UploadStatusType>(
    UploadStatus.uploading,
  );
  const hasCompletedUploadRef = useRef(false);
  const abortControllerRef = useRef(new AbortController());

  const { id, file, isUploading } = fileWith;

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
    if (hasCompletedUploadRef.current !== false) return;
    setCompletedSize(data.progress);
    setUploadStatus(UploadStatus.completed);
    setCompletedFiles((prev) => prev + 1);
    setFiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isUploading: true } : item,
      ),
    );
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

    setUploadStatus(UploadStatus.cancelled);
    hasCompletedUploadRef.current = false;
  }

  function handleCancelUpload() {
    abortControllerRef.current.abort();
    setUploadStatus(UploadStatus.cancelled);
    hasCompletedUploadRef.current = false;
  }

  function handleRefreshUpload() {
    setUploadStatus(UploadStatus.uploading);
    setFiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isUploading: false } : item,
      ),
    );
    setVersion((v) => v + 1);
  }

  useEffect(() => {
    if (isUploading) return;

    const formData = new FormData();
    formData.append("file", file);

    (async () => {
      const result = await createFile(formData, id, abortControllerRef);
      if (result === null) {
        return;
      }
      if (result.status === "COMPLETED") {
        handleUploadComplete({
          fileName: result.file.fileName,
          progress: file.size,
          status: "COMPLETED",
          error: null,
        });
      }
    })();
  }, [isUploading, file, id, version]);

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
                  uploadStatus === "Completed"
                    ? styles.file__statusCompleted
                    : uploadStatus === "Cancelled"
                      ? styles.file__statusCancelled
                      : styles.file__statusUploading
                }`}
              >
                {uploadStatus}
              </small>
            </div>
          </div>
          {uploadStatus === UploadStatus.uploading && (
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
          {uploadStatus === UploadStatus.cancelled && (
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
}
