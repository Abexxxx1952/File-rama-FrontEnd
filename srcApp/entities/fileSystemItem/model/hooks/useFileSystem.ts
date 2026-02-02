import { useEffect, useState } from "react";
import { getFileSystemItems } from "@/srcApp/entities/fileSystemItem/model/getFileSystemItem";
import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";

export function useFileSystem(parentFolderId: string[], version: number) {
  const [items, setItems] = useState<FileSystemItem[] | null>(null);

  useEffect(() => {
    (async () => {
      const parentId =
        parentFolderId.length > 0
          ? parentFolderId[parentFolderId.length - 1]
          : undefined;

      setItems(await getFileSystemItems(parentId));
    })();
  }, [parentFolderId, version]);

  return items;
}
