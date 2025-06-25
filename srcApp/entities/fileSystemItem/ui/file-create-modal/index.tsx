"use client";

import { useRef, useState } from "react";
import { getFilesWithOptions } from "@/srcApp/entities/fileSystemItem/model/getFilesWithId";
import { FileWithOptions } from "@/srcApp/entities/fileSystemItem/model/types/fileWithId";
import { Modal } from "@/srcApp/shared/ui/modal";
import { FileCreateModalItem } from "./file-create-modal-item";
import styles from "./styles.module.css";

type FileCreateModalProps = {
  parentFolderId: string | null;
  setAddFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
};

export function FileCreateModal({
  parentFolderId,
  setAddFileModalOpen,
  forceUpdate,
}: FileCreateModalProps) {
  const [files, setFiles] = useState<FileWithOptions[]>([]);
  const [availableToUpload, setAvailableToUpload] = useState(
    Number(process.env.NEXT_PUBLIC_AVAILABLE_TO_UPLOAD_FILE_COUNT) || 5,
  );
  const [completedFiles, setCompletedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isRevalidateCacheRef = useRef<boolean>(false);

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
      handleSelectedFiles(files);
    }
    setIsDragOver(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  function handleBrowseClick() {
    inputRef.current?.click();
  }

  function handleSelectedFiles(filesList: FileList | null) {
    if (filesList === null || filesList.length === 0) return;
    const filesArray: File[] = [...filesList];
    const filesWithOptions = getFilesWithOptions(
      filesArray,
      availableToUpload,
      setAvailableToUpload,
    );

    setFiles((prev) => [...(prev || []), ...filesWithOptions]);
    setTotalFiles((prev) => prev + filesWithOptions.length);
  }

  return (
    <Modal
      setModalOpen={setAddFileModalOpen}
      backgroundColor="#fff"
      height="90%"
    >
      {() => (
        <div className={styles.uploader}>
          <div className={styles.uploader__header}>
            <h2 className={styles.uploader__title}>File Uploader</h2>
            <h4 className={styles.uploader__fileCompletedStatus}>
              {!!totalFiles &&
                `${completedFiles}/${totalFiles} files completed`}
            </h4>
          </div>
          <ul className={styles.fileList}>
            {files.length > 0 &&
              files.map((file) => (
                <FileCreateModalItem
                  key={file.id}
                  fileWith={file}
                  setFiles={setFiles}
                  parentFolderId={parentFolderId}
                  setCompletedFiles={setCompletedFiles}
                  availableToUpload={availableToUpload}
                  setAvailableToUpload={setAvailableToUpload}
                  forceUpdate={forceUpdate}
                  isRevalidateCacheRef={isRevalidateCacheRef}
                />
              ))}
          </ul>
          <div
            className={`${styles.fileUploadBox} ${isDragOver ? styles.active : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <h2 className={styles.fileUploadBox__title}>
              <span className={styles.fileUploadBox__instruction}>
                {isDragOver ? "Release to upload or" : "Drag files here or"}
              </span>{" "}
              <span
                className={styles.fileUploadBox__button}
                onClick={handleBrowseClick}
              >
                browse
              </span>
            </h2>
            <input
              className={styles.fileUploadBox__input}
              type="file"
              multiple
              hidden
              ref={inputRef}
              onChange={(e) => handleSelectedFiles(e.target.files!)}
            ></input>
          </div>
        </div>
      )}
    </Modal>
  );
}
