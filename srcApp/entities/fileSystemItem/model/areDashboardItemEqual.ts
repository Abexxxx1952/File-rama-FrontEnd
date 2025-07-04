import { DashboardItemProps } from "../ui/dashboardItem";
import { isFile } from "./isFile";
import { isFolder } from "./isFolder";

export function areDashboardItemEqual(
  prevProps: DashboardItemProps,
  nextProps: DashboardItemProps,
) {
  const prevItem = prevProps.item;
  const nextItem = nextProps.item;

  if (isFile(prevItem) && isFile(nextItem)) {
    return (
      prevItem.fileName === nextItem.fileName &&
      prevItem.parentFolderId === nextItem.parentFolderId &&
      prevItem.isPublic === nextItem.isPublic &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.index === nextProps.index
    );
  }

  if (isFolder(prevItem) && isFolder(nextItem)) {
    return (
      prevItem.folderName === nextItem.folderName &&
      prevItem.parentFolderId === nextItem.parentFolderId &&
      prevItem.isPublic === nextItem.isPublic &&
      prevProps.isSelected === nextProps.isSelected &&
      prevProps.index === nextProps.index
    );
  }

  return false;
}
