import styles from "./styles.module.css";

export function UserInfo({ user }: { user: any }) {
  return (
    <div className={styles.userInfo}>
      <h2 className={styles.userInfo__title}>User info</h2>
      <div className={styles.userInfo__row}>
        <span className={styles.userInfo__rowTitle}>ID:</span>
        <span className={styles.userInfo__rowValue}>{user.id}</span>
      </div>
      {user.name && (
        <div className={styles.userInfo__row}>
          <span className={styles.userInfo__rowTitle}>Name: </span>
          <span className={styles.userInfo__rowValue}>{user.name}</span>
        </div>
      )}
      <div className={styles.userInfo__row}>
        <span className={styles.userInfo__rowTitle}>Email: </span>
        <span className={styles.userInfo__rowValue}>{user.email}</span>
      </div>
      <div className={styles.userInfo__row}>
        <span className={styles.userInfo__rowTitle}>Created at:</span>
        <span className={styles.userInfo__rowValue}>{user.createdAt}</span>
      </div>
      <div className={styles.userInfo__row}>
        <span className={styles.userInfo__rowTitle}>Updated at:</span>
        <span className={styles.userInfo__rowValue}>{user.updatedAt}</span>
      </div>
      <div className={styles.userInfo__row}>
        <span className={styles.userInfo__rowTitle}>Verified:</span>
        <span
          className={styles.userInfo__rowValue}
        >{`${user.isVerified}`}</span>
      </div>
      <div className={styles.userInfo__row}>
        <span className={styles.userInfo__rowTitle}>TwoFactorEnabled:</span>
        <span
          className={styles.userInfo__rowValue}
        >{`${user.isTwoFactorEnabled}`}</span>
      </div>
    </div>
  );
}
