import type { UploadStatus } from "./types/fileWithId";
import { FileWithOptions } from "./types/fileWithId";

export function updateFileUploadStatus(
  fileSystemItem: FileWithOptions[],
  id: string,
  status: UploadStatus,
  setAvailableToUpload: React.Dispatch<React.SetStateAction<number>>,
): FileWithOptions[] {
  const updatedFiles = fileSystemItem.map((item) =>
    item.id === id ? { ...item, uploadStatus: status } : item,
  );
  const nextIndex = updatedFiles.findIndex(
    (file) => file.uploadStatus === "queued" && file.id !== id,
  );

  if (nextIndex !== -1) {
    updatedFiles[nextIndex] = {
      ...updatedFiles[nextIndex],
      uploadStatus: "uploading",
    };
  } else {
    setAvailableToUpload((prev) => prev + 1);
  }

  return updatedFiles;
}
