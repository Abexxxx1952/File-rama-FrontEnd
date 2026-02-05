import { memo, useEffect, useState } from "react";
import { ButtonIcon } from "@/srcApp/shared/ui/button-icon";
import { Icon } from "@/srcApp/shared/ui/icon";
import { areOptionsEqual } from "../model/areOptionsEqual";
import { getFolderPath } from "../model/getFolderPath";
import styles from "./styles.module.css";

export type OptionsProps = {
  currentParentFolderId: string | null;
  folderPathTag: string;
  routerBack: () => void;
  isSelected: boolean;
  handleDeleteMany: () => void;
  loadingDelete: boolean;
};

export const Options = memo(function ({
  currentParentFolderId,
  folderPathTag,
  routerBack,
  isSelected,
  handleDeleteMany,
  loadingDelete,
}: OptionsProps) {
  const [path, setPath] = useState(":/");
  const [loadingGetPath, setLoadingGetPath] = useState(false);

  useEffect(() => {
    if (currentParentFolderId === "null" || currentParentFolderId === null) {
      setPath(":/");
      return;
    }
    (async () => {
      const pathResponse = await getFolderPath(
        currentParentFolderId,
        folderPathTag,
        setLoadingGetPath,
      );
      console.log(pathResponse);

      if (pathResponse === ":/") {
        return;
      }
      setPath(`:/${pathResponse}`);
    })();
  }, [currentParentFolderId]);
  function handleBackClick() {
    routerBack();
  }
  return (
    <div className={styles.options}>
      <nav>
        <button
          className={`${styles.options__backBtn} ${path === ":/" && styles.options__backBtn_disabled}`}
          onClick={handleBackClick}
        >
          Back
        </button>
      </nav>
      <span className={styles.options__path}>Path:</span>
      {loadingGetPath ? (
        <div className={styles.options__pathLoading}>
          <Icon
            link={"/svg/settings-sprite.svg#loading"}
            className={styles.options__loading}
          />
        </div>
      ) : (
        <span className={styles.options__pathValue}>{path}</span>
      )}
      {isSelected && (
        <div className={styles.options__deleteBtn}>
          <ButtonIcon
            iconUrl="/svg/settings-sprite.svg#delete"
            onClick={handleDeleteMany}
            loading={loadingDelete}
            className={styles.tableButton__delete}
          />
        </div>
      )}
    </div>
  );
}, areOptionsEqual);
