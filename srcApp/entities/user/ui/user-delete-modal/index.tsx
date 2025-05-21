"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useImperativeDisableScroll } from "@/srcApp/shared/hooks/useImperativeDisableScroll";
import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { Button } from "@/srcApp/shared/ui/button";
import { deleteUser } from "../../model/deleteUser";
import styles from "./styles.module.css";

type UserDeleteModalProps = {
  setDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};
export function UserDeleteModal({ setDeleteModalOpen }: UserDeleteModalProps) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const body = document.querySelector("body");
  useImperativeDisableScroll(body, true);

  useKeyboardHandler(body, [["Escape", () => setDeleteModalOpen(false)]]);

  return (
    <div className={styles.modal}>
      <div
        className={styles.overlay}
        onClick={() => setDeleteModalOpen(false)}
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
              onClick={() => deleteUser(setLoading, router)}
              loading={loading}
            />
          </div>
          <div className={styles.modal__button}>
            <Button
              text="No"
              backgroundColor="var(--primary-logo-color)"
              onClick={() => setDeleteModalOpen(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
