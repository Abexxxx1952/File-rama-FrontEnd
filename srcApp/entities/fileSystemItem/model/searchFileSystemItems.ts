import { debounce } from "@/srcApp/shared/model/debounce";
import { FileSystemItem } from "./types/fileSystemItem";

function setSearchFileSystemItems(
  items: FileSystemItem[] | null | undefined,
  query: string,
  setItems: React.Dispatch<React.SetStateAction<FileSystemItem[]>>,
): void {
  if (!items) {
    return;
  }
  const normalizedQuery = query.toLowerCase();

  const filteredItems = items.filter((item) => {
    if ("folderName" in item) {
      return item.folderName.toLowerCase().includes(normalizedQuery);
    }
    if ("fileName" in item) {
      return item.fileName.toLowerCase().includes(normalizedQuery);
    }
  });
  setItems(filteredItems);
}

export const debouncedSetSearchFileSystemItems = debounce(
  setSearchFileSystemItems,
  1000,
);
