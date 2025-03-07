import { Button } from "@/srcApp/shared/ui/button";
import { Input } from "@/srcApp/shared/ui/input";
import styles from "./styles.module.css";

export function UserUpdate() {
  return (
    <div className={styles.userUpdate}>
      <h2 className={styles.userUpdate__title}>User update</h2>
      <form className={styles.userUpdate__form}>
        <div className={styles.userUpdate__input}>
          <Input
            text="Name"
            placeholder="Change your name"
            focusBackgroundColor="transparent"
            border="none"
          />
        </div>
        <div className={styles.userUpdate__input}>
          <Input
            text="Password"
            placeholder="Change your Password"
            focusBackgroundColor="transparent"
            border="none"
          />
        </div>
        <div className={styles.userUpdate__input}>
          <Input
            text="Repeat Password"
            placeholder="Repeat Password"
            focusBackgroundColor="transparent"
            border="none"
          />
        </div>
        <div className={styles.userUpdate__button}>
          <Button text="Update" backgroundColor="var(--primary-logo-color)" />
        </div>
      </form>
    </div>
  );
}
