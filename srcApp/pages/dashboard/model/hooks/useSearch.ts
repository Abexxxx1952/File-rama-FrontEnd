import { useEffect, useState } from "react";
import { debouncedSetSearchFileSystemItems } from "@/srcApp/entities/fileSystemItem/model/searchFileSystemItems";
import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";

export function useSearch(items: FileSystemItem[] | null, search: string) {
  const [filtered, setFiltered] = useState<FileSystemItem[]>([]);

  useEffect(() => {
    if (!items) return;
    if (search === "") {
      setFiltered(items);
      return;
    }

    debouncedSetSearchFileSystemItems(items, search, setFiltered);
  }, [items, search]);

  return filtered;
}
