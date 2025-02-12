import { FileItem, FileSystemItemType } from "./types";

export function isFile(item: FileSystemItemType): item is FileItem {
  return "fileExtension" in item;
}
