import { Button } from "@/srcApp/shared/ui/button";
import { Icon } from "@/srcApp/shared/ui/icon";
import { Input } from "@/srcApp/shared/ui/input";
import styles from "./styles.module.css";

export function UserDriveUpdate({ googleServiceAccounts }: any) {
  return (
    <div className={styles.userDriveUpdate}>
      <h2 className={styles.userDriveUpdate__title}>Users drive update</h2>
      <form className={styles.userDriveUpdate__form}>
        <div className={styles.userDriveUpdate__input}>
          <Input
            text="Drive Email"
            placeholder="Enter your Drive Email"
            focusBackgroundColor="transparent"
            border="none"
          />
        </div>
        <div className={styles.userDriveUpdate__input}>
          <Input
            text="Private Key"
            placeholder="Enter your Private Key"
            focusBackgroundColor="transparent"
            border="none"
            type="password"
          />
        </div>
        <div className={styles.userDriveUpdate__input}>
          <Input
            text="Root Folder Id"
            placeholder="Enter your Root Folder Id (optional)"
            focusBackgroundColor="transparent"
            border="none"
          />
        </div>
        <div className={styles.userDriveUpdate__button}>
          <Button
            text="Add drive"
            backgroundColor="var(--primary-logo-color)"
          />
        </div>
      </form>
      <h2 className={styles.userDriveUpdate__title}>Yours drives</h2>
      <div className={styles.userDriveUpdate__drives}>
        {googleServiceAccounts.map((item: any) => {
          return (
            <div
              key={item.clientEmail}
              className={styles.userDriveUpdate__drive}
            >
              <span className={styles.userDriveUpdate__driveEmail}>
                {item.clientEmail}
              </span>
              <Icon
                link="/svg/settings-sprite.svg#delete"
                className={styles.userDriveUpdate__driveDelete}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
