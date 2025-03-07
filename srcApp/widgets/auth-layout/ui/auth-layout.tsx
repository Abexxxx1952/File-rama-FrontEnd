import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/srcApp/shared/ui/button-link";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./styles.module.css";

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.auth}>
      <ToastContainer autoClose={8000} />
      <section className={styles.auth__container}>
        <div className={styles.auth__col1}>
          <div className={styles.auth__images}>
            <div className={`${styles.auth__image} ${styles.whiteOutline}`}>
              <Image
                src={`/img/auth/white-outline.png`}
                fill={true}
                alt={`Auth images`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={`${styles.auth__image} ${styles.dots}`}>
              <Image
                src={`/img/auth/dots.png`}
                fill={true}
                alt={`Auth images`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={`${styles.auth__image} ${styles.coin}`}>
              <Image
                src={`/img/auth/coin.png`}
                fill={true}
                alt={`Auth images`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={`${styles.auth__image} ${styles.spring}`}>
              <Image
                src={`/img/auth/spring.png`}
                fill={true}
                alt={`Auth images`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={`${styles.auth__image} ${styles.rocket}`}>
              <Image
                src={`/img/auth/rocket.png`}
                fill={true}
                alt={`Auth images`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={`${styles.auth__image} ${styles.cloud}`}>
              <Image
                src={`/img/auth/cloud.png`}
                fill={true}
                alt={`Auth images`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <div className={`${styles.auth__image} ${styles.stars}`}>
              <Image
                src={`/img/auth/stars.png`}
                fill={true}
                alt={`Auth images`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </div>
        </div>
        <div className={styles.form}>
          <nav className={styles.form_buttons}>
            <ButtonLink
              href="/login"
              text="Sign In"
              backgroundColor="rgba(255, 255, 255, 0.2)"
            />
            <ButtonLink
              href="/register"
              text="Sign Up"
              backgroundColor="rgba(255, 255, 255, 0.2)"
            />
          </nav>
          {children}
          <div className={styles.form__toMain}>
            <Link href="/">To main</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
