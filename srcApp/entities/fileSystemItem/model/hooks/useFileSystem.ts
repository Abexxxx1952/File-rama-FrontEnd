import { useEffect, useState } from "react";
import { getFileSystemItems } from "@/srcApp/entities/fileSystemItem/model/getFileSystemItems";
import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { SortFileSystemRules } from "@/srcApp/pages/dashboard/model/types/sort";

type useFileSystemParams = {
  currentParentFolderId: string | null;
  sortRules: SortFileSystemRules;
  version: number;
  fileSystemItemsCurrentTag: string;
};

export function useFileSystem({
  currentParentFolderId,
  sortRules,
  version,
  fileSystemItemsCurrentTag,
}: useFileSystemParams): [FileSystemItem[] | null, boolean] {
  const [fileSystemItems, setFileSystemItems] = useState<
    FileSystemItem[] | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setFileSystemItems(
        await getFileSystemItems(
          currentParentFolderId,
          sortRules,
          fileSystemItemsCurrentTag,
          setLoading,
        ),
      );
    })();
  }, [sortRules, version]);

  return [fileSystemItems, loading];
}
