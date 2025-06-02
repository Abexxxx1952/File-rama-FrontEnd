"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "@/srcApp/shared/ui/modal";
import { getFilesWithOptions } from "../../model/getFilesWithId";
import { FileWithOptions } from "../../model/types/fileWithId";
import { FileCreateModalItem } from "./file-create-modal-item";
import styles from "./styles.module.css";

type FileCreateModalProps = {
  setAddFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  forceUpdate: () => void;
};

export function FileCreateModal({
  setAddFileModalOpen,
  forceUpdate,
}: FileCreateModalProps) {
  const [files, setFiles] = useState<FileWithOptions[]>([]);
  const [completedFiles, setCompletedFiles] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  console.log("isDragOver", isDragOver);

  useEffect(() => {
    const dropArea = document.getElementById("drop-zone");

    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      const files = event.dataTransfer?.files;
      if (files) {
        handleSelectedFiles(files);
      }
      setIsDragOver(false);
    };

    const handleDragOver = (event: DragEvent) => {
      event.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = () => {
      setIsDragOver(false);
    };

    dropArea?.addEventListener("drop", handleDrop);
    dropArea?.addEventListener("dragover", handleDragOver);
    dropArea?.addEventListener("dragleave", handleDragLeave);

    return () => {
      dropArea?.removeEventListener("drop", handleDrop);
      dropArea?.removeEventListener("dragover", handleDragOver);
      dropArea?.removeEventListener("dragleave", handleDragLeave);
    };
  }, []);
  function handleBrowseClick() {
    inputRef.current?.click();
  }

  function handleSelectedFiles(filesList: FileList | null) {
    if (filesList === null || filesList.length === 0) return;
    const filesArray: File[] = [...filesList];
    const filesWithOptions = getFilesWithOptions(filesArray);

    setFiles((prev) => [...(prev || []), ...filesWithOptions]);
    setTotalFiles((prev) => prev + filesWithOptions.length);
  }

  return (
    <Modal
      setModalOpen={setAddFileModalOpen}
      backgroundColor="#fff"
      height="90%"
    >
      {({ setModalOpen }) => (
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
                  setCompletedFiles={setCompletedFiles}
                  forceUpdate={forceUpdate}
                />
              ))}
          </ul>
          <div
            className={`${styles.fileUploadBox} ${isDragOver ? styles.active : ""}`}
            id="drop-zone"
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
