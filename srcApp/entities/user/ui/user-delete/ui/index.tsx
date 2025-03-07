"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/srcApp/shared/ui/button";
import { createPortal } from "react-dom";
import { UserDeleteModal } from "../../user-delete-modal";
import styles from "./styles.module.css";

export function UserDelete() {
  const portalRef = useRef<HTMLElement | null>(null);

  const [imageModalOpen, setImageModalOpen] = useState<boolean>(false);

  useEffect(() => {
    portalRef.current = document.getElementById("portal");
  }, []);

  return (
    <div className={styles.userEmailConfirmation}>
      <h2 className={styles.userEmailConfirmation__title}>User deleting</h2>
      <div className={styles.userEmailConfirmation__button}>
        <Button
          text="Delete your account"
          backgroundColor="var(--primary-logo-color)"
          onClick={() => setImageModalOpen(true)}
        />
      </div>
      {portalRef.current &&
        imageModalOpen &&
        createPortal(
          <UserDeleteModal setImageModalOpen={setImageModalOpen} />,
          portalRef.current,
        )}
    </div>
  );
}
