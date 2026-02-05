import { FileCreateModalItemProps } from "../ui/file-create-modal/file-create-modal-item";

export function areFileCreateModalItemEqual(
  prevProps: FileCreateModalItemProps,
  nextProps: FileCreateModalItemProps,
) {
  if (
    prevProps.fileWith.id === nextProps.fileWith.id &&
    prevProps.fileWith.uploadStatus === nextProps.fileWith.uploadStatus &&
    prevProps.parentFolderId === nextProps.parentFolderId &&
    prevProps.availableToUpload > 0 &&
    nextProps.availableToUpload > 0 &&
    prevProps.fileSystemItemsCurrentTag === nextProps.fileSystemItemsCurrentTag
  ) {
    return true;
  }

  return false;
}
