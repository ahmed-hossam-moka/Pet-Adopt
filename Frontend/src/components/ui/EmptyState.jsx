import { Link } from "react-router-dom";
import styles from "./EmptyState.module.css";

export default function EmptyState({
  icon,
  title = "Nothing here yet",
  description,
  actionLabel,
  actionTo,
  actionOnClick,
}) {
  return (
    <div className={styles.wrap}>
      {icon ? <div className={styles.icon}>{icon}</div> : null}
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.desc}>{description}</p> : null}

      {actionLabel ? (
        actionTo ? (
          <Link to={actionTo} className="btn btn-primary">
            {actionLabel}
          </Link>
        ) : (
          <button className="btn btn-primary" onClick={actionOnClick}>
            {actionLabel}
          </button>
        )
      ) : null}
    </div>
  );
}

