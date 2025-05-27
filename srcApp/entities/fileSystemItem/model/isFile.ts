import { File } from "./types/file";
import { FileSystemItem } from "./types/fileSystemItem";

export function isFile(item: FileSystemItem): item is File {
  return "fileExtension" in item;
}
