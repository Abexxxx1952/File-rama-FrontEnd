import styles from "./styles.module.css";

type OptionsProps = {
  path: string[];
  setPath: React.Dispatch<React.SetStateAction<string[]>>;
  setParentFolderId: React.Dispatch<React.SetStateAction<string[]>>;
};

export function Options({ path, setPath, setParentFolderId }: OptionsProps) {
  function handleBackClick() {
    setPath((prev) => {
      if (prev.length === 1) return prev;
      return prev.slice(0, prev.length - 1);
    });
    setParentFolderId((prev) => {
      if (prev.length === 0) return prev;
      return prev.slice(0, prev.length - 1);
    });
  }
  return (
    <div className={styles.options}>
      <nav>
        <button className={styles.options__backBtn} onClick={handleBackClick}>
          Back
        </button>
      </nav>
      <span className={styles.options__path}>Path:</span>
      <span className={styles.options__pathValue}>{path.join("")}</span>
      <div className={styles.options__buttons}></div>
    </div>
  );
}
