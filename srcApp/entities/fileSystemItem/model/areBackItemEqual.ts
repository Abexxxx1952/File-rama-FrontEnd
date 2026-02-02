import { BackItemProps } from "../ui";

export function areBackItemEqual(
  prevProps: BackItemProps,
  nextProps: BackItemProps,
) {
  if (
    prevProps.grandParentId === nextProps.grandParentId &&
    prevProps.dndRef.current.droppable === nextProps.dndRef.current.droppable
  ) {
    return true;
  }

  return false;
}
