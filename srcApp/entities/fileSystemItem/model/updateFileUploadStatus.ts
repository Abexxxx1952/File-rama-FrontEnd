import type { UploadStatusType } from "./types/fileWithId";
import { FileWithOptions, UploadStatus } from "./types/fileWithId";

export function updateFileUploadStatus(
  fileSystemItem: FileWithOptions[],
  id: string,
  status: UploadStatusType,
  setAvailableToUpload: React.Dispatch<React.SetStateAction<number>>,
): FileWithOptions[] {
  const updatedFiles = fileSystemItem.map((item) =>
    item.id === id ? { ...item, uploadStatus: status } : item,
  );
  const nextIndex = updatedFiles.findIndex(
    (file) => file.uploadStatus === UploadStatus.queued && file.id !== id,
  );

  if (nextIndex !== -1) {
    updatedFiles[nextIndex] = {
      ...updatedFiles[nextIndex],
      uploadStatus: UploadStatus.uploading,
    };
  } else {
    setAvailableToUpload((prev) => prev + 1);
  }

  return updatedFiles;
}
