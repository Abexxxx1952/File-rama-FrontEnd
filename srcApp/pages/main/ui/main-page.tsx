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
        <section className={styles.description} aria-labelledby="main-title">
          <div className={styles.description__container}>
            <h1 className={styles.description__title} id="main-title">
              Store and share your files on
              <strong className={styles.accented}> File-rama</strong>
            </h1>
            <p className={styles.description__text}>
              Keep documents, folders and connected drives in one place, so the
              file you need is easy to find and ready to share.
            </p>
            <div className={styles.description__buttons}>
              <div className={styles.description__buttonContainer}>
                <ButtonLink
                  href="/register"
                  text="Get started"
                  textColor="var(--secondary-font-color)"
                  backgroundColor="var(--secondary-logo-color)"
                  border="1px solid var(--secondary-logo-color)"
                  focusTextColor="var(--secondary-font-color)"
                  focusBackgroundColor="var(--main-page-font-color)"
                  className={styles.description__button}
                />
              </div>
              <div className={styles.description__buttonContainer}>
                <ButtonLink
                  href="/description"
                  text="Learn more"
                  textColor="var(--main-page-font-color)"
                  backgroundColor="rgba(255, 255, 255, 0.08)"
                  border="1px solid rgba(255, 255, 255, 0.4)"
                  focusTextColor="var(--main-page-font-color)"
                  focusBackgroundColor="rgba(255, 255, 255, 0.16)"
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
