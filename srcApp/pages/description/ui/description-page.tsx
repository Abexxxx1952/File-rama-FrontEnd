import Image from "next/image";
import Link from "next/link";
import { MainFooter } from "@/srcApp/widgets/main-footer";
import { MainHeader } from "@/srcApp/widgets/main-header";
import styles from "./styles.module.css";

export function DescriptionPage() {
  return (
    <>
      <MainHeader />
      <main className={styles.description}>
        <section className={styles.description__container}>
          <h1 className={styles.title}>How to use File-rama</h1>
          <h2 className={styles.subtitle}>
            Step 1: Setup a Google Cloud Console Project:
          </h2>

          <ul className={styles.description__content}>
            <li>
              Go to Google Cloud Console :{" "}
              <Link
                href="https://console.cloud.google.com/"
                className={styles.link}
                aria-label="link"
              >
                https://console.cloud.google.com/
              </Link>
            </li>
            <li>Create a new Project or select an existing one.</li>
            <li>Now Navigate to “API’s & Services” {">"} “Library”.</li>
            <li>
              In Search for “Google Drive API” and click on enable button for
              your project.
            </li>
          </ul>
          <div className={styles.description__image}>
            <Image
              src="/img/description/description_1.webp"
              fill={true}
              alt="Description image 1"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h2 className={styles.subtitle}>
            Step 2: Create Service Account Credentials API
          </h2>
          <div className={styles.description__content}>
            <span className={styles.description__text}>
              In google cloud console, Navigate to “API’s & Services” {">"}
              “Credentials”.
            </span>
            <span className={styles.description__text}>
              Click on “Create Credentials” {">"} Select “Service Account”.
            </span>
            <span className={styles.description__text}>
              Enter Service Account Name, Service account ID then click&nbsp;
              <b>DONE.</b>
            </span>
          </div>
          <div className={styles.description__image}>
            <Image
              src="/img/description/description_2.webp"
              fill={true}
              alt="Description image 2"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h2 className={styles.subtitle}>
            Step 3: Creating API Key JSON File for authentication
          </h2>
          <div className={styles.description__content}>
            <span className={styles.description__text}>
              Once Service Account is been created, click on Service Account
              Email as soon in above image.
            </span>
            <span className={styles.description__text}>
              Then Click on Keys {">"} Add Key {">"} Create New Key
            </span>
          </div>
          <div className={styles.description__image}>
            <Image
              src="/img/description/description_3.webp"
              fill={true}
              alt="Description image 3"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className={styles.description__content}>
            <span className={styles.description__text}>
              This will create a json file download it, It contain api key by
              making use of which you can write a nodeJS Script that can upload
              files into your google drive.
            </span>
          </div>
        </section>
      </main>
      <MainFooter />
    </>
  );
}
