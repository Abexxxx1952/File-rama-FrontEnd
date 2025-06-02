import { v4 as uuidv4 } from "uuid";
import { FileWithOptions } from "./types/fileWithId";

export function getFilesWithOptions(files: File[]): FileWithOptions[] {
  return files.map((file) => ({
    file,
    id: `${uuidv4()}-${file.name.split(".")[0]}`,
    isUploading: false,
  }));
}
