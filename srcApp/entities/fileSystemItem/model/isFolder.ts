import { FileSystemItem } from "./types/fileSystemItem";
import { Folder } from "./types/folder";

export function isFolder(item: FileSystemItem): item is Folder {
  return "folderName" in item;
}
