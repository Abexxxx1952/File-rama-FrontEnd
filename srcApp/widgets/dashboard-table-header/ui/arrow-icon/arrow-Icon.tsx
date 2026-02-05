import {
  SORT_ORDER,
  SortOrder,
} from "@/srcApp/pages/dashboard/model/types/sort";
import { Icon } from "@/srcApp/shared/ui/icon";
import styles from "./styles.module.css";

type ArrowIconProps = {
  sortItem:
    | {
        order?: SortOrder;
        index: number;
      }
    | undefined;
};

export function ArrowIcon({ sortItem }: ArrowIconProps) {
  if (!sortItem) return null;

  const isDesc =
    sortItem?.order === SORT_ORDER.DESC ? SORT_ORDER.DESC : SORT_ORDER.ASC;
  return (
    <Icon
      link="/svg/dashboard-page-sprite.svg#arrow"
      onClick={() => {}}
      className={`${styles.tableHeader__arrow} ${styles[`tableHeader__arrow--${isDesc}`]}`}
    />
  );
}
