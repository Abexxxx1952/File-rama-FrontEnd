import { DashboardItemProps } from "../ui/dashboard-item";
import { isFile } from "./isFile";
import { isFolder } from "./isFolder";

export function areDashboardItemEqual(
  prevProps: DashboardItemProps,
  nextProps: DashboardItemProps,
) {
  const prevItem = prevProps.item;
  const nextItem = nextProps.item;

  if (prevProps.isSelected !== nextProps.isSelected) return false;
  if (prevProps.isDraggable !== nextProps.isDraggable) return false;
  if (prevItem.id !== nextItem.id) return false;
  if (prevProps.index !== nextProps.index) return false;

  if (isFile(prevItem) && isFile(nextItem)) {
    return (
      prevItem.fileName === nextItem.fileName &&
      prevItem.fileExtension === nextItem.fileExtension &&
      prevItem.parentFolderId === nextItem.parentFolderId &&
      prevItem.publicAccessRole === nextItem.publicAccessRole
    );
  }

  if (isFolder(prevItem) && isFolder(nextItem)) {
    return (
      prevItem.folderName === nextItem.folderName &&
      prevItem.parentFolderId === nextItem.parentFolderId
    );
  }

  return false;
}
