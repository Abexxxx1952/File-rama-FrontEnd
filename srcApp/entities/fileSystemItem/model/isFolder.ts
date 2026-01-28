import { FileSystemItem } from "./types/fileSystemItem";
import { Folder } from "./types/folder";

export function isFolder(item: FileSystemItem | null): item is Folder {
  return item !== null && "folderName" in item;
}
