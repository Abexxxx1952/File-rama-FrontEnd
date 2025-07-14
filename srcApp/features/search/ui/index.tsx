import { memo, useState } from "react";
import { ButtonIcon } from "@/srcApp/shared/ui/button-icon";
import { Input } from "@/srcApp/shared/ui/input";
import { Logo } from "@/srcApp/shared/ui/logo";
import styles from "./styles.module.css";

export type SearchProps = {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const Search = memo(function ({ setSearch }: SearchProps) {
  const [searchValue, setSearchValue] = useState("");

  function handleSearch(value: string) {
    setSearch(value);
    setSearchValue(value);
  }

  function handleDelete() {
    setSearch("");
    setSearchValue("");
  }

  return (
    <div className={styles.storage__search}>
      <div className={styles.storage__logo}>
        <Logo />
      </div>

      <div className={styles.storage__searchInput}>
        <Input
          onChange={(e) => handleSearch(e.target.value)}
          value={searchValue}
          placeholder="Search"
          textColor="var(--secondary-font-color)"
          backgroundColor="rgb(255, 255, 255)"
          focusBackgroundColor="rgb(255, 255, 255)"
          border="none"
          placeholderPaddingLeft="1.5rem"
          iconSvg="svg/dashboard-page-sprite.svg#search"
          iconSvgWidth="17px"
          iconSvgHeight="16px"
        />
        {searchValue !== "" && (
          <div className={styles.storage__deleteButton}>
            <ButtonIcon
              iconUrl="/svg/settings-sprite.svg#delete"
              onClick={handleDelete}
              className={styles.tableButton__delete}
            />
          </div>
        )}
      </div>
    </div>
  );
});
