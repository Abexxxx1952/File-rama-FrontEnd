"use client";

import Link from "next/link";

import styles from "./error.module.css";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <main className={styles.error}>
      <div className={styles.error__container}>
        <h1 className={styles.error__title}>Error</h1>

        <p className={styles.error__description}>Something went wrong</p>

        {error.message && (
          <div className={styles.error__message}>{error.message}</div>
        )}

        <div className={styles.error__buttons}>
          <Link
            href="/dashboard"
            className={`${styles.error__button} ${styles.error__button_secondary}`}
          >
            Back to Main
          </Link>
        </div>
      </div>
    </main>
  );
}
