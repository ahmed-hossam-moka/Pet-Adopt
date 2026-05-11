import { Link } from "react-router-dom";
import { FaPaw } from "react-icons/fa";
import styles from "./NotFoundPage.module.css";

/* 
  404 NOT FOUND PAGE
  -------------------
  This renders when no route matches the URL.
  In the router we have { path: "*", element: <NotFoundPage /> }
  The "*" is a wildcard — it matches anything that didn't match above.
*/
function NotFoundPage() {
  return (
    <div className="page-wrapper flex-center fade-in-up">
      <div className={styles.wrap}>
        <div className={styles.card}>
          <FaPaw className={styles.icon} />
          <div className={styles.code}>404</div>
          <h2 className={styles.title}>Oops! This page got lost</h2>
          <p className={styles.desc}>The page you're looking for doesn't exist or was moved.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
