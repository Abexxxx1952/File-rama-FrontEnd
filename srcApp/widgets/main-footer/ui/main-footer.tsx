import Image from "next/image";
import styles from "./styles.module.css";

export function MainFooter() {
  return (
    <footer className={styles.footerMain}>
      {Array(6)
        .fill(0)
        .map((_, index) => {
          return (
            <div key={index} className={styles.footer__item}>
              <Image
                src={`/img/footer/Footer_${index}.png`}
                fill={true}
                alt={`Footer image ${index}`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          );
        })}
    </footer>
  );
}
