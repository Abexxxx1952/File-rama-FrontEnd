import { v4 as uuidv4 } from "uuid";
import type { UploadStatus } from "./types/fileWithId";
import { FileWithOptions } from "./types/fileWithId";

export function getFilesWithOptions(
  files: File[],
  availableToUpload: number,
  setAvailableToUpload: React.Dispatch<React.SetStateAction<number>>,
): FileWithOptions[] {
  const result = files.map((file) => {
    const status: UploadStatus = availableToUpload > 0 ? "uploading" : "queued";

    if (availableToUpload > 0) {
      availableToUpload--;
    }

    return {
      file,
      id: `${uuidv4()}-${file.name.split(".")[0]}`,
      uploadStatus: status,
    };
  });

  setAvailableToUpload(availableToUpload);

  return result;
}
