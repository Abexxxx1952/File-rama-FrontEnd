import Image from "next/image";
import { ButtonLink } from "@/srcApp/shared/ui/button-link";
import { MainFooter } from "@/srcApp/widgets/main-footer";
import { MainHeader } from "@/srcApp/widgets/main-header";
import styles from "./styles.module.css";

export function MainPage() {
  return (
    <>
      <MainHeader />
      <main className={styles.main}>
        <section className={styles.description}>
          <div className={styles.description__container}>
            <h1 className={styles.description__title}>
              Storage and share your files on
              <strong className={styles.accented}> File-rama</strong>
            </h1>
            <span className={styles.description__text}>
              Forgot where something is? Collect files on File-rama. Assemble
              rama
            </span>
            <div className={styles.description__buttons}>
              <div className={styles.description__buttonContainer}>
                <ButtonLink
                  href="/register"
                  text="Getting Started"
                  className={styles.description__button}
                />
              </div>
              <div className={styles.description__buttonContainer}>
                <ButtonLink
                  href="/description"
                  text="Descriptions"
                  className={styles.description__button}
                />
              </div>
            </div>
          </div>
        </section>
        <section className={styles.representative}>
          <div className={styles.representative__image}>
            <Image
              src="/img/main/main_page_representative.png"
              fill={true}
              alt="Representative image"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
          </div>
        </section>
      </main>
      <MainFooter />
    </>
  );
}
