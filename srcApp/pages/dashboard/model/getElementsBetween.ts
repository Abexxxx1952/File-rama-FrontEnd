import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";

export function getElementsBetween(
  arr: FileSystemItem[],
  startIndex: number,
  endIndex: number,
): [string, number][] {
  console.log("startIndex", startIndex, "endIndex", endIndex);

  if (startIndex < endIndex) {
    return arr.slice(startIndex, endIndex + 1).map((item, index) => {
      const indexResult = index + startIndex;
      return [item.id, indexResult];
    });
  } else {
    return arr
      .slice(endIndex, startIndex + 1)
      .reduceRight<[string, number][]>((acc, item, index) => {
        const indexResult = index + endIndex;
        acc.push([item.id, indexResult]);
        return acc;
      }, []);
  }
}
