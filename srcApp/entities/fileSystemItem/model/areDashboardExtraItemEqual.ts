import { DashboardExtraIItemProps } from "../ui";

export function areDashboardExtraItemEqual(
  prevProps: DashboardExtraIItemProps,
  nextProps: DashboardExtraIItemProps,
) {
  if (
    prevProps.usedSize === nextProps.usedSize &&
    prevProps.totalSize === nextProps.totalSize
  ) {
    return true;
  }

  return false;
}
