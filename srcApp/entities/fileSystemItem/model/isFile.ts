import { File, FileSystemItem } from "./types";

export function isFile(item: FileSystemItem): item is File {
  return "fileExtension" in item;
}
