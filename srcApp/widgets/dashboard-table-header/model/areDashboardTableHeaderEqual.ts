import { type DashboardTableHeaderProps } from "../ui/dashboard-table-header";

export function areDashboardTableHeaderEqual(
  prevProps: DashboardTableHeaderProps,
  nextProps: DashboardTableHeaderProps
) {
  if (prevProps.sort === nextProps.sort) {
    return true;
  }

  return false;
}
