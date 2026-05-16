import { type FileCreateModalProps } from "../ui/file-create-modal";

export function areFileCreateModalEqual(
  prevProps: FileCreateModalProps,
  nextProps: FileCreateModalProps
) {
  if (
    prevProps.parentFolderId === nextProps.parentFolderId &&
    prevProps.fileSystemItemsCurrentTag === nextProps.fileSystemItemsCurrentTag
  ) {
    return true;
  }

  return false;
}
