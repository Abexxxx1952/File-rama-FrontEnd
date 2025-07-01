import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { getElementsBetween } from "./getElementsBetween";
import { getLastAndSecondLastFromMap } from "./getLastAndSecondLastFromMap";

export function selectBetween(
  selected: Map<string, number>,
  fileSystemItems: FileSystemItem[] | null,
  setSelected: React.Dispatch<React.SetStateAction<Map<string, number>>>,
): void {
  const result = getLastAndSecondLastFromMap(selected);

  if (result) {
    const { secondLast, last } = result;

    const selectedEntries = getElementsBetween(
      fileSystemItems!,
      secondLast.index,
      last.index,
    );

    setSelected(new Map([...selectedEntries]));
  }
}
