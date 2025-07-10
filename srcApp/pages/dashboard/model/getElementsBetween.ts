import { isFile } from "@/srcApp/entities/fileSystemItem/model/isFile";
import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";

export function getElementsBetween(
  arr: FileSystemItem[],
  startIndex: number,
  endIndex: number,
): [
  string,
  { index: number; folderId: string } | { index: number; fileId: string },
][] {
  if (startIndex < endIndex) {
    return arr.slice(startIndex, endIndex + 1).map((item, index) => {
      const indexResult = index + startIndex;
      if (isFile(item)) {
        return [item.id, { index: indexResult, fileId: item.id }];
      } else {
        return [item.id, { index: indexResult, folderId: item.id }];
      }
    });
  } else {
    return arr
      .slice(endIndex, startIndex + 1)
      .reduceRight<
        [
          string,
          (
            | { index: number; folderId: string }
            | { index: number; fileId: string }
          ),
        ][]
      >((acc, item, index) => {
        const indexResult = index + endIndex;
        if (isFile(item)) {
          acc.push([item.id, { index: indexResult, fileId: item.id }]);
        } else {
          acc.push([item.id, { index: indexResult, folderId: item.id }]);
        }

        return acc;
      }, []);
  }
}
