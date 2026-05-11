import styles from "./Skeleton.module.css";

export function Skeleton({ className = "", style }) {
  return <div className={`skeleton ${styles.base} ${className}`} style={style} />;
}

export function SkeletonText({ lines = 3, className = "" }) {
  return (
    <div className={`${styles.textWrap} ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${styles.line}`}
          style={{ width: i === lines - 1 ? "70%" : "100%" }}
        />
      ))}
    </div>
  );
}

