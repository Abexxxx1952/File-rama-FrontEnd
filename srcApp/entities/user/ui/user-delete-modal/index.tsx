"use client";

import { useImperativeDisableScroll } from "@/srcApp/shared/hooks/useImperativeDisableScroll";
import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { Button } from "@/srcApp/shared/ui/button";
import styles from "./styles.module.css";

type LoginModalProps = {
  setImageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function UserDeleteModal({ setImageModalOpen }: LoginModalProps) {
  const body = document.querySelector("body");
  useImperativeDisableScroll(body, true);

  useKeyboardHandler(body, [["Escape", () => setImageModalOpen(false)]]);

  return (
    <div className={styles.modal}>
      <div
        className={styles.overlay}
        onClick={() => setImageModalOpen(false)}
      ></div>

      <div className={styles.modal__content}>
        <h2 className={styles.modal__title}>
          Are you sure you want to delete your account?
        </h2>
        <div className={styles.modal__buttons}>
          <div className={styles.modal__button}>
            <Button
              text="Yes"
              backgroundColor="var(--primary-logo-color)"
              onClick={() => setImageModalOpen(true)}
            />
          </div>
          <div className={styles.modal__button}>
            <Button
              text="No"
              backgroundColor="var(--primary-logo-color)"
              onClick={() => setImageModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
