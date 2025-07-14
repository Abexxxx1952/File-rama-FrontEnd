import { memo } from "react";
import { formatBytes } from "@/srcApp/shared/model/formatBytes";
import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { areDashboardExtraItemEqual } from "../../model/areDashboardExtraItemEqual";
import styles from "./styles.module.css";

export type DashboardExtraIItemProps = {
  usedSize: number;
  totalSize: number;
  setAddFileModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAddFolderModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const DashboardExtraItem = memo(function ({
  usedSize,
  totalSize,
  setAddFileModalOpen,
  setAddFolderModalOpen,
}: DashboardExtraIItemProps) {
  return (
    <div className={styles.dashboard__extraItem}>
      <div className={styles.dashboard__addButton}>
        <Button
          text="+ Add File"
          className={styles.dashboard__button}
          onClick={() => setAddFileModalOpen(true)}
        />
      </div>
      <div className={styles.dashboard__addButton}>
        <Button
          text="+ Create Folder"
          className={styles.dashboard__button}
          onClick={() => setAddFolderModalOpen(true)}
        />
      </div>
      <div className={styles.dashboard__usageSize}>
        <div className={styles.dashboard__usageSizeHeader}>
          <Icon
            link="/svg/dashboard-page-sprite.svg#cloud"
            className={styles.dashboard__cloudIcon}
            viewBox="0 0 36 36"
          />
          <span className={styles.dashboard__usageSizeTitle}>My Storage</span>
        </div>
        <div className={styles.dashboard__usageSizeValue}>
          <span className={styles.dashboard__totalValue}></span>
          <span className={styles.dashboard__usageValue}></span>
        </div>
        <span className={styles.dashboard__usageSizeText}>
          Used {formatBytes(usedSize)} out of {formatBytes(totalSize)}.
        </span>
      </div>
    </div>
  );
}, areDashboardExtraItemEqual);
