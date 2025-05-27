"use client";

import { useImperativeDisableScroll } from "@/srcApp/shared/hooks/useImperativeDisableScroll";
import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { Icon } from "@/srcApp/shared/ui/icon";
import styles from "./styles.module.css";

type ModalProps = {
  title: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: (
    props: {
      setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    } & Record<string, any>,
  ) => React.ReactNode;
} & Record<string, any>;

export function Modal({ title, setModalOpen, children, ...rest }: ModalProps) {
  const body = document.querySelector("body");

  useImperativeDisableScroll(body, true);

  useKeyboardHandler(body, [["Escape", () => setModalOpen(false)]]);

  return (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={() => setModalOpen(false)}></div>
      <div className={styles.modal__content}>
        <Icon
          link="/svg/settings-sprite.svg#delete"
          onClick={() => setModalOpen(false)}
          className={styles.modal__close}
        />
        <h2 className={styles.modal__title}>{title}</h2>
        {children({ setModalOpen, ...rest })}
      </div>
    </div>
  );
}
