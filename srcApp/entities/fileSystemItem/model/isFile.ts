import { File } from "./types/file";
import { FileSystemItem } from "./types/fileSystemItem";

export function isFile(item: FileSystemItem | null): item is File {
  return item !== null && "fileExtension" in item;
}
