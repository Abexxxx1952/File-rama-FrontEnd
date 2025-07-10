import { FileSystemItem } from "@/srcApp/entities/fileSystemItem/model/types/fileSystemItem";
import { getElementsBetween } from "./getElementsBetween";
import { getLastAndSecondLastFromMap } from "./getLastAndSecondLastFromMap";
import { SelectedMap } from "./types/selectedMap";

export function selectBetween(
  selected: SelectedMap,
  fileSystemItems: FileSystemItem[] | null,
  setSelected: React.Dispatch<React.SetStateAction<SelectedMap>>,
): void {
  const result = getLastAndSecondLastFromMap(selected);

  if (result) {
    const { secondLast, last } = result;

    const selectedEntries = getElementsBetween(
      fileSystemItems!,
      secondLast,
      last,
    );

    setSelected(new Map([...selectedEntries]));
  }
}
