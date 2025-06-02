"use client";

import { useKeyboardHandler } from "@/srcApp/shared/hooks/useKeyboardHandler";
import { Icon } from "@/srcApp/shared/ui/icon";
import { useImperativeDisableScroll } from "../../hooks/useImperativeDisableScroll";
import styles from "./styles.module.css";

type ModalProps = {
  title?: string;
  backgroundColor?: string;
  width?: string;
  height?: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: (
    props: {
      setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    } & Record<string, any>,
  ) => React.ReactNode;
} & Record<string, any>;

export function Modal({
  title,
  backgroundColor,
  width,
  height,
  setModalOpen,
  children,
  ...rest
}: ModalProps) {
  const body = document.querySelector("body");

  useImperativeDisableScroll(body, true);

  useKeyboardHandler(body, [["Escape", () => setModalOpen(false)]]);

  const contentStyle = {
    "--content-bg-color": backgroundColor,
    "--content-width": width,
    "--content-height": height,
  } as React.CSSProperties;

  return (
    <div className={styles.modal}>
      <div className={styles.overlay} onClick={() => setModalOpen(false)}></div>
      <div className={styles.modal__content} style={contentStyle}>
        <Icon
          link="/svg/settings-sprite.svg#delete"
          onClick={() => setModalOpen(false)}
          className={styles.modal__close}
        />
        {title && <h2 className={styles.modal__title}>{title}</h2>}
        {children({ setModalOpen, ...rest })}
      </div>
    </div>
  );
}
