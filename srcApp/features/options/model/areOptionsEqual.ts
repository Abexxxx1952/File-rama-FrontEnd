import { type OptionsProps } from "../ui";

export function areOptionsEqual(
  prevProps: OptionsProps,
  nextProps: OptionsProps
) {
  if (
    prevProps.currentParentFolderId === nextProps.currentParentFolderId &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.loadingDelete === nextProps.loadingDelete
  ) {
    return true;
  }

  return false;
}
